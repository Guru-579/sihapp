import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useTranslation as useCustomTranslation } from '@/utils/translations';
import { useLanguageContext } from '@/contexts/LanguageContext';

export const useTranslation = () => {
  const { t: i18nT, i18n } = useI18nTranslation();
  const { language } = useLanguageContext();
  const { t: customT } = useCustomTranslation(language);

  // Enhanced translation function that tries i18next first, then falls back to custom
  const t = (key: string, options?: any) => {
    // Try i18next translation first
    const i18nResult = i18nT(key, options);
    
    // If i18next returns the key (meaning no translation found), try custom translation
    if (i18nResult === key) {
      try {
        return customT(key as any) || key;
      } catch {
        return key;
      }
    }
    
    return i18nResult;
  };

  return {
    t,
    i18n,
    language: i18n.language,
    changeLanguage: i18n.changeLanguage,
    ready: i18n.isInitialized
  };
};
