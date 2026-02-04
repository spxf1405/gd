import { inject, type InjectionKey } from 'vue'

export interface ToastOptions {
  variant?: 'success' | 'warning' | 'error' | 'info'
  title?: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface ToastMethods {
  show: (options: ToastOptions) => string
  success: (title: string, description?: string) => string
  warning: (title: string, description?: string) => string
  error: (title: string, description?: string) => string
  info: (title: string, description?: string) => string
  dismiss: (id: string) => void
}

export const TOAST_INJECTION_KEY: InjectionKey<ToastMethods> = Symbol('toast')

export function useToast(): ToastMethods {
  const toast = inject(TOAST_INJECTION_KEY)
  
  if (!toast) {
    throw new Error('useToast must be used within ToastContainer')
  }
  
  return toast
}