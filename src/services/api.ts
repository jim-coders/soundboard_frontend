import axios, { AxiosError } from 'axios';
import { Sound } from '../types';

const API_URL = 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This is important for cookies
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Error handling helper
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      message?: string;
      error?: string;
    }>;
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      axiosError.message ||
      'An unexpected error occurred';
    throw new Error(errorMessage);
  }
  throw error;
};

interface UserResponse {
  user: {
    _id: string;
    username: string;
    email: string;
    favorites: string[];
    createdAt: string;
  };
  token: string;
}

interface UploadUrlResponse {
  url: string;
  key: string;
  bucketName: string;
}

export const auth = {
  login: async (
    email: string,
    password: string
  ): Promise<UserResponse> => {
    try {
      const response = await api.post('/users/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  signup: async (
    username: string,
    email: string,
    password: string
  ): Promise<UserResponse> => {
    try {
      const response = await api.post('/users/register', {
        username,
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return token;
  },
  logout: async () => {
    try {
      await api.post('/users/logout');
      localStorage.removeItem('token');
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export const soundboard = {
  getSounds: async (): Promise<Sound[]> => {
    try {
      const response = await api.get<Sound[]>('/sounds');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getSoundUrl: async (id: string): Promise<string> => {
    try {
      const response = await api.get<{ url: string }>(
        `/sounds/${id}/url`
      );
      return response.data.url;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  uploadSound: async (
    file: File,
    title: string,
    description: string
  ) => {
    try {
      // First get the pre-signed URL
      const { data } = await api.get<UploadUrlResponse>(
        '/sounds/upload-url',
        {
          params: {
            fileType: file.type,
            fileName: file.name,
          },
        }
      );

      // Upload directly to S3 using the pre-signed URL
      await axios.put(data.url, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      // Create the sound record in our database
      const response = await api.post<Sound>('/sounds', {
        title,
        description,
        metadata: {
          s3Key: data.key,
          bucketName: data.bucketName,
          fileType: file.type,
          fileSize: file.size,
        },
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  deleteSound: async (id: string): Promise<void> => {
    try {
      await api.delete(`/sounds/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default api;
