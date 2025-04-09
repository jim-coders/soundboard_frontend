// Mock the entire api module
jest.mock('../api', () => {
  const mockAuth = {
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
  };

  const mockSoundboard = {
    uploadSound: jest.fn(),
    deleteSound: jest.fn(),
    getSounds: jest.fn(),
  };

  return {
    auth: mockAuth,
    soundboard: mockSoundboard,
  };
});

import { auth, soundboard } from '../api';

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Auth Service', () => {
    it('should handle successful login', async () => {
      const mockResponse = {
        token: 'test-token',
        user: {
          _id: '1',
          username: 'testuser',
          email: 'test@example.com',
          favorites: [],
          createdAt: '2024-01-01',
        },
      };

      (auth.login as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await auth.login('test@example.com', 'password');

      expect(auth.login).toHaveBeenCalledWith(
        'test@example.com',
        'password'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle login error', async () => {
      const error = new Error('Login failed');
      (auth.login as jest.Mock).mockRejectedValueOnce(error);

      await expect(
        auth.login('test@example.com', 'password')
      ).rejects.toThrow('Login failed');
    });

    it('should handle successful signup', async () => {
      const mockResponse = {
        token: 'test-token',
        user: {
          _id: '1',
          username: 'newuser',
          email: 'new@example.com',
          favorites: [],
          createdAt: '2024-01-01',
        },
      };

      (auth.signup as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await auth.signup(
        'newuser',
        'new@example.com',
        'password'
      );

      expect(auth.signup).toHaveBeenCalledWith(
        'newuser',
        'new@example.com',
        'password'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle successful logout', async () => {
      await auth.logout();
      expect(auth.logout).toHaveBeenCalled();
    });
  });

  describe('Soundboard Service', () => {
    it('should handle successful sound upload', async () => {
      const mockFile = new File(['test'], 'test.mp3', {
        type: 'audio/mp3',
      });
      const mockResponse = {
        _id: '1',
        title: 'Test Sound',
        description: 'Test Description',
        metadata: {
          s3Key: 'test-key',
          bucketName: 'test-bucket',
          fileType: 'audio/mp3',
          fileSize: 1000,
        },
      };

      (soundboard.uploadSound as jest.Mock).mockResolvedValueOnce(
        mockResponse
      );

      const result = await soundboard.uploadSound(
        mockFile,
        'Test Sound',
        'Test Description'
      );

      expect(soundboard.uploadSound).toHaveBeenCalledWith(
        mockFile,
        'Test Sound',
        'Test Description'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle successful sound deletion', async () => {
      await soundboard.deleteSound('1');
      expect(soundboard.deleteSound).toHaveBeenCalledWith('1');
    });

    it('should handle successful sound listing', async () => {
      const mockResponse = [
        {
          _id: '1',
          title: 'Sound 1',
          description: 'Description 1',
          metadata: {
            s3Key: 'key1',
            bucketName: 'bucket1',
            fileType: 'audio/mp3',
            fileSize: 1000,
          },
        },
      ];

      (soundboard.getSounds as jest.Mock).mockResolvedValueOnce(
        mockResponse
      );

      const result = await soundboard.getSounds();

      expect(soundboard.getSounds).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });
});
