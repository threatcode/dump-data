# RingID Frontend

Legacy RingID web frontend modernized with Vite build system, pnpm workspaces, and comprehensive tooling.

![Version](https://img.shields.io/badge/version-0.2.0-blue)
![Node](https://img.shields.io/badge/node-%3E18-green)
![AngularJS](https://img.shields.io/badge/AngularJS-1.8.3-red)
![License](https://img.shields.io/badge/license-MIT-blue)

## Table of Contents

- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Documentation](#documentation)
- [Migration Status](#migration-status)

## Project Structure

This is a **monorepo** using pnpm workspaces:

```
dump-data/
├── apps/                    # Applications
│   └── main-app/          # Main RingID app (AngularJS 1.8.3)
│       ├── app/            # Core application code
│       ├── newsportal/     # News portal sub-app
│       ├── webapp/        # Web app variant
│       └── pages/         # HTML pages
├── packages/               # Shared packages
│   ├── scripts/          # Shared JS utilities
│   └── templates/       # Shared HTML templates
├── tests/                 # Test files (Karma + Jasmine)
├── dist/                  # Build output (generated)
└── node_modules/          # Dependencies (managed by pnpm)
```

## Quick Start

### Prerequisites

- **Node.js** ≥18 (use `nvm install 18` if needed)
- **pnpm** ≥10 (`npm install -g pnpm`)

### Installation

```bash
# Clone the repository
git clone https://github.com/threatcode/dump-data.git
cd dump-data

# Install dependencies (pnpm only!)
pnpm install
```

## Development

### Start Dev Server

```bash
pnpm start
```

Opens Vite dev server at http://localhost:8080 with:
- HMR (Hot Module Replacement)
- Proxy to backend at `http://localhost:3000`
- Source maps for debugging

### Environment Modes

The project supports multiple environments:

| File | Purpose |
|------|---------|
| `.env.development` | Local development |
| `.env.staging` | Staging environment |
| `.env.production` | Production environment |

```bash
# Build for specific environment
pnpm build --mode staging
```

## Build & Deployment

### Build for Production

```bash
pnpm build
```

Output in `dist/` directory with:
- Hashed filenames for cache busting
- Minified JavaScript/CSS
- Optimized assets

### Preview Production Build

```bash
pnpm preview
```

### Docker Deployment

```bash
# Build Docker image
docker build -t ringid-frontend .

# Run container
docker run -p 8080:80 ringid-frontend

# Or use docker-compose
docker-compose up -d
```

## Testing

### Unit Tests (Karma + Jasmine)

```bash
# Run tests once
pnpm test

# Run tests in watch mode
cd tests && karma start karma.conf.cjs
```

Coverage reports generated in `coverage/` directory.

### E2E Tests (Playwright)

```bash
# Run E2E tests
pnpm test:e2e

# Run with UI
pnpm test:e2e:ui
```

## Code Quality

### Linting

```bash
# Lint all JavaScript files
pnpm lint
```

Uses ESLint with:
- `eslint-plugin-angular` for AngularJS best practices
- Modern ES2020+ syntax support

### Formatting

```bash
# Format code with Prettier
pnpm format
```

### Pre-commit Hooks

Husky + lint-staged automatically:
- Lints staged JavaScript files
- Formats code with Prettier
- Runs before each commit

### Security Audit

```bash
pnpm audit
```

## Documentation

| File | Description |
|------|-------------|
| [README.md](README.md) | This file |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture and module structure |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Development guidelines and conventions |
| [MIGRATION.md](MIGRATION.md) | Migration guides and notes |
| [MIGRATION-PLAN.md](MIGRATION-PLAN.md) | Detailed migration strategy to React |
| [CHANGELOG.md](CHANGELOG.md) | Version history |
| [TODO.md](TODO.md) | Gap analysis and action items |

## Migration Status

### Completed ✅

- [x] Migrate Bower → pnpm
- [x] Migrate Grunt → Vite
- [x] Upgrade AngularJS 1.3.15 → 1.8.3 (security fix)
- [x] Upgrade Bootstrap 3.3.5 → 5.3.8
- [x] Set up CI/CD (GitHub Actions)
- [x] Add ESLint + Prettier
- [x] Add pre-commit hooks (Husky)
- [x] Consolidate templates to `packages/templates/`
- [x] Remove jQuery dependencies (partial)
- [x] Create Docker configuration

### In Progress 🚧

- [ ] Refactor feed controllers (consolidate 15+ controllers)
- [ ] Remove remaining jQuery (`image_slider.js`, `utils_script.js`)
- [ ] Add CSS preprocessing (Sass/PostCSS)
- [ ] Optimize images (imagemin)

### Planned 📋

- [ ] Migrate to modern framework (React recommended)
- [ ] Implement state management
- [ ] Add bundle size monitoring
- [ ] Set up micro-frontends

See [MIGRATION-PLAN.md](MIGRATION-PLAN.md) for the detailed migration strategy.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Note**: This is a legacy AngularJS application (1.8.3). The team is planning a migration to a modern framework (React recommended). See [MIGRATION-PLAN.md](MIGRATION-PLAN.md) for details.
