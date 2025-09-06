import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";
import translationEN from "../translate/en.json";
import translationES from "../translate/es.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: translationEN },
    es: { translation: translationES },
  },
  lng: localStorage.getItem("i18nextLng") || "en", // Load language from localStorage or fallback to English
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
