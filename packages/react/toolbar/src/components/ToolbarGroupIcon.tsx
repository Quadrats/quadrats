import React, { useState, useCallback, useRef } from 'react';
import clsx from 'clsx';
import { ArrowDown } from '@quadrats/icons';
import { Icon, IconProps } from '@quadrats/react/components';
import { useClickAway } from '@quadrats/react/utils';
import { ToolbarMenuContext } from '@quadrats/react/toolbar';

export interface ToolbarGroupIconProps extends Omit<IconProps, 'ref' | 'onClick' | 'onMouseDown'> {
  withArrow?: boolean;
}

function ToolbarGroupIcon(props: ToolbarGroupIconProps) {
  const {
    className,
    children,
    withArrow = true,
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

  const onClick = useCallback(() => {
    setMenuExpanded(expanded => !expanded);
  }, []);

  return (
    <ToolbarMenuContext.Provider
      value={{
        isInGroup: true,
        menuExpanded,
      }}
    >
      <div ref={menuRef} className="qdr-toolbar__icon__wrapper">
        <div
          className={clsx('qdr-toolbar__icon', { 'qdr-toolbar__icon--active': menuExpanded }, className)}
          onClick={onClick}
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
        <div className={clsx('qdr-toolbar__icon__menu', { 'qdr-toolbar__icon__menu--expanded': menuExpanded })}>
          {children}
        </div>
      </div>
    </ToolbarMenuContext.Provider>
  );
}

export default ToolbarGroupIcon;
