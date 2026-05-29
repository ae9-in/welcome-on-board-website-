// lib/rbac.ts
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { connectDB } from './mongodb';
import { User } from '@/models/User';
import type { Permission } from '@/models/Role';

export class RBACError extends Error {
  constructor(public permission: Permission, public role: string) {
    super(`Role '${role}' lacks permission: '${permission}'`);
    this.name = 'RBACError';
  }
}

// ─── Server-side permission check (use in API routes & Server Components) ───
export async function requirePermission(permission: Permission): Promise<void> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) throw new RBACError(permission, 'unauthenticated');
  await connectDB();
  const user = await User.findById(userId).select('role customPermissions revokedPermissions isActive');
  if (!user || !user.isActive) throw new RBACError(permission, 'inactive');
  const perms = await user.getEffectivePermissions();
  if (!perms.includes(permission)) throw new RBACError(permission, user.role);
}

// ─── Check without throwing (for conditional UI) ─────────────────────────
export async function hasPermission(permission: Permission): Promise<boolean> {
  try {
    await requirePermission(permission);
    return true;
  } catch {
    return false;
  }
}

// ─── Check multiple permissions (ALL must pass) ───────────────────────────
export async function requireAllPermissions(permissions: Permission[]): Promise<void> {
  await Promise.all(permissions.map(requirePermission));
}

// ─── Check multiple permissions (ANY must pass) ───────────────────────────
export async function requireAnyPermission(permissions: Permission[]): Promise<void> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) throw new RBACError(permissions[0], 'unauthenticated');
  await connectDB();
  const user = await User.findById(userId).select('role customPermissions revokedPermissions isActive');
  if (!user || !user.isActive) throw new RBACError(permissions[0], 'inactive');
  const perms = await user.getEffectivePermissions();
  const hasAny = permissions.some(p => perms.includes(p));
  if (!hasAny) throw new RBACError(permissions[0], user.role);
}

// ─── HOF: Wrap API handler with permission guard ──────────────────────────
export function withPermission(
  permission: Permission,
  handler: (req: any, ctx: any) => Promise<Response>
) {
  return async (req: any, ctx: any) => {
    try {
      await requirePermission(permission);
      return handler(req, ctx);
    } catch (err) {
      if (err instanceof RBACError) {
        return Response.json(
          { error: 'Forbidden', required: err.permission, role: err.role },
          { status: 403 }
        );
      }
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
  };
}

// ─── Role redirect map: where each role goes after login ─────────────────
export const ROLE_REDIRECT: Record<string, string> = {
  admin:      '/admin/dashboard',
  student:    '/student/dashboard',
  pronouncer: '/pronouncer/dashboard',
  judge:      '/pronouncer/dashboard',  // judges share pronouncer shell
};

// ─── Portal label map ────────────────────────────────────────────────────
export const ROLE_PORTAL_LABEL: Record<string, string> = {
  admin:      'Admin Portal',
  student:    'Student Portal',
  pronouncer: 'Pronouncer Console',
  judge:      'Judge Console',
};
