import { LocaleDefinition } from '@quadrats/locales';

/**
 * The minimum configuration of input for link, embed, ...etc.
 */
export interface InputWidgetConfig {
  /**
   * To get the placeholder of input widget from locale.
   */
  getPlaceholder(locale: LocaleDefinition): string;
  /**
   * Invoked after user confirming the input widget.
   */
  confirm(value: string): void;
  defaultValue?: string;
}

export type SetInputWidgetConfig = (value: InputWidgetConfig | null) => void;
