import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Box,
  Text,
  HStack,
  Kbd,
  Divider,
} from '@chakra-ui/react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
                <Text color="whiteAlpha.900">Stop current sound</Text>
              </HStack>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
