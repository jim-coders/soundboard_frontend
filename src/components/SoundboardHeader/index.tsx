import {
  HStack,
  Heading,
  IconButton,
  Text,
  Button,
} from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

interface SoundboardHeaderProps {
  username: string;
  onHelpModalOpen: () => void;
  onLogout: () => void;
}

export const SoundboardHeader = ({
  username,
  onHelpModalOpen,
  onLogout,
}: SoundboardHeaderProps) => {
  return (
    <HStack width="100%" justify="space-between">
      <Link to="/">
        <Heading
          size="lg"
          color="white"
          letterSpacing="tight"
          _hover={{ color: 'brand.neonGreen' }}
          transition="color 0.2s"
        >
          Soundbored
        </Heading>
      </Link>
      <HStack spacing={4}>
        <IconButton
          aria-label="Keyboard shortcuts"
          icon={<QuestionIcon />}
          variant="ghost"
          color="whiteAlpha.900"
          _hover={{ bg: 'whiteAlpha.100' }}
          onClick={onHelpModalOpen}
        />
        <Text color="whiteAlpha.900" fontSize="md">
          {username}
        </Text>
        <Button
          onClick={onLogout}
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
  );
};
