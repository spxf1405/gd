import i18n from "i18next";
// i18n.ts
import vi from '@locales/vi.json';
import en from '@locales/en.json';
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    vi: { translation: vi },
    en: { translation: en },
  },
   interpolation: {
    prefix: "{",
    suffix: "}",
  },
  lng: 'en',
  fallbackLng: 'vi',
});