import React from 'react';
import clsx from 'clsx';

export interface InputProps {
  placeholder?: string;
  disabled?: boolean;
  isError?: boolean;
  maxLength?: number;
}

const Input = ({
  placeholder,
  disabled,
  isError,
}: InputProps) => {
  return (
    <div
      className={clsx(
        'qdr-input',
      )}
    >
      <input
        className={clsx(
          'qdr-input__input',
          {
            'qdr-input__input--error': isError,
          },
        )}
        type="text"
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default Input;