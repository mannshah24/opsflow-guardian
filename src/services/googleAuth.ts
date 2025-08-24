/**
 * Google OAuth Authentication Service
 * Handles Google Sign-In integration and JWT token management
 */

import { API_BASE_URL } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  email_verified: boolean;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginResponse extends AuthTokens {
  user: User;
}

class GoogleAuthService {
  private readonly TOKEN_KEY = 'auth_tokens';
  private readonly USER_KEY = 'auth_user';

  /**
   * Initialize Google OAuth
   */
  async initialize(): Promise<void> {
    // This will be called when the component mounts
    console.log('Google Auth service initialized');
  }

  /**
   * Get Google OAuth authorization URL from backend
   */
  async getAuthUrl(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/google/url`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to get auth URL');
      }
      
      return data.data.auth_url;
    } catch (error) {
      console.error('Failed to get Google auth URL:', error);
      throw error;
    }
  }

  /**
   * Start Google OAuth flow
   */
  async signIn(): Promise<void> {
    try {
      const authUrl = await this.getAuthUrl();
      
      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to start Google sign-in:', error);
      throw error;
    }
  }

  /**
   * Handle OAuth callback with authorization code
   */
  async handleCallback(code: string, state?: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/google/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      // Store tokens and user info
      this.setTokens(data);
      this.setUser(data.user);

      return data.user;
    } catch (error) {
      console.error('OAuth callback failed:', error);
      throw error;
    }
  }

  /**
   * Get current user info from API
   */
  async getCurrentUser(): Promise<User | null> {
    const tokens = this.getTokens();
    if (!tokens) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Try to refresh token
          return await this.refreshAndRetry();
        }
        throw new Error('Failed to get user info');
      }

      const user = await response.json();
      this.setUser(user);
      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      this.signOut();
      return null;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<boolean> {
    const tokens = this.getTokens();
    if (!tokens?.refresh_token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: tokens.refresh_token }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const newTokens = await response.json();
      
      // Update stored tokens
      this.setTokens({
        ...tokens,
        access_token: newTokens.access_token,
        expires_in: newTokens.expires_in,
      });

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.signOut();
      return false;
    }
  }

  /**
   * Refresh token and retry failed request
   */
  private async refreshAndRetry(): Promise<User | null> {
    const refreshed = await this.refreshToken();
    if (refreshed) {
      return await this.getCurrentUser();
    }
    return null;
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    try {
      // Call logout endpoint
      const tokens = this.getTokens();
      if (tokens) {
        await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Always clear local storage
      this.clearStorage();
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const tokens = this.getTokens();
    const user = this.getStoredUser();
    return !!(tokens && user && tokens.access_token);
  }

  /**
   * Get stored authentication tokens
   */
  getTokens(): AuthTokens | null {
    try {
      const tokens = localStorage.getItem(this.TOKEN_KEY);
      return tokens ? JSON.parse(tokens) : null;
    } catch {
      return null;
    }
  }

  /**
   * Get stored user info
   */
  getStoredUser(): User | null {
    try {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  /**
   * Store authentication tokens
   */
  private setTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokens));
  }

  /**
   * Store user information
   */
  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear all stored authentication data
   */
  private clearStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Get authorization header for API requests
   */
  getAuthHeaders(): Record<string, string> {
    const tokens = this.getTokens();
    if (!tokens) {
      return {};
    }

    return {
      'Authorization': `Bearer ${tokens.access_token}`,
    };
  }
}

// Create and export singleton instance
export const googleAuthService = new GoogleAuthService();
export default googleAuthService;
