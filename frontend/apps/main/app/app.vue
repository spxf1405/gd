<script setup lang="ts">
import ToastProvider1 from "./components/reuseables/ToastProvider1.vue";

useHead({
  link: [
    { rel: "preconnect", href: "https://fonsts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap",
    },
  ],
});
</script>

<template>
  <ToastProvider1>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ToastProvider1>
</template>
