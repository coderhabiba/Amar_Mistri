'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from '../locales/en.json';
import bnTranslation from '../locales/bn.json';

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: enTranslation },
        bn: { translation: bnTranslation },
      },
      fallbackLng: 'bn',
      interpolation: { escapeValue: false },
      detection: {
        order: ['localStorage'],
        caches: ['localStorage'],
      },
    });

  if (typeof window !== 'undefined') {
    i18n.on('languageChanged', (lng) => {
      document.documentElement.lang = lng;
    });
    // Set initial lang attribute
    document.documentElement.lang = i18n.language || 'bn';
  }
}

export default i18n;
