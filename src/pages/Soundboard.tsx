import { useEffect } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { useSoundboard } from '../hooks/useSoundboard';
import { SoundboardHeader } from '../components/SoundboardHeader';
import { AddSoundButton } from '../components/AddSoundButton';
import { SoundGrid } from '../components/SoundGrid';
import { AddSoundModal } from '../components/AddSoundModal';
import { HelpModal } from '../components/HelpModal';
import { useDisclosure } from '@chakra-ui/react';

const Soundboard = () => {
  const {
    isOpen: isUploadModalOpen,
    onOpen: onUploadModalOpen,
    onClose: onUploadModalClose,
  } = useDisclosure();
  const {
    isOpen: isHelpModalOpen,
    onOpen: onHelpModalOpen,
    onClose: onHelpModalClose,
  } = useDisclosure();
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
      onUploadModalOpen();
    }

    e.target.value = '';
  };

  const handleUploadClick = async () => {
    const success = await handleUpload();
    if (success) {
      onUploadModalClose();
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
          <SoundboardHeader
            username={user?.username || ''}
            onHelpModalOpen={onHelpModalOpen}
            onLogout={handleLogout}
          />
          <AddSoundButton onFileInputChange={handleFileInputChange} />
          <SoundGrid
            sounds={sounds}
            isLoading={isLoading}
            onPlaySound={playSound}
            onDeleteSound={handleDelete}
          />
        </VStack>
      </Box>

      <AddSoundModal
        isOpen={isUploadModalOpen}
        onClose={onUploadModalClose}
        title={title}
        setTitle={setTitle}
        isUploading={isUploading}
        onUpload={handleUploadClick}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={onHelpModalClose}
      />
    </Box>
  );
};

export default Soundboard;
