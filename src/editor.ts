/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, CSSResultGroup, nothing } from 'lit';
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';

import { IrrigationUnlimitedCardConfig } from './types';
import { customElement, property, state } from 'lit/decorators';

@customElement('irrigation-unlimited-card-editor')
export class IrrigationUnlimitedCardEditor extends LitElement {

  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: IrrigationUnlimitedCardConfig;

  public setConfig(config: IrrigationUnlimitedCardConfig): void {
    this._config = config;
  }

  get _name(): string {
    return this._config?.name || '';
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass) {
      return nothing;
    }

    return html`
      <paper-input
        label="Name (Optional)"
        .value=${this._name}
        .configValue=${'name'}
        @value-changed=${this._valueChanged}
      ></paper-input>
    `;
  }

  private _valueChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === '') {
        const tmpConfig = { ...this._config };
        delete tmpConfig[target.configValue];
        this._config = tmpConfig;
      } else {
        this._config = {
          ...this._config,
          [target.configValue]: target.checked !== undefined ? target.checked : target.value,
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this._config });
  }

  static styles: CSSResultGroup = css`
  `;
}
