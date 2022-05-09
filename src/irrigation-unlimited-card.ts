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

@customElement('irrigation-unlimited-card')
export class IrrigationUnlimitedCard extends LitElement {

  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: IrrigationUnlimitedCardConfig;

  private _entities: Array<string> | undefined = undefined;
  private _last_update: Date | undefined = undefined;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('irrigation-unlimited-card-editor');
  }

  setConfig(config: IrrigationUnlimitedCardConfig): void {
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }
    this.config = config;
  }

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.hass) {
      return false;
    }

    // Init entity list or check
    if (this._entities == undefined) {
      this._entities = [];
      for (const entity_id in this.hass.states) {
        if (entity_id.startsWith("binary_sensor.irrigation_unlimited_")) {
          this._entities.push(entity_id);
          const date: Date = new Date(this.hass.states[entity_id].last_updated);
          if (this._last_update == undefined || date > this._last_update) {
            this._last_update = date;
          }
          // Build display status
          if (entity_id.endsWith("_m")) {
          }
        }
      }
      return true;
    } else {
      for (const entity_id of this._entities) {
        const date = new Date(this.hass.states[entity_id].last_updated);
        if (this._last_update == undefined || date > this._last_update) {
          this._last_update = date;
          return true;
        }
      }
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
      >
        <div class="iu-td">
          <div class="iu-td1"></div>
          <div class="iu-td2"></div>
          <div class="iu-td3"></div>
          <div class="iu-td4"><ha-icon icon="mdi:clock-outline"></ha-icon></div>
          <div class="iu-td5"><ha-icon icon="mdi:timer-sand"></ha-icon></div>
          <div class="iu-td6"><ha-icon icon="mdi:delta"></ha-icon></div>
          <div class="iu-td7"><ha-icon icon="mdi:toggle-switch-outline"></ha-icon></div>
        </div>
        <div class="iu-controller">
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
    const classes: Array<string> = ['iu-td'];
    if (isOn) classes.push('iu-on')
    if (isEnabled) classes.push('iu-enabled')

    return html`
          <div class=${classes.join(' ')}>
            <div class="iu-td1"></div>
            <div class="iu-td2"><ha-icon .icon=${stateObj.attributes.icon}></ha-icon></div>
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
            <div class="iu-td7">
              <ha-switch
                .checked=${isEnabled}
                iukey="${controller + 1}.0.0.0"
                @change="${this._toggleEnable}"
              ></ha-switch>
            </div>
          </div>
          <div class="iu-control-panel">
            <div class="iu-control-panel-item"><label>Zones&nbsp;</label><ha-switch @change="${this._toggleZones}"></ha-switch></div>
            <div class="iu-control-panel-item"><label>Sequences&nbsp;</label><ha-switch @change="${this._toggleSequences}"></ha-switch></div>
          </div>
          <div class="iu-zones iu-content iu-hidden">
            <hr>
            ${Array.from(Array(stateObj.attributes.zone_count).keys()).map((zone: number) => this._renderZone(controller, zone))}
          </div>
          <div class="iu-sequences iu-content iu-hidden">
            <hr>
            ${stateObj.attributes.sequence_status.map((sequence: number) => this._renderSequence(controller, sequence))}
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
    const classes: Array<string> = ['iu-td'];
    if (isOn) classes.push('iu-on');
    if (isEnabled) classes.push('iu-enabled');
    if (isManual) classes.push('iu-manual');
    if (isBlocked) classes.push('iu-blocked');

    return html`
      <div class=${classes.join(' ')}>
      <div class="iu-td1"></div>
      <div class="iu-td2"><ha-icon .icon=${stateObj.attributes.icon}></ha-icon></div>
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
        <div class="iu-td7">
          <ha-switch
            .checked=${isEnabled}
            .disabled=${isBlocked}
            iukey="${controller + 1}.${zone + 1}.0.0"
            @change="${this._toggleEnable}"
          ></ha-switch>
        </div>
      </div>`;
  }

  private _renderSequence(controller: number, sequence: any): TemplateResult {
    const isOn = (sequence.status === 'on');
    const isEnabled = (sequence.enabled);
    const isBlocked = (sequence.status === 'blocked')
    const isManual = (sequence.schedule.index === null);
    const isRunning = (sequence.duration !== 0)
    const start = new Date(sequence.start)
    let startStr = ''
    if (!isNaN(start.getTime())) {
      startStr = start.toLocaleTimeString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: false })
    }
    const duration = new Date(sequence.duration * 1000).toISOString().substring(12, 19)
    const classes: Array<string> = ['iu-td'];
    if (isOn) classes.push('iu-on');
    if (isEnabled) classes.push('iu-enabled');
    if (isManual) classes.push('iu-manual');
    if (isRunning) classes.push('iu-running');
    if (isBlocked) classes.push('iu-blocked');

    return html`
      <div class="iu-collapsible iu-hidden">
        <div class=${classes.join(' ')}>
          <div class="iu-td1 iu-expander" @click="${this._toggleCollapse}"></div>
          <div class="iu-td2"><ha-icon .icon=${sequence.icon} ?is-on=${isOn}></ha-icon></div>
          <div class="iu-td3">
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
          <div class="iu-td7">
            <ha-switch
              .checked=${isEnabled}
              .disabled=${isBlocked}
              iukey="${controller + 1}.0.${sequence.index + 1}.0"
              @change="${this._toggleEnable}"
            ></ha-switch>
          </div>
        </div>
        <div class="iu-content">
          ${sequence.zones.map((sequenceZone: any) => this._renderSequenceZone(controller, sequence.index, sequenceZone, isManual))}
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
    const classes: Array<string> = ['iu-td'];
    if (isOn) classes.push('iu-on');
    if (isEnabled) classes.push('iu-enabled');
    if (isManual) classes.push('iu-manual');
    if (isRunning) classes.push('iu-running');
    if (isBlocked) classes.push('iu-blocked');

    return html`
      <div class=${classes.join(' ')}>
        <div class="iu-td1"></div>
        <div class="iu-td2"><ha-icon .icon=${sequenceZone.icon} ?is-on=${isOn}></ha-icon></div>
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
        <div class="iu-td7">
          <ha-switch
            .checked=${sequenceZone.enabled}
            .disabled=${sequenceZone.status === 'blocked'}
            iukey="${controller + 1}.0.${sequence + 1}.${sequenceZone.index + 1}"
            @change="${this._toggleEnable}"
          ></ha-switch>
        </div>
      </div>
    `;
  }

  private _renderSequenceZoneRef(zoneRef: number): TemplateResult {
    return html`
      <span style="color: ${this._selectColour(zoneRef - 1)}">${zoneRef}</span>
    `;
  }

  private _selectColour(index: number): string {
    const palette: string[] = ['#3498db', '#e74c3c', '#9b59b6', '#f1c40f', '#2ecc71', '#1abc9c', '#34495e', '#e67e22', '#7f8c8d', '#27ae60', '#2980b9', '#8e44ad'];
    return palette[index % palette.length]
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

  private _toggleEnable(e: Event): void {
    const keys = (e.target as Element).getAttribute('iukey')?.split(".", 4);
    if (!keys) return;

    let entity_id = 'binary_sensor.irrigation_unlimited_c' + keys[0] + '_';
    entity_id += (keys[1] === '0') ? 'm' : 'z' + keys[1];

    const data = {
      entity_id: entity_id
    }
    if (keys[2] !== '0') {
      data['sequence_id'] = Number(keys[2]);
    }
    if (keys[3] !== '0') {
      data['zones'] = Number(keys[3])
    }
    this.hass.callService('irrigation_unlimited', 'toggle', data);
    return;
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
      }

      .iu-expander::before {
        content: '\u25BC';
      }

      .iu-td {
        display: flex;
      }

      .iu-td1 {
        flex: 20px;
        text-align: center;
        align-self: center;
      }

      .iu-td2 {
        flex: 30px;
        text-align: center;
        align-self: center;
      }

      .iu-td3 {
        flex: 40%;
        text-align: left;
        align-self: center;
      }

      .iu-td4 {
        flex: 20%;
        text-align: center;
        align-self: center;
      }

      .iu-td5 {
        flex: 15%;
        text-align: center;
        align-self: center;
      }

      .iu-td6 {
        flex: 15%;
        text-align: center;
        align-self: center;
      }

      .iu-td7 {
        flex: 10%;
        text-align: center;
        align-self: center;
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
        line-height: 40px;
      }

      .iu-on ha-icon {
        color: var(--state-icon-active-color, #FDD835);
        line-height: 40px;
      }

    }`;
  }
}
