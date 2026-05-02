import React from 'react';

const sizeMap = {
  small: '24px',
  medium: '40px',
  large: '60px',
};

export function LoadingSpinner({ size = 'medium', message = 'Loading...' }) {
  const spinnerSize = sizeMap[size] || sizeMap.medium;

  return (
    <div className="ring-loading-spinner">
      <div
        className="ring-loading-spinner__spinner"
        style={{
          width: spinnerSize,
          height: spinnerSize,
        }}
      />
      {message && <p className="ring-loading-spinner__message">{message}</p>}
    </div>
  );
}
