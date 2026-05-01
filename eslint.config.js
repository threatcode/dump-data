export default [
  {
    files: ['**/*.js'],
    ignores: ['**/dist/**', '**/node_modules/**'],
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-undef': 'error'
    },
    languageOptions: {
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        XMLHttpRequest: 'readonly',
        WebSocket: 'readonly',
        FileReader: 'readonly',
        Blob: 'readonly',
        // AngularJS
        angular: 'readonly',
        // jQuery
        $: 'readonly',
        jQuery: 'readonly',
        // CommonJS/AMD
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        // Underscore/Lodash
        _: 'readonly',
        // Console
        console: 'readonly',
        // App-specific globals
        base_url: 'readonly',
        userIdentity: 'readonly',
        OPERATION_TYPES: 'readonly',
        AC: 'readonly',
        _user: 'readonly'
      },
      ecmaVersion: 5,
      sourceType: 'script'
    }
  },
  {
    files: ['packages/templates/template-loader.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module'
    }
  }
];
