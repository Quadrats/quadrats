import React, { ReactNode, MouseEventHandler } from 'react';
import clsx from 'clsx';

export interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: 'submit' | 'reset' | 'button';
  variant?: 'primary' | 'secondary' | 'outlined' | 'dashed' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  prefix?: ReactNode;
  disabled?: boolean;
  children: ReactNode;
}

const Button = ({
  onClick,
  className,
  type = 'button',
  variant = 'primary',
  size = 'small',
  prefix,
  disabled,
  children,
}: ButtonProps) => {
  return (
    <button
      className={clsx('qdr-button', `qdr-button--${variant}`, `qdr-button--${size}`, className)}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {prefix}
      {children}
    </button>
  );
};

export default Button;
