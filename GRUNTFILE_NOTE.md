# Grunt Build Tooling

This project originally used Grunt for building and local development.

## Original commands (from content/README.md)
- `grunt local` - Run local development server
- `grunt build` - Build for production

## Setup
The project requires:
- Node.js >= 4
- Bower (`npm install -g bower`)
- Grunt CLI (`npm install -g grunt-cli`)

## Missing files
The original `Gruntfile.js` was not included in the repository dump. To restore building:

1. Recreate `Gruntfile.js` based on the original project configuration
2. Ensure `bower.json` dependencies are installed: `bower install`
3. Check `config/` for server configuration that may reference build paths

## Current state
- `bower.json` has been moved to root level
- `package.json` has been updated with grunt scripts (non-functional without Gruntfile.js)
- `dist/js/` and `dist/css/` contain the last build artifacts
- `dist/scripts/dist/` contains app build output

## Next steps
If restoring the build system:
1. Create `Gruntfile.js` with appropriate tasks
2. Verify `dist/` output matches expected structure
3. Update `package.json` scripts to point to root-level grunt tasks
