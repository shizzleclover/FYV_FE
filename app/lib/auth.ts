// Types for authentication
export interface User {
  id: string;
  name: string;
  email: string;
  isHost: boolean;
  createdAt: string;
  eventCount?: number;
}

// Auth utility functions
export function getUserFromToken(token: string): User | null {
  // In a real app, this would validate and decode the JWT
  // For this mock implementation, we're simplifying the process
  try {
    // This is a placeholder - real implementation would decode the JWT
    return null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export function isAuthenticated(token?: string): boolean {
  if (!token) return false;
  
  // In a real app, this would validate the JWT
  return token.length > 0;
} 