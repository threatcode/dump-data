# dump-data

Legacy Ringid web frontend — migrated to a cleaner `src/` + `dist/` layout.

## Project structure

- `config/` — server-side rewrite, gzip, cache and virtual-host configuration files
- `src/` — active application source (app, pages, styles, scripts, images, templates, apidocfiles)
- `dist/` — generated build assets, downloads, and scripts/dist output
- `tests/` — test files, karma config, and test media
- `legacy/` — archived backup and deprecated files pending cleanup
- `content/` — original dump location; nearly emptied after migration

## How to run (original instructions)

1. Clone the repository
2. Ensure Node.js ≥ 4 is installed
3. Run `npm install` (or `npm run setup`)
4. Run `grunt local` from the `content/` directory (or `npm start` for convenience)
5. Browse http://localhost:8080/#/

> **Note:** The original project used `grunt` and `bower`. The `content/` directory may still be needed for development until tooling is moved to root level.

## Migration status

The `npm run migrate` script has moved:
- Source directories → `src/`
- Build artifacts → `dist/`
- Test files → `tests/`
- API docs → `src/apidocfiles/`
- Legacy/backup files → `legacy/`
- Downloadable binaries → `dist/downloads/`
- Static files (robots.txt, sitemap.xml) → repository root

For full details, see `MIGRATION.md`.

## Remaining action items

- Move or consolidate remaining `content/.gitignore` and `content/README.md`
- Standardize build tooling at root level (`Gruntfile.js`, `bower.json` already moved)
- Review `legacy/` and remove obsolete files once confirmed unused
- Consider removing `content/` entirely once the migration is fully verified
