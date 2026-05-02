import React from 'react';

const variantStyles = {
  default: 'ring-badge--default',
  primary: 'ring-badge--primary',
  success: 'ring-badge--success',
  warning: 'ring-badge--warning',
  danger: 'ring-badge--danger',
  info: 'ring-badge--info',
};

export function Badge({ variant = 'default', children, className = '' }) {
  return (
    <span className={`ring-badge ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
