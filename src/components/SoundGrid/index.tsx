import {
  Grid,
  Box,
  Text,
  IconButton,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { SoundButton } from '../SoundButton';
import { generateColor } from '../../theme';
import { Sound } from '../../types';

interface SoundGridProps {
  sounds: Sound[];
  isLoading: boolean;
  onPlaySound: (sound: Sound) => void;
  onDeleteSound: (id: string) => void;
}

export const SoundGrid = ({
  sounds,
  isLoading,
  onPlaySound,
  onDeleteSound,
}: SoundGridProps) => {
  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="brand.neonBlue" />
      </Center>
    );
  }

  return (
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
              onClick={() => onPlaySound(sound)}
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
              onClick={() => onDeleteSound(sound._id)}
            />
          </Box>
        );
      })}
    </Grid>
  );
};
