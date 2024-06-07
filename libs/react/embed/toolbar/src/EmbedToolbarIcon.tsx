import React from 'react';
import { Editor } from '@quadrats/react';
import { InputWidgetConfig } from '@quadrats/common/input-widget';
import { ReactEmbed } from '@quadrats/react/embed';
import { ToolbarIcon, ToolbarIconProps } from '@quadrats/react/toolbar';
import { useEmbedTool } from './useEmbedTool';

export interface EmbedToolbarIconProps<Provider extends string>
  extends Omit<ToolbarIconProps, 'active' | 'onClick'>,
  Pick<InputWidgetConfig, 'getPlaceholder'> {
  controller: ReactEmbed<Provider>;
  /**
   * The providers supported by this icon.
   */
  providers: Provider[];
  startToolInput?: (editor: Editor, inputConfig: InputWidgetConfig) => void;
}

function EmbedToolbarIcon<Provider extends string>(props: EmbedToolbarIconProps<Provider>) {
  const {
    controller, providers, getPlaceholder, startToolInput, ...rest
  } = props;

  const { onClick } = useEmbedTool(controller, providers, getPlaceholder, startToolInput);

  return <ToolbarIcon {...rest} onClick={onClick} />;
}

export default EmbedToolbarIcon;
