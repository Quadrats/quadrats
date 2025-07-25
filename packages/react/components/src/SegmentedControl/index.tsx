import React from 'react';
import clsx from 'clsx';

export interface SegmentedControlProps {
  options: { value: string; label: string; disabled?: boolean }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const SegmentedControl = ({ options, value, onChange, disabled }: SegmentedControlProps) => {
  return (
    <div
      className={clsx('qdr-segmented-control', {
        'qdr-segmented-control--disabled': disabled || options.filter((o) => o.disabled).length === options.length,
      })}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          disabled={disabled || option.disabled}
          className={clsx('qdr-segmented-control__button', {
            'qdr-segmented-control__button--active': value === option.value,
          })}
          onClick={() => {
            onChange(option.value);
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
