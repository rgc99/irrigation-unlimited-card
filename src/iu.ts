import { HomeAssistant } from "./ha-types";
import {
  hms_to_secs,
  secs_to_hms,
  elapsed_secs,
  percent_completed,
} from "./util";

interface EntityInfo {
  index: number;
  name: string;
  entity_id: string;
}

interface ZoneInfo extends EntityInfo {
  zone_id: string;
}

interface SequenceZoneInfo {
  index: number;
  zone_ids: string[];
}

interface SequenceInfo {
  index: number;
  name: string;
  entity_id: string;
  zones: [SequenceZoneInfo];
}

interface ControllerInfo {
  index: number;
  name: string;
  controller_id: string;
  entity_id: string;
  zones: [ZoneInfo];
  sequences: [SequenceInfo];
}

interface GetInfo {
  version: string;
  controllers: [ControllerInfo];
}

interface IUSequenceZoneStatus {
  index: number;
  enabled: boolean;
  status: string;
  start: string | null;
  duration: string;
  suspended: string | null;
  icon: string;
  adjustment: string;
  zone_ids: string[];
}

const enum IUUpdateStatus {
  None = 0,
  EntityUpdated = 1 << 0,
  TimerRequired = 1 << 1,
}

class IUBase {
  public start: Date | undefined = undefined;
  public status: string | undefined = undefined;
  protected _duration: number | undefined = undefined;
  protected _remaining: number | undefined = undefined;
  private _percent_completed: number | undefined = undefined;

  public get duration(): string | undefined {
    return secs_to_hms(this._duration);
  }

  protected set duration(value: string | undefined) {
    this._duration = hms_to_secs(value);
    return;
  }

  public get remaining(): string | undefined {
    return secs_to_hms(this._remaining);
  }

  public set remaining(value: string) {
    this._remaining = hms_to_secs(value);
  }

  public get percent_completed(): number | undefined {
    return this._percent_completed;
  }

  public update_stats(now: Date): void {
    if (this.start && this._duration) {
      if (this.status === "on" || this.status === "delay") {
        const elapsed = elapsed_secs(now, this.start);
        this._remaining = this._duration - elapsed;
        this._percent_completed = percent_completed(elapsed, this._duration);
      }
    }
  }

  public clear_stats(): void {
    this._remaining = this._percent_completed = undefined;
  }
}

class IUEntity extends IUBase {
  public index: number;
  public name: string;
  public entity_id: string;
  private last_updated: Date | undefined = undefined;

  public get id1(): number {
    return this.index + 1;
  }

  constructor(data: EntityInfo) {
    super();
    this.index = data.index;
    this.name = data.name;
    this.entity_id = data.entity_id;
  }

  public update(hass: HomeAssistant): number {
    let result: number = IUUpdateStatus.None;
    const entity = hass.states[this.entity_id];
    const date = new Date(entity.last_updated);

    if (this.last_updated === undefined || date > this.last_updated) {
      this.last_updated = date;
      result |= IUUpdateStatus.EntityUpdated;
      this.status = entity.attributes.status;
      if (
        this.status === "on" ||
        this.status === "delay" ||
        this.status === "paused"
      ) {
        this.start = new Date(entity.attributes.current_start);
        this.duration = entity.attributes.current_duration;
        this.remaining = entity.attributes.time_remaining;
      } else {
        this.start = undefined;
        this.clear_stats();
      }
    }
    if (this.status === "on" || this.status === "delay")
      result |= IUUpdateStatus.TimerRequired;
    return result;
  }

  public timer(now: Date): void {
    if (this.status === "on" || this.status === "delay") this.update_stats(now);
  }
}

export class IUSequenceZone extends IUBase {
  public index: number;
  public zone_ids: string[];
  public enabled: boolean = true;
  public suspended: Date | null = null;
  public icon?: string;
  public adjustment?: string;

  public get id1(): number {
    return this.index + 1;
  }

  constructor(data: SequenceZoneInfo) {
    super();
    this.index = data.index;
    this.zone_ids = data.zone_ids;
  }

  public assign(szs: IUSequenceZoneStatus) {
    this.icon = szs.icon;
    this.enabled = szs.enabled;
    this.suspended = szs.suspended ? new Date(szs.suspended) : null;
    this.adjustment = szs.adjustment;
    if (szs.start) {
      this.start = new Date(szs.start);
      this.duration = szs.duration;
    } else {
      this.start = undefined;
      this.duration = "0:00:00";
    }
    if (this.status === "off" && szs.status === "on") {
      this._remaining = this._duration;
    } else if (szs.status === "off") this._remaining = undefined;
    this.status = szs.status;
  }
}

