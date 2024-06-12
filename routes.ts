/** 
 *  Array of public routes.
 *  These routes do not require authentication.
 * @type {string[]}
*/
export const publicRoutes = [
  '/',
  '/auth/new-verification'
];

/** 
 * Array of routes for user authentication.
 * These routes will redirect logged in users to '/settings'.
 * @type {string[]}
*/
export const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/auth/reset',
]

/** 
 * Prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes.
 * @type {string}
*/
export const apiAuthPrefix = '/api/auth';

/**
 * Default redirect path for logged in.
 * @type {string} 
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings';