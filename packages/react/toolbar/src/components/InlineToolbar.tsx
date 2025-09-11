import React, { Fragment } from 'react';
import clsx from 'clsx';
import { Icon } from '@quadrats/react/components';
import { IconDefinition } from '@quadrats/icons';

export interface InlineToolbarProps {
  className?: string;
  iconGroups: {
    enabledBgColor?: boolean;
    icons: {
      icon: IconDefinition;
      onClick: VoidFunction;
      active?: boolean;
      disabled?: boolean;
      className?: string;
    }[];
  }[];
}

function InlineToolbar({ className, iconGroups }: InlineToolbarProps) {
  const validIconsGroup = iconGroups.filter((group) => group.icons.length);

  return (
    <div contentEditable={false} className={clsx('qdr-inline-toolbar', className)}>
      {validIconsGroup.map((group, index) => (
        <Fragment key={index}>
          <div
            className={clsx('qdr-inline-toolbar__wrapper', {
              'qdr-inline-toolbar__wrapper--enabledBgColor': group.enabledBgColor,
            })}
          >
            {group.icons.map((icon) => (
              <Icon
                key={icon.icon.name}
                className={clsx('qdr-inline-toolbar__icon', icon.className, {
                  'qdr-inline-toolbar__icon--active': icon.active,
                  'qdr-inline-toolbar__icon--disabled': icon.disabled,
                })}
                icon={icon.icon}
                width={24}
                height={24}
                onClick={(e) => {
                  if (!icon.disabled) {
                    e.preventDefault();
                    icon.onClick();
                  }
                }}
              />
            ))}
          </div>
          {index < validIconsGroup.length - 1 && <div className="qdr-inline-toolbar__divider" />}
        </Fragment>
      ))}
    </div>
  );
}

export default InlineToolbar;
