import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Flex,
} from '@chakra-ui/react';
import { FallingNotes } from '../components/FallingNotes';

const triggerCelebration = () => {
  confetti({
    particleCount: 500,
    spread: 500,
    origin: { y: 0.4 },
  });
};

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box position="relative" minH="100vh" overflow="hidden">
      <FallingNotes />
      <Flex justify="flex-end" p={4} position="relative" zIndex={2}>
        <Button
          variant="ghost"
          colorScheme="green"
          onClick={() => navigate('/login')}
          _hover={{ transform: 'scale(1.05)' }}
          transition="all 0.2s"
        >
          Login
        </Button>
      </Flex>
      <Container
        maxW="container.md"
        py={10}
        position="relative"
        zIndex={1}
      >
        <VStack spacing={8} align="center">
          <Heading
            as="h1"
            size="2xl"
            textAlign="center"
            bgGradient="linear(to-r, brand.neonGreen, brand.neonBlue)"
            bgClip="text"
          >
            Soundbored
          </Heading>

          <Text fontSize="xl" textAlign="center" color="gray.300">
            Another soundboard except its free and there's no ads
          </Text>

          <Text fontSize="lg" color="gray.400" textAlign="center">
            Unless it gets popular then you can expect ads 😤
          </Text>

          <Box py={4}>
            <Button
              size="lg"
              colorScheme="green"
              onClick={() => navigate('/signup')}
              _hover={{ transform: 'scale(1.05)' }}
              transition="all 0.2s"
            >
              Make Some Noise
            </Button>
          </Box>

          <Text fontSize="sm" color="gray.500" textAlign="center">
            Imagine if there was{' '}
            <span onClick={triggerCelebration}>confetti</span> when an
            emoji hits a corner...
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};
