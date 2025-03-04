import api from './api';
import { UserResponse, UserFilters } from '../types/user';

export const userService = {
  async getUsers(
    pageNumber: number = 0,
    rowCount: number = 10,
    filters: UserFilters = {}
  ): Promise<UserResponse> {
    // Create URL search params
    const params = new URLSearchParams();
    params.append('pageNumber', pageNumber.toString());
    params.append('rowCount', rowCount.toString());
    
    // Add filters if they exist
    if (filters.email) params.append('email', filters.email);
    if (filters.name) params.append('name', filters.name);
    if (filters.roleType) params.append('roleType', filters.roleType);
    if (filters.deleted !== undefined) params.append('deleted', filters.deleted.toString());
    
    const response = await api.get<UserResponse>(`/api/v1/users?${params.toString()}`);
    return response.data;
  },
  
  async getUserById(id: number): Promise<any> {
    const response = await api.get(`/api/v1/users/${id}`);
    return response.data;
  },
  
  async createUser(userData: any): Promise<any> {
    const response = await api.post('/api/v1/users', userData);
    return response.data;
  },
  
  async updateUser(id: number, userData: any): Promise<any> {
    const response = await api.put(`/api/v1/users/${id}`, userData);
    return response.data;
  },
  
  async deleteUser(id: number): Promise<any> {
    const response = await api.delete(`/api/v1/users/${id}`);
    return response.data;
  }
};

export default userService;