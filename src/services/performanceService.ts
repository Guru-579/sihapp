import { trackUserAction } from './feedbackService';

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  apiResponseTime: number;
  errorCount: number;
  feature: string;
}

class PerformanceMonitor {
  private startTimes: Map<string, number> = new Map();
  private metrics: PerformanceMetrics[] = [];

  // Start timing an operation
  startTiming(operation: string) {
    this.startTimes.set(operation, performance.now());
  }

  // End timing and record metric
  endTiming(operation: string, feature?: string) {
    const startTime = this.startTimes.get(operation);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.recordMetric(operation, duration, feature);
      this.startTimes.delete(operation);
      return duration;
    }
    return 0;
  }

  // Record a performance metric
  private recordMetric(operation: string, duration: number, feature?: string) {
    const metric = {
      loadTime: operation.includes('load') ? duration : 0,
      renderTime: operation.includes('render') ? duration : 0,
      apiResponseTime: operation.includes('api') ? duration : 0,
      errorCount: operation.includes('error') ? 1 : 0,
      feature: feature || operation
    };

    this.metrics.push(metric);

    // Track performance in analytics
    trackUserAction('performance_metric', 'performance', undefined, {
      operation,
      duration,
      feature,
      timestamp: new Date().toISOString()
    });

    // Log slow operations
    if (duration > 3000) {
      console.warn(`Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`);
      trackUserAction('slow_operation', 'performance', undefined, {
        operation,
        duration,
        feature
      });
    }
  }

  // Get performance summary
  getMetrics() {
    return this.metrics;
  }

  // Monitor page load performance
  monitorPageLoad() {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigation) {
            const loadTime = navigation.loadEventEnd - navigation.fetchStart;
            const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
            
            trackUserAction('page_load_complete', 'performance', undefined, {
              loadTime,
              domContentLoaded,
              url: window.location.pathname
            });
          }
        }, 0);
      });
    }
  }

  // Monitor API calls
  monitorApiCall(apiName: string, promise: Promise<any>) {
    this.startTiming(`api_${apiName}`);
    
    return promise
      .then((result) => {
        this.endTiming(`api_${apiName}`, apiName);
        return result;
      })
      .catch((error) => {
        this.endTiming(`api_${apiName}`, apiName);
        this.recordMetric(`error_${apiName}`, 0, apiName);
        throw error;
      });
  }

  // Monitor component render time
  monitorRender(componentName: string, renderFunction: () => void) {
    this.startTiming(`render_${componentName}`);
    renderFunction();
    this.endTiming(`render_${componentName}`, componentName);
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Initialize page load monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.monitorPageLoad();
}

// Hook for React components
export const usePerformanceMonitor = () => {
  return {
    startTiming: performanceMonitor.startTiming.bind(performanceMonitor),
    endTiming: performanceMonitor.endTiming.bind(performanceMonitor),
    monitorApiCall: performanceMonitor.monitorApiCall.bind(performanceMonitor),
    monitorRender: performanceMonitor.monitorRender.bind(performanceMonitor)
  };
};
