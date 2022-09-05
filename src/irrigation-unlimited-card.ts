/* eslint-disable @typescript-eslint/no-explicit-any */
import './editor';

import { LitElement, html, TemplateResult, css, PropertyValues, CSSResultGroup, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators';

import {
  HomeAssistant,
  hasConfigOrEntityChanged,
  LovelaceCardEditor,
} from 'custom-card-helpers';

import type { IrrigationUnlimitedCardConfig } from './types';
import { CARD_VERSION } from './const';
import { localize } from './localize/localize';

/* eslint no-console: 0 */
console.info(
  `%c  IRRIGATION-UNLIMITED-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'irrigation-unlimited-card',
  name: 'Irrigation Unlimited Card',
  description: 'A companion card for the Irrigation Unlimited integration',
});

type IUEntity = { entity_id: string; last_updated: Date };

@customElement('irrigation-unlimited-card')
export class IrrigationUnlimitedCard extends LitElement {

  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: IrrigationUnlimitedCardConfig;

  private _iu_entities: IUEntity[] | undefined = undefined;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('irrigation-unlimited-card-editor');
  }

  public setConfig(config: IrrigationUnlimitedCardConfig): void {
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }
    this.config = config;
  }

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  public getCardSize(): number {
    return 1;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.hass) {
      return false;
    }

    // Init entity list or check
    if (this._iu_entities == undefined) {
      this._iu_entities = [];
      for (const entity_id in this.hass.states) {
        if (entity_id.startsWith("binary_sensor.irrigation_unlimited_")) {
          const date: Date = new Date(this.hass.states[entity_id].last_updated);
          this._iu_entities.push({ entity_id: entity_id, last_updated: date });
        }
      }
      return true;
    } else {
      let result = false;
      for (const iu_entity of this._iu_entities) {
        const date = new Date(this.hass.states[iu_entity.entity_id].last_updated);
        if (date > (iu_entity.last_updated)) {
          iu_entity.last_updated = date;
          result = true;
        }
      }
      return result;
    }
    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass) {
      return nothing;
    }

    return html`
      <ha-card
        .header=${this.config.name}
        tabindex="0"
        id="iu-card"
        @click="${this._clickNet}"
      >
        <div class="iu-header-row iu-td">
          <div class="iu-td1"></div>
          <div class="iu-td2"></div>
          <div class="iu-td3"></div>
          <div class="iu-td4"><ha-icon icon="mdi:clock-outline"></ha-icon></div>
          <div class="iu-td5"><ha-icon icon="mdi:timer-sand"></ha-icon></div>
          <div class="iu-td6"><ha-icon icon="mdi:delta"></ha-icon></div>
          <div class="iu-td7"><ha-icon icon="mdi:toggle-switch-outline"></ha-icon></div>
        </div>
        <div class="iu-controllers">
          ${Array.from(Array(this.hass.states['irrigation_unlimited.coordinator'].attributes.controller_count).keys()).map((index: number) => this._renderController(index))}
        </div>
      </ha-card>
    `;
  }

  private _renderController(controller: number): TemplateResult {
    const stateObj = this.hass.states['binary_sensor.irrigation_unlimited_c' + (controller + 1) + '_m'];
    const isOn = (stateObj.state === 'on');
    const isEnabled = (stateObj.attributes.enabled);
    let start: Date;
    let duration: string;
    let schedule_name: string;
    let startStr = '';

    if (isOn) {
      start = new Date(stateObj.attributes.current_start);
      duration = stateObj.attributes.time_remaining;
      schedule_name = stateObj.attributes.current_name;
    } else {
      start = new Date(stateObj.attributes.next_start);
      duration = stateObj.attributes.next_duration;
      schedule_name = stateObj.attributes.next_name;
    }
    if (!isNaN(start.getTime())) {
      startStr = start.toLocaleTimeString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: false })
    }
    const classes: Array<string> = ['iu-controller-row iu-td'];
    if (isOn) classes.push('iu-on')
    if (isEnabled) classes.push('iu-enabled')

    return html`
      <div class="iu-controller iu-object" iu-key="${controller + 1}.0.0.0">
      <hr>
        <div class=${classes.join(' ')}>
          <div class="iu-td1"></div>
          <div class="iu-td2">
            <ha-icon .icon=${stateObj.attributes.icon}></ha-icon>
          </div>
          <div class="iu-td3">
            <span>${controller + 1}</span>
            <span class="iu-name">${stateObj.attributes.friendly_name}</span>
          </div>
          <div class="iu-td4">
            <div ?hidden=${!isEnabled}>
              <span class="iu-schedule">${schedule_name}</span>
              <span class="iu-start" ?hidden=${isOn}><br>${startStr}</span>
            </div>
          </div>
          <div class="iu-td5 iu-duration">
            <div ?hidden=${!isEnabled}>
              ${duration}
            </div>
          </div>
          <div class="iu-td6"></div>
          <div class="iu-td7">${this._renderMenu(isEnabled, false, true, true, null)}</div>
        </div>
        <div class="iu-control-panel">
          <div class="iu-control-panel-item">
            <label>Zones&nbsp;</label>
            <ha-switch @change="${this._toggleZones}"></ha-switch>
          </div>
          <div class="iu-control-panel-item">
            <label>Sequences&nbsp;</label>
            <ha-switch @change="${this._toggleSequences}"></ha-switch>
          </div>
        </div>
        <div class="iu-zones iu-content iu-hidden">
          <hr>
          ${Array.from(Array(stateObj.attributes.zone_count).keys()).map((zone: number) => this._renderZone(controller, zone))}
        </div>
        <div class="iu-sequences iu-content iu-hidden">
          <hr>
          ${stateObj.attributes.sequence_status.map((sequence: number) => this._renderSequence(controller, sequence))}
        </div>
      </div>
    `;
  }

  private _renderZone(controller: number, zone: number): TemplateResult {
    const stateObj = this.hass.states['binary_sensor.irrigation_unlimited_c' + (controller + 1) + '_z' + (zone + 1)]
    const isOn = (stateObj.state === 'on');
    const isEnabled = (stateObj.attributes.enabled);
    const isBlocked = (stateObj.attributes.status === 'blocked')
    let start: Date;
    let duration: string;
    let schedule_index: number;
    let schedule_name: string;
    let adjustment: string;
    let startStr = ''

    if (isOn) {
      start = new Date(stateObj.attributes.current_start);
      duration = stateObj.attributes.time_remaining;
      schedule_index = stateObj.attributes.current_schedule;
      schedule_name = stateObj.attributes.current_name;
      adjustment = stateObj.attributes.current_adjustment;
    } else {
      start = new Date(stateObj.attributes.next_start);
      duration = stateObj.attributes.next_duration;
      schedule_index = stateObj.attributes.next_schedule;
      schedule_name = stateObj.attributes.next_name;
      adjustment = stateObj.attributes.next_adjustment;
    }
    const isManual = schedule_index === 0;
    if (!isNaN(start.getTime())) {
      startStr = start.toLocaleTimeString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: false })
    }
    const classes: Array<string> = ['iu-zone-row iu-td'];
    if (isOn) classes.push('iu-on');
    if (isEnabled) classes.push('iu-enabled');
    if (isManual) classes.push('iu-manual');
    if (isBlocked) classes.push('iu-blocked');
    let timeline = stateObj.attributes.timeline;
    if (timeline === undefined) timeline = [];
    return html`
      <div class="iu-zone iu-object" iu-key="${controller + 1}.${zone + 1}.0.0">
        <div class="iu-collapsible iu-hidden">
          <div class=${classes.join(' ')}>
            <div class="iu-td1 iu-expander" @click="${this._toggleCollapse}"></div>
            <div class="iu-td2" @click="${this._toggleCollapse}">
              <ha-icon .icon=${stateObj.attributes.icon}></ha-icon>
            </div>
            <div class="iu-td3">
              <span style="color: ${this._selectColour(zone)}">${zone + 1}</span>
              <span class="iu-name">${stateObj.attributes.friendly_name}</span>
            </div>
            <div class="iu-td4">
              <div ?hidden=${!isEnabled || isBlocked}>
                <span class="iu-schedule">${schedule_name}</span>
                <span class="iu-start" ?hidden=${isOn || isManual}><br>${startStr}</span>
              </div>
            </div>
            <div class="iu-td5 iu-duration">
              <div ?hidden=${!isEnabled || isBlocked}>${duration}</div>
            </div>
            <div class="iu-td6 iu-adjustment">
              <div ?hidden=${isManual}>${adjustment}</div>
            </div>
            <div class="iu-td7">${this._renderMenu(isEnabled, isBlocked, true, true, adjustment)}</div>
          </div>
          <div class="iu-zone-history iu-content">
            ${timeline.filter(function (item: any) { return item.status === "history" && item.start !== item.end }).map((item: any) => this._renderZoneHistory(item))}
          </div>
        </div>
      </div>
    `;
  }

  private _renderZoneHistory(timeline: any): TemplateResult {
    const start = new Date(timeline.start);
    const duration = new Date(new Date(timeline.end).getTime() - start.getTime()).toISOString().slice(12, 19);
    const startStr = start.toLocaleString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: false });
    return html`
      <div class="iu-zone-history iu-object">
        <div class='iu-zone-history-row iu-td'}>
          <div class="iu-td1"></div>
          <div class="iu-td2">
            <ha-icon icon="mdi:history"></ha-icon>
          </div>
          <div class="iu-td3">${startStr}</div>
          <div class="iu-td4 iu-schedule">${timeline.schedule_name}</div>
          <div class="iu-td5 iu-duration">${duration}</div>
          <div class="iu-td6 iu-adjustment">${timeline.adjustment}</div>
          <div class="iu-td7"></div>
        </div>
      </div>
    `;
  }

  private _renderSequence(controller: number, sequence: any): TemplateResult {
    const isOn = (sequence.status === 'on' || sequence.status === 'paused');
    const isEnabled = (sequence.enabled);
    const isBlocked = (sequence.status === 'blocked')
    const isManual = (sequence.enabled && sequence.schedule.index === null);
    const isRunning = (sequence.duration !== 0)
    const start = new Date(sequence.start)
    let startStr = ''
    if (!isNaN(start.getTime())) {
      startStr = start.toLocaleTimeString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: false })
    }
    const duration = new Date(sequence.duration * 1000).toISOString().substring(12, 19)
    const classes: Array<string> = ['iu-sequence-row iu-td'];
    if (isOn) classes.push('iu-on');
    if (isEnabled) classes.push('iu-enabled');
    if (isManual) classes.push('iu-manual');
    if (isRunning) classes.push('iu-running');
    if (isBlocked) classes.push('iu-blocked');

    return html`
      <div class="iu-sequence iu-object" iu-key="${controller + 1}.0.${sequence.index + 1}.0">
        <div class="iu-collapsible iu-hidden">
          <div class=${classes.join(' ')}>
            <div class="iu-td1 iu-expander" @click="${this._toggleCollapse}"></div>
            <div class="iu-td2" @click="${this._toggleCollapse}">
              <ha-icon .icon=${sequence.icon} ?is-on=${isOn}></ha-icon>
            </div>
            <div class="iu-td3" @click="${this._toggleCollapse}">
              <span>${sequence.index + 1}</span>
              <span class="iu-name">${sequence.name}</span>
            </div>
            <div class="iu-td4">
              <div ?hidden=${!isEnabled || isBlocked || !isRunning}>
                <span class="iu-schedule">${sequence.schedule.name}</span>
                <span class="iu-start" ?hidden=${isOn}><br>${startStr}</span>
              </div>
            </div>
            <div class="iu-td5 iu-duration">
              <div ?hidden=${!isEnabled || isBlocked || !isRunning}>${duration}</div>
            </div>
            <div class="iu-td6 iu-adjustment">
            <div ?hidden=${isManual}>${sequence.adjustment}</div>
            </div>
            <div class="iu-td7">${this._renderMenu(isEnabled, isBlocked, true, false, sequence.adjustment)}</div>
          </div>
          <div class="iu-sequence-zones iu-content">
            ${sequence.zones.map((sequenceZone: any) => this._renderSequenceZone(controller, sequence.index, sequenceZone, isManual))}
          </div>
        </div>
      </div>
    `;
  }

  private _renderSequenceZone(controller: number, sequence: number, sequenceZone: any, isManual: boolean): TemplateResult {
    const isOn = (sequenceZone.status === 'on');
    const isEnabled = (sequenceZone.enabled);
    const isBlocked = (sequenceZone.status === 'blocked')
    const isRunning = (sequenceZone.duration !== 0)
    const duration = new Date(sequenceZone.duration * 1000).toISOString().substring(12, 19)
    const classes: Array<string> = ['iu-sequence-zone-row iu-td'];
    if (isOn) classes.push('iu-on');
    if (isEnabled) classes.push('iu-enabled');
    if (isManual) classes.push('iu-manual');
    if (isRunning) classes.push('iu-running');
    if (isBlocked) classes.push('iu-blocked');

    return html`
      <div class="iu-sequence-zone iu-object" iu-key="${controller + 1}.0.${sequence + 1}.${sequenceZone.index + 1}">
        <div class=${classes.join(' ')}>
          <div class="iu-td1"></div>
          <div class="iu-td2">
            <ha-icon .icon=${sequenceZone.icon} ?is-on=${isOn}></ha-icon>
          </div>
          <div class="iu-td3">
            <span>${sequenceZone.zone_ids.map((zoneRef: number) => this._renderSequenceZoneRef(zoneRef))}</span>
          </div>
          <div class="iu-td4"></div>
          <div class="iu-td5 iu-duration">
            <div ?hidden=${!isEnabled || isBlocked || !isRunning}>${duration}</div>
          </div>
          <div class="iu-td6 iu-adjustment">
            <div ?hidden=${isManual}>${sequenceZone.adjustment}</div>
          </div>
          <div class="iu-td7">${this._renderMenu(isEnabled, isBlocked, false, false, sequenceZone.adjustment)}</div>
        </div>
      </div>
    `;
  }

  private _renderSequenceZoneRef(zoneRef: number): TemplateResult {
    return html`
      <span style="color: ${this._selectColour(zoneRef - 1)}">${zoneRef}</span>
    `;
  }

  private _renderMenu(isEnabled: boolean, isBlocked: boolean, allowManual: boolean, allowCancel: boolean, adjustment: string | null | undefined): TemplateResult {
    return html`
      <div class="iu-menu">
        <ha-icon class="iu-menu-button" icon="mdi:dots-vertical" @click="${this._toggleMenu}"></ha-icon>
        <div class="iu-menu-content iu-hidden">
          <div class="iu-menu-item">
            <div class="iu-mc1">Enable</div>
            <div class="iu-mc2"></div>
            <div class="iu-mc3">${this._renderEnabled(isEnabled, isBlocked)}</div>
          </div>
          <div class="iu-menu-item ${(!allowManual) ? 'iu-hidden' : ''}">
            <div class="iu-mc1">Manual</div>
            <div class="iu-mc2">
              <input type="text"
                class="iu-time-input"
                placeholder="0:00:00"
                title="Duration"
                size="8"
                maxlength="8"
                required
                pattern="^[0-9]{1,2}:[0-9]{2}:[0-9]{2}$">
              </input>
            </div>
            <div class="iu-mc3">
              <ha-icon-button icon="mdi:play" @click="${this._serviceManualRun}">
                <ha-icon icon="mdi:play"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
          <div class="iu-menu-item ${(!allowCancel) ? 'iu-hidden' : ''}">
            <div class="iu-mc1">Cancel</div>
            <div class="iu-mc2"></div>
            <div class="iu-mc3">
              <ha-icon-button .disabled=${!allowCancel} @click="${this._serviceCancel}">
                <ha-icon icon="mdi:cancel"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
          <div class="iu-menu-item ${(adjustment === undefined) ? 'iu-hidden' : ''}">
            <div class="iu-mc1">Adjust</div>
            <div class="iu-mc2">
              <input type="text"
                class="iu-adjust-input"
                value=${adjustment}
                title="Adjustment options\n===============\nPercentage: %n\nActual: =0:00:00\nIncrease: +0:00:00\nDecrease: -0:00:00\nReset: <blank>"
                size="9"
                maxlength="9"
                pattern="^$|^[=+-][0-9]{1,2}:[0-9]{2}:[0-9]{2}$|^%[0-9]*\.?[0-9]+$">
              </input>
            </div>
            <div class="iu-mc3">
              <ha-icon-button icon="mdi:adjust" @click="${this._serviceAdjust}">
                <ha-icon icon="mdi:adjust"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _renderEnabled(isEnabled: boolean, isBlocked: boolean): TemplateResult {
    return html`
      <ha-switch
        .checked=${isEnabled}
        .disabled=${isBlocked}
        @change="${this._serviceEnable}"
      ></ha-switch>
    `;
  }

  private _selectColour(index: number): string {
    const palette: string[] = ['#3498db', '#e74c3c', '#9b59b6', '#f1c40f', '#2ecc71', '#1abc9c', '#34495e', '#e67e22', '#7f8c8d', '#27ae60', '#2980b9', '#8e44ad'];
    return palette[index % palette.length]
  }

  private _clickNet(e: Event): void {
    const target = e.target as Element;
    if (target.closest('.iu-menu')) return;

    const menus = target.closest('#iu-card')?.querySelectorAll('.iu-menu-content:not(.iu-hidden)');
    menus?.forEach(p => p.classList.add('iu-hidden'))
  }

  private _toggleCollapse(e: Event): void {
    const target = (e.target as Element).closest('.iu-collapsible');
    target?.classList.toggle('iu-hidden')
    this.requestUpdate();
  }

  private _toggleZones(e: Event): void {
    (e.target as Element).closest('.iu-controller')?.querySelector('.iu-zones')?.classList.toggle('iu-hidden')
  }

  private _toggleSequences(e: Event): void {
    (e.target as Element).closest('.iu-controller')?.querySelector('.iu-sequences')?.classList.toggle('iu-hidden')
  }

  private _toggleMenu(e: Event): void {
    (e.target as Element).closest('.iu-menu')?.querySelector('.iu-menu-content')?.classList.toggle('iu-hidden')
  }

  private _get_iu_key(e: Event): string[] | undefined {
    return (e.target as Element).closest('.iu-object')?.getAttribute('iu-key')?.split(".", 4);
  }

  private _build_entity_id(keys: string[]): string {
    let entity_id = 'binary_sensor.irrigation_unlimited_c' + keys[0] + '_';
    entity_id += (keys[1] === '0') ? 'm' : 'z' + keys[1];
    return entity_id
  }

  private _build_data(e: Event): { [key: string]: string | number | null; } | undefined {
    const keys = this._get_iu_key(e);
    if (!keys) return;

    const entity_id = this._build_entity_id(keys);
    const data = {
      entity_id: entity_id
    }
    if (keys[2] !== '0') {
      data['sequence_id'] = Number(keys[2]);
    }
    if (keys[3] !== '0') {
      data['zones'] = Number(keys[3])
    }
    return data;
  }

  private _serviceEnable(e: Event): void {
    const data = this._build_data(e);
    if (!data) return;

    this.hass.callService('irrigation_unlimited', 'toggle', data);
    return;
  }

  private _serviceManualRun(e: Event): void {
    const data = this._build_data(e);
    if (!data) return;

    const timeElement = (e.target as Element).closest('.iu-menu-item')?.querySelector('.iu-time-input') as HTMLInputElement;
    data['time'] = timeElement.value;

    this.hass.callService('irrigation_unlimited', 'manual_run', data);
    this._toggleMenu(e);
    return;
  }

  private _serviceCancel(e: Event): void {
    const data = this._build_data(e);
    if (!data) return;

    this.hass.callService('irrigation_unlimited', 'cancel', data);
    this._toggleMenu(e);
  }

  private _serviceAdjust(e: Event): void {
    const data = this._build_data(e);
    if (!data) return;

    const adjustElement = (e.target as Element).closest('.iu-menu-item')?.querySelector('.iu-adjust-input') as HTMLInputElement;
    const value = adjustElement.value;

    switch (value.slice(0, 1)) {
      case '%': { data['percentage'] = value.slice(1); break; }
      case '=': { data['actual'] = value.slice(1); break; }
      case '+': { data['increase'] = value.slice(1); break; }
      case '-': { data['decrease'] = value.slice(1); break; }
      case '': { data['reset'] = null; break; }
      default: return;
    }

    console.log(data);
    this.hass.callService('irrigation_unlimited', 'adjust_time', data);
    this._toggleMenu(e);
  }

  static get styles(): CSSResultGroup {
    return css`
      .iu-control-panel {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      .iu-control-panel-item {
        padding: .5em 0 .5em 1em;
      }

      .iu-zones.iu-hidden.iu-content {
        display: none;
      }

      .iu-sequences.iu-hidden.iu-content {
        display: none;
      }

      .iu-hidden .iu-content {
        display: none;
      }

      .iu-hidden .iu-expander::before {
        content: '\u25B6';
        font-size: large;
      }

      .iu-expander::before {
        content: '\u25BC';
        font-size: large;
      }

      .iu-controller-row.iu-td {
        display: flex;
        align-items: center;
        min-height: 3em;
      }

      .iu-zone-row.iu-td {
        display: flex;
        align-items: center;
        min-height: 3em;
      }

      .iu-sequence-row.iu-td {
        display: flex;
        align-items: center;
        min-height: 3em;
      }

      .iu-sequence-zone-row.iu-td {
        display: flex;
        align-items: center;
        height: 2em;
      }

      .iu-td {
        display: flex;
        align-items: center;
      }

      .iu-td1 {
        flex: 1.5em;
        text-align: center;
        cursor: pointer;
      }

      .iu-td2 {
        flex: 30px;
        text-align: center;
      }

      .iu-td3 {
        flex: 40%;
        text-align: left;
      }

      .iu-td4 {
        flex: 20%;
        text-align: center;
      }

      .iu-td5 {
        flex: 15%;
        text-align: center;
      }

      .iu-td6 {
        flex: 15%;
        text-align: center;
      }

      .iu-td7 {
        flex: 10%;
        text-align: center;
      }

      .iu-on .iu-duration {
        color: var(--state-on-color, #66a61e);
      }

      .iu-schedule {
        color: var(--secondary-text-color, #727272);
        font-size: small;
      }

      .iu-manual .iu-schedule {
        color: var(--label-badge-red, #DF4C1E);
      }

      .iu-name {
        color: var(--secondary-text-color, #727272);
        font-weight: 500;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      ha-icon {
        color: var(--state-icon-color, #44739e);
      }

      .iu-on .iu-td2 ha-icon {
        color: var(--state-icon-active-color, #FDD835);
      }

      .iu-menu {
        position: relative;
        display: inline-block;
      }

      .iu-menu-button {
        background-color: transparent;
        text-align: center;
        display: block;
        font-size: 16px;
        border: none;
        cursor: pointer;
      }

      .iu-menu-content {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        width: 200px;
        padding: 10px 0;
        position: absolute;
        background-color: var(--card-background-color, white);
        right: 0;
        box-shadow: 0px 0px 7px 0px rgba(50, 50, 50, 0.75);
        border-radius: 5px;
        z-index: 1;
      }

      .iu-menu-content.iu-hidden {
        display: none;
      }

      .iu-menu-content .iu-menu-item {
        display: flex;
        padding: 0px 5px;
        line-height: 48px;
      }

      .iu-menu .iu-menu-item:hover {
        color: var(--primary-color, #b3e5fc);
        background-color: var(--secondary-background-color, #e5e5e5);
      }

      .iu-menu-item.iu-hidden {
        display: none;
      }

      .iu-mc1 {
        flex: 30%;
        text-align: left;
      }

      .iu-mc2 {
        flex: 40%;
        text-align: right;
      }

      .iu-mc3 {
        flex: 30%;
        text-align: center;
      }

      .iu-mc3 ha-icon {
        display: flex;
      }

      .iu-adjust-input:invalid,
      .iu-time-input:invalid {
        color: var(--label-badge-red, #DF4C1E);
      }
    }`;
  }
}
