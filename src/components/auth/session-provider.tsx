'use client';
import { createContext, useContext } from 'react';
import { authClient } from '@/lib/auth-client';

type SessionState = ReturnType<typeof authClient.useSession>;
const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const session = authClient.useSession();
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useSession must be used within SessionProvider.');
  return session;
}

