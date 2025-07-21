import React, { FC, Key, useEffect, useState } from 'react';
import clsx from 'clsx';
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
  /**
   * If given, the message will be closed after the amount of time.
   * You can use `Message.config` to overwrite.
   * @default 3000
   */
  duration?: NotifierData['duration'];
  /**
   * message icon prefix
   */
  icon?: IconDefinition;
  /**
   * The key of message.
   */
  reference?: Key;
  /**
   * The severity of the message.
   */
  severity?: MessageSeverity;
  themeClassName: string;
}

export type MessageType = FC<MessageData> &
  Notifier<MessageData, MessageConfigProps> &
  Record<
    string,
    (
      message: MessageData['children'],
      themeClassName: string,
      props?: Omit<MessageData, 'children' | 'severity' | 'icon'>,
    ) => Key
  >;

/**
 * The react component for `mezzanine` message.
 *
 * Use the API from the Message instance such as `Message.add` and `Message.success`
 * to display a notification message globally.
 */
const Message: MessageType = ((props) => {
  const {
    children,
    themeClassName,
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
          themeClassName,
        )}
      >
        {icon ? <Icon className="qdr-message__icon" icon={icon} /> : null}
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
  Message[severity.key] = (message, themeClassName, props) =>
    Message.add({
      ...props,
      children: message,
      themeClassName,
      severity: validSeverities.includes(severity.key as MessageSeverity)
        ? (severity.key as MessageSeverity)
        : undefined,
      icon: severity.icon,
    });
});

export default Message;
