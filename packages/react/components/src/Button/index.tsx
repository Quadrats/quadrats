import React, { ReactNode, MouseEventHandler } from 'react';
import clsx from 'clsx';

export interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'submit' | 'reset' | 'button';
  variant?: 'primary' | 'secondary' | 'outlined' | 'dashed' | 'tertiary';
  children: ReactNode;
}

const Button = ({
  onClick,
  type = 'button',
  variant = 'primary',
  children,
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        'qdr-button',
        `qdr-button--${variant}`,
      )}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;