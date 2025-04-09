import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/soundboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description:
          error instanceof Error
            ? error.message
            : 'An error occurred',
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
              Login
            </Heading>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4}>
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
                    placeholder="Enter your password"
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
                  Login
                </Button>
              </VStack>
            </form>
            <Text color="whiteAlpha.800">
              Don't have an account?{' '}
              <Link
                as={RouterLink}
                to="/signup"
                color="brand.neonBlue"
              >
                Sign Up
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Flex>
  );
};

export default Login;
