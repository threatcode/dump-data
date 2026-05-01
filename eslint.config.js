export default [
  {
    files: ['**/*.js'],
    rules: {
      'no-unused-vars': 'warn',
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
        console: 'readonly'
      },
      ecmaVersion: 5,
      sourceType: 'script'
    }
  }
];
