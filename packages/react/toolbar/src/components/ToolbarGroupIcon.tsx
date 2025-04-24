import React, { useState, useCallback, useRef, useLayoutEffect } from 'react';
import clsx from 'clsx';
import { ArrowDown } from '@quadrats/icons';
import { Icon, IconProps } from '@quadrats/react/components';
import { useClickAway } from '@quadrats/react/utils';
import { useToolbar } from '../contexts/toolbar';
import { ToolbarMenuContext } from '../contexts/toolbarMenu';

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

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { toolbarRef } = useToolbar();
  const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom');
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
    wrapperRef,
    [menuExpanded, wrapperRef],
  );

  useLayoutEffect(() => {
    function handler() {
      const icon = iconRef.current;
      const menu = menuRef.current;
      const toolbar = toolbarRef?.current;

      if (icon && menu) {
        const rect = icon.getBoundingClientRect();
        const toolbarRect = toolbar?.getBoundingClientRect();
        const menuWidth = menu.clientWidth;
        const menuHeight = menu.clientHeight;

        if (rect.left + menuWidth > window.innerWidth) {
          if (rect.left + (menuWidth + rect.width) / 2 > window.innerWidth) {
            menu.style.right = '0';
            menu.style.left = 'unset';
          } else {
            menu.style.right = 'unset';
            menu.style.left = `-${(menuWidth - rect.width) / 2}px`;
          }
        } else {
          menu.style.right = 'unset';
          menu.style.left = '0';
        }

        if (toolbarRect && toolbarRect.top + toolbarRect.height + menuHeight > window.innerHeight) {
          setPlacement('top');
        } else {
          setPlacement('bottom');
        }
      }
    }

    handler();

    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler);

    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler);
    };
  }, [toolbarRef]);

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
      <div ref={wrapperRef} className="qdr-toolbar__icon__wrapper">
        <div
          ref={iconRef}
          className={clsx('qdr-toolbar__icon', { 'qdr-toolbar__icon--expanded': menuExpanded }, className)}
          onClick={onClick}
        >
          <Icon
            {...rest}
          />
          {withArrow && (
            <Icon
              icon={ArrowDown}
              className="qdr-toolbar__icon__arrow"
              width={12}
              height={12}
            />
          )}
        </div>
        <div
          ref={menuRef}
          className={clsx(
            'qdr-toolbar__icon__menu',
            { 'qdr-toolbar__icon__menu--expanded': menuExpanded },
            { 'qdr-toolbar__icon__menu--top': placement === 'top' },
            { 'qdr-toolbar__icon__menu--bottom': placement === 'bottom' },
          )}
        >
          {children}
        </div>
      </div>
    </ToolbarMenuContext.Provider>
  );
}

export default ToolbarGroupIcon;
