import { useState, useEffect } from 'react';

// Simple translation hook that uses the i18n.js from the js folder
declare global {
  interface Window {
    I18N?: {
      t: (key: string) => string;
      setLang: (lang: string) => void;
      currentLang: string;
    };
  }
}

export function useTranslation() {
  const [lang, setLang] = useState('ar');
  const [dir, setDir] = useState<'rtl' | 'ltr'>('rtl');

  useEffect(() => {
    // Load i18n.js dynamically
    const script = document.createElement('script');
    script.src = '/js/i18n.js';
    script.async = true;
    script.onload = () => {
      if (window.I18N) {
        setLang(window.I18N.currentLang);
        setDir(window.I18N.currentLang === 'ar' ? 'rtl' : 'ltr');
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const t = (key: string): string => {
    if (window.I18N) {
      return window.I18N.t(key);
    }
    return key;
  };

  const setLanguage = (newLang: string) => {
    if (window.I18N) {
      window.I18N.setLang(newLang);
      setLang(newLang);
      setDir(newLang === 'ar' ? 'rtl' : 'ltr');
    }
  };

  return {
    t,
    lang,
    dir,
    setLanguage,
  };
}

export default useTranslation;