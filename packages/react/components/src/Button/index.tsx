import React, { ReactNode, MouseEventHandler } from 'react';
import clsx from 'clsx';

export interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'submit' | 'reset' | 'button';
  variant?: 'primary' | 'secondary' | 'outlined' | 'dashed' | 'tertiary';
  disabled?: boolean;
  children: ReactNode;
}

const Button = ({
  onClick,
  type = 'button',
  variant = 'primary',
  disabled,
  children,
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        'qdr-button',
        `qdr-button--${variant}`,
      )}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;