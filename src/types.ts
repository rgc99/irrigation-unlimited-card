import { LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'irrigation-unlimited-card-editor': LovelaceCardEditor;
  }
}

export interface IrrigationUnlimitedCardConfig extends LovelaceCardConfig {
  type: string;
  name?: string;
}
