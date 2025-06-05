import React from 'react';
import clsx from 'clsx';

export interface TextareaProps {
  placeholder?: string;
  height?: number;
  disabled?: boolean;
  isError?: boolean;
  maxLength?: number;
}

const Textarea = ({
  placeholder,
  height,
  disabled,
  isError,
}: TextareaProps) => {
  return (
    <div
      className={clsx(
        'qdr-textarea',
      )}
    >
      <textarea
        style={{ height }}
        className={clsx(
          'qdr-textarea__textarea',
          {
            'qdr-textarea__textarea--error': isError,
          },
        )}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default Textarea;