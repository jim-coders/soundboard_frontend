import { Box, ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthProvider';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Soundboard from './pages/Soundboard';
import PrivateRoute from './components/PrivateRoute';
import { Landing } from './pages/Landing';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router basename="/">
          <Box width="100vw" minH="100vh" overflow="hidden">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/soundboard"
                element={
                  <PrivateRoute>
                    <Soundboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Box>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
