import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Languages, Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  native: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

interface LanguageSwitcherProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  showText?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  variant = 'ghost', 
  size = 'sm',
  showText = false 
}) => {
  const { i18n, t } = useTranslation();

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    // Also update the custom language context if it exists
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', languageCode);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {showText && (
            <span className="hidden sm:inline">
              {currentLanguage.native}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`flex items-center justify-between cursor-pointer ${
              i18n.language === language.code ? 'bg-accent' : ''
            }`}
          >
            <div className="flex flex-col">
              <span className="font-medium">{language.native}</span>
              <span className="text-xs text-muted-foreground">{language.name}</span>
            </div>
            {i18n.language === language.code && (
              <div className="h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