export interface IUTimeline {
  start: string;
  end: string;
  schedule: number;
  schedule_name: string;
  adjustment: string;
  status: string;
}

export class IUSequence extends IUEntity {
  public zones: IUSequenceZone[] = [];

  constructor(data: SequenceInfo) {
    super(data);
    for (const z of data.zones) this.zones.push(new IUSequenceZone(z));
  }

  public override update(hass: HomeAssistant): number {
    let result = super.update(hass);
    if ((result & IUUpdateStatus.EntityUpdated) !== 0) {
      const entity = hass.states[this.entity_id];
      for (const szs of entity.attributes.zones as [IUSequenceZoneStatus])
        this.zones[szs.index].assign(szs);
    }
    return result;
  }

  public override timer(now: Date): void {
    super.timer(now);
    if (this.status === "on")
      for (const z of this.zones) if (z.status === "on") z.update_stats(now);
  }
}

export class IUZone extends IUEntity {
  public zone_id: string;

  constructor(data: ZoneInfo) {
    super(data);
    this.zone_id = data.zone_id;
  }
}

export class IUController extends IUEntity {
  public controller_id: string;
  public zones: IUZone[] = [];
  public sequences: IUSequence[] = [];

  constructor(data: ControllerInfo) {
    super(data);
    this.controller_id = data.controller_id;
    for (const z of data.zones) this.zones.push(new IUZone(z));
    for (const s of data.sequences) this.sequences.push(new IUSequence(s));
  }

  public lookup_zone_name(zone_id: string): string | undefined {
    for (const z of this.zones) if (z.zone_id === zone_id) return z.name;
    return undefined;
  }

  private sequence_status(status: string): boolean {
    for (const s of this.sequences) {
      if (s.status === status) return true;
    }
    return false;
  }

  public pause_resume_status(): number {
    let result = 0;
    if (this.sequence_status("on")) result |= 1;
    if (this.sequence_status("paused")) result |= 2;
    return result;
  }

  public override update(hass: HomeAssistant): number {
    let result = super.update(hass);
    for (const z of this.zones) result |= z.update(hass);
    for (const s of this.sequences) result |= s.update(hass);
    return result;
  }
}

export class IUCoordinator {
  public readonly controllers: IUController[];
  private initialised: boolean = false;
  private version: string = "";
  private parent: any;
  private timer_id: number | undefined = undefined;

  constructor(parent: any) {
    this.parent = parent;
    this.controllers = [];
  }

  private async _getInfo(hass: HomeAssistant): Promise<GetInfo> {
    try {
      const response: GetInfo = (
        await hass.callService(
          "irrigation_unlimited",
          "get_info",
          {},
          { entity_id: "irrigation_unlimited.coordinator" },
          true,
          true
        )
      ).response;
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public init(hass: HomeAssistant): void {
    if (!hass || this.initialised) return;
    this._getInfo(hass).then((response) => {
      this.version = response.version;
      for (const c of response.controllers)
        this.controllers.push(new IUController(c));
      this.initialised = true;
      this.parent.requestUpdate();
    });
  }

  public update(hass: HomeAssistant): boolean {
    if (!this.initialised) return false;
    let result = IUUpdateStatus.None;
    const now = new Date();
    for (const c of this.controllers) result |= c.update(hass);
    if (
      this.timer_id === undefined &&
      (result & IUUpdateStatus.TimerRequired) !== 0
    ) {
      this.start_timer(hass);
    } else if (
      this.timer_id !== undefined &&
      (result & IUUpdateStatus.TimerRequired) === 0
    ) {
      this.stop_timer();
    }
    return result !== 0;
  }

  private start_timer(_hass: HomeAssistant) {
    if (this.timer_id) return;
    this.timer_id = setInterval(
      (function (scope) {
        return function () {
          const now = new Date();
          for (const c of scope.controllers) {
            c.timer(now);
            for (const z of c.zones) z.timer(now);
            for (const s of c.sequences) s.timer(now);
          }
          scope.parent.requestUpdate();
        };
      })(this),
      1000
    );
  }

  private stop_timer() {
    if (!this.timer_id) return;
    clearInterval(this.timer_id);
    this.timer_id = undefined;
  }
}
