import { IsNodeMatchOptions } from '@quadrats/core';

export interface ExitBreakRule {
  hotkey: string;
  /**
   * @default ParagraphType
   */
  defaultType?: string;
  match?: IsNodeMatchOptions & {
    /**
     * Only match at if selection on edge of block.
     * @default false
     */
    onlyAtEdge?: boolean;
  };
  /**
   * Exit before the selected block if true.
   * @default false
   */
  before?: boolean;
}

export interface SoftBreakRule {
  hotkey: string;
  match?: IsNodeMatchOptions;
}
