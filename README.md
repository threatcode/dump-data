# dump-data

Legacy RingID web frontend in a monorepo structure. Modernized with Vite build system and pnpm workspaces.

## Project Structure

This is a monorepo using pnpm workspaces with the following structure:

- `apps/` — Application code
  - `main-app/` — Main RingID web application (AngularJS)
- `packages/` — Shared packages
  - `scripts/` — Shared JavaScript utilities
  - `styles/` — Shared CSS styles
  - `templates/` — Shared HTML templates
  - `common/` — Common resources (fonts, images, apidocfiles)
  - `resources/` — Shared resources (fonts, configs)
- `config/` — Server configuration files (rewrite, gzip, cache, vhost)
- `scripts/` — Migration and utility scripts
- `tests/` — Test files and karma configuration

## Development Setup

1. Clone the repository
2. Ensure Node.js 18+ is installed
3. Run `pnpm install` to install dependencies
4. Run `pnpm start` to start Vite development server on port 8080
5. Run `pnpm build` to build the application with Vite
6. Run `pnpm preview` to preview the production build
7. Run `pnpm test` to run tests

## Build Process

The project uses Vite for fast modern builds:
- Development server with HMR (Hot Module Replacement)
- Optimized production builds
- Asset handling and bundling

## Code Quality

- `pnpm lint` — Lint JavaScript files with ESLint
- `pnpm format` — Format code with Prettier

## Migration Notes

This project has been migrated to a monorepo structure. Recent improvements:
- Migrated from Bower to npm for dependency management
- Replaced Grunt with Vite for modern build tooling
- Migrated from npm to pnpm for better monorepo support
- Added ESLint and Prettier for code quality
- Removed legacy backup files

## TODO

See [TODO.md](TODO.md) for comprehensive gap analysis and action items.
