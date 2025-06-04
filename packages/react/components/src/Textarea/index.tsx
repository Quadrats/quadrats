import React from 'react';
import clsx from 'clsx';

export interface TextareaProps {
  placeholder?: string;
}

const Textarea = () => {
  return (
    <div
      className={clsx(
        'qdr-textarea',
      )}
    >
      textarea
    </div>
  );
};

export default Textarea;