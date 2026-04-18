// Production error handling utilities

export interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: number;
  userAgent: string;
  url: string;
}

export class ErrorLogger {
  private static instance: ErrorLogger;
  private errors: ErrorInfo[] = [];

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  logError(error: Error, componentStack?: string): void {
    const errorInfo: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      componentStack,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.errors.push(errorInfo);
    
    // In production, send to monitoring service
    if (import.meta.env.PROD) {
      this.sendToMonitoring(errorInfo);
    } else {
      console.error('Error logged:', errorInfo);
    }
  }

  private sendToMonitoring(errorInfo: ErrorInfo): void {
    // Send to monitoring service (Sentry, LogRocket, etc.)
    // Example implementation:
    /*
    if (window.Sentry) {
      window.Sentry.captureException(new Error(errorInfo.message), {
        extra: errorInfo,
      });
    }
    */
    
    // For now, just log to console in production
    console.error('Production Error:', errorInfo);
  }

  getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }
}

// Global error handler
export function setupGlobalErrorHandler(): void {
  const errorLogger = ErrorLogger.getInstance();

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorLogger.logError(new Error(`Unhandled Promise Rejection: ${event.reason}`));
  });

  // Handle global errors
  window.addEventListener('error', (event) => {
    errorLogger.logError(new Error(event.message), event.filename);
  });
}

// Utility function for handling async operations
export async function handleAsync<T>(
  operation: () => Promise<T>,
  errorMessage?: string
): Promise<{ data?: T; error?: Error }> {
  try {
    const data = await operation();
    return { data };
  } catch (error) {
    const errorLogger = ErrorLogger.getInstance();
    const finalError = error instanceof Error ? error : new Error(String(error));
    
    if (errorMessage) {
      finalError.message = `${errorMessage}: ${finalError.message}`;
    }
    
    errorLogger.logError(finalError);
    return { error: finalError };
  }
}