import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Input as AntInput, InputProps, TextAreaProps } from "@ant-design/react-native";
import Feather from "@expo/vector-icons/Feather";
import Colors from "@/constants/Colors";
import { useToggle } from "@/hooks";

export const Input = ({ ...props }: InputProps) => (
  <AntInput
    placeholderTextColor={Colors.gray600}
    {...props}
    inputStyle={[styles.input, props.inputStyle]}
  />
);

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

  return (
    <AntInput.TextArea
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 17,
    color: Colors.black,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderBottomWidth: 0,
    height: 35,
  },
});

Input.Password = InputPassword;
Input.TextArea = InputTextArea;

export default Input;