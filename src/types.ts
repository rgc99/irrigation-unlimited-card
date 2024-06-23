import { HomeAssistant } from "./ha-types";

export interface LovelaceCardConfig {
  index?: number;
  view_index?: number;
  type: string;
  [key: string]: any;
}

export interface ConfigChangedEvent {
  config: LovelaceCardConfig;
  error?: string;
  guiModeAvailable?: boolean;
}

declare global {
  interface HASSDomEvents {
    // @ts-ignore
    "config-changed": ConfigChangedEvent;
  }
}

export interface ShowViewConfig {
  user?: string;
}

export interface LovelaceViewConfig {
  index?: number;
  title?: string;
  type?: string;
  strategy?: {
    type: string;
    options?: Record<string, unknown>;
  };
  cards?: LovelaceCardConfig[];
  path?: string;
  icon?: string;
  theme?: string;
  panel?: boolean;
  background?: string;
  visible?: boolean | ShowViewConfig[];
}

export interface LovelaceConfig {
  title?: string;
  strategy?: {
    type: string;
    options?: Record<string, unknown>;
  };
  views: LovelaceViewConfig[];
  background?: string;
}

export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  lovelace?: LovelaceConfig;
  setConfig(config: LovelaceCardConfig): void;
}

declare global {
  interface HTMLElementTagNameMap {
    "irrigation-unlimited-card-editor": LovelaceCardEditor;
  }
}

export interface IrrigationUnlimitedCardConfig extends LovelaceCardConfig {
  type: string;
  name?: string;
  show_controllers?: string;
  always_show_zones?: boolean;
  always_show_sequences?: boolean;
  show_timeline_history?: boolean;
  show_timeline_scheduled?: boolean;
}
