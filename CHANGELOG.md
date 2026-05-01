# Changelog

All notable changes to the RingID Frontend project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Bundle visualization with rollup-plugin-visualizer
- AngularJS template cache plugin for Vite
- HMR overlay for better dev experience

### Changed
- Upgraded AngularJS from 1.3.15 to 1.8.3 (security fix)
- Upgraded Bootstrap from 3.3.5 to 5.3.8
- Replaced angular-ui-notification with @uirouter/angularjs
- Removed jQuery dependencies from HTML files
- Updated Vite config with improved build settings

### Fixed
- ESLint configuration for modern JavaScript
- Karma test configuration for ES modules
- Template URLs to use @templates alias

---

## [0.2.0] - 2026-05-01

### Added
- **CI/CD Pipeline** with GitHub Actions (`.github/workflows/ci.yml`)
  - Automated lint, test, build, and security audit
- **Pre-commit hooks** with Husky and lint-staged
- **Environment configuration**
  - `.env.development`, `.env.staging`, `.env.production`
  - Vite mode parameter support
- **Documentation**
  - `ARCHITECTURE.md` - System architecture and module structure
  - `CONTRIBUTING.md` - Development guidelines and conventions
  - `MIGRATION.md` - Migration guides and notes
- **Test infrastructure**
  - 8+ test files with Jasmine/Karma
  - E2E test setup with Puppeteer
  - Test coverage reporting with karma-coverage
- **Code quality tools**
  - ESLint with AngularJS support
  - Prettier for code formatting
  - EditorConfig alignment
- **Template management**
  - Consolidated templates into `packages/templates/`
  - `@templates/` alias configured in Vite
  - Template cache plugin for AngularJS
- **WebSocket modernization**
  - Documented WebSocket protocol
  - Fixed worker.js syntax errors
  - Added OPERATION_TYPES documentation

### Changed
- **Build system**: Migrated from Grunt to Vite
  - Faster builds with HMR support
  - Modern JavaScript (ES2020+) support
  - Improved dev server with proxy
- **Package manager**: Migrated from npm to pnpm
  - Monorepo structure with pnpm workspaces
  - Faster installs, reduced disk space
- **Dependency management**
  - Updated all dependencies to modern versions
  - Removed Bower and legacy package managers
- **Module architecture**
  - Consolidated AngularJS module definitions
  - Fixed module registration pattern (try/catch)
  - Single module definition files for sub-modules
- **Code cleanup**
  - Removed 50+ legacy backup files
  - Deleted minified files from source
  - Removed commented lazy-load code
  - Fixed hardcoded debug flags to use environment variables

### Fixed
- **Security vulnerabilities** (from pnpm audit)
  - GHSA-4w4v-5hc9-xrr2: AngularJS super-linear runtime (ReDoS)
  - Multiple AngularJS XSS vulnerabilities via `$resource`, `angular.copy()`
  - Bootstrap XSS in Popover/Tooltip
  - angular-ui-notification XSS
- **Template references**
  - Updated 100+ template URLs to use `@templates/` alias
  - Fixed hardcoded `pages/` paths
- **ESLint errors**
  - Fixed implicit injection issues
  - Added AngularJS globals configuration
  - Resolved unused variable warnings

### Removed
- **Legacy files**
  - `.bowerrc`, `.jshintrc`, `.tern-project`
  - Legacy minified files (`app.min.js`, `styles.min.css`)
  - Backup files (`*_old*.html`, `*_backup*.html`)
- **Dependencies**
  - jQuery (from HTML, partial from JS)
  - Bower and all Bower components
  - Grunt and all Grunt plugins
- **Duplicate content**
  - `apps/main-app/templates/` (consolidated to `packages/templates/`)

### Security
- Upgraded AngularJS to 1.8.3 (latest 1.x)
- Upgraded Bootstrap to 5.3.8
- Replaced vulnerable angular-ui-notification
- Added security audit to CI pipeline

---

## [0.1.0] - 2024-01-01

### Added
- Initial release of RingID Frontend
- AngularJS 1.3.15 application structure
- WebSocket-based real-time communication
- Feed, Chat, Auth, Profile modules
- News portal sub-application
- Basic Grunt build system
- Bower for frontend dependencies

---

## Migration Notes

### From 0.1.0 to 0.2.0

**Breaking Changes:**
- Node.js version requirement changed from ≥4 to ≥18
- Package manager changed from npm to pnpm
- Build system changed from Grunt to Vite
- Some template URLs changed to use `@templates/` alias

**Migration Steps:**
1. Delete `node_modules/` and run `pnpm install`
2. Update Node.js to version 18 or higher
3. Use `pnpm start` instead of `npm start`
4. Update any custom template paths to use `@templates/` alias
5. Remove any remaining jQuery usage in application code

**Deprecations:**
- Grunt build system (removed)
- Bower package manager (removed)
- jQuery dependency (being phased out)
- AngularJS 1.x (planning migration to modern framework)
