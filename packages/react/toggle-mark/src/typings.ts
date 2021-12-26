import { ToggleMark } from '@quadrats/common/toggle-mark';
import {
  CreateRenderMarkOptions,
  ReactEditor,
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
  extends ToggleMark<ReactEditor>,
  WithCreateHandlers<[ReactToggleMarkCreateHandlersOptions?]>,
  WithCreateRenderLeaf<[ReactToggleMarkCreateRenderLeafOptions?]> {}
