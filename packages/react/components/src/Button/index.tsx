import React, { ReactNode, MouseEventHandler } from 'react';
import clsx from 'clsx';

export interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: 'submit' | 'reset' | 'button';
  variant?: 'primary' | 'secondary' | 'outlined' | 'dashed' | 'tertiary';
  disabled?: boolean;
  children: ReactNode;
}

const Button = ({ onClick, className, type = 'button', variant = 'primary', disabled, children }: ButtonProps) => {
  return (
    <button
      className={clsx('qdr-button', `qdr-button--${variant}`, className)}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
