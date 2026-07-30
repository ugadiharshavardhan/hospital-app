import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { connectDB } from './db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Always wrap in try/catch — any uncaught throw becomes error=Configuration
        try {
          await connectDB();

          const user = await User.findOne({
            email: String(credentials.email).toLowerCase().trim(),
          }).select('+password');

          if (!user) return null;
          if (!user.isActive) return null;

          const isValid = await bcrypt.compare(
            String(credentials.password),
            user.password
          );
          if (!isValid) return null;

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.avatar || null,
          };
        } catch (err) {
          // Log the real error server-side; return null so NextAuth shows
          // "CredentialsSignin" (wrong password) instead of "Configuration"
          console.error('[Auth] authorize error:', err?.message || err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
      }
      if (trigger === 'update' && session) {
        if (session.name) token.name = session.name;
        if (session.user?.name) token.name = session.user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        if (token.name) session.user.name = token.name;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: { strategy: 'jwt' },

  // NextAuth v5: accepts AUTH_SECRET (preferred) or NEXTAUTH_SECRET (legacy)
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,

  // Required for production deployments behind proxies / Vercel / Railway etc.
  trustHost: true,
});
