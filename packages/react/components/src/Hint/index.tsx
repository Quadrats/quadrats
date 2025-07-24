import React, { CSSProperties, useMemo } from 'react';
import clsx from 'clsx';
import { Info, Success, Warning, Error } from '@quadrats/icons';
import Icon from '../Icon';

export interface HintProps {
  children: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
}

const Hint = ({ children, variant = 'info' }: HintProps) => {
  const icon = useMemo(() => {
    switch (variant) {
      case 'info':
        return Info;

      case 'success':
        return Success;

      case 'warning':
        return Warning;

      case 'error':
        return Error;

      default:
        return Info;
    }
  }, [variant]);

  return (
    <div className="qdr-hint">
      <div className={clsx('qdr-hint__icon', `qdr-hint__icon--${variant}`)}>
        <Icon icon={icon} width={16} height={16} />
      </div>
      <div className={clsx('qdr-hint__children', `qdr-hint__children--${variant}`)}>{children}</div>
    </div>
  );
};

export interface HintsProps {
  hints: {
    text: string;
    variant?: 'info' | 'success' | 'warning' | 'error';
  }[];
  style?: CSSProperties;
}

export const Hints = ({ hints, style }: HintsProps) => {
  return (
    <div className="qdr-hints" style={style}>
      {hints.map((hint, index) => (
        <Hint key={index} variant={hint.variant}>
          {hint.text}
        </Hint>
      ))}
    </div>
  );
};

export default Hint;
