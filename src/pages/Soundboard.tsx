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
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { Sound } from 'types';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { soundboard } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { SoundButton } from '../components/SoundButton';
import { generateColor } from '../theme';

const Soundboard = () => {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, logout } = useAuth();

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
    if (!user) {
      navigate('/login');
      return;
    }
    loadSounds();
  }, [navigate, loadSounds, user]);

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      return;
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
      return;
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
        return;
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
      return;
    }

    setSelectedFile(file);
    setTitle(file.name.split('.')[0]); // Set default title from filename
    onOpen();
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
      return;
    }

    if (title.length > 20) {
      toast({
        title: 'Error',
        description: 'Title must be 20 characters or less',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
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
      onClose();
      setSelectedFile(null);
      setTitle('');
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box
      minH="100vh"
      w="100vw"
      bg="brand.dark.400"
      py={4}
      px={4}
      overflow="hidden"
    >
      <Box
        as="section"
        className="soundboard-container"
        bg="brand.dark.300"
        maxW="1400px"
        w="100%"
        mx="auto"
        borderRadius="md"
        p={{ base: 4, md: 6 }}
        boxShadow="lg"
        border="1px solid"
        borderColor="brand.dark.100"
      >
        <VStack spacing={6} align="stretch">
          <HStack width="100%" justify="space-between">
            <Heading size="lg" color="white" letterSpacing="tight">
              Soundboard
            </Heading>
            <HStack spacing={4}>
              <Text color="whiteAlpha.900" fontSize="md">
                {user?.username}
              </Text>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                borderColor="whiteAlpha.400"
                color="whiteAlpha.900"
                _hover={{
                  bg: 'whiteAlpha.100',
                }}
              >
                Logout
              </Button>
            </HStack>
          </HStack>

          <Box
            p={4}
            bg="brand.dark.200"
            borderRadius="md"
            borderWidth="1px"
            borderColor="brand.dark.100"
          >
            <HStack spacing={4}>
              <Input
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                display="none"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  as="span"
                  variant="solid"
                  bg="brand.neonBlue"
                  color="white"
                  _hover={{ bg: 'brand.neonGreen' }}
                  loadingText="Uploading..."
                  isLoading={isUploading}
                  cursor="pointer"
                  size="md"
                  leftIcon={<AddIcon />}
                >
                  Add Sound
                </Button>
              </label>
            </HStack>
          </Box>

          <Grid
            templateColumns={{
              base: 'repeat(auto-fill, minmax(120px, 1fr))',
              md: 'repeat(auto-fill, minmax(120px, 1fr))',
            }}
            gap={4}
            p={3}
          >
            {sounds.map((sound) => {
              // Generate a consistent color based on the sound's ID
              const color = generateColor(sound._id);

              return (
                <Box
                  key={sound._id}
                  position="relative"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  role="group"
                >
                  <SoundButton
                    title={sound.title}
                    glowColor={color}
                    onClick={async () => {
                      try {
                        const url = await soundboard.getSoundUrl(
                          sound._id
                        );
                        const audio = new Audio(url);
                        audio.onerror = (e) => {
                          console.error('Audio error:', e);
                          toast({
                            title: 'Error playing sound',
                            description:
                              'Could not load the audio file',
                            status: 'error',
                            duration: 5000,
                            isClosable: true,
                          });
                        };
                        await audio.play();
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
                      }
                    }}
                  />
                  <IconButton
                    aria-label="Delete sound"
                    icon={<DeleteIcon boxSize={4} color="red.500" />}
                    variant="unstyled"
                    size="sm"
                    opacity={0}
                    border="none"
                    borderWidth="0"
                    outline="none"
                    _groupHover={{ opacity: 1 }}
                    _hover={{
                      bg: 'transparent',
                      border: 'none',
                      borderWidth: '0',
                      outline: 'none',
                    }}
                    _active={{
                      bg: 'transparent',
                      border: 'none',
                      borderWidth: '0',
                      outline: 'none',
                    }}
                    _focus={{
                      boxShadow: 'none',
                      border: 'none',
                      borderWidth: '0',
                      outline: 'none',
                    }}
                    position="absolute"
                    top={0}
                    right={1}
                    onClick={() => handleDelete(sound._id)}
                  />
                </Box>
              );
            })}
          </Grid>
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent
          bg="brand.dark.200"
          borderColor="brand.dark.100"
          borderWidth={1}
        >
          <ModalHeader color="white">Add New Sound</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel color="whiteAlpha.900">
                  Title (max 20 characters)
                </FormLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter sound title"
                  maxLength={20}
                  borderColor="whiteAlpha.200"
                  _hover={{ borderColor: 'whiteAlpha.300' }}
                  _focus={{
                    borderColor: 'brand.neonBlue',
                    boxShadow:
                      '0 0 0 1px var(--chakra-colors-brand-neonBlue)',
                  }}
                />
              </FormControl>
              <Button
                onClick={handleUpload}
                isLoading={isUploading}
                width="100%"
                bg="brand.neonBlue"
                color="white"
                _hover={{ bg: 'brand.neonGreen' }}
              >
                Upload
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Soundboard;
