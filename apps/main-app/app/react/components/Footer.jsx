import React from 'react';

export function Footer() {
  return (
    <footer className="ring-footer">
      <div className="ring-footer__container">
        <div className="ring-footer__section">
          <h3 className="ring-footer__title">ringID</h3>
          <p className="ring-footer__description">
            Free Video Calls, Secret Chats, Feeds, Stickers & more
          </p>
        </div>

        <div className="ring-footer__section">
          <h4 className="ring-footer__subtitle">Product</h4>
          <ul className="ring-footer__links">
            <li><a href="/features">Features</a></li>
            <li><a href="/download">Download</a></li>
            <li><a href="/pricing">Pricing</a></li>
          </ul>
        </div>

        <div className="ring-footer__section">
          <h4 className="ring-footer__subtitle">Support</h4>
          <ul className="ring-footer__links">
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/help">Help Center</a></li>
          </ul>
        </div>

        <div className="ring-footer__section">
          <h4 className="ring-footer__subtitle">Legal</h4>
          <ul className="ring-footer__links">
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="ring-footer__bottom">
        <p>&copy; {new Date().getFullYear()} ringID. All rights reserved.</p>
      </div>
    </footer>
  );
}
