import { Box, Input, Button, Text } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

interface AddSoundButtonProps {
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AddSoundButton = ({
  onFileInputChange,
}: AddSoundButtonProps) => {
  return (
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
          accept=".mp3,.m4a,audio/mp3,audio/mp4,audio/x-m4a"
          onChange={onFileInputChange}
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
  );
};
