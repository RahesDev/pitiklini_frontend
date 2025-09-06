// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
const loadpath = "../src/Pages/Landing";

i18n
  .use(HttpApi) // Load translations from your server or local files
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "es", "fr"], // Add all supported languages here
    backend: {
      loadPath: loadpath,
    },
    detection: {
      order: ["path", "cookie", "localStorage", "sessionStorage", "navigator"],
      caches: ["cookie"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
