import React, { useMemo } from 'react';
import clsx from 'clsx';
import BaseField, { BaseFieldProps } from '../BaseField';

export interface InputProps extends Omit<BaseFieldProps, 'children'> {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isError?: boolean;
  hint?: string;
  maxLength?: number;
}

const Input = ({
  label,
  className,
  width,
  value = '',
  onChange,
  placeholder,
  disabled,
  isError,
  hint,
  maxLength,
  errorMessage,
  required = false,
}: InputProps) => {
  const isLimited = useMemo(() => maxLength && value && value.length >= maxLength, [maxLength, value]);

  return (
    <BaseField className={className} label={label} required={required} width={width} errorMessage={errorMessage}>
      <div className="qdr-input">
        <input
          className={clsx('qdr-input__input', {
            'qdr-input__input--error': isError,
          })}
          value={value}
          onChange={(e) => {
            onChange?.(e.target.value);
          }}
          type="text"
          maxLength={maxLength}
          placeholder={placeholder}
          disabled={disabled}
        />
        {hint && (
          <div className="qdr-input__hint-wrapper">
            <span className="qdr-input__hint">{hint}</span>
          </div>
        )}
        {maxLength && (
          <span
            className={clsx('qdr-input__counter', {
              'qdr-input__counter--have-hint': hint,
              'qdr-input__counter--limited': isLimited,
              'qdr-input__counter--error': isError,
              'qdr-input__counter--disabled': disabled,
            })}
          >
            {`${value ? value.length : 0}/${maxLength}`}
          </span>
        )}
      </div>
    </BaseField>
  );
};

export default Input;
