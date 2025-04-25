import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { soundboard } from '../services/api';
import { useAuth } from './useAuth';
import { Sound } from '../types';

export const useSoundboard = () => {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map());
  const navigate = useNavigate();
  const toast = useToast();
  const { user, logout } = useAuth();

  const loadSounds = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await soundboard.getSounds();
      setSounds(data);

      // Preload all sounds
      data.forEach(async (sound) => {
        try {
          const url = await soundboard.getSoundUrl(sound._id);
          const audio = new Audio(url);
          audioCache.current.set(sound._id, audio);
        } catch (error) {
          console.error(
            `Failed to preload sound ${sound._id}:`,
            error
          );
        }
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error loading sounds';
      toast({
        title: 'Error loading sounds',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Number keys 1-9 for quick sound access
      if (e.key >= '1' && e.key <= '9' && !e.shiftKey) {
        const index = parseInt(e.key) - 1;
        if (sounds[index]) {
          playSound(sounds[index]);
        }
      }

      // Shift + Number keys 1-9 for sounds 10-18
      if (e.key >= '1' && e.key <= '9' && e.shiftKey) {
        const index = parseInt(e.key) + 8; // 1 becomes 9, 2 becomes 10, etc.
        if (sounds[index]) {
          playSound(sounds[index]);
        }
      }

      // Space bar to play/stop current sound
      if (e.key === ' ') {
        e.preventDefault();
        const currentAudio = Array.from(
          audioCache.current.values()
        ).find((audio) => !audio.paused);
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () =>
      window.removeEventListener('keydown', handleKeyPress);
  }, [sounds]);

  const handleFileSelect = async (file: File) => {
    // Check file size (1MB limit)
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: 'Please select a file smaller than 1MB',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    // Check file type
    if (!file.type.startsWith('audio/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an audio file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    // Check duration (10 seconds limit)
    try {
      const audio = new Audio(URL.createObjectURL(file));
      await new Promise((resolve, reject) => {
        audio.onloadedmetadata = resolve;
        audio.onerror = reject;
      });

      if (audio.duration > 10) {
        toast({
          title: 'Audio too long',
          description:
            'Please select an audio file shorter than 10 seconds',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    } catch (error) {
      console.error('Error checking audio:', error);
      toast({
        title: 'Error checking audio',
        description: 'Could not verify audio duration',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    setSelectedFile(file);
    setTitle(file.name.split('.')[0]); // Set default title from filename
    return true;
  };

  const handleUpload = async () => {
    if (!selectedFile || !title) {
      toast({
        title: 'Error',
        description: 'Please provide a title and select a file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (title.length > 20) {
      toast({
        title: 'Error',
        description: 'Title must be 20 characters or less',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    setIsUploading(true);
    try {
      await soundboard.uploadSound(selectedFile, title, '');
      await loadSounds();
      toast({
        title: 'Sound uploaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setSelectedFile(null);
      setTitle('');
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Upload failed';
      toast({
        title: 'Upload failed',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await soundboard.deleteSound(id);
      await loadSounds();
      toast({
        title: 'Sound deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Delete failed';
      toast({
        title: 'Delete failed',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  };

  const playSound = async (sound: Sound) => {
    try {
      const url = await soundboard.getSoundUrl(sound._id);
      const audio = new Audio(url);

      audio.onerror = (e) => {
        console.error('Audio error:', e);
        toast({
          title: 'Error playing sound',
          description: 'Could not load the audio file',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      };

      await audio.play();
      return true;
    } catch (error) {
      console.error('Play error:', error);
      toast({
        title: 'Error playing sound',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to play sound',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  };

  return {
    sounds,
    isUploading,
    isLoading,
    selectedFile,
    title,
    setTitle,
    loadSounds,
    handleFileSelect,
    handleUpload,
    handleDelete,
    handleLogout,
    playSound,
    user,
  };
};
