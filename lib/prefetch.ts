/**
 * Route prefetching utilities for optimized navigation
 *
 * Preloads route chunks when user hovers over navigation links
 */

// Define lazy import functions that match App.tsx
const routeImports = {
  dashboard: () => import('@/features/dashboard/DashboardPage'),
  'james-ia': () => import('@/features/james-ia/JamesIADashboard'),
  inbox: () => import('@/features/inbox/InboxPage'),
  boards: () => import('@/features/boards/BoardsPage'),
  contacts: () => import('@/features/contacts/ContactsPage'),
  settings: () => import('@/features/settings/SettingsPage'),
  activities: () => import('@/features/activities/ActivitiesPage'),
  reports: () => import('@/features/reports/ReportsPage'),
} as const;

export type RouteName = keyof typeof routeImports;

// Cache to avoid duplicate prefetches
const prefetchedRoutes = new Set<RouteName>();

/**
 * Prefetch a route's chunk before navigation
 * @param route - The route name to prefetch
 */
export const prefetchRoute = (route: RouteName): void => {
  if (prefetchedRoutes.has(route)) return;

  prefetchedRoutes.add(route);

  // Use requestIdleCallback for non-blocking prefetch
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      routeImports[route]().catch(() => {
        // Silent fail - will load on actual navigation
        prefetchedRoutes.delete(route);
      });
    });
  } else {
    // Fallback for Safari
    setTimeout(() => {
      routeImports[route]().catch(() => {
        prefetchedRoutes.delete(route);
      });
    }, 100);
  }
};

/**
 * Prefetch multiple routes at once
 * Useful for predictive loading based on user behavior
 */
export const prefetchRoutes = (routes: RouteName[]): void => {
  routes.forEach(prefetchRoute);
};

/**
 * Prefetch all routes after initial page load
 * Use sparingly - only when bandwidth is not a concern
 */
export const prefetchAllRoutes = (): void => {
  // Wait for initial render to complete
  if ('requestIdleCallback' in window) {
    requestIdleCallback(
      () => {
        Object.keys(routeImports).forEach(route => {
          prefetchRoute(route as RouteName);
        });
      },
      { timeout: 5000 }
    );
  }
};

/**
 * Get the route name from a path
 */
export const getRouteFromPath = (path: string): RouteName | null => {
  const segments = path.replace(/^\//, '').split('/').filter(Boolean);
  const first = segments[0] || 'dashboard';
  const second = segments[1];

  // /dashboard/boards -> boards, /dashboard/contatos -> contacts, etc.
  if (first === 'dashboard' && second) {
    if (second === 'boards') return 'boards';
    if (second === 'contatos') return 'contacts';
    if (second === 'james-ia') return 'james-ia';
    if (second === 'leads-crm' || second === 'financeiro') return 'dashboard';
  }

  if (first in routeImports) {
    return first as RouteName;
  }

  // Handle aliases
  if (first === 'pipeline') return 'boards';

  return null;
};

/**
 * Hook-friendly prefetch handler for NavLink hover
 */
export const createPrefetchHandler = (path: string) => {
  return () => {
    const route = getRouteFromPath(path);
    if (route) {
      prefetchRoute(route);
    }
  };
};
