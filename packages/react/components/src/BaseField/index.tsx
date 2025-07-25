import React, { ReactNode } from 'react';
import { Error } from '@quadrats/icons';
import clsx from 'clsx';
import Icon from '../Icon';

export interface BaseFieldProps {
  label?: string;
  className?: string;
  width?: number;
  children: ReactNode;
  required?: boolean;
  errorMessage?: string;
}

const BaseField = ({ label, className, width, children, required = false, errorMessage }: BaseFieldProps) => {
  return (
    <div className={clsx('qdr-base-field', className)} style={{ width }}>
      {label && (
        <p className="qdr-base-field__label">
          {label}
          {required && <span className="qdr-base-field__required-mark">*</span>}
        </p>
      )}
      {children}
      {errorMessage && (
        <div className="qdr-base-field__error-message">
          <Icon icon={Error} width={16} height={16} />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default BaseField;
