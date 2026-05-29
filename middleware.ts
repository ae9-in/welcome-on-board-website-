// middleware.ts — protects ALL routes, redirects to /login if not authenticated
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public paths that do NOT require login
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api/auth',          // NextAuth internal endpoints
];

// Role-based route restrictions
const ROUTE_ROLE_MAP: { pattern: RegExp; roles: string[] }[] = [
  { pattern: /^\/admin(\/.*)?$/,       roles: ['admin'] },
  { pattern: /^\/student(\/.*)?$/,     roles: ['student'] },
  { pattern: /^\/pronouncer(\/.*)?$/,  roles: ['pronouncer', 'judge', 'admin'] },
];

// API role restrictions
const API_PERMISSION_MAP: { pattern: RegExp; roles: string[] }[] = [
  { pattern: /^\/api\/admin\//,        roles: ['admin'] },
  { pattern: /^\/api\/student\//,      roles: ['student'] },
  { pattern: /^\/api\/pronouncer\//,   roles: ['pronouncer', 'judge', 'admin'] },
];

export default withAuth(
  function middleware(req: NextRequest & { nextauth: { token: any } }) {
    const { token } = req.nextauth;
    const path = req.nextUrl.pathname;

    // Allow public paths through
    const isPublic = PUBLIC_PATHS.some((p) => path.startsWith(p));
    if (isPublic) return NextResponse.next();

    // No token → redirect to login
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }

    // Suspended account
    if (token.isActive === false) {
      return NextResponse.redirect(new URL('/login?error=AccountSuspended', req.url));
    }

    // Role-based route protection
    for (const { pattern, roles } of ROUTE_ROLE_MAP) {
      if (pattern.test(path)) {
        if (!roles.includes(token.role)) {
          const correctPortal =
            token.role === 'admin'   ? '/admin/dashboard'
            : token.role === 'student' ? '/student/dashboard'
            : '/pronouncer/dashboard';
          return NextResponse.redirect(new URL(correctPortal, req.url));
        }
        break;
      }
    }

    // API role protection
    for (const { pattern, roles } of API_PERMISSION_MAP) {
      if (pattern.test(path)) {
        if (!roles.includes(token.role)) {
          return NextResponse.json(
            { error: 'Forbidden', yourRole: token.role, requiredOneOf: roles },
            { status: 403 }
          );
        }
        break;
      }
    }

    // Student must complete profile before accessing student routes
    if (
      token.role === 'student' &&
      !token.studentProfile &&
      path.startsWith('/student') &&
      !path.includes('/profile/setup')
    ) {
      return NextResponse.redirect(new URL('/student/profile/setup', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Always run middleware — let the function above decide
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match ALL routes EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico, favicon.svg
     * - public assets (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|public/|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf)).*)',
  ],
};
