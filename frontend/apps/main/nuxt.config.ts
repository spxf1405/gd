import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["radix-vue/nuxt", "@nuxtjs/i18n", "@nuxt/image"],
  vite: {
    plugins: [tailwindcss()],
  },
  typescript: {
    includeWorkspace: true,
  },
  i18n: {
    locales: [
      { code: "vi", language: "vi-VN", file: "vi.json" },
      { code: "en", language: "en-US", file: "en.json" },
    ],
    defaultLocale: "en",
    langDir: "../../../shared/i18n/locales/"
  },
  plugins: ["~/plugins/vue-query.ts"],
  runtimeConfig: {
    public: {
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      }
    }
  }
});
