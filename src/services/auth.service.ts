import api from './api';
import { LoginResponse, LoginCredentials } from '../types/auth';
import storage from '../utils/storage';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/v1/auth/sign-in', credentials);
    
    // Store token and expiry in localStorage
    if (response.data.data) {
      const { accessToken, accessTokenExpireTime } = response.data.data;
      storage.set('accessToken', accessToken);
      
      // Calculate expiry time
      const expiryTime = new Date().getTime() + accessTokenExpireTime;
      storage.set('tokenExpiry', expiryTime);
    }
    
    return response.data;
  },
  
  logout(): void {
    storage.remove('accessToken');
    storage.remove('tokenExpiry');
  },
  
  isAuthenticated(): boolean {
    const token = storage.get<string>('accessToken');
    const tokenExpiry = storage.get<number>('tokenExpiry');
    
    if (!token || !tokenExpiry) {
      return false;
    }
    
    // Check if token is expired
    const now = new Date().getTime();
    
    return now < tokenExpiry;
  },
  
  getToken(): string | null {
    return storage.get<string>('accessToken');
  }
};

export default authService;