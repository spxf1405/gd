import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["radix-vue/nuxt"],
  vite: {
    plugins: [tailwindcss()],
  },
  typescript: {
    includeWorkspace: true,
  },
  plugins: ["~/plugins/vue-query.ts"],
});
