import React, { useState, useCallback, useRef } from 'react';
import clsx from 'clsx';
import { ArrowDown, Check } from '@quadrats/icons';
import { Icon, IconProps } from '@quadrats/react/components';
import { useClickAway } from '@quadrats/react/utils';

export interface ToolbarIconProps extends Omit<IconProps, 'ref' | 'onClick' | 'onMouseDown'> {
  active?: boolean;
  isMoreButton?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  name?: string;
  withArrow?: boolean;
}

function ToolbarIcon(props: ToolbarIconProps) {
  const {
    active,
    className,
    children,
    isMoreButton,
    onClick: onClickProps,
    onMouseDown: onMouseDownProps,
    name,
    withArrow,
    ...rest
  } = props;

  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuExpanded, setMenuExpanded] = useState<boolean>(false);

  useClickAway(
    () => {
      if (!menuExpanded) {
        return;
      }

      return () => {
        setMenuExpanded(false);
      };
    },
    menuRef,
    [menuExpanded, menuRef],
  );

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

  if (name) {
    return (
      <div
        className={clsx(
          'qdr-toolbar__icon',
          'qdr-toolbar__icon--with-name',
          { 'qdr-toolbar__icon--with-name--active': active },
          className,
        )}
        onClick={onClick}
        onMouseDown={onMouseDown}
      >
        <Icon
          {...rest}
          width={20}
          height={20}
        />
        <p className="qdr-toolbar__icon__name">{name}</p>
        {active && (
          <Icon
            className="qdr-toolbar__icon__check"
            icon={Check}
            width={20}
            height={20}
          />
        )}
      </div>
    );
  }

  return (
    <div ref={menuRef} className="qdr-toolbar__icon__wrapper">
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
