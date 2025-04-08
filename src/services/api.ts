import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:4000';

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This is important for cookies
});

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userData');
      window.location.href = '/login';
      throw new ApiError(
        'Session expired. Please log in again.',
        401
      );
    }

    if (error.response?.status === 403) {
      throw new ApiError(
        'You do not have permission to perform this action.',
        403
      );
    }

    if (error.response?.status === 404) {
      throw new ApiError(
        'The requested resource was not found.',
        404
      );
    }

    if (error.response?.status === 500) {
      throw new ApiError(
        'An unexpected server error occurred. Please try again later.',
        500
      );
    }

    throw error;
  }
);

// Error handling helper
const handleApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    throw error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      message?: string;
      error?: string;
      code?: string;
    }>;

    const status = axiosError.response?.status;
    const message =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      axiosError.message ||
      'An unexpected error occurred';

    throw new ApiError(
      message,
      status,
      axiosError.response?.data?.code
    );
  }

  throw new ApiError('An unexpected error occurred');
};

interface UserResponse {
  user: {
    _id: string;
    username: string;
    email: string;
    favorites: string[];
    createdAt: string;
  };
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
      // Store user data in localStorage (not sensitive)
      localStorage.setItem(
        'userData',
        JSON.stringify(response.data.user)
      );
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
      // Store user data in localStorage (not sensitive)
      localStorage.setItem(
        'userData',
        JSON.stringify(response.data.user)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getCurrentUser: () => {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('userData');
      return null;
    }
  },
  logout: async () => {
    try {
      await api.post('/users/logout');
      localStorage.removeItem('userData');
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export const soundboard = {
  getSounds: async () => {
    try {
      const response = await api.get('/sounds');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getSoundUrl: async (id: string) => {
    try {
      const response = await api.get(`/sounds/${id}/url`);
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
      const response = await api.post('/sounds', {
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
  deleteSound: async (id: string) => {
    try {
      const response = await api.delete(`/sounds/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default api;
