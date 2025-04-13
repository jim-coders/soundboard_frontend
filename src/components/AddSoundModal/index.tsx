import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
} from '@chakra-ui/react';
import { useRef } from 'react';

interface AddSoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  setTitle: (title: string) => void;
  isUploading: boolean;
  onUpload: () => void;
}

export const AddSoundModal = ({
  isOpen,
  onClose,
  title,
  setTitle,
  isUploading,
  onUpload,
}: AddSoundModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null!);

  return (
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
              onUpload();
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
  );
};
