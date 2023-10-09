import axiosInstance from './instance';
import { AxiosRequestConfig } from 'axios';

export function createInterceptors(): void {
  axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
    
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      return Promise.reject(error);
    },
  );
}
