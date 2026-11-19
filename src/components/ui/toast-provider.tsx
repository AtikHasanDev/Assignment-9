'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

type Notice = { id: number; message: string; kind: 'success' | 'error' };
const ToastContext = createContext<(message: string, kind?: Notice['kind']) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [notice, setNotice] = useState<Notice | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notify = useCallback((message: string, kind: Notice['kind'] = 'success') => {
    if (timer.current) clearTimeout(timer.current);
    setNotice({ id: Date.now(), message, kind });
    timer.current = setTimeout(() => setNotice(null), 6000);
  }, []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return <ToastContext.Provider value={notify}>{children}<div className="toast-region" aria-live="polite" aria-atomic="true">{notice && <div key={notice.id} className={'toast toast--' + notice.kind}><span>{notice.message}</span><button type="button" aria-label="Dismiss notification" onClick={() => setNotice(null)}>×</button></div>}</div></ToastContext.Provider>;
}
export const useToast = () => useContext(ToastContext);
