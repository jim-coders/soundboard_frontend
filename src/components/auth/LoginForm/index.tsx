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

export const LoginForm = () => {
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
      navigate('/soundboard');
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to login',
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
  );
};
