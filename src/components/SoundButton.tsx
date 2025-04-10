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
