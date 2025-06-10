import React from 'react';
import { InputWidgetConfig } from '@quadrats/common/input-widget';
import { ReactEmbed } from '@quadrats/react/embed';
import { ToolbarIcon, ToolbarIconProps } from '@quadrats/react/toolbar';
import { useEmbedTool } from './useEmbedTool';

export interface EmbedToolbarIconProps<Provider extends string>
  extends Omit<ToolbarIconProps, 'active' | 'onClick'>,
  Pick<InputWidgetConfig, 'getPlaceholder'> {
  controller: ReactEmbed<Provider>;
  /**
   * The provider supported by this icon.
   */
  provider: Provider;
}

function EmbedToolbarIcon<Provider extends string>(props: EmbedToolbarIconProps<Provider>) {
  const {
    controller, provider, getPlaceholder, ...rest
  } = props;

  const { onClick } = useEmbedTool(controller, provider, getPlaceholder);

  return <ToolbarIcon {...rest} onClick={onClick} />;
}

export default EmbedToolbarIcon;
