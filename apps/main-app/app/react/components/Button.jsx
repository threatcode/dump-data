import React from 'react';

const variantStyles = {
  primary: 'ring-btn--primary',
  secondary: 'ring-btn--secondary',
  outline: 'ring-btn--outline',
  ghost: 'ring-btn--ghost',
  danger: 'ring-btn--danger',
};

const sizeStyles = {
  small: 'ring-btn--sm',
  medium: 'ring-btn--md',
  large: 'ring-btn--lg',
};

export function Button({
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  children,
  type = 'button',
  className = '',
}) {
  return (
    <button
      type={type}
      className={`ring-btn ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
