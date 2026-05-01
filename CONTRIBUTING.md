# Contributing to RingID

Thank you for your interest in contributing to RingID!

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/dump-data.git`
3. Install dependencies: `pnpm install`
4. Start development server: `pnpm start`

## Branch Naming

- `feature/description` — New features
- `fix/description` — Bug fixes
- `refactor/description` — Code refactoring
- `docs/description` — Documentation updates
- `chore/description` — Maintenance tasks

## Commit Conventions

We follow Conventional Commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`

Examples:
- `feat(chat): add message reactions`
- `fix(auth): resolve login redirect issue`
- `refactor(feed): consolidate feed controllers`

## Pull Request Process

1. Create a PR against the `main` branch
2. Fill out the PR template completely
3. Ensure CI checks pass
4. Request review from maintainers
5. Address review feedback

## Code Quality

- Run `pnpm lint` before committing
- Run `pnpm format` to format code
- Write tests for new features
- Update documentation as needed

## Testing

- Run `pnpm test` to execute tests
- Add tests for new functionality
- Ensure existing tests pass

## Questions?

Open an issue or contact the maintainers.
