import { Button, ButtonProps, Text } from '@chakra-ui/react';

interface SoundButtonProps extends ButtonProps {
  title: string;
  glowColor?: string;
}

export const SoundButton = ({
  title,
  glowColor,
  ...props
}: SoundButtonProps) => {
  return (
    <Button
      variant="soundPad"
      borderColor={glowColor}
      _hover={{
        transform: 'translateY(-2px)',
        bg: 'blackAlpha.600',
        boxShadow: `0 4px 12px ${glowColor}40`,
        borderColor: glowColor,
      }}
      _active={{
        transform: 'translateY(0)',
        bg: 'blackAlpha.700',
        boxShadow: `0 0 16px ${glowColor}60`,
        borderColor: glowColor,
      }}
      {...props}
    >
      <Text
        width="100%"
        textOverflow="ellipsis"
        overflow="hidden"
        whiteSpace="nowrap"
      >
        {title}
      </Text>
    </Button>
  );
};
