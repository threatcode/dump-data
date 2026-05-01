# RingID Architecture

## Overview

RingID is a real-time social networking application built with AngularJS 1.x. It uses WebSocket for real-time communication and follows a modular monorepo structure.

## Monorepo Structure

```
dump-data/
├── apps/
│   └── main-app/          # Main AngularJS application
│       ├── app/           # Application code
│       │   ├── chat/      # Chat module
│       │   ├── feed/      # News feed module
│       │   ├── profile/   # User profile module
│       │   ├── auth/      # Authentication
│       │   ├── circle/    # Friend circles
│       │   ├── common/    # Shared components
│       │   ├── friend/    # Friend management
│       │   ├── global/    # Global services
│       │   ├── header/    # Header/navigation
│       │   ├── media/     # Media handling
│       │   ├── notification/ # Notifications
│       │   ├── shared/    # Shared directives
│       │   ├── sticker/   # Sticker pack
│       │   └── utils/     # Utilities
│       └── images/        # Application images
├── packages/
│   ├── scripts/          # Shared JavaScript utilities
│   ├── styles/           # Shared CSS styles
│   ├── templates/        # Shared HTML templates
│   ├── common/           # Common resources
│   └── resources/        # Shared resources
├── config/               # Server configurations
├── tests/                # Test files
└── scripts/              # Migration scripts
```

## AngularJS Module Structure

### Core Modules
- `ringid` — Main application module
- `ringid.chat` — Chat functionality
- `ringid.feed` — News feed
- `ringid.profile` — User profiles
- `ringid.auth` — Authentication
- `ringid.circle` — Friend circles
- `ringid.friend` — Friend management
- `ringid.notification` — Notifications
- `ringid.media` — Media handling
- `ringid.sticker` — Stickers
- `ringid.newsportal` — News portal

### Module Registration Pattern

Modules use a try/catch pattern for registration:

```javascript
try {
  angular.module('ringid.feed');
} catch (e) {
  angular.module('ringid.feed', [
    'ringid.services',
    'ngRoute',
    // dependencies
  ]);
}
```

## WebSocket Communication

Real-time communication uses a custom binary protocol:

- **worker.js** — Main WebSocket handler
- **sender.js** — Message sending utilities
- **wat.fall.js** — Fallback handling

### Message Types (OPERATION_TYPES)

Defined in `packages/scripts/operationtypes.js`:
- `ACTION_ADD` — Add new item
- `ACTION_UPDATE` — Update existing item
- `ACTION_DELETE` — Delete item
- `ACTION_GET` — Retrieve data
- `ACTION_LIST` — List items

## Services and Factories

### Core Services
- `AuthService` — Authentication and session management
- `ChatService` — Chat message handling
- `FeedService` — News feed operations
- `UserService` — User data management
- `NotificationService` — Notification handling
- `MediaService` — Media upload and processing

### Shared Services (packages/scripts/)
- `ringalert.factory.js` — Alert notifications
- `ringapicall.factory.js` — API calls
- `utils.factory.js` — Utility functions

## Template System

Templates are stored in `packages/templates/` and referenced using the `@templates/` alias:

```javascript
// In directives
templateUrl: '@templates/dropdowns/action-dropdown.html'

// In controllers
$scope.templateUrl = '@templates/popups/create-album-popup.html'
```

Vite resolves the `@templates` alias to `packages/templates/`.

## Build System

### Development
- Command: `pnpm start`
- Tool: Vite with HMR
- Port: 8080
- Proxy: API requests to `localhost:3000`

### Production
- Command: `pnpm build`
- Output: `dist/`
- Tool: Vite with Rollup bundler

## Environment Configuration

Environment variables (Vite):
- `VITE_API_URL` — Backend API URL
- `VITE_WS_URL` — WebSocket URL
- `VITE_DEBUG` — Debug mode flag

See `.env.example` for configuration options.

## Testing

- Test runner: Karma
- Framework: Jasmine
- E2E: Playwright (configured but not implemented)

Run tests: `pnpm test`

## Security Considerations

- AngularJS 1.x has known XSS vulnerabilities
- Bootstrap 3.x has XSS in Popover/Tooltip
- Plan migration to modern framework (Angular/React/Vue)
- Implement strict CSP headers
- Sanitize user input
