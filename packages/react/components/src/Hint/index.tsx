import React from 'react';
import clsx from 'clsx';

export interface HintProps {
  children: string;
}

const Hint = ({
  children,
}: HintProps) => {
  return (
    <div
      className={clsx(
        'qdr-hint',
      )}
    >
      {children}
    </div>
  );
};

export default Hint;