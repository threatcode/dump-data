# Contributing to RingID Frontend

Thank you for your interest in contributing to RingID! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to abide by our code of conduct. Be respectful, inclusive, and professional.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/dump-data.git`
3. Install dependencies: `pnpm install`
4. Start development server: `pnpm start`
5. Create a new branch for your feature/fix

## Development Workflow

We use a monorepo structure with pnpm workspaces:

```
dump-data/
├── apps/           # Applications
│   └── main-app/   # Main RingID app (AngularJS)
├── packages/       # Shared packages
│   ├── scripts/    # Shared JS modules
│   └── templates/  # Shared HTML templates
├── tests/          # Test files
└── dist/           # Build output
```

### Available Scripts

- `pnpm start` - Start Vite dev server on port 8080
- `pnpm build` - Build for production
- `pnpm test` - Run tests with Karma
- `pnpm lint` - Lint code with ESLint
- `pnpm format` - Format code with Prettier
- `pnpm audit` - Run security audit

## Branch Naming Convention

Use the following format for branch names:

```
<type>/<description>
```

### Types

- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `style/` - Code style/formatting (no logic changes)
- `refactor/` - Code refactoring (no feature/fix changes)
- `test/` - Adding or updating tests
- `chore/` - Build process, tooling, dependencies
- `perf/` - Performance improvements

### Examples

- `feat/chat-message-reactions`
- `fix/login-redirect-loop`
- `docs/update-api-endpoints`
- `refactor/feed-controller-consolidation`

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style/formatting
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Scopes

- `app` - Main application code
- `feed` - Feed module
- `chat` - Chat module
- `auth` - Authentication
- `profile` - User profile
- `build` - Build system
- `deps` - Dependencies
- `ci` - CI/CD

### Examples

```bash
feat(chat): add message reactions

- Add reaction picker component
- Store reactions in WebSocket message
- Update UI to display reactions

Closes #123
```

```bash
fix(auth): redirect loop on login page

The OAuth callback was not properly handling the token exchange,
causing an infinite redirect loop.

Fixes #456
```

## Pull Request Process

1. **Create a PR** against the `main` branch
2. **Fill out the PR template** with all required information
3. **Link related issues** using "Closes #123" or "Fixes #123"
4. **Add screenshots** for UI changes
5. **Ensure CI passes** - all checks must be green
6. **Request review** from at least one maintainer
7. **Address feedback** promptly and professionally

### PR Title Format

Follow the same convention as commit messages:

```
<type>(<scope>): <description>
```

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Tests added/updated for changes
- [ ] Documentation updated (if needed)
- [ ] All CI checks pass
- [ ] No console errors/warnings
- [ ] Manual testing performed

## Code Style Guidelines

### JavaScript (AngularJS)

- Use 2 spaces for indentation
- Use ES2020+ features (arrow functions, destructuring, etc.)
- Prefer `const` over `let`, avoid `var`
- Use `$inject` for dependency injection (not implicit)
- Use IIFE or strict mode to avoid global pollution

### HTML Templates

- Use `@templates/` alias for template URLs
- Keep templates clean and semantic
- Use AngularJS best practices for directives

### CSS/SCSS

- Use 2 spaces for indentation
- Prefer SCSS for new styles
- Follow BEM naming convention where applicable
- Avoid `!important`

### Linting

We use ESLint and Prettier. Configuration files:
- `.eslintrc.json` - ESLint rules
- `.prettierrc.json` - Prettier formatting
- `.editorconfig` - Editor settings

Pre-commit hooks (Husky + lint-staged) will automatically format and lint your code.

## Testing Requirements

### Unit Tests

- Located in `tests/` directory
- Use Jasmine framework with Karma runner
- File naming: `*.spec.js` or `*.Spec.js`
- Target coverage: 60%+

### Running Tests

```bash
pnpm test              # Run tests once
pnpm test:watch       # Run tests in watch mode
```

### E2E Tests

- Use Playwright (preferred) or Cypress
- Test critical user flows
- Run in CI environment

## Documentation

### When to Update Documentation

- New features or API changes
- Breaking changes
- Architectural changes
- New development patterns

### Documentation Files

- `README.md` - Project overview and setup
- `CONTRIBUTING.md` - This file
- `ARCHITECTURE.md` - System architecture (coming soon)
- `MIGRATION.md` - Migration guides
- `CHANGELOG.md` - Version history

## Questions?

Feel free to open an issue for questions or reach out to the maintainers.

Thank you for contributing!
