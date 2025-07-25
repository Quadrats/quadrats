import React, { useMemo } from 'react';
import clsx from 'clsx';
import BaseField from '../BaseField';

export interface TextareaProps {
  label?: string;
  className?: string;
  width?: number;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
  isError?: boolean;
  hint?: string;
  maxLength?: number;
  required?: boolean;
}

const Textarea = ({
  label,
  className,
  width,
  value = '',
  onChange,
  placeholder,
  height,
  disabled,
  isError,
  hint,
  maxLength,
  required = false,
}: TextareaProps) => {
  const isLimited = useMemo(() => maxLength && value && value.length >= maxLength, [maxLength, value]);

  return (
    <BaseField className={className} label={label} required={required} width={width}>
      <div className="qdr-textarea">
        <textarea
          style={{ height }}
          className={clsx('qdr-textarea__textarea', {
            'qdr-textarea__textarea--error': isError,
          })}
          value={value}
          onChange={(e) => {
            onChange?.(e.target.value);
          }}
          maxLength={maxLength}
          placeholder={placeholder}
          disabled={disabled}
        />
        {hint && (
          <div className="qdr-textarea__hint-wrapper">
            <span className="qdr-textarea__hint">{hint}</span>
          </div>
        )}
        {maxLength && (
          <span
            className={clsx('qdr-textarea__counter', {
              'qdr-textarea__counter--have-hint': hint,
              'qdr-textarea__counter--limited': isLimited,
              'qdr-textarea__counter--error': isError,
              'qdr-textarea__counter--disabled': disabled,
            })}
          >
            {`${value ? value.length : 0}/${maxLength}`}
          </span>
        )}
      </div>
    </BaseField>
  );
};

export default Textarea;
