import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { auth } from '../services/api';

export const useSignUpForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

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

    if (username.trim().length < 3) {
      toast({
        title: 'Error',
        description: 'Username must be at least 3 characters',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (!email.trim()) {
      toast({
        title: 'Error',
        description: 'Email is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (!password.trim()) {
      toast({
        title: 'Error',
        description: 'Password is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters',
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
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await auth.signup(username, email, password);
      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to create account. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleSubmit,
  };
};
