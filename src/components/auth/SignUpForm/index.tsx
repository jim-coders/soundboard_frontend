import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  VStack,
  useToast,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useAuth } from '../../../hooks/useAuth';
import { auth } from '../../../services/api';

export const SignUpForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();

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
      await auth.signup(username, email, password);
      await login(email, password);
      navigate('/soundboard');
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to sign up',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel color="brand.neonBlue">Username</FormLabel>
          <Input
            type="text"
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
          <FormLabel color="brand.neonBlue">Password</FormLabel>
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
            onChange={(e) => setConfirmPassword(e.target.value)}
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
  );
};
