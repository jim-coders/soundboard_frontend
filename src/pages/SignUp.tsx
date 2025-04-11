import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  Container,
  Flex,
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { signup } = useAuth();

  // Form validation
  const validateForm = () => {
    if (!username.trim()) {
      toast({
        title: 'Error',
        description: 'Username is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (!email.trim() || !email.includes('@')) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await signup(username, email, password);

      toast({
        title: 'Account created',
        description: 'Welcome to Soundboard!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Redirect to soundboard page
      navigate('/soundboard', { replace: true });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred during registration';
      toast({
        title: 'Registration failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color="brand.neonBlue">
                    Username
                  </FormLabel>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    borderColor="brand.dark.100"
                    _hover={{ borderColor: 'brand.neonGreen' }}
                    _focus={{
                      borderColor: 'brand.neonGreen',
                      boxShadow:
                        '0 0 0 1px var(--chakra-colors-brand-neonGreen)',
                    }}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color="brand.neonBlue">Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    borderColor="brand.dark.100"
                    _hover={{ borderColor: 'brand.neonGreen' }}
                    _focus={{
                      borderColor: 'brand.neonGreen',
                      boxShadow:
                        '0 0 0 1px var(--chakra-colors-brand-neonGreen)',
                    }}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color="brand.neonBlue">
                    Password
                  </FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    borderColor="brand.dark.100"
                    _hover={{ borderColor: 'brand.neonGreen' }}
                    _focus={{
                      borderColor: 'brand.neonGreen',
                      boxShadow:
                        '0 0 0 1px var(--chakra-colors-brand-neonGreen)',
                    }}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color="brand.neonBlue">
                    Confirm Password
                  </FormLabel>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Confirm your password"
                    borderColor="brand.dark.100"
                    _hover={{ borderColor: 'brand.neonGreen' }}
                    _focus={{
                      borderColor: 'brand.neonGreen',
                      boxShadow:
                        '0 0 0 1px var(--chakra-colors-brand-neonGreen)',
                    }}
                  />
                </FormControl>
                <Button
                  type="submit"
                  width="100%"
                  isLoading={isLoading}
                  bg="brand.neonGreen"
                  color="black"
                  _hover={{ bg: 'brand.neonBlue' }}
                >
                  Sign Up
                </Button>
              </VStack>
            </form>
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
