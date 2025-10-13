import React, { Fragment, useRef } from 'react';
import clsx from 'clsx';
import { Icon } from '@quadrats/react/components';
import { IconDefinition } from '@quadrats/icons';
import { useClickAway } from '@quadrats/react/utils';

export interface InlineToolbarProps {
  className?: string;
  iconGroups: {
    enabledBgColor?: boolean;
    icons: (
      | {
          icon: IconDefinition;
          onClick: VoidFunction;
          active?: boolean;
          disabled?: boolean;
          className?: string;
        }
      | React.JSX.Element
    )[];
  }[];
  style?: React.CSSProperties;
  onClickAway?: VoidFunction;
}

function InlineToolbar({ className, iconGroups, style, onClickAway }: InlineToolbarProps) {
  const validIconsGroup = iconGroups.filter((group) => group.icons.length);
  const ref = useRef<HTMLDivElement>(null);

  useClickAway(
    () => {
      return onClickAway
        ? () => {
            onClickAway();
          }
        : undefined;
    },
    ref,
    [],
  );

  return (
    <div ref={ref} contentEditable={false} className={clsx('qdr-inline-toolbar', className)} style={style}>
      {validIconsGroup.map((group, index) => (
        <Fragment key={index}>
          <div
            className={clsx('qdr-inline-toolbar__wrapper', {
              'qdr-inline-toolbar__wrapper--enabledBgColor': group.enabledBgColor,
            })}
          >
            {group.icons.map((child) =>
              'icon' in child ? (
                <Icon
                  key={child.icon.name}
                  className={clsx('qdr-inline-toolbar__icon', child.className, {
                    'qdr-inline-toolbar__icon--active': child.active,
                    'qdr-inline-toolbar__icon--disabled': child.disabled,
                  })}
                  icon={child.icon}
                  width={24}
                  height={24}
                  onClick={(e) => {
                    if (!child.disabled) {
                      e.preventDefault();
                      child.onClick();
                    }
                  }}
                />
              ) : (
                child
              ),
            )}
          </div>
          {index < validIconsGroup.length - 1 && <div className="qdr-inline-toolbar__divider" />}
        </Fragment>
      ))}
    </div>
  );
}

export default InlineToolbar;
