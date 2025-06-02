import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Input as AntInput, InputProps } from "@ant-design/react-native";
import Feather from "@expo/vector-icons/Feather";
import Colors from "@/constants/Colors";
import { useToggle } from "@/hooks";

export const Input = ({ allowClear = true, ...props }: InputProps) => (
  <AntInput
    inputStyle={styles.input}
    placeholderTextColor={Colors.gray600}
    allowClear={allowClear}
    {...props}
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

const styles = StyleSheet.create({
  input: {
    fontSize: 17,
    color: Colors.black,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderBottomWidth: 0,
  },
});

Input.Password = InputPassword;

export default Input;