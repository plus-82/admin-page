import { AxiosError } from 'axios';

/**
 * Standardized error message format
 */
export interface ErrorMessage {
  message: string;
  code?: string;
  details?: string;
}

/**
 * Parse error from different sources into a standard format
 */
export const parseError = (error: unknown): ErrorMessage => {
  // Handle Axios errors
  if (isAxiosError(error)) {
    const response = error.response?.data;
    
    // Check if response has our standard API error format
    if (response && typeof response === 'object' && 'message' in response) {
      return {
        message: response.message || 'An error occurred',
        code: response.code || error.response?.status?.toString(),
        details: response.details || error.response?.statusText,
      };
    }
    
    // Generic axios error
    return {
      message: 'Network or server error',
      code: error.response?.status?.toString() || 'NETWORK_ERROR',
      details: error.message,
    };
  }
  
  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      message: error.message || 'An unknown error occurred',
      details: error.stack,
    };
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
    };
  }
  
  // Fallback for unknown error types
  return {
    message: 'An unknown error occurred',
    details: JSON.stringify(error),
  };
};

/**
 * Type guard for Axios errors
 */
function isAxiosError(error: any): error is AxiosError {
  return error && error.isAxiosError === true;
}

/**
 * Log error with consistent format
 */
export const logError = (error: unknown, context?: string): void => {
  const parsedError = parseError(error);
  const contextPrefix = context ? `[${context}] ` : '';
  
  console.error(
    `${contextPrefix}Error: ${parsedError.message}${
      parsedError.code ? ` (${parsedError.code})` : ''
    }`,
    parsedError.details || ''
  );
};

export default { parseError, logError };