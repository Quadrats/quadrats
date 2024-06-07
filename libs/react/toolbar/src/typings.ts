import { Range } from '@quadrats/core';
import { InputWidgetConfig } from '@quadrats/common/input-widget';

export interface ToolInputConfig extends InputWidgetConfig {
  currentSelection: Range | null;
}

export type StartToolInput = (config: InputWidgetConfig) => void;
