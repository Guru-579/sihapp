import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { languages, Language } from '@/utils/translations';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Globe, Sparkles } from 'lucide-react';

const LanguageSelector = () => {
  const { setLanguage } = useLanguageContext();
  const { setCurrentStep } = useAuth();

  const handleLanguageSelect = (langCode: Language) => {
    setLanguage(langCode);
    setCurrentStep('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-green-600 to-emerald-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-white/5 rounded-full animate-float"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-bounce-gentle"></div>
      </div>
      
      <Card className="w-full max-w-md mx-auto glass-card animate-fade-in relative z-10">
        <CardHeader className="text-center pb-8 relative">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-white to-green-100 rounded-full flex items-center justify-center mb-6 animate-pulse-glow">
            <Globe className="h-10 w-10 text-primary animate-float" />
          </div>
          <CardTitle className="text-3xl font-bold font-poppins bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
            Farmer Advisory
          </CardTitle>
          <div className="flex items-center justify-center mt-2">
            <Sparkles className="h-4 w-4 text-yellow-500 mr-2 animate-pulse" />
            <p className="text-muted-foreground font-medium">Choose your preferred language</p>
            <Sparkles className="h-4 w-4 text-yellow-500 ml-2 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {languages.map((lang, index) => (
            <Button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              variant="outline"
              className="w-full h-16 text-lg font-medium justify-start hover-lift border-2 group hover:border-primary/50 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center w-full">
                <span className="font-bold text-xl mr-4 group-hover:scale-110 transition-transform">
                  {lang.native}
                </span>
                <span className="text-muted-foreground group-hover:text-primary transition-colors">
                  ({lang.name})
                </span>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageSelector;