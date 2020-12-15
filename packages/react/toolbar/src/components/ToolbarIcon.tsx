import React from 'react';
import clsx from 'clsx';
import { Icon, IconProps } from '@quadrats/react/components';
import './toolbar.styles';

export interface ToolbarIconProps extends Omit<IconProps, 'ref'> {
  active?: boolean;
}

function ToolbarIcon(props: ToolbarIconProps) {
  const {
    active, className, onMouseDown, ...rest
  } = props;

  return (
    <Icon
      {...rest}
      className={clsx('qdr-toolbar__icon', { 'qdr-toolbar__icon--active': active }, className)}
      onMouseDown={(event) => {
        event.preventDefault();
        onMouseDown?.(event);
      }}
    />
  );
}

export default ToolbarIcon;
