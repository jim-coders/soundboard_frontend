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
      style={
        {
          '--chakra-colors-borderColor': glowColor,
        } as React.CSSProperties
      }
      display="flex"
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      <Text
        width="100%"
        textOverflow="ellipsis"
        overflow="hidden"
        whiteSpace="nowrap"
        fontSize="lg"
        fontWeight="medium"
        px={2}
      >
        {title}
      </Text>
    </Button>
  );
};
