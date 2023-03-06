import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import sk from './locales/sk/translation.json';

export const defaultNS = 'default';

export const resources = {
  en: {
    [defaultNS]: en,
  },
  sk: {
    [defaultNS]: sk,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    defaultNS,
    ns: [defaultNS],
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
