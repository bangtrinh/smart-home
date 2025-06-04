import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/en.json";
import viTranslation from "./locales/vi.json";

const resources = {
  en: { translation: enTranslation },
  vi: { translation: viTranslation },
};

// Hàm helper để map ngôn ngữ i18n sang OpenWeather format
export const getWeatherLanguage = (locale) => {
  const langMap = {
    'vi': 'vi',
    'en': 'en',
    'ja': 'ja',
    'ko': 'ko',
    'zh': 'zh_cn',
    'zh-CN': 'zh_cn',
    'zh-TW': 'zh_tw',
    'th': 'th',
    'fr': 'fr',
    'de': 'de',
    'es': 'es',
    'ru': 'ru'
  };
  return langMap[locale] || 'en';
};

// Hàm helper để lấy ngôn ngữ hiện tại cho weather API
export const getCurrentWeatherLanguage = () => {
  return getWeatherLanguage(i18n.language);
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    
    // Cấu hình language detection
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false, // react đã xử lý XSS
    },
    
    // Debug trong development
    debug: process.env.NODE_ENV === 'development',
    
    // Callback khi ngôn ngữ thay đổi
    react: {
      useSuspense: false, // tránh loading issues
    }
  });

// Event listener cho việc thay đổi ngôn ngữ
i18n.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng);
  // Có thể dispatch event để refresh weather data
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: lng }));
});

export default i18n;