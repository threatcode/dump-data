import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks';

export function Feed({ userId }) {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to feed updates via WebSocket
  useWebSocket(1001, (message) => {
    if (message.actn === 1001) {
      setFeeds(prev => [message.data, ...prev]);
      setLoading(false);
    }
  });

  // Load initial feed
  useEffect(() => {
    // This would call the AngularJS feedFactory via bridge
    // For now, show placeholder
    setLoading(false);
  }, [userId]);

  if (loading) {
    return <div className="feed-loading">Loading feed...</div>;
  }

  return (
    <div className="feed-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Feed (React Component)</h2>
      <p>This is a React Feed component that will eventually replace the AngularJS feed.</p>

      <div className="feed-post-box" style={{ margin: '20px 0', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <textarea
          placeholder="What's on your mind?"
          style={{ width: '100%', minHeight: '80px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#f47727',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Post
        </button>
      </div>

      {feeds.length === 0 ? (
        <div className="no-feeds" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>No feeds yet. Start posting!</p>
        </div>
      ) : (
        <div className="feed-list">
          {feeds.map((feed, index) => (
            <div key={index} className="feed-item" style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
              <p>{feed.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
