import { apiClient } from './apiClient';
import { User } from '../types';

export const authService = {
  login: (credentials: any) => apiClient.post<{ token: string; user: User }>('/auth/login', credentials),
  getMe: () => apiClient.get<User>('/auth/me'),
};
