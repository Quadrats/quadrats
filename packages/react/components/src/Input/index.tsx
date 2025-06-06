import React, { useMemo } from 'react';
import clsx from 'clsx';

export interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isError?: boolean;
  hint?: string;
  maxLength?: number;
}

const Input = ({
  value = '',
  onChange,
  placeholder,
  disabled,
  isError,
  hint,
  maxLength,
}: InputProps) => {
  const isLimited = useMemo(
    () => (maxLength && value && value.length >= maxLength), [maxLength, value],
  );

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
        value={value}
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
        type="text"
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
      />
      {(hint || maxLength) && (
        <div className="qdr-input__hint-wrapper">
          <span className="qdr-input__hint">
            {hint}
          </span>
          {maxLength && (
            <span
              className={clsx(
                'qdr-input__counter',
                {
                  'qdr-input__counter--limited': isLimited,
                  'qdr-input__counter--error': isError,
                  'qdr-input__counter--disabled': disabled,
                },
              )}
            >
              {`${value ? value.length : 0}/${maxLength}`}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Input;