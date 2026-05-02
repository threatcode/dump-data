import React from 'react';

export function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  error,
  id,
  className = '',
}) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`ring-input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="ring-input-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value, e)}
        placeholder={placeholder}
        className={`ring-input ${error ? 'ring-input--error' : ''}`}
      />
      {error && <span className="ring-input-error">{error}</span>}
    </div>
  );
}
