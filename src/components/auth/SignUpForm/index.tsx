import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Box,
} from '@chakra-ui/react';
import { useSignUpForm } from '../../../hooks/useSignUpForm';

export const SignUpForm = () => {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleSubmit,
  } = useSignUpForm();

  const isUsernameInvalid =
    username.trim().length > 0 && username.trim().length < 3;

  return (
    <VStack as="form" spacing={4} onSubmit={handleSubmit}>
      <FormControl isRequired isInvalid={isUsernameInvalid}>
        <FormLabel color="whiteAlpha.900">Username</FormLabel>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          borderColor="whiteAlpha.200"
          _hover={{ borderColor: 'whiteAlpha.300' }}
          _focus={{
            borderColor: 'brand.neonBlue',
            boxShadow:
              '0 0 0 1px var(--chakra-colors-brand-neonBlue)',
          }}
        />
        <Box h="20px" mt={1}>
          {isUsernameInvalid && (
            <FormErrorMessage>
              Username must be at least 3 characters
            </FormErrorMessage>
          )}
        </Box>
      </FormControl>
      <FormControl isRequired>
        <FormLabel color="whiteAlpha.900">Email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          borderColor="whiteAlpha.200"
          _hover={{ borderColor: 'whiteAlpha.300' }}
          _focus={{
            borderColor: 'brand.neonBlue',
            boxShadow:
              '0 0 0 1px var(--chakra-colors-brand-neonBlue)',
          }}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel color="whiteAlpha.900">Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          borderColor="whiteAlpha.200"
          _hover={{ borderColor: 'whiteAlpha.300' }}
          _focus={{
            borderColor: 'brand.neonBlue',
            boxShadow:
              '0 0 0 1px var(--chakra-colors-brand-neonBlue)',
          }}
        />
      </FormControl>
      <Button
        type="submit"
        isLoading={isLoading}
        width="100%"
        bg="brand.neonBlue"
        color="white"
        _hover={{ bg: 'brand.neonGreen' }}
      >
        Sign Up
      </Button>
    </VStack>
  );
};
