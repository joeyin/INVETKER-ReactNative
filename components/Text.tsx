import { useTheme } from "@react-navigation/native";
import { Text as RNText, TextProps } from "react-native";

export const Text = ({ children, style = {}, ...props }: TextProps) => {
  const { colors } = useTheme();

  return (
    <RNText style={[{ color: colors.text }, style]} {...props}>
      {children}
    </RNText>
  );
};
