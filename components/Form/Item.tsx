import React from "react";
import {
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import Colors from "../../constants/Colors";
import { Flex, Form, FormItemProps } from "@ant-design/react-native";

interface Props extends FormItemProps {
  children: React.ReactNode;
  requiredStyle?: StyleProp<ViewStyle | TextStyle>;
}

const Item = ({ children, layout, label, labelStyle, ...props }: Props) => (
  <Flex
    direction={layout === "horizontal" ? "row" : "column"}
    align="start"
    style={[styles.formGroup, props.wrapperStyle]}
  >
    <Flex>
      {props.required && (
        <Text style={[styles.required, props.requiredStyle]}>*</Text>
      )}
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </Flex>
    <Form.Item {...props} noStyle>
      {children}
    </Form.Item>
  </Flex>
);

const styles = StyleSheet.create({
  formGroup: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: Colors.gray400,
    marginBottom: 15,
  },
  required: {
    fontSize: 15,
    color: Colors.danger,
    marginRight: 5,
  },
  label: {
    fontSize: 15,
    fontWeight: 700,
    color: Colors.black,
    marginBlock: 5,
    marginRight: 18,
    justifyContent: "flex-start",
  },
});

export default Item;
