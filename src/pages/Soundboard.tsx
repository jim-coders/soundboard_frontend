import { useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Button,
  Input,
  VStack,
  Heading,
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
  Spinner,
  Center,
  Kbd,
  Divider,
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon, QuestionIcon } from '@chakra-ui/icons';
import { useSoundboard } from '../hooks/useSoundboard';
import { SoundButton } from '../components/SoundButton';
import { generateColor } from '../theme';

const Soundboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isHelpOpen,
    onOpen: onHelpOpen,
    onClose: onHelpClose,
  } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null!);
  const {
    sounds,
    isUploading,
    isLoading,
    title,
    setTitle,
    loadSounds,
    handleFileSelect,
    handleUpload,
    handleDelete,
    handleLogout,
    playSound,
    user,
  } = useSoundboard();

  useEffect(() => {
    loadSounds();
  }, [loadSounds]);

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const success = await handleFileSelect(file);
    if (success) {
      onOpen();
    }

    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  const handleUploadClick = async () => {
    const success = await handleUpload();
    if (success) {
      onClose();
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
              <IconButton
                aria-label="Keyboard shortcuts"
                icon={<QuestionIcon />}
                variant="ghost"
                color="whiteAlpha.900"
                _hover={{ bg: 'whiteAlpha.100' }}
                onClick={onHelpOpen}
              />
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
            position="relative"
            display="flex"
            justifyContent="center"
          >
            <Box
              position="relative"
              width="60px"
              height="60px"
              borderRadius="full"
              bg="brand.dark.300"
              border="2px solid"
              borderColor="brand.neonBlue"
              boxShadow="0 0 10px rgba(0, 255, 255, 0.3)"
              _hover={{
                transform: 'scale(1.05)',
                boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)',
                borderColor: 'brand.neonGreen',
              }}
              _active={{
                transform: 'scale(0.95)',
                boxShadow: '0 0 5px rgba(0, 255, 255, 0.2)',
              }}
              transition="all 0.2s ease-in-out"
            >
              <Input
                type="file"
                accept="audio/*"
                onChange={handleFileInputChange}
                id="file-upload"
                opacity={0}
                position="absolute"
                zIndex={1}
                width="100%"
                height="100%"
                cursor="pointer"
                borderRadius="full"
                pointerEvents="none"
              />
              <Button
                as="label"
                htmlFor="file-upload"
                variant="unstyled"
                width="100%"
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                position="relative"
                _hover={{}}
                _active={{}}
              >
                <AddIcon
                  boxSize={6}
                  color="brand.neonBlue"
                  transition="all 0.2s ease-in-out"
                  _groupHover={{
                    color: 'brand.neonGreen',
                    transform: 'rotate(90deg)',
                  }}
                />
              </Button>
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                width="40px"
                height="40px"
                borderRadius="full"
                border="2px solid"
                borderColor="brand.neonBlue"
                opacity={0.3}
                pointerEvents="none"
              />
            </Box>
            <Text
              position="absolute"
              bottom="-20px"
              color="whiteAlpha.700"
              fontSize="xs"
              textAlign="center"
              width="100%"
            >
              Add Sound
            </Text>
          </Box>

          {isLoading ? (
            <Center py={10}>
              <Spinner size="xl" color="brand.neonBlue" />
            </Center>
          ) : (
            <Grid
              templateColumns={{
                base: 'repeat(9, 1fr)',
                md: 'repeat(9, 1fr)',
              }}
              gap={4}
              p={3}
              maxW="1600px"
              mx="auto"
            >
              {sounds.map((sound, index) => {
                const color = generateColor(sound._id);
                return (
                  <Box
                    key={sound._id}
                    position="relative"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    role="group"
                    w="100%"
                    h="160px"
                  >
                    <SoundButton
                      title={sound.title}
                      glowColor={color}
                      onClick={() => playSound(sound)}
                      w="100%"
                      h="100%"
                      minH="160px"
                    />
                    <Text
                      position="absolute"
                      top={-6}
                      color="whiteAlpha.700"
                      fontSize="xs"
                    >
                      {index < 9 ? `[${index + 1}]` : ''}
                    </Text>
                    <IconButton
                      aria-label="Delete sound"
                      icon={
                        <DeleteIcon boxSize={4} color="red.500" />
                      }
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
          )}
        </VStack>
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={inputRef}
      >
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent
          bg="brand.dark.200"
          borderColor="brand.dark.100"
          borderWidth={1}
        >
          <ModalHeader color="white">Add New Sound</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUploadClick();
              }}
            >
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.900">
                    Title (max 20 characters)
                  </FormLabel>
                  <Input
                    ref={inputRef}
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
                  type="submit"
                  isLoading={isUploading}
                  width="100%"
                  bg="brand.neonBlue"
                  color="white"
                  _hover={{ bg: 'brand.neonGreen' }}
                >
                  Upload
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isHelpOpen} onClose={onHelpClose}>
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent
          bg="brand.dark.200"
          borderColor="brand.dark.100"
          borderWidth={1}
        >
          <ModalHeader color="white">Keyboard Shortcuts</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6} align="stretch">
              <Box>
                <Text
                  color="white"
                  fontWeight="bold"
                  mb={3}
                  fontSize="lg"
                >
                  Play Sounds
                </Text>
                <VStack spacing={3} align="stretch">
                  <HStack spacing={2}>
                    <Kbd
                      bg="brand.dark.300"
                      color="white"
                      borderColor="brand.neonBlue"
                    >
                      1
                    </Kbd>
                    <Text color="whiteAlpha.900">-</Text>
                    <Kbd
                      bg="brand.dark.300"
                      color="white"
                      borderColor="brand.neonBlue"
                    >
                      9
                    </Kbd>
                    <Text color="whiteAlpha.900">
                      Play first 9 sounds
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Kbd
                      bg="brand.dark.300"
                      color="white"
                      borderColor="brand.neonBlue"
                    >
                      Shift
                    </Kbd>
                    <Text color="whiteAlpha.900">+</Text>
                    <Kbd
                      bg="brand.dark.300"
                      color="white"
                      borderColor="brand.neonBlue"
                    >
                      1
                    </Kbd>
                    <Text color="whiteAlpha.900">-</Text>
                    <Kbd
                      bg="brand.dark.300"
                      color="white"
                      borderColor="brand.neonBlue"
                    >
                      9
                    </Kbd>
                    <Text color="whiteAlpha.900">
                      Play sounds 10-18
                    </Text>
                  </HStack>
                </VStack>
              </Box>
              <Divider borderColor="whiteAlpha.300" />
              <Box>
                <Text
                  color="white"
                  fontWeight="bold"
                  mb={3}
                  fontSize="lg"
                >
                  Control
                </Text>
                <HStack spacing={2}>
                  <Kbd
                    bg="brand.dark.300"
                    color="white"
                    borderColor="brand.neonBlue"
                  >
                    Space
                  </Kbd>
                  <Text color="whiteAlpha.900">
                    Stop current sound
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Soundboard;
