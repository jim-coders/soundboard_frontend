import {
  Box,
  VStack,
  Heading,
  Text,
  Link,
  Container,
  Flex,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { SignUpForm } from '../components/auth/SignUpForm';

const SignUp = () => {
  return (
    <Flex
      minH="100vh"
      width="100%"
      bg="brand.dark.400"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Container maxW="md">
        <Box
          bg="brand.dark.300"
          p={8}
          borderRadius="xl"
          boxShadow="dark-lg"
          border="2px solid"
          borderColor="brand.dark.100"
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            borderRadius: 'xl',
            padding: '2px',
            background:
              'linear-gradient(45deg, var(--chakra-colors-brand-neonGreen), var(--chakra-colors-brand-neonBlue))',
            WebkitMask:
              'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            zIndex: -1,
          }}
        >
          <VStack spacing={6}>
            <Heading
              bgGradient="linear(to-r, brand.neonGreen, brand.neonBlue)"
              bgClip="text"
              textShadow="0 0 10px rgba(57, 255, 20, 0.5)"
            >
              Sign Up
            </Heading>
            <SignUpForm />
            <Text color="whiteAlpha.800">
              Already have an account?{' '}
              <Link
                as={RouterLink}
                to="/login"
                color="brand.neonBlue"
              >
                Login
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Flex>
  );
};

export default SignUp;
