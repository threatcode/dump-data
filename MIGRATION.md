# Migration Guidance

This file describes a safe refactor path from the current `content/` layout to a cleaner `src/` + `dist/` repository structure.

## Current state

- `content/` contains application source, static HTML pages, generated assets, and legacy files mixed together.
- `config/` contains server configuration.
- There is no root-level source tree for active frontend code.

## Goal state

- `src/` contains all active application source files.
- `dist/` contains generated production assets.
- `legacy/` holds archived or deprecated content pending cleanup.
- `content/` can be removed or kept as a migration fallback until the transition is complete.

## Recommended structure

```text
/README.md
/package.json
/.gitignore
/bower.json
/config/
/src/
  /app/
  /pages/
  /styles/
  /scripts/
  /images/
  /templates/
  /apidocfiles/
/legacy/
/dist/
  /downloads/
  /scripts/dist/
/tests/
  /testmedia/
```

## Safe migration steps

1. Inventory current application source under `content/`.
   - `content/app/`, `content/styles/`, `content/templates/`, `content/images/`, `content/fonts/`
   - `content/js/`, `content/css/`
   - `content/pages/`, `content/error/`, `content/mobile/`, `content/newsportal/`, `content/player/`, `content/webapp/`
   - `content/chatwindow.js`, `content/utils_script.js`
   - `content/*.html`, `content/*.xhtml`

2. Create the new `src/` tree and move active source files there.
   - Move only active source files first; leave legacy content in `content/`.
   - Update any build or runtime paths before removing the original files.

3. Move generated build artifacts into `dist/`.
   - `content/build/` → `dist/`
   - `content/css/` → `dist/css/`, `content/js/` → `dist/js/`
   - `content/scripts/dist/` → `dist/scripts/dist/`
   - hashed bundles and minified assets from `content/`

4. Move top-level HTML and XHTML pages and shared scripts into `src/`.
   - Root-level `content/*.html` and `content/*.xhtml` pages → `src/pages/`
   - `content/chatwindow.js` → `src/scripts/chatwindow.js`
   - `content/utils_script.js` → `src/scripts/utils_script.js`

5. Move API documentation and test files.
   - `content/apidocfiles/` → `src/apidocfiles/`
   - `content/apidoc.json` → `src/apidocfiles/apidoc.json`
   - `content/tests/` → `tests/`
   - `content/karma.conf.js` → `tests/karma.conf.js`
   - `content/testmedia/` → `tests/testmedia/`

6. Move downloadable binaries and archives.
   - `content/ringID*.exe`, `content/ringID*.zip` → `dist/downloads/`

7. Move root-level static files.
   - `content/robots.txt` → `robots.txt`
   - `content/sitemap.xml` → `sitemap.xml`

8. Archive backup/legacy files.
   - `content/*.backup`, `content/*_old*.html`, `content/index_old_file_important.html`
   - `content/privacy_old_important.html` → `legacy/`
   - `content/ringidUpdate.txt` → `legacy/`

9. Use the provided script
   - Run `npm run migrate` from the repository root
   - This moves safe source directories into `src/`, generated assets into `dist/`, test files into `tests/`, and archives legacy files into `legacy/`

10. Update repository tooling.
    - `content/bower.json` → `bower.json` (root level)
    - Merge `content/.gitignore` entries into root `.gitignore`
    - Merge `content/README.md` into root `README.md`
    - Modify any server or deployment references to point to `src/` and `dist/`.

11. Validate the refactor.
    - Run the application and confirm builds still work.
    - Remove `content/index.html` if it is just a redirect duplicate.
    - Keep `content/` as fallback until the migration is fully verified.

## Notes

- Do not delete files until the new structure is confirmed working.
- Use the `legacy/` folder for any content that is preserved for later review.
