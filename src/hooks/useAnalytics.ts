import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  trackPageView, 
  trackFeatureUsage, 
  trackError, 
  trackUserAction 
} from '@/services/feedbackService';

export const useAnalytics = () => {
  const { user } = useAuth();

  // Track page views
  const trackPage = (page: string) => {
    trackPageView(page, user?.uid);
  };

  // Track feature usage
  const trackFeature = (feature: string, properties?: Record<string, any>) => {
    trackFeatureUsage(feature, user?.uid, properties);
  };

  // Track errors
  const trackErrorEvent = (error: string, context?: string) => {
    trackError(error, context, user?.uid);
  };

  // Track custom user actions
  const trackAction = (action: string, category: string, properties?: Record<string, any>) => {
    trackUserAction(action, category, user?.uid, properties);
  };

  return {
    trackPage,
    trackFeature,
    trackError: trackErrorEvent,
    trackAction,
    userId: user?.uid
  };
};

// Hook for automatic page view tracking
export const usePageTracking = (pageName: string) => {
  const { trackPage } = useAnalytics();

  useEffect(() => {
    trackPage(pageName);
  }, [pageName, trackPage]);
};
