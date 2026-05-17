'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth(requiredRole = null) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (requiredRole && session?.user?.role && session.user.role !== requiredRole) {
      router.push(`/${session.user.role}`);
    }
  }, [status, session, requiredRole, router]);

  return { session, status, user: session?.user };
}

export function useRequireRole(role) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    if (session.user.role !== role) {
      router.push(`/${session.user.role}`);
    }
  }, [session, status, role, router]);

  return { session, user: session?.user, isLoading: status === 'loading' };
}
