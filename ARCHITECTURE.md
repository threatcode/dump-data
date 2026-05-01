# RingID Frontend Architecture

This document describes the architecture of the RingID web frontend application.

## Overview

RingID is a social networking platform built with **AngularJS 1.8.3** (legacy, planned migration to modern framework). The application follows a modular monorepo structure using **pnpm workspaces**.

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | AngularJS 1.8.3 |
| Build Tool | Vite 6.x |
| Package Manager | pnpm 10.x |
| Styling | Bootstrap 5.3, CSS |
| Real-time | WebSocket (custom binary protocol) |
| Testing | Karma + Jasmine, Playwright |
| Linting | ESLint, Prettier |

## Project Structure

```
dump-data/
├── apps/
│   └── main-app/              # Main RingID application
│       ├── app/               # Application code
│       │   ├── auth/          # Authentication module
│       │   ├── chat/          # Chat functionality
│       │   ├── feed/          # News feed
│       │   ├── friend/        # Friends management
│       │   ├── global/        # Shared services/utilities
│       │   ├── profile/       # User profiles
│       │   └── ...
│       ├── newsportal/        # News portal sub-app
│       ├── mobile/            # Mobile web version
│       └── webapp/            # Web app variant
├── packages/                  # Shared packages
│   ├── scripts/               # Shared JavaScript modules
│   └── templates/             # Shared HTML templates
├── tests/                     # Test suites
├── worker/                    # Web Workers
└── dist/                      # Build output
```

## AngularJS Module Architecture

### Core Modules

The application uses AngularJS modules with a try/catch pattern for registration:

```javascript
try {
  angular.module('ringid.feed');
} catch (e) {
  angular.module('ringid.feed', []);
}
```

**Note**: This pattern is being consolidated. See [TODO.md](./TODO.md) for migration progress.

### Main Modules

| Module | Description | Registration Location |
|--------|-------------|----------------------|
| `ringid` | Main application module | `app.js` |
| `ringid.feed` | News feed functionality | `app/feed/` (30+ files) |
| `ringid.chat` | Chat and messaging | `app/chat/` |
| `ringid.auth` | Authentication | `app/auth/` |
| `ringid.profile` | User profiles | `app/profile/` |
| `ringid.friend` | Friends management | `app/friend/` |
| `ringid.notification` | Notifications | `app/notification/` |
| `ringid.media` | Media upload/display | `app/media/` |
| `ringid.search` | Search functionality | `app/search/` |

### Module Dependencies

```
ringid
├── ringid.auth
├── ringid.chat
├── ringid.feed
├── ringid.friend
├── ringid.notification
├── ringid.profile
├── ringid.media
├── ringid.search
└── ngRoute, ngStorage, etc.
```

## Shared Services

### Location: `app/global/services/`

| Service | Description |
|---------|-------------|
| `AuthService` | Authentication and session management |
| `WebSocketService` | Real-time communication |
| `UserService` | User data management |
| `FeedService` | Feed data and operations |
| `ChatService` | Chat message handling |
| `NotificationService` | Push notifications |
| `StorageService` | Local/session storage wrapper |

### Service Pattern

Services are defined as AngularJS factories or services:

```javascript
angular.module('ringid.global')
  .factory('AuthService', ['$http', '$q', function($http, $q) {
    // Service implementation
  }]);
```

## WebSocket Protocol

The application uses a custom binary WebSocket protocol for real-time communication.

### Location: `worker/`

| File | Description |
|------|-------------|
| `worker.js` | Main Web Worker for WebSocket |
| `sender.js` | Message sending logic |
| `wat.fall.js` | Message queue/fallback handling |

### Message Types (OPERATION_TYPES)

WebSocket messages use operation type codes defined in the application. See `packages/scripts/` for operation type constants.

### WebSocket Flow

```
Client (AngularJS) → Worker (worker.js) → Server (WebSocket)
                    ↓
Client ← Worker ← Server
```

## Template System

### Template Aliases (Vite)

Configured in `vite.config.js`:

```javascript
resolve: {
  alias: {
    '@app': '/apps/main-app/app',
    '@packages': '/packages',
    '@templates': '/packages/templates'
  }
}
```

### Template Cache

Templates are cached using AngularJS `$templateCache`. The Vite configuration includes a custom plugin to automatically cache HTML templates.

### Template URL Pattern

```javascript
// Use alias in directives/components
templateUrl: '@templates/home/feed.html'
```

## Build System (Vite)

### Configuration: `vite.config.js`

Key features:
- **Dev Server**: Port 8080, proxies `/api` to backend
- **Build**: Outputs to `dist/`, chunks with hash
- **Aliases**: `@app`, `@packages`, `@templates`
- **Template Cache**: Custom plugin for AngularJS
- **Bundle Analysis**: `rollup-plugin-visualizer`

### Build Commands

```bash
pnpm start          # Dev server with HMR
pnpm build          # Production build
pnpm preview        # Preview production build
```

## Environment Configuration

Environment variables are managed through Vite's `.env` files:

| File | Purpose |
|------|---------|
| `.env.development` | Local development |
| `.env.staging` | Staging environment |
| `.env.production` | Production environment |

### Accessing Environment Variables

```javascript
// In application code
const apiUrl = import.meta.env.VITE_API_URL;
const debugMode = import.meta.env.VITE_DEBUG;
```

## State Management

Currently uses AngularJS services with local state. For the planned migration to a modern framework, consider:
- Redux (via angular-redux)
- MobX
- Or framework-native state management

## Authentication Flow

1. User initiates login (email/password or social)
2. `AuthService.login()` sends credentials to API
3. On success, token stored in `ngStorage`
4. WebSocket connection established with auth token
5. User session maintained via token refresh

## Testing Architecture

### Unit Tests (Karma + Jasmine)

- Configuration: `tests/karma.conf.cjs`
- Test files: `tests/**/*.spec.js`
- Coverage: `coverage/`

### E2E Tests (Playwright)

- Configuration: `playwright.config.js`
- Test files: `tests/e2e/`

## Future Architecture (Migration)

The application is planning migration from AngularJS to a modern framework. See [TODO.md](./TODO.md) for the migration strategy.

### Recommended Migration Path

1. **Angular** - If staying in Google ecosystem
2. **React** - Larger ecosystem, easier hiring
3. **Vue** - Progressive, easier learning curve

### Micro-Frontend Approach

During migration, consider:
- Running both versions via iframes
- Using module federation
- Gradual route-by-route migration

## Performance Considerations

- **Bundle Splitting**: Vite handles automatic code splitting
- **Lazy Loading**: Planned via `$ocLazyLoad` (currently commented)
- **Image Optimization**: `vite-plugin-imagemin` available
- **Tree Shaking**: Enabled by Vite/Rollup

## Security

See [TODO.md](./TODO.md) for security-related items.

Current security measures:
- Content Security Policy (CSP) planned
- `$sce` for XSS protection
- Angular 1.8.3 (latest 1.x, but still legacy)
- Regular `pnpm audit` checks

## Troubleshooting

### Common Issues

1. **Module registration errors**: Check try/catch pattern in module files
2. **Template not found**: Verify `@templates` alias is used
3. **WebSocket disconnects**: Check worker.js logs
4. **Build failures**: Clear `node_modules` and `pnpm install`

### Debug Tools

- `developer.config.js` - RingLogger configuration
- Browser DevTools - Network, Console
- Vite DevTools - HMR, build analysis
