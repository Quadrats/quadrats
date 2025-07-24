import React from 'react';
import clsx from 'clsx';
import { Icon } from '@quadrats/react/components';
import { IconDefinition } from '@quadrats/icons';

export interface InlineToolbarProps {
  className?: string;
  leftIcons: {
    icon: IconDefinition;
    onClick: VoidFunction;
    active: boolean;
    disabled?: boolean;
  }[];
  rightIcons: {
    icon: IconDefinition;
    onClick: VoidFunction;
    disabled?: boolean;
  }[];
}

function InlineToolbar({ className, leftIcons, rightIcons }: InlineToolbarProps) {
  return (
    <div contentEditable={false} className={clsx('qdr-inline-toolbar', className)}>
      {leftIcons.length > 0 && (
        <div className="qdr-inline-toolbar__wrapper">
          {leftIcons.map((icon) => (
            <Icon
              key={icon.icon.name}
              className={clsx('qdr-inline-toolbar__icon', {
                'qdr-inline-toolbar__icon--active': icon.active,
                'qdr-inline-toolbar__icon--disabled': icon.disabled,
              })}
              icon={icon.icon}
              width={24}
              height={24}
              onClick={() => {
                if (!icon.disabled) {
                  icon.onClick();
                }
              }}
            />
          ))}
        </div>
      )}
      {leftIcons.length > 0 && rightIcons.length > 0 && <div className="qdr-inline-toolbar__divider" />}
      {rightIcons.map((icon) => (
        <Icon
          key={icon.icon.name}
          className={clsx('qdr-inline-toolbar__icon', {
            'qdr-inline-toolbar__icon--disabled': icon.disabled,
          })}
          icon={icon.icon}
          width={24}
          height={24}
          onClick={() => {
            if (!icon.disabled) {
              icon.onClick();
            }
          }}
        />
      ))}
    </div>
  );
}

export default InlineToolbar;
