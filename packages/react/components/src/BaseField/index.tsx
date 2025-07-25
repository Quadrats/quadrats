import React, { ReactNode } from 'react';
import clsx from 'clsx';

export interface BaseFieldProps {
  label?: string;
  className?: string;
  width?: number;
  children: ReactNode;
  required?: boolean;
}

const BaseField = ({ label, className, width, children, required = false }: BaseFieldProps) => {
  return (
    <div className={clsx('qdr-base-field', className)} style={{ width }}>
      {label && (
        <p className="qdr-base-field__label">
          {label}
          {required && <span className="qdr-base-field__required-mark">*</span>}
        </p>
      )}
      {children}
    </div>
  );
};

export default BaseField;
