import React, { forwardRef } from 'react';
import clsx from 'clsx';

export interface ProgressProps {
  className?: string;
  percentage?: number;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(props, ref) {
  const { className, percentage = 0 } = props;

  const size = 16;
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  return (
    <div ref={ref} className={clsx('qdr-progress', className)}>
      <div className="qdr-progress__wrapper">
        <div className="qdr-progress__spinner-wrapper">
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
        </div>
        <p className="qdr-progress__percentage">{`${percentage}%`}</p>
      </div>
    </div>
  );
});

export default Progress;
