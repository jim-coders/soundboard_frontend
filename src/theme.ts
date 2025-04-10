import {
  extendTheme,
  type ThemeConfig,
  type ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react';

// Extend Chakra UI's ButtonProps with our custom props
export interface CustomButtonProps extends ChakraButtonProps {
  glowColor?: string;
}

// Generate a seeded random color based on a string
export const generateColor = (seed: string) => {
  // Simple hash function to generate a number from a string
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use sin function to generate "random" but consistent RGB values
  const r = Math.abs(Math.sin(hash * 1.1)) * 255;
  const g = Math.abs(Math.sin(hash * 2.2)) * 255;
  const b = Math.abs(Math.sin(hash * 3.3)) * 255;

  // Convert to hex and ensure proper formatting
  const toHex = (n: number) => {
    const hex = Math.floor(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  } as ThemeConfig,
  styles: {
    global: {
      body: {
        bg: '#1E1E1E',
        color: 'white',
      },
    },
  },
  colors: {
    brand: {
      neonGreen: '#00FF9D',
      neonBlue: '#00A3FF',
      neonPink: '#FF0099',
      neonPurple: '#9D00FF',
      neonOrange: '#FF6B00',
      dark: {
        100: '#2A2A2A',
        200: '#232323',
        300: '#1E1E1E',
        400: '#141414',
      },
    },
  },
  components: {
    Button: {
      variants: {
        soundPad: {
          width: '120px',
          height: '120px',
          aspectRatio: '1',
          bg: 'black',
          color: 'white',
          border: '3px solid',
          borderColor: 'var(--chakra-colors-borderColor)',
          borderRadius: 'lg',
          transition: 'all 0.2s ease-in-out',
          fontSize: 'sm',
          fontWeight: 'bold',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2',
          position: 'relative',
          overflow: 'hidden',
          transform: 'translateY(-4px)',
          boxShadow:
            '0 8px 12px rgba(0, 0, 0, 0.2), 0 0 10px var(--chakra-colors-borderColor), inset 0 0 15px var(--chakra-colors-borderColor)',
          _before: {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            height: '60%',
            borderRadius: '50%',
            background: 'var(--chakra-colors-borderColor)',
            filter: 'blur(15px)',
            opacity: 0.2,
            zIndex: 0,
          },
          _hover: {
            borderColor: 'var(--chakra-colors-borderColor)',
            boxShadow:
              '0 8px 12px rgba(0, 0, 0, 0.2), 0 0 15px var(--chakra-colors-borderColor), inset 0 0 20px var(--chakra-colors-borderColor)',
            _before: {
              opacity: 0.3,
            },
          },
          _active: {
            transform: 'translateY(0)',
            borderColor: 'var(--chakra-colors-borderColor)',
            boxShadow:
              '0 2px 4px rgba(0, 0, 0, 0.1), 0 0 8px var(--chakra-colors-borderColor), inset 0 0 12px var(--chakra-colors-borderColor)',
            _before: {
              opacity: 0.15,
            },
          },
          _focus: {
            outline: 'none',
            borderColor: 'var(--chakra-colors-borderColor)',
          },
          '& > *': {
            position: 'relative',
            zIndex: 1,
          },
        },
      },
    },
    Box: {
      variants: {
        soundboard: {
          bg: 'brand.dark.300',
          p: { base: 4, md: 6 },
          borderRadius: 'md',
          boxShadow: 'lg',
          border: '1px solid',
          borderColor: 'brand.dark.100',
        },
      },
    },
  },
});

export default theme;
