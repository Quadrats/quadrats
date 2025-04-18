import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { ArrowDown } from '@quadrats/icons';
import { Icon, IconProps } from '@quadrats/react/components';

export interface ToolbarIconProps extends Omit<IconProps, 'ref' | 'onClick' | 'onMouseDown'> {
  active?: boolean;
  isMoreButton?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  withArrow?: boolean;
}

function ToolbarIcon(props: ToolbarIconProps) {
  const {
    active, className, children, isMoreButton, onClick: onClickProps, onMouseDown: onMouseDownProps, withArrow, ...rest
  } = props;

  const [menuExpanded, setMenuExpanded] = useState<boolean>(false);

  const onClick = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isMoreButton) {
      setMenuExpanded(expanded => !expanded);
    } else {
      onClickProps?.(event);
    }
  }, [isMoreButton, onClickProps]);

  const onMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isMoreButton) {
      event.preventDefault();
      onMouseDownProps?.(event);
    }
  }, [isMoreButton, onMouseDownProps]);

  return (
    <div className="qdr-toolbar__icon__wrapper">
      <div
        className={clsx('qdr-toolbar__icon', { 'qdr-toolbar__icon--active': active }, className)}
        onClick={onClick}
        onMouseDown={onMouseDown}
      >
        <Icon
          {...rest}
        />
        {withArrow && (
          <Icon
            icon={ArrowDown}
            width={12}
            height={12}
          />
        )}
      </div>
      {isMoreButton && (
        <div className={clsx('qdr-toolbar__icon__menu', { 'qdr-toolbar__icon__menu--expanded': menuExpanded })}>
          {children}
        </div>
      )}
    </div>
  );
}

export default ToolbarIcon;
