# Codebase Audit Report

**Date**: May 2, 2026
**Application**: RingID Web App
**Framework**: AngularJS 1.8.3

## 1. Codebase Overview

| Metric | Count |
|--------|-------|
| Total JavaScript files | 293 |
| AngularJS modules | 6 |
| Routes | 20+ |
| Shared services | 16 |
| Directives | 7+ |
| Controllers | 15+ |

## 2. Module Map

### 2.1 Main Module: `ringid`
- **File**: `apps/main-app/app/app.module.js`
- **Dependencies**: ngRoute, ngStorage, ringid.feed, ringid.profile, ringid.chat, ringid.newsportal, ringid.services
- **Routes**: Defined in `app.routes.js`

### 2.2 Feed Module: `ringid.feed`
- **File**: `apps/main-app/app/feed/feed.module.js`
- **Dependencies**: ngRoute, ngStorage
- **Structure**:
  - `controllers/` - Feed-related controllers
  - `directives/` - Feed-related directives
  - `services/` - Feed-related services

### 2.3 Profile Module: `ringid.profile`
- **File**: `apps/main-app/app/profile/profile.module.js`
- **Dependencies**: ringid.services, ngRoute, ngStorage

### 2.4 Chat Module: `ringid.chat`
- **File**: `apps/main-app/app/chat/chat.module.js`
- **Dependencies**: ringid.services, ngRoute, ngStorage

### 2.5 News Portal Module: `ringid.newsportal`
- **File**: `apps/main-app/app/newsportal/newsportal.module.js`
- **Dependencies**: ringid.services, ngRoute, ngStorage

### 2.6 Common Factories Module: `ringid.factories`
- **File**: `apps/main-app/app/common/factories.module.js`

## 3. Route Map

| Route | Template | Controller | Complexity |
|-------|----------|------------|------------|
| `/` | index.html | - | Medium |
| `/profile/:uId/:subpage?/:albumId?` | profile/profile.html | ProfileController | High |
| `/circle/:circleId/:subpage?` | home/circle.html | - | High |
| `/feed/:feedId/:commentId?/:shared?` | index-singlefeed.html | - | High |
| `/medias` | home/media.feed.html | - | Medium |
| `/feed_shares/:feedId/:commentId?` | index-who-sharedfeed.html | - | Medium |
| `/media` | media-list.html | - | Medium |
| `/media/myalbums` | mediasearch/my.albums.html | - | Medium |
| `/media/upload` | mediasearch/media.upload.html | MediaPostController | High |
| `/media/:albumtype` | mediasearch/albums.all.html | allAlbumTypeController | Medium |
| `/media/:stype/:sk?` | mediasearch/search.result.html | mSearchResultController | High |
| `/chat` | partials/chat/single-page/home.html | ChatHistoryController | High |
| `/circle` | circle-partials/all-circle.html | allCirclePopupController | Medium |
| `/newsportal` | newsportal/portal-index.html | FeedNewsportalController | Medium |
| `/newsportal/following` | newsportal/following.html | portalFollowingController | Medium |
| `/newsportal/discover` | newsportal/discover.html | portalDiscoverController | Medium |
| `/newsportal/saved` | newsportal/saved.html | portalSaveController | Low |
| `/newsportal/:uid` | newsportal/profilenews.html | portalSaveController | Medium |
| `/allnotification` | partials/all-notification.html | - | Low |
| `/allfriendrequest` | partials/all-friend-request.html | - | Low |

## 4. Shared Services

Located in `apps/main-app/app/shared/services/`:

| Service | Purpose |
|---------|---------|
| `album.factory.js` | Album management |
| `circle-manager.factory.js` | Circle/group management |
| `circle.http.service.js` | Circle HTTP API calls |
| `emotion.factory.js` | Emotion/emoji handling |
| `feed.factory.js` | Feed data operations |
| `file-upload.service.js` | File upload handling |
| `friends.factory.js` | Friends management |
| `friends.http.service.js` | Friends HTTP API calls |
| `image-quality.service.js` | Image quality processing |
| `image.http.service.js` | Image HTTP API calls |
| `invite.factory.js` | User invitation system |
| `media-metadata.service.js` | Media metadata handling |
| `media.factory.js` | Media operations |
| `media.http.service.js` | Media HTTP API calls |
| `portal.http.service.js` | News portal API calls |
| `sticker.emo.factory.js` | Sticker and emoji handling |

## 5. Directives

Located in `apps/main-app/app/shared/directives/`:

