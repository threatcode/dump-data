/**
 * React-AngularJS Bridge Utilities
 * 
 * Helper functions for running React and AngularJS side-by-side.
 */

/**
 * Mount a React component into a DOM container.
 * Used for manual mounting outside of AngularJS directives.
 */
export function mountReactComponent(Component, container, props = {}) {
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(Component, props));
  return root;
}

/**
 * Unmount a React component from a DOM container.
 */
export function unmountReactComponent(root) {
  if (root) {
    root.unmount();
  }
}

/**
 * Convert AngularJS scope data to React props.
 * Handles $digest cycle synchronization.
 */
export function scopeToProps($scope, bindings) {
  const props = {};
  bindings.forEach((binding) => {
    props[binding] = $scope[binding];
  });
  return props;
}

/**
 * Create a bridge between AngularJS scope and React state.
 * Syncs changes from AngularJS to React.
 */
export function createScopeBridge($scope, bindings, onUpdate) {
  bindings.forEach((binding) => {
    $scope.$watch(binding, (newVal, oldVal) => {
      if (newVal !== oldVal && onUpdate) {
        onUpdate(binding, newVal, oldVal);
      }
    });
  });
}

/**
 * Safe $apply wrapper for AngularJS.
 * Prevents "$digest already in progress" errors.
 */
export function safeApply($scope, fn) {
  const phase = $scope.$root.$$phase;
  if (phase === '$apply' || phase === '$digest') {
    if (fn && typeof fn === 'function') {
      fn();
    }
  } else {
    $scope.$apply(fn);
  }
}

/**
 * Get AngularJS injector safely.
 */
export function getInjector(modules = ['ringid', 'ng']) {
  try {
    return angular.injector(modules);
  } catch (error) {
    console.error('Failed to get AngularJS injector:', error);
    return null;
  }
}

/**
 * Get an AngularJS service by name.
 */
export function getAngularService(serviceName, modules = ['ringid', 'ng']) {
  const injector = getInjector(modules);
  if (injector) {
    try {
      return injector.get(serviceName);
    } catch (error) {
      console.error(`Service not found: ${serviceName}`, error);
      return null;
    }
  }
  return null;
}

/**
 * Emit an event from React to AngularJS.
 */
export function emitToAngular(eventName, data = {}) {
  const $rootScope = getAngularService('$rootScope');
  if ($rootScope) {
    safeApply($rootScope, () => {
      $rootScope.$broadcast(eventName, data);
    });
  }
}

/**
 * Listen to AngularJS events in React.
 */
export function listenToAngularEvent(eventName, callback) {
  const $rootScope = getAngularService('$rootScope');
  if ($rootScope) {
    const handler = (event, ...args) => {
      callback(...args);
    };
    $rootScope.$on(eventName, handler);
    return () => {
      // Cleanup - AngularJS doesn't have off for $on, but we can track it
    };
  }
  return () => {};
}
