import { toast } from "sonner";
import { API_BASE_URL } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Authentication token storage keys
export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_DATA_KEY = 'user_data';

// Helper function to get the authentication token
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

// Helper function to get the current user data
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem(USER_DATA_KEY);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

// Helper function to set authentication data
export function setAuthData(token: string, user: User): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
}

// Helper function to clear authentication data
export function clearAuthData(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
}

// Helper function to check if the user is authenticated
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

// Register function
export async function register(name: string, email: string, password: string): Promise<AuthResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        toast.error(error.message || "Registration failed");
      } else {
        toast.error("Registration failed - server error");
      }
      return null;
    }

    const data = await response.json();
    
    // Store authentication data
    setAuthData(data.token, data.user);
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    toast.error("Registration failed. Please try again.");
    return null;
  }
}

// Login function
export async function login(email: string, password: string): Promise<AuthResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        toast.error(error.message || "Login failed");
      } else {
        toast.error("Login failed - server error");
      }
      return null;
    }

    const data = await response.json();
    
    // Store authentication data
    setAuthData(data.token, data.user);
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    toast.error("Login failed. Please try again.");
    return null;
  }
}

// Logout function
export function logout(): void {
  clearAuthData();
}

// Function to get auth header
export function getAuthHeader(): Record<string, string> {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Get user profile
export async function getUserProfile(): Promise<User | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      console.error('No authentication token found');
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      // If unauthorized, clear auth data
      if (response.status === 401) {
        clearAuthData();
      }
      return null;
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// Get user's hosted events
export async function getUserEvents(): Promise<any[] | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      console.error('No authentication token found');
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/events/user`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthData();
        toast.error("Authentication expired. Please log in again.");
      } else {
        toast.error("Failed to fetch your events");
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user events:', error);
    toast.error("Failed to fetch your events. Please try again.");
    return null;
  }
}