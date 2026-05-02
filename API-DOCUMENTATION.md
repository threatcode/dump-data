# RingID API Documentation

## Overview

This document maps the HTTP endpoints and WebSocket actions used by the RingID web frontend. The application uses a hybrid approach with RESTful HTTP APIs for CRUD operations and WebSocket (binary protocol) for real-time updates.

## Base Configuration

- **Base URL**: Configured via `VITE_API_URL` environment variable (default: `http://localhost:3000`)
- **WebSocket URL**: Configured via `VITE_WS_URL` environment variable (default: `ws://localhost:3000`)
- **Content Type**: `application/x-www-form-urlencoded` (legacy, see `app.routes.js`)

---

## HTTP API Services

### Authentication API (`ringhttp.factory.js`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User login |
| `/api/auth/logout` | POST | User logout |
| `/api/auth/refresh` | POST | Refresh session token |
| `/api/auth/verify-phone` | POST | Verify phone number (Digits SDK) |

**Parameters**:
- `username` / `phone`
- `password`
- `deviceId` (5 = Web)
- `sessionId`

---

### Feed API (`feed.factory.js`, `OPERATION_TYPES`)

**WebSocket Operations** (via `$$connector` service):

| Operation Type | Description | Request | Response |
|----------------|-------------|----------|----------|
| `TYPE_NEWS_FEED` (1001) | Get news feed | `{ userId, limit, offset }` | Feed items array |
| `TYPE_MY_NEWS_FEED` (1002) | Get user's posts | `{ userId }` | User feed items |
| `TYPE_FRIEND_NEWSFEED` (1003) | Get friend feed | `{ userId }` | Friend feed items |
| `TYPE_GROUP_NEWS_FEED` (1004) | Get group feed | `{ circleId }` | Group feed items |
| `TYPE_MEDIAS_NEWS_FEED` (1005) | Get media feed | `{ userId }` | Media items |
| `TYPE_NEWS_PORTAL_FEED` (1006) | Get portal feed | `{ portalId }` | Portal feed items |
| `TYPE_BUSINESS_PAGE_FEED` (1007) | Get business feed | `{ pageId }` | Business feed items |

**Feed Actions**:
- `TYPE_ADD_STATUS` (2001) - Create new post
- `TYPE_DELETE_STATUS` (2002) - Delete post
- `TYPE_UPDATE_STATUS` (2003) - Update post
- `TYPE_LIKE_STATUS` (2004) - Like a post
- `TYPE_UNLIKE_STATUS` (2005) - Unlike a post
- `TYPE_SHARE_STATUS` (2006) - Share a post
- `TYPE_ADD_COMMENT` (2007) - Add comment
- `TYPE_DELETE_COMMENT` (2008) - Delete comment

---

### Friends API (`friends.http.service.js`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/friends/list` | GET | Get friends list |
| `/api/friends/add` | POST | Send friend request |
| `/api/friends/accept` | POST | Accept friend request |
| `/api/friends/reject` | POST | Reject friend request |
| `/api/friends/remove` | POST | Remove friend |
| `/api/friends/requests` | GET | Get pending requests |
| `/api/friends/suggestions` | GET | Get friend suggestions |

---

### Media API (`media.http.service.js`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/media/upload` | POST | Upload media file |
| `/api/media/list` | GET | Get user's media |
| `/api/media/delete` | POST | Delete media |
| `/api/media/albums` | GET | Get albums |
| `/api/media/album/create` | POST | Create album |
| `/api/media/trending` | GET | Get trending media |
| `/api/media/search` | GET | Search media |

---

### Circle/Group API (`circle.http.service.js`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/circles/list` | GET | Get user's circles |
| `/api/circles/create` | POST | Create circle |
| `/api/circles/update` | POST | Update circle |
| `/api/circles/delete` | POST | Delete circle |
| `/api/circles/members` | GET | Get circle members |
| `/api/circles/join` | POST | Join circle |
| `/api/circles/leave` | POST | Leave circle |

---

### Portal/News Portal API (`portal.http.service.js`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/portals/list` | GET | Get portals |
| `/api/portals/follow` | POST | Follow portal |
| `/api/portals/unfollow` | POST | Unfollow portal |
| `/api/portals/discover` | GET | Discover portals |
| `/api/portals/saved` | GET | Get saved portal feeds |

---

