<script setup lang="ts">
</script>

<template>
  <div class="text-cyber-green">07:45:52</div>
  <DialogRoot>
    <!-- Trigger button -->
    <DialogTrigger
      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      Open Dialog
    </DialogTrigger>

    <DialogPortal>
      <!-- Overlay -->
      <DialogOverlay
        class="fixed inset-0 bg-black/50 data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut"
      />

      <!-- Content -->
      <DialogContent
        class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-6 w-[400px] data-[state=open]:animate-zoomIn data-[state=closed]:animate-zoomOut"
      >
        <DialogTitle class="text-lg font-semibold text-gray-900">
          Radix Vue Dialog
        </DialogTitle>
        <DialogDescription class="text-sm text-gray-600 mt-2">
          This dialog is fully accessible and styled with Tailwind.
        </DialogDescription>

        <!-- Actions -->
        <div class="mt-4 flex justify-end gap-2">
          <DialogClose
            class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
          >
            Cancel
          </DialogClose>
          <DialogClose
            class="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
          >
            Confirm
          </DialogClose>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes zoomIn {
  from {
    transform: scale(0.95) translate(-50%, -50%);
    opacity: 0;
  }
  to {
    transform: scale(1) translate(-50%, -50%);
    opacity: 1;
  }
}
@keyframes zoomOut {
  from {
    transform: scale(1) translate(-50%, -50%);
    opacity: 1;
  }
  to {
    transform: scale(0.95) translate(-50%, -50%);
    opacity: 0;
  }
}
</style>
