import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Soundboard from './pages/Soundboard';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Box width="100vw" minH="100vh" overflow="hidden">
            <Routes>
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
              <Route path="/" element={<Login />} />
            </Routes>
          </Box>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
