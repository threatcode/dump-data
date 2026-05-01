# Changelog

All notable changes to the RingID project will be documented in this file.

## [Unreleased]

### Added
- Pre-commit hooks with Husky and lint-staged
- GitHub Actions CI/CD pipeline
- ESLint and Prettier configuration
- Vite build system with HMR

### Changed
- Migrated from Bower to pnpm
- Replaced Grunt with Vite
- Consolidated templates into packages/templates
- Updated template URLs to use @templates alias
- Removed legacy backup files

### Removed
- Bower configuration (bower.json, .bowerrc)
- Grunt configuration (Gruntfile.js)
- Legacy linter configs (.jshintrc, .tern-project)
- Old backup files (*_old*, *_backup*)

## [0.2.0] - 2026-05-01

### Added
- pnpm workspace configuration
- Modern build tooling with Vite
- ESLint with AngularJS support
- Prettier for code formatting
- .env.example for environment configuration
- .nvmrc for Node.js version management

### Changed
- Migrated from npm to pnpm
- Flattened nested package directories
- Updated all package.json files with proper metadata
- Improved README with pnpm commands

### Removed
- Grunt build system
- Bower dependency management
- Legacy build artifacts

## [0.1.0] - 2024-01-01

### Added
- Initial monorepo structure
- AngularJS 1.3.15 application
- Basic chat, feed, and profile functionality
- WebSocket communication

[Unreleased]: https://github.com/threatcode/dump-data/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/threatcode/dump-data/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/threatcode/dump-data/releases/tag/v0.1.0
