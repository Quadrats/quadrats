import React, { forwardRef } from 'react';
import clsx from 'clsx';
import './progress.scss';

export interface ProgressProps {
  className?: string;
  percentage?: number;
}

const Progress = forwardRef<HTMLSpanElement, ProgressProps>(function Progress(props, ref) {
  const { className, percentage = 0 } = props;
  const transform = `scaleX(${percentage / 100})`;
  const style = {
    transform,
    msTransform: transform,
  };

  return (
    <span ref={ref} className={clsx('qdr-progress', className)}>
      <span className="qdr-progress__backdrop" />
      <span className="qdr-progress__track" style={style} />
    </span>
  );
});

export default Progress;
