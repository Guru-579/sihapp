import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface FeedbackData {
  id?: string;
  userId?: string;
  rating: number;
  category: 'general' | 'feature' | 'bug' | 'suggestion';
  message: string;
  feature?: string;
  deviceInfo?: {
    userAgent: string;
    platform: string;
    language: string;
  };
  timestamp: Date;
  status?: 'pending' | 'reviewed' | 'resolved';
}

export interface AnalyticsEvent {
  id?: string;
  userId?: string;
  event: string;
  category: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
  timestamp: Date;
}

// Feedback functions
export const submitFeedback = async (feedbackData: Omit<FeedbackData, 'id' | 'timestamp' | 'status'>): Promise<string> => {
  try {
    const feedback: FeedbackData = {
      ...feedbackData,
      timestamp: new Date(),
      status: 'pending',
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
      }
    };

    const docRef = await addDoc(collection(db, 'feedback'), {
      ...feedback,
      timestamp: Timestamp.fromDate(feedback.timestamp)
    });

    console.log('Feedback submitted with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw new Error('Failed to submit feedback');
  }
};

export const getFeedback = async (limitCount: number = 50): Promise<FeedbackData[]> => {
  try {
    const q = query(
      collection(db, 'feedback'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const feedback: FeedbackData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      feedback.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp.toDate()
      } as FeedbackData);
    });
    
    return feedback;
  } catch (error) {
    console.error('Error getting feedback:', error);
    throw new Error('Failed to get feedback');
  }
};

// Analytics functions
export const trackEvent = async (eventData: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<void> => {
  try {
    const event: AnalyticsEvent = {
      ...eventData,
      userId: eventData.userId || null,
      timestamp: new Date()
    };

    await addDoc(collection(db, 'analytics'), {
      ...event,
      timestamp: Timestamp.fromDate(event.timestamp)
    });

    console.log('Event tracked:', event.event);
  } catch (error) {
    console.error('Error tracking event:', error);
    // Don't throw error for analytics to avoid disrupting user experience
  }
};

// Predefined analytics events
export const trackPageView = (page: string, userId?: string) => {
  trackEvent({
    userId,
    event: 'page_view',
    category: 'navigation',
    label: page,
    properties: {
      page,
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    }
  });
};

export const trackFeatureUsage = (feature: string, userId?: string, properties?: Record<string, any>) => {
  trackEvent({
    userId,
    event: 'feature_used',
    category: 'engagement',
    label: feature,
    properties: {
      feature,
      ...properties
    }
  });
};

export const trackError = (error: string, context?: string, userId?: string) => {
  trackEvent({
    userId,
    event: 'error',
    category: 'error',
    label: error,
    properties: {
      error,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    }
  });
};

export const trackUserAction = (action: string, category: string, userId?: string, properties?: Record<string, any>) => {
  trackEvent({
    userId,
    event: action,
    category,
    properties
  });
};

// Get analytics data (for admin use)
export const getAnalytics = async (limitCount: number = 100): Promise<AnalyticsEvent[]> => {
  try {
    const q = query(
      collection(db, 'analytics'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const analytics: AnalyticsEvent[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      analytics.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp.toDate()
      } as AnalyticsEvent);
    });
    
    return analytics;
  } catch (error) {
    console.error('Error getting analytics:', error);
    throw new Error('Failed to get analytics');
  }
};
