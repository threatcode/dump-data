# RingID Frontend - TODO List

Comprehensive gap analysis and action items for the modernized RingID web frontend.

## Priority Levels
- **P0 (Critical)**: Security vulnerabilities, blocking issues
- **P1 (High)**: Code quality, CI/CD, major cleanup
- **P2 (Medium)**: Modernization, documentation
- **P3 (Low)**: Nice-to-have improvements

---

## P0 - Critical Issues

### Security Vulnerabilities
- [ ] **Fix AngularJS 1.x XSS vulnerabilities** - Plan migration to modern framework (Angular/React/Vue)
  - Current versions have known XSS via `$resource`, ReDoS vulnerabilities
  - Workaround: Implement strict CSP, DOM sanitization
- [ ] **Upgrade Bootstrap 3.x** - Vulnerable to XSS in Popover/Tooltip
  - Migrate to Bootstrap 4/5 or modern CSS framework (Tailwind)
- [ ] **Fix angular-ui-notification XSS** - Version 0.3.6 vulnerable
  - Find alternative (ngToast, angular-toastr) or upgrade

### Security Vulnerabilities (From pnpm audit)
- [ ] **Fix high: angular super-linear runtime** - ReDoS via backtracking
  - Package: angular 1.3.15 (all 1.x vulnerable)
  - CVE: GHSA-4w4v-5hc9-xrr2
- [ ] **Fix moderate: angular XSS** - Cross-Site Scripting vulnerabilities
  - Via `$resource`, `angular.copy()`, `<input type="url">`
  - Multiple CVEs
- [ ] **Fix moderate: Bootstrap XSS** - Popover, Tooltip, data-* attributes
  - Package: bootstrap 3.3.5 (upgrade to 4.x+)
- [ ] **Fix moderate: angular-ui-notification XSS** - Version 0.3.6
  - Find alternative (ngToast, angular-toastr)
- [ ] **Fix low: AngularJS SVG sanitization** - Improper SVG handling
- [ ] **Fix low: Image source restrictions bypass** - Multiple bypass vectors

### Duplicate Content (Maintenance Burden)
- [ ] **Consolidate templates** - Remove duplication between:
  - `apps/main-app/templates/` and `packages/templates/`
  - Keep in `packages/templates/`, update Vite alias `@templates`
- [ ] **Remove legacy minified files** from source (should be in `dist/`)
  - `apps/main-app/newsportal/app.min.js`, `styles.min.css`
  - `apps/main-app/mobile/`, `m.ringid.com/` minified files

---

## P1 - High Priority

### CI/CD Setup
- [ ] **Set up GitHub Actions workflow**
  - Create `.github/workflows/ci.yml`
  - Jobs: install (pnpm), lint, test, build, security audit
- [ ] **Configure branch protection** on `main`
  - Require PR reviews
  - Require CI checks to pass
- [ ] **Add deployment pipeline**
  - Build → Upload to CDN/S3/static server
  - Staging and production environments

### Code Quality
- [ ] **Install pre-commit hooks** (Husky + lint-staged)
  ```bash
  pnpm add -D husky lint-staged
  ```
  - Run ESLint + Prettier on staged files
- [ ] **Expand ESLint configuration**
  - Add `eslint-plugin-angular`
  - Enable more rules, update to `ecmaVersion: 2020`
  - Remove conflicting `.eslintrc.json` if exists
- [ ] **Align EditorConfig with Prettier**
  - Both should use 2 spaces for JS files
- [ ] **Remove legacy linter configs**
  - Delete `.jshintrc`, `.bowerrc`, `.tern-project`

### Testing Infrastructure
- [ ] **Expand test coverage** (currently only 1 test file)
  - Create tests for: auth, chat, feed, notification modules
  - Target: 60%+ coverage
- [ ] **Fix Karma configuration**
  - Include all app directories (newsportal, mobile, etc.)
  - Ensure ChromeHeadless works in CI
- [ ] **Add E2E tests** (Playwright or Cypress)
  - Puppeteer is installed but not configured
- [ ] **Add test coverage tool** (karma-coverage or vite-plugin-istanbul)

### Cleanup
- [ ] **Remove legacy backup files**
  - `*_old*.html`, `*_backup*.html`, `*_old*.css`, `*_old*.js`
  - Examples: `index-dashboard-headbar_backup_1_2_2016.html`
