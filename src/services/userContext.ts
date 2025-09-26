import { authApi } from './api';

// Cache for user profile to avoid repeated API calls
let userProfileCache: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get the current user's ID from their profile
 * Uses caching to avoid repeated API calls
 */
export const getCurrentUserId = async (): Promise<number | null> => {
  try {
    // Check if we have a valid cached profile
    const now = Date.now();
    if (userProfileCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return userProfileCache.id || userProfileCache.user_id;
    }

    // Check if user is authenticated
    if (!authApi.isAuthenticated()) {
      return null;
    }

    // Fetch fresh profile data
    const profile = await authApi.getProfile();
    
    // Cache the profile
    userProfileCache = profile;
    cacheTimestamp = now;
    
    // Return user ID (try different possible field names)
    return profile.id || profile.user_id || profile.userId || null;
  } catch (error) {
    console.error('Failed to get current user ID:', error);
    return null;
  }
};

/**
 * Get the current user's profile (cached)
 */
export const getCurrentUserProfile = async (): Promise<any | null> => {
  try {
    // Check if we have a valid cached profile
    const now = Date.now();
    if (userProfileCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return userProfileCache;
    }

    // Check if user is authenticated
    if (!authApi.isAuthenticated()) {
      return null;
    }

    // Fetch fresh profile data
    const profile = await authApi.getProfile();
    
    // Cache the profile
    userProfileCache = profile;
    cacheTimestamp = now;
    
    return profile;
  } catch (error) {
    console.error('Failed to get current user profile:', error);
    return null;
  }
};

/**
 * Clear the user profile cache (useful for logout)
 */
export const clearUserCache = () => {
  userProfileCache = null;
  cacheTimestamp = 0;
};

/**
 * Force refresh the user profile cache
 */
export const refreshUserCache = async (): Promise<any | null> => {
  userProfileCache = null;
  cacheTimestamp = 0;
  return await getCurrentUserProfile();
};
