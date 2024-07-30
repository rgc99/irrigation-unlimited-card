/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, PropertyValues, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./editor";
import {
  IUCoordinator,
  IUController,
  IUZone,
  IUSequence,
  IUSequenceZone,
  IUTimeline,
} from "./iu";
import { styles } from "./styles";
import { HomeAssistant } from "./ha-types";
import type {
  IrrigationUnlimitedCardConfig,
  LovelaceCardEditor,
} from "./types";
import { CARD_VERSION } from "./const";
import { date_to_str } from "./util";
import { localise } from "./localize";

const loc = new localise(window.navigator.language);

/* eslint no-console: 0 */
console.info(
  `%c  IRRIGATION-UNLIMITED-CARD \n%c  ${loc.t("common.version")} ${CARD_VERSION}    `,
  "color: orange; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: dimgray"
);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "irrigation-unlimited-card",
  name: "Irrigation Unlimited Card",
  description: "A companion card for the Irrigation Unlimited integration",
});

@customElement("irrigation-unlimited-card")
export class IrrigationUnlimitedCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: IrrigationUnlimitedCardConfig;

  private iu_coordinator = new IUCoordinator(this);

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement("irrigation-unlimited-card-editor");
  }

  public setConfig(config: IrrigationUnlimitedCardConfig): void {
    if (!config) {
      throw new Error(loc.t("common.invalidConfiguration"));
    }
    this.config = config;
  }

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  public getCardSize(): number {
    return 1;
  }

  protected firstUpdated(
    _changedProperties: PropertyValues<any> | Map<PropertyKey, unknown>
  ): void {
    this.iu_coordinator.init(this.hass);
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.hass) {
      return false;
    }

    if (changedProps.has("config")) return true;
    return this.iu_coordinator.update(this.hass);
  }

  static styles = styles;

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass) return nothing;
    return html`
      <ha-card
        .header=${this.config.name}
        tabindex="0"
        id="iu-card"
        @click="${this._clickNet}"
      >
        <div class="iu-header">
          <div class="iu-header-row iu-td">
            <div class="iu-td1"></div>
            <div class="iu-td2"></div>
            <div class="iu-td3"></div>
            <div class="iu-td4">
              <ha-icon icon="mdi:clock-outline"></ha-icon>
            </div>
            <div class="iu-td5"><ha-icon icon="mdi:timer-sand"></ha-icon></div>
            <div class="iu-td6"><ha-icon icon="mdi:delta"></ha-icon></div>
            <div class="iu-td7"><ha-icon icon="mdi:menu"></ha-icon></div>
          </div>
        </div>
        <div class="iu-controllers">
          ${this.iu_coordinator.controllers.map((controller) =>
            this._renderController(controller)
          )}
        </div>
        <div class="iu-footer"></div>
      </ha-card>
    `;
  }

  private _renderController(controller: IUController): TemplateResult {
    const stateObj = this.hass.states[controller.entity_id];
    const status = stateObj.attributes.status;
    const isOn = stateObj.state === "on";
    const isDelay = status === "delay";
    const isEnabled = stateObj.attributes.enabled;
    const suspended = stateObj.attributes.suspended;
    const isHidden = !(
      !this.config.show_controllers ||
      (this.config.show_controllers &&
        this.config.show_controllers
          ?.replace(/\s/g, "")
          .split(",")
          .includes(controller.id1 + ""))
    );
    const zonesHidden = !this.config.always_show_zones;
    const sequencesHidden = !this.config.always_show_sequences;

    let start: Date;
    let duration: string | undefined;
    let schedule_name: string;

    if (isOn) {
      start = new Date(stateObj.attributes.current_start);
      duration = controller.remaining;
      schedule_name = stateObj.attributes.current_name;
    } else if (suspended) {
      start = new Date(suspended);
      duration = "";
      schedule_name = "";
    } else {
      start = new Date(stateObj.attributes.next_start);
      duration = stateObj.attributes.next_duration;
      schedule_name = stateObj.attributes.next_name;
    }
    const startStr = date_to_str(start);

    const classes: string[] = ["iu-controller", "iu-object"];
    if (isHidden) classes.push("iu-hidden");
    if (isOn) classes.push("iu-on");
    if (isEnabled) classes.push("iu-enabled");
    if (suspended) classes.push("iu-suspended");
    if (isDelay) classes.push("iu-delay");

    const zonesClasses: Array<string> = ["iu-zones iu-content"];
    if (zonesHidden) zonesClasses.push("iu-hidden");

    const sequencesClasses: Array<string> = ["iu-sequences iu-content"];
    if (sequencesHidden) sequencesClasses.push("iu-hidden");

    return html`
      <div class=${classes.join(" ")} iu-key="${controller.id1}.0.0.0">
        <hr />
        <div class="iu-controller-row iu-td">
          <div class="iu-td1"></div>
          <div class="iu-td2">
            <ha-icon .icon=${stateObj.attributes.icon}></ha-icon>
          </div>
          <div class="iu-td3">
            <span>${controller.id1}</span>
            <span class="iu-name">${controller.name}</span>
          </div>
          <div class="iu-td4">
            <div ?hidden=${!isEnabled}>
              <span class="iu-schedule">${schedule_name}</span>
              <br ?hidden=${isOn || suspended} />
              <span class="iu-start" ?hidden=${isOn}>${startStr}</span>
            </div>
          </div>
          <div class="iu-td5 iu-duration">
            <div ?hidden=${!isEnabled}>${duration}</div>
          </div>
          <div class="iu-td6"></div>
          <div class="iu-td7">
            ${this._renderMenu(
              isEnabled,
              false,
              true,
              true,
              controller.pause_resume_status(),
              null,
              suspended
            )}
          </div>
        </div>
        <div class="iu-control-panel">
          <div class="iu-control-panel-item iu-show-zones">
            <label>${loc.t("controller.zones.name")}&nbsp;</label>
            <ha-switch
              .checked="${!zonesHidden}"
              .disabled="${this.config.always_show_zones}"
              title=${loc.t("controller.zones.buttonHint")}
              @change="${this._toggleZones}"
            >
            </ha-switch>
          </div>
          <div class="iu-control-panel-item iu-show-sequences">
            <label>${loc.t("controller.sequences.name")}&nbsp;</label>
            <ha-switch
              .checked="${!sequencesHidden}"
              .disabled="${this.config.always_show_sequences}"
              title=${loc.t("controller.sequences.buttonHint")}
              @change="${this._toggleSequences}"
            >
            </ha-switch>
          </div>
        </div>
        <div class=${zonesClasses.join(" ")}>
          <hr />
          ${controller.zones.map((zone) => this._renderZone(controller, zone))}
        </div>
        <div class=${sequencesClasses.join(" ")}>
          <hr />
          ${controller.sequences.map((sequence) =>
            this._renderSequence(controller, sequence)
          )}
        </div>
      </div>
    `;
  }

  private _renderZone(controller: IUController, zone: IUZone): TemplateResult {
    const stateObj = this.hass.states[zone.entity_id];
    const status = stateObj.attributes.status;
    const isOn = stateObj.state === "on";
    const isEnabled = stateObj.attributes.enabled;
    const suspended = stateObj.attributes.suspended;
    const isBlocked = status === "blocked";
    let start: Date;
    let duration: string | undefined;
    let schedule_index: number;
    let schedule_name: string;
    let adjustment: string;

    if (isOn) {
      start = new Date(stateObj.attributes.current_start);
      duration = zone.remaining;
      schedule_index = stateObj.attributes.current_schedule;
      schedule_name = stateObj.attributes.current_name;
      adjustment = stateObj.attributes.current_adjustment;
    } else if (suspended) {
      start = new Date(suspended);
      duration = "";
      schedule_index = -1;
      schedule_name = "";
      adjustment = "";
    } else {
      start = new Date(stateObj.attributes.next_start);
      duration = stateObj.attributes.next_duration;
      schedule_index = stateObj.attributes.next_schedule;
      schedule_name = stateObj.attributes.next_name;
      adjustment = stateObj.attributes.next_adjustment;
    }
    const isManual = schedule_index === 0;
    if (isManual) schedule_name = loc.t("menu.manual.name");
    const startStr = date_to_str(start);
    const classes: string[] = ["iu-zone", "iu-object"];
    if (isOn) classes.push("iu-on");
    if (isEnabled) classes.push("iu-enabled");
    if (suspended) classes.push("iu-suspended");
    if (isManual) classes.push("iu-manual");
    if (isBlocked) classes.push("iu-blocked");
    let timeline: IUTimeline[] = stateObj.attributes.timeline;
    if (timeline !== undefined) {
      // Filter items
      timeline = timeline.filter((item: IUTimeline) => {
        return (
          (item.start !== item.end &&
            item.status === "history" &&
            (this.config.show_timeline_history === undefined ||
              this.config.show_timeline_history)) ||
          (item.status === "scheduled" &&
            this.config.show_timeline_scheduled) ||
          (item.status === "next" && this.config.show_timeline_scheduled) ||
          (item.status === "running" && this.config.show_timeline_scheduled)
        );
      });
      // Sort items
      timeline.sort((a, b) => {
        const da = new Date(a.start).getTime();
        const db = new Date(b.start).getTime();
        if (a.status === "history" && a.status === "history") return db - da;
        return da - db;
      });
      // Move first history item to head
      const idx = timeline.findIndex((item) => item.status === "history");
      if (idx >= 0) timeline.unshift(timeline.splice(idx, 1)[0]);
    } else timeline = [];

    return html`
      <div
        class=${classes.join(" ")}
        iu-key="${controller.id1}.${zone.id1}.0.0"
      >
        <div class="iu-collapsible iu-hidden">
          <div class="iu-zone-row iu-td">
            <div
              class="iu-td1 iu-expander"
              @click="${this._toggleCollapse}"
            ></div>
            <div class="iu-td2" @click="${this._toggleCollapse}">
              <ha-icon .icon=${stateObj.attributes.icon}></ha-icon>
            </div>
            <div class="iu-td3" @click="${this._toggleCollapse}">
              <span style="color: ${this._selectColour(zone.index)}"
                >${zone.id1}</span
              >
              <span class="iu-name">${stateObj.attributes.friendly_name}</span>
            </div>
            <div class="iu-td4">
              <div ?hidden=${!isEnabled || isBlocked}>
                <span class="iu-schedule">${schedule_name}</span>
                <br ?hidden=${isOn || isManual || suspended} />
                <span class="iu-start" ?hidden=${isOn || isManual}
                  >${startStr}</span
                >
              </div>
            </div>
            <div class="iu-td5 iu-duration">
              <div ?hidden=${!isEnabled || suspended || isBlocked}>
                ${duration}
              </div>
            </div>
            <div class="iu-td6 iu-adjustment">
              <div ?hidden=${!isEnabled || isBlocked || suspended || isManual}>
                ${adjustment}
              </div>
            </div>
            <div class="iu-td7">
              ${this._renderMenu(
                isEnabled,
                isBlocked,
                true,
                true,
                0,
                adjustment,
                suspended
              )}
            </div>
          </div>
          <div class="iu-zone-timelines iu-content">
            ${timeline.map((item) => this._renderTimeline(item))}
          </div>
        </div>
      </div>
    `;
  }

  private _renderTimeline(timeline: IUTimeline): TemplateResult {
    const start = new Date(timeline.start);
    const duration = new Date(
      new Date(timeline.end).getTime() - start.getTime()
    )
      .toISOString()
      .slice(12, 19);
    const startStr = start.toLocaleString(undefined, {
      weekday: "short",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });
    const classes: string[] = ["iu-zone-timeline", "iu-object"];
    let icon: String = "";
    if (timeline.status === "history") {
      classes.push("iu-timeline-history");
      icon = "mdi:history";
    } else if (timeline.status === "scheduled") {
      classes.push("iu-timeline-scheduled");
      icon = "mdi:clock-outline";
    } else if (timeline.status === "next") {
      classes.push("iu-timeline-next");
      icon = "mdi:clock-star-four-points-outline";
    } else if (timeline.status === "running") {
      classes.push("iu-timeline-running");
      icon = "mdi:play";
    }
    let schedule_name: string;
    if (timeline.schedule !== 0) schedule_name = timeline.schedule_name;
    else schedule_name = loc.t("menu.manual.name");

    return html`
      <div class=${classes.join(" ")}>
        <div class="iu-timeline-row iu-td">
          <div class="iu-td1"></div>
          <div class="iu-td2">
            <ha-icon icon=${icon}></ha-icon>
          </div>
          <div class="iu-td3">${startStr}</div>
          <div class="iu-td4 iu-schedule">${schedule_name}</div>
          <div class="iu-td5 iu-duration">${duration}</div>
          <div class="iu-td6 iu-adjustment">${timeline.adjustment}</div>
          <div class="iu-td7"></div>
        </div>
      </div>
    `;
  }

  private _renderSequence(
    controller: IUController,
    sequence: IUSequence
  ): TemplateResult {
    const stateObj = this.hass.states[sequence.entity_id];
    const status = stateObj.attributes.status;
    const isOn = status === "on";
    const isPaused = status === "paused";
    const isDelay = status === "delay";
    const isBlocked = status === "blocked";
    const isEnabled = stateObj.attributes.enabled;
    const suspended = stateObj.attributes.suspended;
    let start: Date;
    let duration: string | undefined;
    let schedule_index: number;
    let schedule_name: string;
    let adjustment: string;

    if (isOn || isPaused || isDelay) {
      start = new Date(stateObj.attributes.current_start);
      duration = sequence.remaining;
      schedule_index = stateObj.attributes.current_schedule;
      schedule_name = stateObj.attributes.current_name;
      adjustment = stateObj.attributes.adjustment;
    } else if (suspended) {
      start = new Date(suspended);
      duration = "";
      schedule_index = -1;
      schedule_name = "";
      adjustment = "";
    } else {
      start = new Date(stateObj.attributes.next_start);
      duration = stateObj.attributes.next_duration;
      schedule_index = stateObj.attributes.next_schedule;
      schedule_name = stateObj.attributes.next_name;
      adjustment = stateObj.attributes.adjustment;
    }
    const isManual = schedule_index === 0;
    if (isManual) schedule_name = loc.t("menu.manual.name");
    const isRunning = sequence.remaining !== undefined;
    const startStr = date_to_str(start);
    const classes: string[] = ["iu-sequence", "iu-object"];
    if (isOn) classes.push("iu-on");
    if (isPaused) classes.push("iu-paused");
    if (isDelay) classes.push("iu-delay");
    if (isEnabled) classes.push("iu-enabled");
    if (suspended) classes.push("iu-suspended");
    if (isManual) classes.push("iu-manual");
    if (isRunning) classes.push("iu-running");
    if (isBlocked) classes.push("iu-blocked");

    return html`
      <div
        class=${classes.join(" ")}
        iu-key="${controller.id1}.0.${sequence.id1}.0"
      >
        <div class="iu-collapsible iu-hidden">
          <div class="iu-sequence-row iu-td">
            <div
              class="iu-td1 iu-expander"
              @click="${this._toggleCollapse}"
            ></div>
            <div class="iu-td2" @click="${this._toggleCollapse}">
              <ha-icon
                .icon=${stateObj.attributes.icon}
                ?is-on=${isOn || isPaused}
              ></ha-icon>
            </div>
            <div class="iu-td3" @click="${this._toggleCollapse}">
              <span>${sequence.id1}</span>
              <span class="iu-name">${sequence.name}</span>
            </div>
            <div class="iu-td4">
              <div ?hidden=${!isEnabled || isBlocked}>
                <span class="iu-schedule">${schedule_name}</span>
                <br ?hidden=${isOn || isPaused || isDelay || suspended} />
                <span class="iu-start" ?hidden=${isOn || isPaused || isDelay}
                  >${startStr}</span
                >
              </div>
            </div>
            <div class="iu-td5 iu-duration">
              <div ?hidden=${!isEnabled || suspended || isBlocked}>
                ${duration}
              </div>
            </div>
            <div class="iu-td6 iu-adjustment">
              <div ?hidden=${isManual}>${adjustment}</div>
            </div>
            <div class="iu-td7">
              ${this._renderMenu(
                isEnabled,
                isBlocked,
                true,
                true,
                status === "on" || status === "delay"
                  ? 1
                  : status === "paused"
                    ? 2
                    : 0,
                adjustment,
                suspended
              )}
            </div>
          </div>
          <div class="iu-sequence-zones iu-content">
            ${sequence.zones.map((zone) =>
              this._renderSequenceZone(controller, sequence, zone, isManual)
            )}
          </div>
        </div>
      </div>
    `;
  }

  private _renderSequenceZone(
    controller: IUController,
    sequence: IUSequence,
    sequenceZone: IUSequenceZone,
    isManual: boolean
  ): TemplateResult {
    const status = sequenceZone.status;
    const isOn = status === "on";
    const isEnabled = sequenceZone.enabled;
    const suspended = sequenceZone.suspended;
    const isBlocked = status === "blocked";
    const isRunning = sequenceZone.remaining !== undefined;
    let duration: string | undefined;
    let startStr = "";

    if (isOn) duration = sequenceZone.remaining;
    else if (suspended) duration = "";
    else duration = sequenceZone.duration;

    if (suspended !== null) {
      const start = new Date(suspended);
      startStr = date_to_str(start);
    }
    const classes: string[] = ["iu-sequence-zone", "iu-object"];
    if (isOn) classes.push("iu-on");
    if (isEnabled) classes.push("iu-enabled");
    if (suspended) classes.push("iu-suspended");
    if (isManual) classes.push("iu-manual");
    if (isRunning) classes.push("iu-running");
    if (isBlocked) classes.push("iu-blocked");

    return html`
      <div
        class=${classes.join(" ")}
        iu-key="${controller.id1}.0.${sequence.id1}.${sequenceZone.id1}"
      >
        <div class="iu-sequence-zone-row iu-td">
          <div class="iu-td1"></div>
          <div class="iu-td2">
            <ha-icon .icon=${sequenceZone.icon} ?is-on=${isOn}></ha-icon>
          </div>
          <div class="iu-td3">
            <span
              >${sequenceZone.zone_ids.map(
                (zoneRef: string, index: number, array) =>
                  this._renderSequenceZoneRef(
                    controller,
                    zoneRef,
                    index === array.length - 1
                  )
              )}</span
            >
          </div>
          <div class="iu-td4">
            <div ?hidden=${!isEnabled || isBlocked}>
              <span class="iu-start">${startStr}</span>
            </div>
          </div>
          <div class="iu-td5 iu-duration">
            <div ?hidden=${!isEnabled || suspended !== null || isBlocked}>
              ${duration}
            </div>
          </div>
          <div class="iu-td6 iu-adjustment">
            <div ?hidden=${isManual}>${sequenceZone.adjustment}</div>
          </div>
          <div class="iu-td7">
            ${this._renderMenu(
              isEnabled,
              isBlocked,
              false,
              false,
              0,
              sequenceZone.adjustment,
              suspended
            )}
          </div>
        </div>
      </div>
    `;
  }

  private _renderSequenceZoneRef(
    controller: IUController,
    zoneRef: string,
    last: boolean
  ): TemplateResult {
    const name = controller.lookup_zone_name(zoneRef);
    if (name)
      return html`<span class="iu-name"
        >${name}${last === false ? ", " : ""}</span
      >`;
    return html`
      <span style="color: ${this._selectColour(parseInt(zoneRef) - 1)}"
        >${zoneRef}</span
      >
    `;
  }

  private _renderMenu(
    isEnabled: boolean,
    isBlocked: boolean,
    allowManual: boolean,
    allowCancel: boolean,
    pauseResume: number,
    adjustment: string | null | undefined,
    suspended: Date | string | null | undefined
  ): TemplateResult {
    return html`
      <div class="iu-menu">
        <ha-icon
          class="iu-menu-button"
          icon="mdi:dots-vertical"
          @click="${this._toggleMenu}"
        ></ha-icon>
        <div class="iu-menu-content iu-hidden">
          <div class="iu-menu-item iu-enable">
            <div class="iu-mc1">${loc.t("menu.enable.name")}</div>
            <div class="iu-mc2"></div>
            <div class="iu-mc3">
              ${this._renderEnabled(isEnabled, isBlocked)}
            </div>
          </div>
          <div
            class="iu-menu-item iu-suspend ${suspended === undefined
              ? "iu-hidden"
              : ""}"
          >
            <div class="iu-mc1">${loc.t("menu.suspend.name")}</div>
            <div class="iu-mc2">
              <input
                type="text"
                class="iu-time-input"
                placeholder="h:mm:ss"
                title=${loc.t("menu.suspend.hint")}
                size="8"
                maxlength="8"
                required
                pattern="^[0-9]{1,2}:[0-9]{2}:[0-9]{2}$"
              />
            </div>
            <div class="iu-mc3">
              <ha-icon-button
                icon="mdi:timer-outline"
                title=${loc.t("menu.suspend.buttonHint")}
                @click="${this._serviceSuspend}"
              >
                <ha-icon icon="mdi:timer-outline"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
          <div
            class="iu-menu-item iu-manual ${!allowManual ? "iu-hidden" : ""}"
          >
            <div class="iu-mc1">${loc.t("menu.manual.name")}</div>
            <div class="iu-mc2">
              <input
                type="text"
                class="iu-time-input"
                placeholder="0:00:00"
                title=${loc.t("menu.manual.hint")}
                size="8"
                maxlength="8"
                required
                pattern="^[0-9]{1,2}:[0-9]{2}:[0-9]{2}$"
              />
            </div>
            <div class="iu-mc3">
              <ha-icon-button
                icon="mdi:play"
                title=${loc.t("menu.manual.buttonHint")}
                @click="${this._serviceManualRun}"
              >
                <ha-icon icon="mdi:run"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
          <div
            class="iu-menu-item iu-pause ${(~pauseResume & 1) > 0
              ? "iu-hidden"
              : ""}"
          >
            <div class="iu-mc1">${loc.t("menu.pause.name")}</div>
            <div class="iu-mc2"></div>
            <div class="iu-mc3">
              <ha-icon-button
                .disabled=${(~pauseResume & 1) > 0}
                title=${loc.t("menu.pause.buttonHint")}
                @click="${this._servicePause}"
              >
                <ha-icon icon="mdi:pause"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
          <div
            class="iu-menu-item iu-resume ${(~pauseResume & 2) > 0
              ? "iu-hidden"
              : ""}"
          >
            <div class="iu-mc1">${loc.t("menu.resume.name")}</div>
            <div class="iu-mc2"></div>
            <div class="iu-mc3">
              <ha-icon-button
                .disabled=${(~pauseResume & 2) > 0}
                title=${loc.t("menu.resume.buttonHint")}
                @click="${this._serviceResume}"
              >
                <ha-icon icon="mdi:play"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
          <div
            class="iu-menu-item iu-cancel ${!allowCancel ? "iu-hidden" : ""}"
          >
            <div class="iu-mc1">${loc.t("menu.cancel.name")}</div>
            <div class="iu-mc2"></div>
            <div class="iu-mc3">
              <ha-icon-button
                .disabled=${!allowCancel}
                title=${loc.t("menu.cancel.buttonHint")}
                @click="${this._serviceCancel}"
              >
                <ha-icon icon="mdi:cancel"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
          <div
            class="iu-menu-item iu-adjust ${adjustment === undefined
              ? "iu-hidden"
              : ""}"
          >
            <div class="iu-mc1">${loc.t("menu.adjust.name")}</div>
            <div class="iu-mc2">
              <input
                type="text"
                class="iu-adjust-input"
                value=${adjustment ?? ""}
                title=${loc.t("menu.adjust.hint")}
                size="9"
                maxlength="9"
                pattern="^$|^[=+-][0-9]{1,2}:[0-9]{2}:[0-9]{2}$|^%[0-9]*.?[0-9]+$"
              />
            </div>
            <div class="iu-mc3">
              <ha-icon-button
                title=${loc.t("menu.adjust.buttonHint")}
                @click="${this._serviceAdjust}"
              >
                <ha-icon icon="mdi:adjust"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _renderEnabled(
    isEnabled: boolean,
    isBlocked: boolean
  ): TemplateResult {
    return html`
      <ha-switch
        .checked=${isEnabled}
        .disabled=${isBlocked}
        title=${loc.t("menu.enable.buttonHint")}
        @change="${this._serviceEnable}"
      ></ha-switch>
    `;
  }

  private _selectColour(index: number): string {
    const palette: string[] = [
      "#3498db",
      "#e74c3c",
      "#9b59b6",
      "#f1c40f",
      "#2ecc71",
      "#1abc9c",
      "#34495e",
      "#e67e22",
      "#7f8c8d",
      "#27ae60",
      "#2980b9",
      "#8e44ad",
    ];
    return palette[index % palette.length];
  }

  private _clickNet(e: Event): void {
    const target = e.target as Element;
    if (target.closest(".iu-menu")) return;

    const menus = target
      .closest("#iu-card")
      ?.querySelectorAll(".iu-menu-content:not(.iu-hidden)");
    menus?.forEach((p) => p.classList.add("iu-hidden"));
  }

  private _toggleCollapse(e: Event): void {
    const target = (e.target as Element).closest(".iu-collapsible");
    target?.classList.toggle("iu-hidden");
    this.requestUpdate();
  }

  private _toggleZones(e: Event): void {
    (e.target as Element)
      .closest(".iu-controller")
      ?.querySelector(".iu-zones")
      ?.classList.toggle("iu-hidden");
  }

  private _toggleSequences(e: Event): void {
    (e.target as Element)
      .closest(".iu-controller")
      ?.querySelector(".iu-sequences")
      ?.classList.toggle("iu-hidden");
  }

  private _toggleMenu(e: Event): void {
    (e.target as Element)
      .closest(".iu-menu")
      ?.querySelector(".iu-menu-content")
      ?.classList.toggle("iu-hidden");
  }

  private _get_iu_key(e: Event): string[] | undefined {
    return (e.target as Element)
      .closest(".iu-object")
      ?.getAttribute("iu-key")
      ?.split(".", 4);
  }

  private _build_entity_id(keys: string[]): string {
    const controller = this.iu_coordinator.controllers[+keys[0] - 1];
    let entity_id: string;
    if (keys[1] === "0" && keys[2] === "0") {
      entity_id = controller.entity_id;
    } else if (keys[1] !== "0") {
      entity_id = controller.zones[+keys[1] - 1].entity_id;
    } else {
      entity_id = controller.sequences[+keys[2] - 1].entity_id;
    }
    return entity_id;
  }

  private _build_data(
    e: Event
  ): { [key: string]: string | number | null } | undefined {
    const keys = this._get_iu_key(e);
    if (!keys) return;

    const entity_id = this._build_entity_id(keys);
    const data = {
      entity_id: entity_id,
    };
    if (keys[3] !== "0") {
      data["zones"] = Number(keys[3]);
    }
    return data;
  }

  private _serviceEnable(e: Event): void {
    const data = this._build_data(e);
    if (!data) return;

    this.hass.callService("irrigation_unlimited", "toggle", data);
    return;
  }

  private _serviceSuspend(e: Event): void {
    const data = this._build_data(e);
    if (!data) return;

    const timeElement = (e.target as Element)
      .closest(".iu-menu-item")
      ?.querySelector(".iu-time-input") as HTMLInputElement;
    if (timeElement.value) data["for"] = timeElement.value;
    else data["reset"] = null;

    this.hass.callService("irrigation_unlimited", "suspend", data);
  }

  private _serviceManualRun(e: Event): void {
    const data = this._build_data(e);
    if (!data) return;

    const timeElement = (e.target as Element)
      .closest(".iu-menu-item")
      ?.querySelector(".iu-time-input") as HTMLInputElement;
    if (timeElement.value) data["time"] = timeElement.value;

    this.hass.callService("irrigation_unlimited", "manual_run", data);
    this._toggleMenu(e);
    return;
  }

  private _serviceCancel(e: Event): void {
    const data = this._build_data(e);
    if (!data) return;

    this.hass.callService("irrigation_unlimited", "cancel", data);
    this._toggleMenu(e);
  }

  private _servicePause(e: Event): void {
    const data = this._build_data(e);
    if (!data) return;

    data["sequence_id"] = "0";
    this.hass.callService("irrigation_unlimited", "pause", data);
    this._toggleMenu(e);
  }

  private _serviceResume(e: Event): void {
    const data = this._build_data(e);
    if (!data) return;

    data["sequence_id"] = "0";
    this.hass.callService("irrigation_unlimited", "resume", data);
    this._toggleMenu(e);
  }

  private _serviceAdjust(e: Event): void {
    const data = this._build_data(e);
    if (!data) return;

    const adjustElement = (e.target as Element)
      .closest(".iu-menu-item")
      ?.querySelector(".iu-adjust-input") as HTMLInputElement;
    const value = adjustElement.value;

    switch (value.slice(0, 1)) {
      case "%": {
        data["percentage"] = value.slice(1);
        break;
      }
      case "=": {
        data["actual"] = value.slice(1);
        break;
      }
      case "+": {
        data["increase"] = value.slice(1);
        break;
      }
      case "-": {
        data["decrease"] = value.slice(1);
        break;
      }
      case "": {
        data["reset"] = null;
        break;
      }
      default:
        return;
    }

    this.hass.callService("irrigation_unlimited", "adjust_time", data);
    this._toggleMenu(e);
  }
}
