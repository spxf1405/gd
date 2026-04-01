import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["radix-vue/nuxt", "@nuxtjs/i18n"],
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
});
