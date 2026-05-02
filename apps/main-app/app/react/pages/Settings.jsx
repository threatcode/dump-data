import React from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function Settings() {
  const [settings, setSettings] = React.useState({
    notifications: true,
    privacy: 'public',
    theme: 'light'
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="settings-page" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Settings</h1>
      <p>This page is built with React components!</p>

      <div style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleChange('notifications', e.target.checked)}
            />{' '}
            Enable Notifications
          </label>
        </div>

        <Input
          label="Theme"
          type="text"
          value={settings.theme}
          onChange={(e) => handleChange('theme', e.target.value)}
          placeholder="Enter theme"
        />

        <div style={{ marginTop: '20px' }}>
          <Button variant="primary" onClick={() => alert('Settings saved!')}>
            Save Settings
          </Button>
          <Button
            variant="secondary"
            onClick={() => window.location.href = '/'}
            style={{ marginLeft: '10px' }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
