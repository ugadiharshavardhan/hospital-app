'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

export function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: 'inherit' },
          duration: 4000,
        }}
        richColors
      />
    </SessionProvider>
  );
}
