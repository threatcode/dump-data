import angularPlugin from 'eslint-plugin-angular';

export default [
  {
    files: ['**/*.js'],
    ignores: ['**/dist/**', '**/node_modules/**', '**/chatwindow.js', '**/utils_script.js', '**/*.module.js', '**/websocket.service.js', '**/ring-socket.service.js', '**/feed-shared.service.js', '**/feed.wrappers.js'],
    plugins: {
      angular: angularPlugin
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-undef': 'error',
      // AngularJS best practices
      'angular/directive-restrict': ['error', { restrict: 'EAC' }],
      'angular/no-service-method': 'error',
      'angular/timeout-service': 'warn',
      'angular/typecheck-array': 'error',
      'angular/typecheck-date': 'error',
      'angular/typecheck-function': 'error',
      'angular/typecheck-number': 'error',
      'angular/typecheck-object': 'error',
      'angular/typecheck-string': 'error',
      'angular/controller-as': 'error',
      'angular/di-order': 'warn'
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
        // Timers
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        // AngularJS
        angular: 'readonly',
        // jQuery (being phased out)
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
        _user: 'readonly',
        // Web Workers
        postMessage: 'readonly',
        importScripts: 'readonly',
        self: 'readonly',
        // WebSocket/Worker specific
        RingParser: 'readonly',
        RingLogger: 'readonly',
        RingWorker: 'readonly',
        RingSocket: 'readonly',
        Logger: 'readonly',
        // Data types
        DataView: 'readonly',
        ArrayBuffer: 'readonly',
        MessageChannel: 'readonly',
        // RingID specific
        object_extend: 'readonly',
        isString: 'readonly',
        isElement: 'readonly',
        getUniqueId: 'readonly',
        noop: 'readonly',
        objectFreeze: 'readonly',
        Digits: 'readonly',
        RingID: 'readonly',
        utils: 'readonly',
        jAlert: 'readonly',
        im_base: 'readonly',
        sticker_base: 'readonly',
        dateformate: 'readonly',
        windowFocus: 'readonly',
        settings: 'readonly',
        connection: 'readonly',
        // WebSocket state
        KeepAliveInterval: 'readonly',
        keepAlivePacket: 'readonly',
        PingPongMap: 'readonly',
        floodingRequest: 'readonly',
        floodingData: 'readonly',
        floodingDataInterval: 'readonly',
        brokenRequest: 'readonly',
        brokenData: 'readonly',
        brokenRequestInterval: 'readonly',
        ProccessRunning: 'readonly',
        chatRequestMap: 'readonly',
        toIgnorePacketIds: 'readonly',
        ATTRIBUTE_CODES: 'readonly',
        responseFalse: 'readonly',
        stopKeepAlive: 'readonly',
        buildPacketAndSend: 'readonly',
        SocketProvider: 'readonly',
        isString: 'readonly',
        isElement: 'readonly',
        i: 'readonly',
        settings: 'readonly',
        connection: 'readonly',
        fastdom: 'readonly',
        keepAlive: 'readonly'
      },
      ecmaVersion: 2020,
      sourceType: 'script'
    }
  },
  {
    files: ['**/*.module.js', 'packages/templates/template-loader.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module'
    }
  }
];
