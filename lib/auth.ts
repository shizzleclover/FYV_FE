import { toast } from "sonner";
import { API_BASE_URL } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  isHost: boolean;
  createdAt: string;
  eventCount?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Auth constants
const AUTH_TOKEN_KEY = 'event_app_auth_token';
const USER_DATA_KEY = 'event_app_user';

// Auth Helper Functions

/**
 * Get the authentication token from local storage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Get the current user from local storage
 */
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userJson = localStorage.getItem(USER_DATA_KEY);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

/**
 * Set authentication data in local storage
 */
export const setAuthData = (token: string, user: User) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
}

/**
 * Clear authentication data from local storage
 */
export const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
}

/**
 * Check if the user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
}

/**
 * Register a new user
 */
export const register = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse | null> => {
  try {
    // For demo purposes, we're just mocking the API response
    // In a real app, this would be a fetch call to the backend
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message || 'Registration failed');
      return null;
    }
    
    const data = await response.json();
    setAuthData(data.token, data.user);
    return data;
    
  } catch (error) {
    console.error('Registration error:', error);
    toast.error('Registration failed. Please try again later.');
    return null;
  }
}

/**
 * Login a user
 */
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse | null> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message || 'Login failed');
      return null;
    }
    
    const data = await response.json();
    setAuthData(data.token, data.user);
    return data;
    
  } catch (error) {
    console.error('Login error:', error);
    toast.error('Login failed. Please try again later.');
    return null;
  }
}

/**
 * Logout the current user
 */
export const logout = () => {
  clearAuthData();
}

/**
 * Get authentication header for API requests
 */
export const getAuthHeader = (): HeadersInit => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Get the current user's profile from the API
 */
export const getUserProfile = async (): Promise<User> => {
  const token = getAuthToken();
  
  if (!token) {
    toast.error('Authentication required');
    throw new Error('No authentication token');
  }
  
  try {
    const response = await fetch('/api/auth/me', {
      headers: {
        ...getAuthHeader(),
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        clearAuthData();
        toast.error('Your session has expired. Please log in again.');
        throw new Error('Auth token expired');
      }
      
      const error = await response.json();
      toast.error(error.message || 'Failed to fetch user profile');
      throw new Error('Failed to fetch user profile');
    }
    
    const userData = await response.json();
    return userData;
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

/**
 * Get events hosted by the current user
 */
export const getUserEvents = async () => {
  const token = getAuthToken();
  
  if (!token) {
    toast.error('Authentication required');
    throw new Error('No authentication token');
  }
  
  try {
    const response = await fetch('/api/events', {
      headers: {
        ...getAuthHeader(),
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        clearAuthData();
        toast.error('Your session has expired. Please log in again.');
        throw new Error('Auth token expired');
      }
      
      const error = await response.json();
      toast.error(error.message || 'Failed to fetch events');
      throw new Error('Failed to fetch events');
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}