import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, setupRecaptcha, sendOTP } from '@/lib/firebase';
import { RecaptchaVerifier, ConfirmationResult, onAuthStateChanged, User } from 'firebase/auth';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  currentStep: 'language' | 'login' | 'otp' | 'dashboard';
  mobileNumber: string;
  user: User | null;
  confirmationResult: ConfirmationResult | null;
  setCurrentStep: (step: 'language' | 'login' | 'otp' | 'dashboard') => void;
  setMobileNumber: (number: string) => void;
  sendOTPCode: (phoneNumber: string) => Promise<boolean>;
  verifyOTP: (otp: string) => Promise<boolean>;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStep, setCurrentStep] = useState<'language' | 'login' | 'otp' | 'dashboard'>('language');
  const [mobileNumber, setMobileNumber] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        setIsAuthenticated(true);
        setCurrentStep('dashboard');
      }
    });

    return () => unsubscribe();
  }, []);

  const sendOTPCode = async (phoneNumber: string): Promise<boolean> => {
    try {
      // Test account bypass
      if (phoneNumber === '+919999999999') {
        toast.info('Test account detected. Use OTP: 1234');
        return true;
      }

      // Setup reCAPTCHA
      const recaptchaVerifier = setupRecaptcha('recaptcha-container');
      
      // Send OTP
      const confirmation = await sendOTP(phoneNumber, recaptchaVerifier);
      setConfirmationResult(confirmation);
      
      toast.success('OTP sent successfully!');
      return true;
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
      return false;
    }
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    try {
      // Test account bypass
      if (mobileNumber === '9999999999' && otp === '1234') {
        login();
        toast.success('Login successful!');
        return true;
      }

      if (!confirmationResult) {
        toast.error('Please request OTP first');
        return false;
      }

      // Verify OTP with Firebase
      const result = await confirmationResult.confirm(otp);
      setUser(result.user);
      setIsAuthenticated(true);
      setCurrentStep('dashboard');
      
      toast.success('Login successful!');
      return true;
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast.error('Invalid OTP. Please try again.');
      return false;
    }
  };

  const login = () => {
    setIsAuthenticated(true);
    setCurrentStep('dashboard');
  };

  const logout = () => {
    auth.signOut();
    setIsAuthenticated(false);
    setCurrentStep('language');
    setMobileNumber('');
    setUser(null);
    setConfirmationResult(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentStep,
        mobileNumber,
        user,
        confirmationResult,
        setCurrentStep,
        setMobileNumber,
        sendOTPCode,
        verifyOTP,
        login,
        logout,
      }}
    >
      {children}
      <div id="recaptcha-container"></div>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};