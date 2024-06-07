import React from 'react';
import { ListRootTypeKey } from '@quadrats/common/list';
import { ToolbarIcon, ToolbarIconProps } from '@quadrats/react/toolbar';
import { ReactList } from '@quadrats/react/list';
import { useListTool } from './useListTool';

export interface ListToolbarIconProps extends Omit<ToolbarIconProps, 'active' | 'onClick'> {
  controller: ReactList;
  listTypeKey: ListRootTypeKey;
}

function ListToolbarIcon(props: ListToolbarIconProps) {
  const { controller, listTypeKey, ...rest } = props;
  const { active, onClick } = useListTool(controller, listTypeKey);

  return <ToolbarIcon {...rest} active={active} onClick={onClick} />;
}

export default ListToolbarIcon;
