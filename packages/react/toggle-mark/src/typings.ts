import { ToggleMark } from '@quadrats/common/toggle-mark';
import {
  CreateRenderMarkOptions,
  RenderMarkProps,
  WithCreateHandlers,
  WithCreateRenderLeaf,
} from '@quadrats/react';

export type RenderToggleMarkProps = RenderMarkProps<boolean>;

export interface ReactToggleMarkCreateHandlersOptions {
  /**
   * The hotkey to toggle the mark.
   */
  hotkey?: string;
}

export type ReactToggleMarkCreateRenderLeafOptions = Partial<Omit<CreateRenderMarkOptions<boolean>, 'type'>>;

export interface ReactToggleMark
  extends ToggleMark,
  WithCreateHandlers<[ReactToggleMarkCreateHandlersOptions?]>,
  WithCreateRenderLeaf<[ReactToggleMarkCreateRenderLeafOptions?]> {}