- [ ] **Fix package.json files**
  - Add `main`/`exports` fields to packages
  - Remove `"setup": "grunt build"` from apps

---

## P2 - Medium Priority

### Documentation
- [ ] **Update README.md**
  - Fix Node.js version (≥18, not ≥4)
  - Document pnpm commands (not npm)
  - Update migration notes
- [ ] **Create CONTRIBUTING.md**
  - Branch naming, commit conventions, PR template
- [ ] **Create CHANGELOG.md**
  - Document changes from v0.1.0 to v0.2.0
- [ ] **Create ARCHITECTURE.md**
  - Explain AngularJS module structure
  - Document shared services, WebSocket protocol
- [ ] **Update MIGRATION.md**
  - Reflect actual monorepo structure (not `content/` → `src/`)
  - Archive obsolete migration script

### Environment Configuration
- [ ] **Create `.env.example`**
  ```
  VITE_API_URL=http://localhost:3000
  VITE_WS_URL=ws://localhost:3000
  VITE_DEBUG=false
  ```
- [ ] **Add environment modes** to Vite
  - `.env.development`, `.env.staging`, `.env.production`
  - Use `mode` parameter: `vite build --mode staging`
- [ ] **Move debug flags** from `developer.config.js`
  - Use `import.meta.env.VITE_DEBUG_*` instead of hardcoded values

### Modernization (Pre-Migration)
- [ ] **Refactor to AngularJS components**
  - Use `.component()` method (available in 1.5+)
  - Eases future migration to Angular/React
- [ ] **Enable modern JS features**
  - Arrow functions, template literals, destructuring
  - Update ESLint `ecmaVersion` to 2020
- [ ] **Add CSS preprocessing** (Sass/PostCSS)
  - Vite has built-in Sass support
  - Migrate from 50+ plain CSS files
- [ ] **Optimize images**
  - Add `vite-plugin-imagemin`
  - Compress images in `apps/main-app/images/`

### Build Improvements
- [ ] **Expand Vite configuration**
  - Add template cache plugin for AngularJS
  - Configure bundle analyzer (`rollup-plugin-visualizer`)
  - Fix HMR for AngularJS (replace `require.context` with dynamic imports)
- [ ] **Add build validation**
  - Check `dist/` contains expected files
  - Smoke test with local HTTP server

---

## P3 - Low Priority

### Code Quality
- [ ] **Consider TypeScript gradual adoption**
  - Add `allowJs: true` initially
  - Rename files to `.ts` gradually
- [ ] **Add JSDoc documentation**
  - Document functions, services, factories
  - Set up documentation generation (jsdoc)

### Nice-to-Have
- [ ] **Create Docker configuration**
  - `Dockerfile` for production (multi-stage build)
  - `docker-compose.yml` for local development
- [ ] **Add state management** (for future framework migration)
  - Consider `angular-redux` for current setup
- [ ] **Set up bundle size monitoring**
  - Track JS/CSS bundle sizes over time
  - Alert on significant increases

---

## P0 - AngularJS Specific Issues (From Code Analysis)

### Module Architecture
- [ ] **Fix module registration pattern**
  - Current: `try { module('ringid.feed') } catch { module('ringid.feed', [...]) }`
  - Better: Check if module exists before registering
  - Affects: `feed`, `profile`, `newsportal` modules
- [ ] **Consolidate sub-modules**
  - `ringid.feed` registered in 30+ files with try/catch
  - `ringid.profile` registered in multiple directive files
  - Create a single module definition file for each sub-module
- [ ] **Remove circular dependencies**
  - `lazyload.config.js` references `js/build/modules/` (non-existent paths)
  - Digits SDK loaded from CDN but also configured in lazyload

### Template References
- [ ] **Update template URLs to use `@templates` alias**
  - Current: `templateUrl: 'templates/home/feed.html'`
  - Should be: `templateUrl: '@templates/home/feed.html'`
  - Affects 100+ template references in JS files
- [ ] **Fix hardcoded `pages/` paths**
  - Some templates use `pages/index.html`, `pages/profile/profile.html`
  - Should consolidate to `@templates/` structure
- [ ] **Template cache not properly populated**
  - `template-loader.js` created but not integrated with AngularJS `$templateCache`
  - Need to call `loadTemplates()` during app bootstrap

### Real-time Communication (WebSocket)
- [ ] **Modernize WebSocket handling**
  - Current: Custom binary protocol in `worker/`
  - Consider: Socket.io client (already in node_modules/.ignored)
  - Document WebSocket message types (OPERATION_TYPES)
