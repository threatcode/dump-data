import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import imagemin from 'vite-plugin-imagemin';
import fs from 'fs';
import path from 'path';

// Custom plugin for AngularJS template cache
function angularTemplateCache(options = {}) {
  const { templateDir = 'packages/templates', prefix = '' } = options;

  return {
    name: 'angular-template-cache',
    transform(code, id) {
      if (id.endsWith('.html') && id.includes(templateDir)) {
        const template = fs.readFileSync(id, 'utf-8');
        const templatePath = path.relative(templateDir, id);
        const moduleId = prefix + templatePath;

        return {
          code: `
            angular.module('ng').run(['$templateCache', function($templateCache) {
              $templateCache.put('${moduleId}', '${template.replace(/'/g, "\\'").replace(/\n/g, '\\n')}');
            }]);
            export default '${moduleId}';
          `,
          map: null
        };
      }
      return null;
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.html') && file.includes(templateDir)) {
        const template = fs.readFileSync(file, 'utf-8');
        const templatePath = path.relative(templateDir, file);
        const moduleId = prefix + templatePath;

        const mod = server.moduleGraph.getModuleById(file);
        if (mod) {
          server.ws.send({
            type: 'custom',
            event: 'angular-template-update',
            data: { moduleId, template }
          });
        }
      }
    }
  };
}

export default defineConfig({
  root: '.',
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    loader: 'jsx',
    include: /src\/react\/.*\.[jt]sx?$/,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: '/index.html'
      },
      output: {
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    plugins: [
      visualizer({
        filename: 'dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true
      })
    ]
  },
  server: {
    port: 8080,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    },
    hmr: {
      overlay: true
    }
  },
  resolve: {
    alias: {
      '@app': '/apps/main-app/app',
      '@packages': '/packages',
      '@templates': '/packages/templates',
      '@react': '/apps/main-app/app/react'
    }
  },
  plugins: [
    angularTemplateCache({
      templateDir: 'packages/templates',
      prefix: ''
    }),
    imagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9] },
      svgo: true
    })
  ],
  optimizeDeps: {
    include: ['angular', 'angular-route', 'angular-animate', 'angular-loader', 'ngstorage', 'react', 'react-dom', 'react2angular']
  }
});
