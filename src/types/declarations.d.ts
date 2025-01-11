declare module 'i18next' {
  const i18next: {
    use: (plugin: any) => typeof i18next;
    init: (config: any) => Promise<typeof i18next>;
  };
  export default i18next;
}

declare module 'react-i18next' {
  export const initReactI18next: any;
  export const useTranslation: () => {
    t: (key: string) => string;
    i18n: {
      changeLanguage: (lang: string) => Promise<void>;
      language: string;
    };
  };
}

declare module 'i18next-browser-languagedetector' {
  const LanguageDetector: any;
  export default LanguageDetector;
} 