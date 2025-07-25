import React, { useMemo } from 'react';
import clsx from 'clsx';

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
    <div className={clsx('qdr-textarea', className)} style={{ width }}>
      {label && (
        <p className="qdr-textarea__label">
          {label}
          {required && <span className="qdr-textarea__required-mark">*</span>}
        </p>
      )}
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
      {(hint || maxLength) && (
        <div className="qdr-textarea__hint-wrapper">
          <span className="qdr-textarea__hint">{hint}</span>
          {maxLength && (
            <span
              className={clsx('qdr-textarea__counter', {
                'qdr-textarea__counter--limited': isLimited,
                'qdr-textarea__counter--error': isError,
                'qdr-textarea__counter--disabled': disabled,
              })}
            >
              {`${value ? value.length : 0}/${maxLength}`}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Textarea;
