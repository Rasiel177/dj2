import { createContext, useState, useEffect, ReactNode } from 'react';
import translations from '@/lib/translations';

type Language = 'en' | 'tr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Get saved language from localStorage or default to browser language
  const getBrowserLanguage = (): Language => {
    const browserLang = navigator.language.substring(0, 2);
    return browserLang === 'tr' ? 'tr' : 'en';
  };
  
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || getBrowserLanguage();
  });
  
  // Save language selection to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };
  
  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        let fallback = translations['en'];
        for (const fallbackKey of keys) {
          if (fallback && fallback[fallbackKey]) {
            fallback = fallback[fallbackKey];
          } else {
            return key; // Return the key itself if no translation found
          }
        }
        return typeof fallback === 'string' ? fallback : key;
      }
    }
    
    return value;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