| Directive | Purpose |
|-----------|---------|
| `rg-comments.directive.js` | Comments display/interaction |
| `rg-editor.directive.js` | Rich text editor |
| `rg-emoticon.directive.js` | Emoticon picker/insertion |
| `rg-hashtag.directive.js` | Hashtag parsing/display |
| `rg-invite.directive.js` | User invitation UI |
| `rg-like.directive.js` | Like button/interaction |
| `rg-upload.directive.js` | File upload UI |

## 6. WebSocket Protocol

### 6.1 Connector Service
- **File**: `apps/main-app/app/connector/socket.communication.factory.js`
- **Service Name**: `$$connector`

### 6.2 Protocol Details

**Message Format**:
- Binary protocol using `DataView` and `ArrayBuffer`
- Messages contain:
  - `actn` - Action number (operation type)
  - `pckId` - Packet ID (client-generated)
  - `pckFs` - Packet ID from server
  - `sId` - Session ID
  - `tbid` - Tab ID
  - `dvc` - Device type (5 = Web)

**Key Operations**:
- `send(data, request_type, flooding)` - Send data without waiting for response
- `request(data, request_type, flooding)` - Send data and return a promise
- `pull(data, request_type, flooding)` - Send data with merge support
- `subscribe(callback, options)` - Subscribe to messages with optional filter
- `unsubscribe(key)` - Remove subscription
- `keepAlive()` - Send keep-alive packet

**Message Flow**:
1. Client sends binary packet with `pckId`
2. Server responds with matching `pckId`
3. Server pushes updates with `pckFs` (packet from server)
4. Subscribers filter messages by `actn` (action number)

**Connection Management**:
- WebSocket connection via `$websocket` service
- Session tracked via cookies (`sessionID`, `uId`, `sId`)
- Keep-alive packets sent periodically
- Reconnection logic on connection loss
- Web Worker (`RingWorker`) handles packet encoding/decoding

**Action Types** (defined in `actions.constant.js`):
- Authentication operations
- Feed operations
- Chat operations
- Notification operations
- Media operations

## 7. Dependencies

### 7.1 AngularJS Dependencies
- `angular` 1.8.3
- `angular-route`
- `angular-animate`
- `angular-loader`
- `ngstorage`
- `@uirouter/angularjs` 1.1.0

### 7.2 UI Dependencies
- `bootstrap` 5.3.3

### 7.3 Build Tools
- `vite` 8.0.10
- `sass` 1.99.0

## 8. Migration Readiness

### 8.1 Completed
- [x] AngularJS upgraded to 1.8.3
- [x] jQuery dependencies removed
- [x] Feed controllers consolidated
- [x] Vite build system configured
- [x] React infrastructure added (Phase 1)
- [x] React components created (Header, Footer, Button, Input, Card, Badge, Avatar, LoadingSpinner)
- [x] react2angular bridge configured
- [x] Custom React hooks for AngularJS services
- [x] React pages created (About, Settings)
- [x] React Header integrated into main template
- [x] React Footer integrated into main template
- [x] React routes added (/about, /settings)
- [x] React pages use React components (Button, Input, Card)

### 8.2 In Progress
- [~] Integrating React components into existing templates
- [~] Building React page equivalents for AngularJS routes

### 8.3 Pending
- [ ] TypeScript migration (enable `allowJs: true`)
- [ ] Convert directives to `.component()` pattern
- [ ] Document all API endpoints
- [ ] Create React versions of complex components (Feed, Chat)
- [ ] Set up shared state management (Redux/Zustand)
- [ ] Route-by-route migration (replace AngularJS routes with React)

## 9. Component Migration Priority

### Low Priority (Static/Simple)
- About page
- Contact page
- FAQ page
- Settings page

### Medium Priority
- Profile page
- Notifications
- Media cloud
- News portal

### High Priority (Complex)
- Feed (real-time updates, WebSocket)
- Chat (real-time messaging, WebSocket)
- Circle/groups

## 10. Recommended Next Steps

1. **Enable TypeScript**: Add `tsconfig.json` with `allowJs: true`
2. **Create API documentation**: Map all HTTP endpoints and WebSocket actions
3. **Migrate simple routes first**: Start with static pages
4. **Build React Feed component**: Replace AngularJS feed incrementally
5. **Build React Chat component**: Replace AngularJS chat with WebSocket bridge
6. **Set up state management**: Introduce Zustand or Redux for shared state
7. **Remove AngularJS**: Once all routes are migrated
