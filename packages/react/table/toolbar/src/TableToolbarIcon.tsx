import React from 'react';
import { ToolbarIcon, ToolbarIconProps } from '@quadrats/react/toolbar';
import { ReactTable } from '@quadrats/react/table';
import { useTableTool } from './useTableTool';

export interface TableToolbarIconProps extends Omit<ToolbarIconProps, 'active' | 'onClick'> {
  controller: ReactTable;
}

function TableToolbarIcon(props: TableToolbarIconProps) {
  const { controller, ...rest } = props;
  const { insert } = useTableTool(controller);

  return <ToolbarIcon {...rest} onClick={insert} />;
}

export default TableToolbarIcon;
