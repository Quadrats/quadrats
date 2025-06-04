import React from 'react';
import clsx from 'clsx';

export interface InputProps {
  placeholder?: string;
}

const Input = () => {
  return (
    <div
      className={clsx(
        'qdr-input',
      )}
    >
      input
    </div>
  );
};

export default Input;