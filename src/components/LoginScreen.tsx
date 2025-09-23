import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Smartphone, ArrowLeft } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const LoginScreen = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation();
  const { setCurrentStep, setMobileNumber, sendOTPCode } = useAuth();
  const [mobile, setMobile] = useState('');

  const handleGetOtp = async () => {
    if (mobile.length === 10) {
      setMobileNumber(mobile);
      const phoneNumber = `+91${mobile}`;
      const success = await sendOTPCode(phoneNumber);
      if (success) {
        setCurrentStep('otp');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center pb-6 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep('language')}
            className="absolute top-4 left-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="absolute top-4 right-4">
            <LanguageSwitcher />
          </div>
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Smartphone className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            {t('auth.login')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="mobile" className="text-base font-medium">
              {t('auth.mobileNumber')}
            </Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="9999999999"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="h-12 text-lg"
              maxLength={10}
            />
          </div>
          <Button
            onClick={handleGetOtp}
            className="w-full h-12 text-lg font-medium"
            disabled={mobile.length !== 10}
          >
            {t('auth.getOtp')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;