### Profile API (`profile.http.service.js`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/profile/get` | GET | Get user profile |
| `/api/profile/update` | POST | Update profile |
| `/api/profile/cover/upload` | POST | Upload cover photo |
| `/api/profile/avatar/upload` | POST | Upload avatar |
| `/api/profile/settings` | GET/POST | Get/Update settings |

---

### Image API (`image.http.service.js`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/images/upload` | POST | Upload image |
| `/api/images/quality` | POST | Get optimized image URL |

---

### Sticker/Emoji API (`sticker.http.service.js`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stickers/list` | GET | Get sticker packs |
| `/api/stickers/download` | GET | Download sticker pack |
| `/api/emoji/list` | GET | Get emoji list |

---

## WebSocket Protocol

### Connection

- **Service**: `$$connector` (`apps/main-app/app/connector/socket.communication.factory.js`)
- **Protocol**: Binary (DataView/ArrayBuffer)
- **Reconnection**: Automatic with exponential backoff

### Message Format

```
{
  "actn": <operation_type>,  // Action number
  "pckId": <client_generated>, // Packet ID
  "pckFs": <server_packet_id>, // Server packet ID (for responses)
  "sId": <session_id>,         // Session ID
  "tbid": <tab_id>,            // Tab ID
  "dvc": 5                     // Device type (5 = Web)
}
```

### WebSocket Methods

- `send(data, request_type, flooding)` - Send without waiting for response
- `request(data, request_type, flooding)` - Send and return promise
- `pull(data, request_type, flooding)` - Send with merge support
- `subscribe(callback, options)` - Subscribe to messages with filter
- `unsubscribe(key)` - Remove subscription
- `keepAlive()` - Send keep-alive packet

---

## WebSocket Action Types (`OPERATION_TYPES`)

Defined in `apps/main-app/app/global/constants/actions.constant.js`:

### Authentication (1-999)
- `TYPE_LOGIN` (1)
- `TYPE_LOGOUT` (2)
- `TYPE_SESSION_EXPIRE` (3)

### Feed Operations (1000-1999)
- `TYPE_NEWS_FEED` (1001)
- `TYPE_MY_NEWS_FEED` (1002)
- `TYPE_FRIEND_NEWSFEED` (1003)
- `TYPE_GROUP_NEWS_FEED` (1004)
- `TYPE_MEDIAS_NEWS_FEED` (1005)
- `TYPE_NEWS_PORTAL_FEED` (1006)
- `TYPE_BUSINESS_PAGE_FEED` (1007)

### Feed Actions (2000-2999)
- `TYPE_ADD_STATUS` (2001)
- `TYPE_DELETE_STATUS` (2002)
- `TYPE_UPDATE_STATUS` (2003)
- `TYPE_LIKE_STATUS` (2004)
- `TYPE_UNLIKE_STATUS` (2005)
- `TYPE_SHARE_STATUS` (2006)
- `TYPE_ADD_COMMENT` (2007)
- `TYPE_DELETE_COMMENT` (2008)

### Chat Operations (3000-3999)
- `TYPE_CHAT_MESSAGE` (3001)
- `TYPE_CHAT_HISTORY` (3002)
- `TYPE_CHAT_TYPING` (3003)

### Notification Operations (4000-4999)
- `TYPE_NOTIFICATION` (4001)
- `TYPE_NOTIFICATION_READ` (4002)

### Media Operations (5000-5999)
- `TYPE_MEDIA_UPLOAD` (5001)
- `TYPE_MEDIA_DELETE` (5002)

---

## Migration Notes

### For React Migration

1. **Replace `$$connector`** with modern WebSocket library (Socket.io or native WebSocket wrapper)
2. **Replace HTTP services** with `fetch` or `axios` calls
3. **State Management**: Consider Redux Toolkit or Zustand for managing:
   - Feed state
   - User state
   - Notification state
4. **API Calls**: Create TypeScript interfaces for all request/response types

### Example React API Call

```typescript
// api/feed.ts
export async function getFeed(userId: string, limit = 20): Promise<FeedItem[]> {
  const response = await fetch(`${API_URL}/api/feed/list?userId=${userId}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });
  return response.json();
}
```

---

## Security Considerations

1. **Session Management**: Currently uses cookies (`sessionID`, `uId`, `sId`)
2. **WebSocket Auth**: Session validated on connection
3. **API Auth**: Token-based (sent via cookie or header)
4. **CORS**: Must be configured on server to allow web origin

---

*Generated: 2026-05-02*
*Based on codebase analysis - may need server team verification*