- [ ] **Fix worker files**
  - `worker.js` has syntax errors (fixed `ipip` typo, but may have more)
  - `wat.fall.js` and `sender.js` use legacy patterns
  - Consider migrating to modern Web Worker API
- [ ] **WebSocket dependency in `packages/scripts/`**
  - `chatwindow.js` (2279 lines) contains WebSocket logic
  - Should be in a dedicated service/factory

### Feed System
- [ ] **Refactor feed controllers**
  - 15+ feed controllers in `app/feed/controllers/`
  - Many are near-identical (share, edit, tag, who-share)
  - Consolidate into a single feed controller with parameters
- [ ] **Fix feed directive registration**
  - Directives register `angular.module('ringid.feed')` repeatedly
  - Should import the module once and add directives
- [ ] **Remove commented lazy-load code**
  - `app.routes.js` has 50+ lines of commented `$ocLazyLoad` code
  - Either implement lazy loading properly or remove comments

### Authentication & User Management
- [ ] **Consolidate auth modules**
  - Auth logic scattered: `app/auth/`, `app/global/`, `app/friend/`
  - Create unified auth service
- [ ] **Fix social login flow**
  - Digits SDK loaded from CDN (deprecated)
  - `digit.service.js` and `rg-verify-phone.directive.js` need update
- [ ] **Remove hardcoded debug flags**
  - `developer.config.js` has `ALL_CHAT = true/false`
  - Move to environment variables

### Code Quality (AngularJS-Specific)
- [ ] **Remove global variable pollution**
  - Files use `var app;` then `app = angular.module(...)`
  - Should use IIFE or strict mode consistently
- [ ] **Fix AngularJS injection**
  - Some files use implicit injection instead of `$inject`
  - Affects minification (though Vite handles this now)
- [ ] **Remove jQuery dependency**
  - ESLint shows `$` as undefined (jQuery usage)
  - Migrate to AngularJS `angular.element` or native DOM

---

## Quick Wins (Completed ✓)

1. ✓ **Delete legacy files**: `.bowerrc`, `.jshintrc`, `.tern-project`
2. **Fix `.npmrc`**: Add comments about pnpm settings (partially done)
3. ✓ **Align EditorConfig/Prettier**: Both use 2 spaces for JS
4. **Add npm scripts**: `prepare` for Husky, `audit` for security
5. ✓ **Update README**: Fix Node version, document pnpm commands
6. ✓ **Consolidate templates**: Deleted `apps/main-app/templates/`
7. ✓ **Create `.env.example`**: Basic Vite environment variables
8. ✓ **Set up GitHub Actions CI/CD**: Created `.github/workflows/ci.yml`

---

## Migration Strategy (Long-term)

### AngularJS → Modern Framework
1. **Research phase** (1-2 weeks)
   - Evaluate: Angular (2+), React, Vue
   - Consider team expertise, ecosystem, migration tools
2. **Prototype phase** (2-4 weeks)
   - Create small app in chosen framework
   - Identify migration patterns
3. **Incremental migration** (3-6 months)
   - Use micro-frontends or iframes to run both versions
   - Migrate module-by-module
4. **Deprecation** (1 month)
   - Sunset AngularJS version
   - Redirect to new app

**Recommendation**: Angular (if staying Google ecosystem) or React (larger ecosystem, easier hiring)

---

## Progress Tracking

- [x] Migrate Bower → npm
- [x] Migrate Grunt → Vite
- [x] Add ESLint + Prettier
- [x] Migrate npm → pnpm
- [x] Create `pnpm-workspace.yaml`
- [x] Flatten nested package directories
- [x] Add `package.json` to all workspace packages
- [x] Update `.nvmrc` (Node 18)
- [x] Set up CI/CD (GitHub Actions)
- [x] Fix `.npmrc` (added comments)
- [x] Consolidate templates into `packages/templates/`
- [ ] Configure pre-commit hooks
- [ ] Expand test coverage
- [ ] Fix security vulnerabilities (AngularJS 1.x)
- [ ] Create documentation (CONTRIBUTING, ARCHITECTURE)
- [ ] Plan AngularJS migration strategy
- [ ] Fix template URLs to use `@templates` alias
- [ ] Modernize WebSocket handling
- [ ] Refactor feed controllers (consolidate 15+ controllers)

---

*Last updated: 2026-05-01*
