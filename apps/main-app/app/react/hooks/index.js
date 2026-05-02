import { useState, useEffect, useCallback } from 'react';

/**
 * useAngularService Hook
 * 
 * Bridges AngularJS services to React components.
 * Allows React components to access AngularJS dependency injection.
 */
export function useAngularService(serviceName) {
  const [service, setService] = useState(null);

  useEffect(() => {
    const injector = angular.injector(['ringid', 'ng']);
    try {
      const svc = injector.get(serviceName);
      setService(svc);
    } catch (error) {
      console.error(`Failed to get AngularJS service: ${serviceName}`, error);
    }
  }, [serviceName]);

  return service;
}

/**
 * useAuth Hook
 * 
 * Provides authentication state from AngularJS Auth service.
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const Auth = useAngularService('Auth');

  useEffect(() => {
    if (!Auth) return;

    const checkAuth = () => {
      if (Auth.isLoggedIn()) {
        const userFactory = angular.injector(['ringid', 'ng']).get('userFactory');
        const currentUser = userFactory.getCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, [Auth]);

  const logout = useCallback(() => {
    if (Auth) {
      Auth.logout();
      setUser(null);
    }
  }, [Auth]);

  return { user, loading, logout, isAuthenticated: !!user };
}

/**
 * useWebSocket Hook
 * 
 * Provides WebSocket connectivity via AngularJS $$connector service.
 */
export function useWebSocket(actionNumber, callback) {
  const connector = useAngularService('$$connector');

  useEffect(() => {
    if (!connector || !actionNumber) return;

    const subscriptionKey = connector.subscribe(
      (message) => {
        if (message.actn === actionNumber) {
          callback(message);
        }
      },
      { action: actionNumber }
    );

    return () => {
      if (subscriptionKey) {
        connector.unsubscribe(subscriptionKey);
      }
    };
  }, [connector, actionNumber, callback]);

  const send = useCallback(
    (data, requestType) => {
      if (connector) {
        connector.request(data, requestType);
      }
    },
    [connector]
  );

  return { send };
}

/**
 * useStorage Hook
 * 
 * Provides access to ngStorage service for persistent storage.
 */
export function useStorage(storageType = '$localStorage') {
  const storage = useAngularService(storageType);

  const get = useCallback(
    (key) => {
      if (storage && storage[key]) {
        return storage[key];
      }
      return null;
    },
    [storage]
  );

  const set = useCallback(
    (key, value) => {
      if (storage) {
        storage[key] = value;
      }
    },
    [storage]
  );

  const remove = useCallback(
    (key) => {
      if (storage && storage[key]) {
        delete storage[key];
      }
    },
    [storage]
  );

  return { get, set, remove, storage };
}

/**
 * useApi Hook
 * 
 * Provides API service access from AngularJS.
 */
export function useApi() {
  const Api = useAngularService('Api');

  const call = useCallback(
    async (endpoint, params = {}) => {
      if (!Api || !Api[endpoint]) {
        throw new Error(`API endpoint not found: ${endpoint}`);
      }
      return Api[endpoint](params);
    },
    [Api]
  );

  return { call, api: Api };
}
