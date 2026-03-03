<script setup lang="ts">
import AppToastProvider from "./components/reuseables/ToastProvider.vue";

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
  <AppToastProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </AppToastProvider>
</template>
