<script setup lang="ts">
import { ToastProvider, ToastViewport } from 'radix-vue'
import Toast, { type ToastProps } from './Toast.vue'
import { ref, provide } from 'vue'

export interface ToastItem extends ToastProps {
  id: string
  open: boolean
}

const toasts = ref<ToastItem[]>([])

// Add toast with options
const show = (options: ToastOptions): string => {
  const id = Math.random().toString(36).slice(2, 11)
  toasts.value.push({
    ...options,
    id,
    open: true,
  })
  return id
}

// Convenience methods
const success = (title: string, description?: string): string => {
  return show({ variant: 'success', title, description })
}

const warning = (title: string, description?: string): string => {
  return show({ variant: 'warning', title, description })
}

const error = (title: string, description?: string): string => {
  return show({ variant: 'error', title, description })
}

const info = (title: string, description?: string): string => {
  return show({ variant: 'info', title, description })
}

// Remove toast
const dismiss = (id: string): void => {
  const index = toasts.value.findIndex((t) => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

// Provide toast methods to children
const toastMethods: ToastMethods = {
  show,
  success,
  warning,
  error,
  info,
  dismiss,
}

provide(TOAST_INJECTION_KEY, toastMethods)
</script>

<template>
  <ToastProvider>
    <!-- Your app content -->
    <slot />

    <!-- Toast Viewport (where toasts appear) -->
    <ToastViewport
      class="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:top-0 sm:bottom-auto sm:flex-col-reverse md:max-w-[420px]"
    />

    <!-- Render all toasts -->
    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      :variant="toast.variant"
      :title="toast.title"
      :description="toast.description"
      :duration="toast.duration"
      :action="toast.action"
      @close="dismiss(toast.id)"
    />
  </ToastProvider>
</template>