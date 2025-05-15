import React, { forwardRef } from 'react';
import clsx from 'clsx';

export interface ProgressProps {
  className?: string;
  percentage?: number;
}

const Progress = forwardRef<HTMLSpanElement, ProgressProps>(function Progress(props, ref) {
  const { className, percentage = 0 } = props;

  const size = 16;
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  return (
    <span ref={ref} className={clsx('qdr-progress', className)}>
      <svg width={size} height={size}>
        <circle
          className="qdr-progress__backdrop"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          className="qdr-progress__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
    </span>
  );
});

export default Progress;
