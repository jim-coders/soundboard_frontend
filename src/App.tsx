import { ChakraProvider } from '@chakra-ui/react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Soundboard from './pages/Soundboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ChakraProvider>
      <Router>
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
          <Route
            path="/"
            element={<Navigate to="/soundboard" replace />}
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
