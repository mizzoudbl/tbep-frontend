import { nanoid } from 'nanoid';

const USER_ID_KEY = 'tbep_user_id';

/**
 * Generate a unique session ID for each chat conversation
 * This ID persists for the lifetime of a single chat session
 */
export function generateSessionId(): string {
  return `session_${nanoid()}`;
}

/**
 * Get or create a persistent user ID
 * This ID is stored in localStorage and persists across sessions
 * Useful for tracking anonymous users before authentication is implemented
 */
export function getUserId(): string {
  try {
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
      userId = `user_${nanoid()}`;
      localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
  } catch (error) {
    // Fallback if localStorage is not available (e.g., private browsing)
    console.warn('Failed to access localStorage for user tracking:', error);
    return `user_${nanoid()}`;
  }
}
