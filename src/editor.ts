import {
  LitElement,
  html,
  TemplateResult,
  css,
  CSSResultGroup,
  nothing,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant } from "./ha-types";
import { fireEvent } from "./fire_event";
import { IrrigationUnlimitedCardConfig } from "./types";
import { localise } from "./localize";

const loc = new localise(window.navigator.language);

@customElement("irrigation-unlimited-card-editor")
export class IrrigationUnlimitedCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: IrrigationUnlimitedCardConfig;

  public setConfig(config: IrrigationUnlimitedCardConfig): void {
    this._config = config;
  }

  get _name(): string {
    return this._config?.name || "";
  }

  get _show_controllers(): string {
    return this._config?.show_controllers || "";
  }

  get _always_show_zones(): boolean {
    return this._config?.always_show_zones || false;
  }

  get _always_show_sequences(): boolean {
    return this._config?.always_show_sequences || false;
  }

  get _show_timeline_scheduled(): boolean {
    return this._config?.show_timeline_scheduled || false;
  }

  get _show_timeline_history(): boolean {
    return this._config?.show_timeline_history || true;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass) {
      return nothing;
    }

    return html`
      <div class="iu-editor-row">
        <ha-textfield
          label=${loc.t("editor.title.name")}
          .value=${this._name}
          .configValue=${"name"}
          @input="${this._valueChanged}"
        ></ha-textfield>
      </div>
      <div class="iu-editor-row">
        <ha-textfield
          label=${loc.t("editor.showControllers.name")}
          .value=${this._show_controllers}
          .configValue=${"show_controllers"}
          @input="${this._valueChanged}"
        ></ha-textfield>
      </div>
      <div class="iu-editor-row">
        <ha-switch
          id=${this._always_show_zones}
          .checked=${this._always_show_zones}
          .configValue=${"always_show_zones"}
          @change=${this._valueChanged}
        ></ha-switch>
        <label for=${this._always_show_zones}
          >${loc.t("editor.alwaysShowZones.name")}</label
        >
      </div>
      <div class="iu-editor-row">
        <ha-switch
          id=${this._always_show_sequences}
          .checked=${this._always_show_sequences}
          .configValue=${"always_show_sequences"}
          @change=${this._valueChanged}
        ></ha-switch>
        <label for=${this._always_show_sequences}
          >${loc.t("editor.alwaysShowSequences.name")}</label
        >
      </div>
      <div class="iu-editor-row">
        <ha-switch
          id=${this._show_timeline_scheduled}
          .checked=${this._show_timeline_scheduled}
          .configValue=${"show_timeline_scheduled"}
          @change=${this._valueChanged}
        ></ha-switch>
        <label for=${this._show_timeline_scheduled}
          >${loc.t("editor.showTimelineScheduled.name")}</label
        >
      </div>
      <div class="iu-editor-row">
        <ha-switch
          id=${this._show_timeline_history}
          .checked=${this._show_timeline_history}
          .configValue=${"show_timeline_history"}
          @change=${this._valueChanged}
        ></ha-switch>
        <label for=${this._show_timeline_history}
          >${loc.t("editor.showTimelineHistory.name")}</label
        >
      </div>
    `;
  }

  private _valueChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (target.configValue) {
      if (target.value === "") {
        const tmpConfig = { ...this._config };
        delete tmpConfig[target.configValue];
        this._config = tmpConfig;
      } else {
        this._config = {
          ...this._config,
          [target.configValue]:
            target.checked !== undefined ? target.checked : target.value,
        };
      }
    }
    fireEvent(
      this,
      "config-changed",
      { config: this._config },
      { bubbles: true, composed: true }
    );
  }

  static styles: CSSResultGroup = css`
    ha-switch {
      padding: 16px 6px;
    }
    ha-textfield {
      width: 100%;
    }
  `;
}
