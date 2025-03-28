import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Button,
  Input,
  VStack,
  Heading,
  useToast,
  IconButton,
  HStack,
  Text,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { soundboard, auth } from '../services/api';

interface Sound {
  _id: string;
  title: string;
  description?: string;
  duration?: string;
  metadata: {
    s3Key: string;
    bucketName: string;
    fileType: string;
  };
  user: {
    username: string;
    email: string;
  };
  createdAt: string;
}

const Soundboard = () => {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const loadSounds = useCallback(async () => {
    try {
      const data = await soundboard.getSounds();
      setSounds(data);
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
    }
  }, [toast]);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    loadSounds();
  }, [navigate, loadSounds]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await soundboard.uploadSound(file);
      await loadSounds();
      toast({
        title: 'Sound uploaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
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
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const currentUser = auth.getCurrentUser();
  if (!currentUser) {
    return null;
  }

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        <HStack width="100%" justify="space-between">
          <Heading>Soundboard</Heading>
          <HStack spacing={4}>
            <Text>Welcome, {currentUser.username}</Text>
            <Button onClick={handleLogout} colorScheme="red">
              Logout
            </Button>
          </HStack>
        </HStack>

        <Input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          display="none"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button
            as="span"
            colorScheme="blue"
            loadingText="Uploading..."
            isLoading={isUploading}
            cursor="pointer"
          >
            Upload Sound
          </Button>
        </label>

        <Grid
          templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
          gap={4}
        >
          {sounds.map((sound) => (
            <Box
              key={sound._id}
              p={4}
              borderWidth={1}
              borderRadius="md"
              _hover={{ shadow: 'md' }}
            >
              <VStack spacing={2}>
                <Text fontWeight="bold">{sound.title}</Text>
                {sound.description && (
                  <Text fontSize="sm" color="gray.600">
                    {sound.description}
                  </Text>
                )}
                <Button
                  width="100%"
                  onClick={() =>
                    new Audio(
                      `http://localhost:4000/sounds/${sound._id}`
                    ).play()
                  }
                >
                  Play Sound
                </Button>
                <IconButton
                  aria-label="Delete sound"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDelete(sound._id)}
                />
              </VStack>
            </Box>
          ))}
        </Grid>
      </VStack>
    </Box>
  );
};

export default Soundboard;
