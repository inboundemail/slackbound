import { eventHandler, getRouterParam } from 'h3';

/**
 * Catchall placeholder for /api/auth/* routes
 * These routes are handled by the Next.js app (Better Auth)
 * This is just a placeholder in case requests accidentally hit the Nitro server
 */
export default eventHandler(async (event) => {
  const path = getRouterParam(event, 'path') || '';
  
  return {
    message: 'Auth routes are handled by the Next.js app',
    path: `/api/auth/${path}`,
    note: 'If you are seeing this, requests may be misconfigured',
  };
});

