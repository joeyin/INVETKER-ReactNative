import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Input as AntInput, InputProps, TextAreaProps } from "@ant-design/react-native";
import Feather from "@expo/vector-icons/Feather";
import Colors from "@/constants/Colors";
import { useToggle } from "@/hooks";
import { useTheme } from "@react-navigation/native";

export const Input = ({ ...props }: InputProps) => {
  const { colors } = useTheme();

  return (
    <AntInput
      placeholderTextColor={Colors.gray600}
      {...props}
      inputStyle={[{ color: colors.text }, styles.input, props.inputStyle]}
    />
  )
};

export const InputPassword = (props: InputProps) => {
  const passwordVisible = useToggle();

  return (
    <Input
      {...props}
      textContentType="oneTimeCode"
      type={passwordVisible.state ? "text" : "password"}
      suffix={
        <TouchableOpacity onPress={passwordVisible.toggle}>
          <Feather
            name={passwordVisible.state ? "eye" : "eye-off"}
            size={16}
            color={Colors.secondary}
          />
        </TouchableOpacity>
      }
    />
  );
};

export const InputTextArea = (props: TextAreaProps) => {
  const { colors } = useTheme();

  return (
    <AntInput.TextArea
      inputStyle={{
        color: colors.text,
      }}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 17,
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 35,
  },
});

Input.Password = InputPassword;
Input.TextArea = InputTextArea;

export default Input;