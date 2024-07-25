import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "@/routes";

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  //  Allow navigate in '/api/auth/providers' routes
  if (isApiAuthRoute) { return null; }

  //  Allow navigate in public routes ['/auth/login', '/auth/register']. If already logged in redirect to "/settings"
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  // If not logged in neither in a public route -> redirect to login
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;

    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  //  matcher --> define in which routes the middleware will be called
  // This regex apply middleware to every single route, except next static files like next image, landing page etc.
  // The idea is to assume the entire app is protected and allow just specific routes for non-authorized users

  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}