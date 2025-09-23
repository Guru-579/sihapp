import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/utils/translations';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const OtpScreen = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const { mobileNumber, setCurrentStep, verifyOTP } = useAuth();
  const [otp, setOtp] = useState('');

  const handleVerifyOtp = async () => {
    if (otp.length === 4) {
      await verifyOTP(otp);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center pb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep('login')}
            className="absolute top-4 left-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            {t('enterOtp')}
          </CardTitle>
          <p className="text-muted-foreground">
            Sent to +91 {mobileNumber}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-base font-medium">
              {t('enterOtp')}
            </Label>
            <Input
              id="otp"
              type="text"
              placeholder="1234"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="h-12 text-lg text-center tracking-widest"
              maxLength={4}
            />
          </div>
          <Button
            onClick={handleVerifyOtp}
            className="w-full h-12 text-lg font-medium"
            disabled={otp.length !== 4}
          >
            {t('verifyLogin')}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Test: Use OTP "1234" for mobile 9999999999
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OtpScreen;