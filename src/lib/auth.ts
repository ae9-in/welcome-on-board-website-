// lib/auth.ts
import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { connectDB } from './mongodb';
import { User } from '@/models/User';
import { ROLE_REDIRECT } from './rbac';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },   // 24h sessions
  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/student/profile/setup',
  },

  providers: [
    // ─── Credentials (email + password) ──────────────────────────────────
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }
        await connectDB();

        // Fetch user WITH passwordHash (normally excluded)
        const user = await User.findOne({ email: credentials.email.toLowerCase() })
          .select('+passwordHash +loginAttempts +lockUntil');

        if (!user) throw new Error('No account found with this email');
        if (!user.isActive) throw new Error('Account suspended. Contact admin.');

        // Brute-force protection: lock after 5 failed attempts
        if (user.isLocked()) {
          const minutesLeft = Math.ceil((user.lockUntil!.getTime() - Date.now()) / 60000);
          throw new Error(`Account locked. Try again in ${minutesLeft} minutes.`);
        }

        const valid = await user.comparePassword(credentials.password);
        if (!valid) {
          user.loginAttempts += 1;
          if (user.loginAttempts >= 5) {
            user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30min lock
          }
          await user.save();
          const remaining = 5 - user.loginAttempts;
          throw new Error(remaining > 0
            ? `Incorrect password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`
            : 'Account locked for 30 minutes due to too many failed attempts.'
          );
        }

        // Success — reset attempts, record login
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        user.lastLogin = new Date();
        await user.save();

        const effectivePerms = await user.getEffectivePermissions();

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: effectivePerms,
          avatar: user.avatar,
          studentProfile: user.studentProfile?.toString(),
          redirectTo: ROLE_REDIRECT[user.role],
        };
      },
    }),

    // ─── Google OAuth (students only) ────────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
      authorization: {
        params: { prompt: 'select_account' }
      },
    }),
  ],

  callbacks: {
    // ─── signIn: block Google login for non-students ──────────────────────
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await connectDB();
        const existing = await User.findOne({ email: user.email });
        if (existing && existing.role !== 'student') {
          // Admins/judges must use credentials — not Google
          return '/login?error=AdminsMustUseCredentials';
        }
      }
      return true;
    },

    // ─── JWT: embed role + permissions into token ─────────────────────────
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        // First login — user object from authorize()
        token.id = user.id;
        token.role = (user as any).role;
        token.permissions = (user as any).permissions ?? [];
        token.avatar = (user as any).avatar;
        token.studentProfile = (user as any).studentProfile;
        token.redirectTo = (user as any).redirectTo;
      }

      if (account?.provider === 'google' && token.email) {
        // Google OAuth flow — upsert user, assign student role
        await connectDB();
        let dbUser = await User.findOne({ email: token.email });
        if (!dbUser) {
          dbUser = await User.create({
            name: token.name,
            email: token.email,
            googleId: account.providerAccountId,
            role: 'student',
            isEmailVerified: true,
            avatar: token.picture,
          });
        } else if (!dbUser.googleId) {
          dbUser.googleId = account.providerAccountId;
          await dbUser.save();
        }
        token.id = dbUser._id.toString();
        token.role = dbUser.role;
        token.permissions = await dbUser.getEffectivePermissions();
        token.studentProfile = dbUser.studentProfile?.toString();
        token.redirectTo = ROLE_REDIRECT[dbUser.role];
      }

      // Token refresh when session is updated
      if (trigger === 'update' && session?.role) {
        token.role = session.role;
        token.permissions = session.permissions;
      }

      return token;
    },

    // ─── Session: expose token data to client ─────────────────────────────
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).permissions = token.permissions as string[];
        (session.user as any).avatar = token.avatar as string;
        (session.user as any).studentProfile = token.studentProfile as string;
        (session.user as any).redirectTo = token.redirectTo as string;
      }
      return session;
    },
  },

  events: {
    async signOut({ token }) {
      // Log logout for audit trail
      if (token?.id) {
        await connectDB();
        await User.findByIdAndUpdate(token.id, { lastLogin: new Date() });
      }
    },
  },
};
