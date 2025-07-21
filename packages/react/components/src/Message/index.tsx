import React, { FC, Key, useEffect, useState } from 'react';
import clsx from 'clsx';
import { ThemeProps } from '@quadrats/react/configs';
import Icon from '../Icon';
import { createNotifier } from '../Notifier/createNotifier';
import { Notifier, NotifierData, NotifierConfig } from '../Notifier/typings';
import SlideFade, { SlideFadeProps } from '../Transition/SlideFade';
import { Info, Success, Warning, Error, IconDefinition } from '@quadrats/icons';

export interface MessageConfigProps
  extends Pick<NotifierConfig, 'duration'>,
    Pick<
      SlideFadeProps,
      'onEnter' | 'onEntering' | 'onEntered' | 'onExit' | 'onExiting' | 'onExited' | 'easing' | 'direction'
    > {}

export type MessageSeverity = 'success' | 'warning' | 'error' | 'info';

export interface MessageData extends Omit<NotifierData, 'onClose'>, MessageConfigProps {
  duration?: NotifierData['duration'];
  icon?: IconDefinition;
  reference?: Key;
  severity?: MessageSeverity;
  theme: ThemeProps;
}

export type MessageType = FC<MessageData> &
  Notifier<MessageData, MessageConfigProps> &
  Record<
    string,
    (
      message: MessageData['children'],
      theme: ThemeProps,
      props?: Omit<MessageData, 'children' | 'theme' | 'severity' | 'icon'>,
    ) => Key
  >;

const Message: MessageType = ((props) => {
  const {
    children,
    theme,
    duration,
    icon,
    reference,
    severity,
    onExited: onExitedProp,
    ...restTransitionProps
  } = props;

  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (open && duration) {
      const timer = window.setTimeout(() => {
        setOpen(false);
      }, duration);

      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [open, duration]);

  const onExited: SlideFadeProps['onExited'] = (node) => {
    if (onExitedProp) {
      onExitedProp(node);
    }

    if (reference) Message.remove(reference);
  };

  return (
    <SlideFade in={open} appear onExited={onExited} {...restTransitionProps}>
      <div
        className={clsx(
          'qdr-message',
          {
            [`qdr-message--${severity}`]: !!severity,
          },
          theme.className,
        )}
        style={theme.style}
      >
        {icon ? <Icon className="qdr-message__icon" icon={icon} width={24} height={24} /> : null}
        <span className="qdr-message__content">{children}</span>
      </div>
    </SlideFade>
  );
}) as MessageType;

const { add, config, destroy, remove } = createNotifier<MessageData, MessageConfigProps>({
  duration: 3000,
  render: (message) => <Message {...message} key={undefined} />,
  setRoot: (root) => {
    root?.setAttribute('class', 'qdr-message__root');
  },
});

Message.add = add;
Message.config = config;
Message.destroy = destroy;
Message.remove = remove;

const severities = [
  {
    key: 'success',
    icon: Success,
  },
  {
    key: 'warning',
    icon: Warning,
  },
  {
    key: 'error',
    icon: Error,
  },
  {
    key: 'info',
    icon: Info,
  },
];

const validSeverities: MessageSeverity[] = ['success', 'warning', 'error', 'info'];

severities.forEach((severity) => {
  Message[severity.key] = (message, theme, props) =>
    Message.add({
      ...props,
      children: message,
      theme,
      severity: validSeverities.includes(severity.key as MessageSeverity)
        ? (severity.key as MessageSeverity)
        : undefined,
      icon: severity.icon,
    });
});

export default Message;
