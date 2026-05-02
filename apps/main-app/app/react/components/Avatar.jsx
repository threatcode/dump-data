import React, { useState } from 'react';

const sizeMap = {
  small: '32px',
  medium: '48px',
  large: '64px',
  xlarge: '96px',
};

export function Avatar({ src, alt = '', size = 'medium', fallback = '?' }) {
  const [error, setError] = useState(false);
  const avatarSize = sizeMap[size] || sizeMap.medium;

  const initials = alt
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="ring-avatar"
      style={{ width: avatarSize, height: avatarSize }}
    >
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          className="ring-avatar__image"
          onError={() => setError(true)}
        />
      ) : (
        <div className="ring-avatar__fallback">{initials || fallback}</div>
      )}
    </div>
  );
}
