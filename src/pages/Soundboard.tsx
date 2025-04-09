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
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { soundboard } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { SoundButton } from '../components/SoundButton';
import { generateColor } from '../theme';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTitle(file.name.split('.')[0]); // Set default title from filename
      onOpen();
    }
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

    setIsUploading(true);
    try {
      await soundboard.uploadSound(selectedFile, title, description);
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
      setDescription('');
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
                  {sound.description && (
                    <Text
                      fontSize="2xs"
                      color="whiteAlpha.700"
                      mt={2}
                      noOfLines={1}
                      textAlign="center"
                      maxW="95px"
                    >
                      {sound.description}
                    </Text>
                  )}
                  <IconButton
                    aria-label="Delete sound"
                    icon={<DeleteIcon />}
                    variant="ghost"
                    colorScheme="red"
                    size="xs"
                    opacity={0}
                    _groupHover={{ opacity: 1 }}
                    position="absolute"
                    top={-1}
                    right={-1}
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
                <FormLabel color="whiteAlpha.900">Title</FormLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter sound title"
                  borderColor="whiteAlpha.200"
                  _hover={{ borderColor: 'whiteAlpha.300' }}
                  _focus={{
                    borderColor: 'brand.neonBlue',
                    boxShadow:
                      '0 0 0 1px var(--chakra-colors-brand-neonBlue)',
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel color="whiteAlpha.900">
                  Description
                </FormLabel>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter sound description (optional)"
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
