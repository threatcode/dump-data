import React from 'react';

export function Card({ title, subtitle, children, className = '' }) {
  return (
    <div className={`ring-card ${className}`}>
      {(title || subtitle) && (
        <div className="ring-card__header">
          {title && <h3 className="ring-card__title">{title}</h3>}
          {subtitle && <p className="ring-card__subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="ring-card__content">{children}</div>
    </div>
  );
}
