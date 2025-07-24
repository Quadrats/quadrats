import React from 'react';
import clsx from 'clsx';

export interface ToggleProps {
  onChange: (status: boolean) => void;
  checked: boolean;
  disabled?: boolean;
}

const Toggle = ({ onChange, checked, disabled }: ToggleProps) => {
  return (
    <div
      className={clsx('qdr-toggle', {
        'qdr-toggle--checked': checked,
        'qdr-toggle--disabled': disabled,
      })}
    >
      <div className="qdr-toggle__control" />
      <input
        aria-checked={checked}
        aria-disabled={disabled}
        checked={checked}
        className="qdr-toggle__input"
        disabled={disabled}
        onChange={(e) => {
          onChange(e.target.checked);
        }}
        type="checkbox"
      />
    </div>
  );
};

export default Toggle;
