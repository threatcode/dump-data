# Migration Guidance

This file describes the actual migration performed on the RingID codebase from legacy tooling to modern tooling.

## Migration Completed (2026-05-01)

### From → To
- **Bower → pnpm** (with workspaces)
- **Grunt → Vite** (with HMR and fast builds)
- **Legacy structure → Monorepo** (apps/ + packages/)

## Final Structure

```
/README.md
/package.json
/pnpm-workspace.yaml
/.npmrc
/eslint.config.js
/.prettierrc
/.husky/
/apps/
  /main-app/        # Main AngularJS application
/packages/
  /scripts/         # Shared JavaScript utilities
  /styles/          # Shared CSS styles
  /templates/       # Shared HTML templates
  /common/          # Common resources
  /resources/       # Shared resources
/config/            # Server configurations
/tests/             # Test files
/scripts/           # Migration scripts
```

## What Was Done

### 1. Package Manager Migration
- Deleted `bower.json`, `.bowerrc`
- Created `pnpm-workspace.yaml`
- Migrated all dependencies to `package.json` files
- Used pnpm workspaces for monorepo management

### 2. Build System Migration
- Deleted `Gruntfile.js`
- Created `vite.config.js` with:
  - AngularJS support
  - Template alias (`@templates/` → `packages/templates/`)
  - Proxy for API requests
  - Build optimization

### 3. Code Quality Setup
- Added ESLint with AngularJS globals
- Added Prettier for formatting
- Set up Husky + lint-staged for pre-commit hooks
- Created `.editorconfig` for consistency

### 4. Template Consolidation
- Moved all templates to `packages/templates/`
- Deleted `apps/main-app/templates/`
- Updated 161 template URLs to use `@templates/` alias
- Created `template-loader.js` for Vite compatibility

### 5. CI/CD Setup
- Created `.github/workflows/ci.yml`
- Added GitHub Actions workflow for:
  - Install (pnpm)
  - Lint (ESLint)
  - Build (Vite)
  - Security audit

### 6. Cleanup
- Removed legacy files: `.jshintrc`, `.tern-project`, `.eslintrc.json`
- Deleted backup files (`*_old*`, `*_backup*`)
- Flattened nested package directories
- Added `package.json` to all workspace packages

### 7. Documentation
- Updated `README.md` with pnpm commands
- Created `CONTRIBUTING.md`
- Created `CHANGELOG.md`
- Created `ARCHITECTURE.md`
- Created `TODO.md` with gap analysis

## Migration Script

The original migration script (`scripts/migrate-to-src.js`) is obsolete. The actual migration was done manually with these steps:

1. Set up pnpm workspace
2. Configure Vite for AngularJS
3. Move files to monorepo structure
4. Update all references and imports
5. Add modern tooling (ESLint, Prettier, Husky)
6. Create CI/CD pipeline
7. Document everything

## Lessons Learned

- **Incremental migration works better** than big-bang changes
- **Template URLs need careful handling** — sed replacements can break strings
- **AngularJS globals must be configured** in ESLint
- **Git lock files** can be an issue in containerized environments
- **pnpm workspaces** are excellent for monorepo management

## Future Migrations

### AngularJS → Modern Framework
See `TODO.md` for the long-term migration strategy to Angular/React/Vue.

Recommended approach:
1. Research and prototype (1-2 weeks)
2. Incremental migration using micro-frontends (3-6 months)
3. Sunset AngularJS version

### Security Updates
- Upgraded AngularJS 1.3.15 → 1.8.3 (latest 1.x)
- Upgraded Bootstrap 3.3.5 → 5.3.8
- Replaced angular-ui-notification with @uirouter/angularjs
- See `TODO.md` for remaining security items
