import React from 'react';
import clsx from 'clsx';
import { ArrowDown } from '@quadrats/icons';
import { Icon, IconProps } from '@quadrats/react/components';

export interface ToolbarIconProps extends Omit<IconProps, 'ref'> {
  active?: boolean;
  withArrow?: boolean;
}

function ToolbarIcon(props: ToolbarIconProps) {
  const {
    active, className, onMouseDown, withArrow, ...rest
  } = props;

  return (
    <div className={clsx('qdr-toolbar__icon', { 'qdr-toolbar__icon--active': active }, className)}>
      <Icon
        {...rest}
        onMouseDown={(event) => {
          event.preventDefault();
          onMouseDown?.(event);
        }}
      />
      {withArrow && (
        <Icon icon={ArrowDown} width={12} height={12} />
      )}
    </div>
  );
}

export default ToolbarIcon;
