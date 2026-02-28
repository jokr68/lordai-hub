import { useState, useEffect } from 'react';
import I18N, { Language } from '@/lib/i18n';

export function useTranslation() {
  const [language, setLanguage] = useState<Language>(I18N.currentLang);
  const [dir, setDir] = useState<'rtl' | 'ltr'>(I18N.currentLang === 'ar' ? 'rtl' : 'ltr');

  useEffect(() => {
    // Listen for language changes
    const checkLanguage = () => {
      const newLang = I18N.currentLang;
      setLanguage(newLang);
      setDir(newLang === 'ar' ? 'rtl' : 'ltr');
    };

    // Check initially
    checkLanguage();

    // Set up interval to check for language changes
    const interval = setInterval(checkLanguage, 100);

    return () => clearInterval(interval);
  }, []);

  const t = (key: string): string => {
    return I18N.t(key);
  };

  const changeLanguage = (newLang: Language) => {
    I18N.setLang(newLang);
    setLanguage(newLang);
    setDir(newLang === 'ar' ? 'rtl' : 'ltr');
  };

  return {
    t,
    language,
    dir,
    setLanguage: changeLanguage,
  };
}

export default useTranslation;