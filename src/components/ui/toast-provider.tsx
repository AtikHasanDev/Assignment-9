'use client';
import { createContext, useContext } from 'react';
import { Toaster, toast } from 'sonner';

type NoticeKind = 'success' | 'error';
const notify = (message: string, kind: NoticeKind = 'success') => { if (kind === 'error') toast.error(message); else toast.success(message); };
const ToastContext = createContext<(message: string, kind?: NoticeKind) => void>(notify);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <ToastContext.Provider value={notify}>{children}<Toaster position="bottom-right" richColors closeButton theme="light" duration={6000} /></ToastContext.Provider>;
}
export const useToast = () => useContext(ToastContext);
