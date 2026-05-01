// Modern template loader for Vite
// This module loads HTML templates and caches them for AngularJS

const templateContext = import.meta.glob('/packages/templates/**/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const templates = {};

for (const [path, content] of Object.entries(templateContext)) {
  // Convert path to template ID
  // e.g., /packages/templates/home/feed.html -> home/feed.html
  const id = path.replace('/packages/templates/', '').replace(/^\//, '');

  templates[id] = content;
}

// Create AngularJS template cache
export default function loadTemplates($templateCache) {
  'ngInject';

  for (const [id, content] of Object.entries(templates)) {
    $templateCache.put(id, content);
  }
}
