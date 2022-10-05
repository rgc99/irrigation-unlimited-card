import { LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'irrigation-unlimited-card-editor': LovelaceCardEditor;
  }
}

export interface IrrigationUnlimitedCardConfig extends LovelaceCardConfig {
  type: string;
  name?: string;
  show_controllers?: string;
  always_show_zones?: boolean;
  always_show_sequences?: boolean;
}
