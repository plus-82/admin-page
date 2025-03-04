/**
 * Utility for safely interacting with localStorage with type safety and error handling
 */
export const storage = {
  /**
   * Get an item from localStorage with proper type casting
   */
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue ?? null;
      }
      return JSON.parse(item) as T;
    } catch (e) {
      console.error(`Error getting item ${key} from localStorage:`, e);
      return defaultValue ?? null;
    }
  },

  /**
   * Set an item in localStorage with proper serialization
   */
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error setting item ${key} in localStorage:`, e);
    }
  },

  /**
   * Remove an item from localStorage
   */
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing item ${key} from localStorage:`, e);
    }
  },

  /**
   * Clear all items from localStorage
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  }
};

export default storage;