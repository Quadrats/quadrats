import React, { useCallback } from 'react';
import clsx from 'clsx';
import { Check } from '@quadrats/icons';
import { Icon, IconProps } from '@quadrats/react/components';
import { useLocale } from '@quadrats/react';
import { getIconNameInGroup } from './toolbarIconName';
import { useToolbarMenu } from '../contexts/toolbarMenu';

export interface ToolbarIconProps extends Omit<IconProps, 'ref' | 'onClick' | 'onMouseDown'> {
  active?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

function ToolbarIcon(props: ToolbarIconProps) {
  const {
    active,
    className,
    icon,
    onClick: onClickProps,
    onMouseDown: onMouseDownProps,
    ...rest
  } = props;

  const locale = useLocale();
  const { isInGroup } = useToolbarMenu();

  const onClick = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    onClickProps?.(event);
  }, [onClickProps]);

  const onMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    onMouseDownProps?.(event);
  }, [onMouseDownProps]);

  if (isInGroup) {
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
          icon={icon}
          width={20}
          height={20}
        />
        <p className="qdr-toolbar__icon__name">{getIconNameInGroup(icon.name, locale)}</p>
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
    <div className="qdr-toolbar__icon__wrapper">
      <div
        className={clsx('qdr-toolbar__icon', { 'qdr-toolbar__icon--active': active }, className)}
        onClick={onClick}
        onMouseDown={onMouseDown}
      >
        <Icon
          {...rest}
          icon={icon}
        />
      </div>
    </div>
  );
}

export default ToolbarIcon;
