import React from 'react';

export function Header({ user, notifications, onLogout }) {
  const notificationCount = notifications?.length || 0;

  return (
    <header className="ring-header">
      <div className="ring-header__container">
        <div className="ring-header__logo">
          <a href="/">ringID</a>
        </div>

        <nav className="ring-header__nav">
          <a href="/" className="ring-header__nav-link">Home</a>
          <a href="/feed" className="ring-header__nav-link">Feed</a>
          <a href="/chat" className="ring-header__nav-link">Chat</a>
          <a href="/newsportal" className="ring-header__nav-link">News</a>
          <a href="/about" className="ring-header__nav-link">About (React)</a>
          <a href="/settings" className="ring-header__nav-link">Settings (React)</a>
        </nav>

        <div className="ring-header__actions">
          {user ? (
            <>
              <div className="ring-header__notifications">
                <button className="ring-header__notification-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  {notificationCount > 0 && (
                    <span className="ring-header__notification-badge">{notificationCount}</span>
                  )}
                </button>
              </div>

              <div className="ring-header__user-menu">
                <img
                  src={user.avatar || '/images/default-avatar.png'}
                  alt={user.name}
                  className="ring-header__avatar"
                />
                <span className="ring-header__username">{user.name}</span>
                <button onClick={onLogout} className="ring-header__logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="ring-header__auth-links">
              <a href="/social/login" className="ring-header__auth-link">Login</a>
              <a href="/social/signup" className="ring-header__auth-link">Sign Up</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
