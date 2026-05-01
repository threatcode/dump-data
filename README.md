# dump-data

Legacy RingID web frontend in a monorepo structure. Modernized with Vite build system.

## Project Structure

This is a monorepo using npm workspaces with the following structure:

- `apps/` — Application code
  - `main-app/` — Main RingID web application (AngularJS)
- `packages/` — Shared packages
  - `scripts/` — Shared JavaScript utilities
  - `styles/` — Shared CSS styles
  - `templates/` — Shared HTML templates
  - `common/` — Common resources (fonts, images, apidocfiles)
- `config/` — Server configuration files (rewrite, gzip, cache, vhost)
- `scripts/` — Migration and utility scripts
- `tests/` — Test files and karma configuration

## Development Setup

1. Clone the repository
2. Ensure Node.js ≥ 4 is installed
3. Run `npm run setup` to install dependencies
4. Run `npm start` to start Vite development server on port 8080
5. Run `npm run build` to build the application with Vite
6. Run `npm run preview` to preview the production build
7. Run `npm test` to run tests

## Build Process

The project uses Vite for fast modern builds:
- Development server with HMR (Hot Module Replacement)
- Optimized production builds
- Asset handling and bundling

## Code Quality

- `npm run lint` — Lint JavaScript files with ESLint
- `npm run format` — Format code with Prettier

## Migration Notes

This project has been migrated to a monorepo structure. Recent improvements:
- Migrated from Bower to npm for dependency management
- Replaced Grunt with Vite for modern build tooling
- Added ESLint and Prettier for code quality
- Removed legacy backup files

## TODO

- Consider migrating from AngularJS to a modern framework
