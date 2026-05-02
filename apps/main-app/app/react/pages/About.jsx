import React from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export function About() {
  return (
    <div className="about-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>About RingID</h1>
      <p>This page is rendered with React!</p>

      <Card title="Migration Status" subtitle="AngularJS to React">
        <p>We are incrementally migrating from AngularJS to React.</p>
        <ul>
          <li>✅ React infrastructure set up</li>
          <li>✅ React components created</li>
          <li>✅ react2angular bridge configured</li>
          <li>🔄 Integrating React components</li>
        </ul>
      </Card>

      <div style={{ marginTop: '20px' }}>
        <Button variant="primary" onClick={() => window.location.href = '/'}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}
