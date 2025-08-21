import React from "react";
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import Colors from "@/constants/Colors";
import { Flex, Form, FormItemProps } from "@ant-design/react-native";
import { useTheme } from "@react-navigation/native";
import { Text } from "../Text";

interface Props extends FormItemProps {
  children: React.ReactNode;
  requiredStyle?: StyleProp<ViewStyle | TextStyle>;
  labelWrapperStyle?: ViewStyle;
  bodyStyle?: ViewStyle;
}

const Item = ({
  children,
  layout,
  label,
  labelWrapperStyle,
  labelStyle,
  bodyStyle,
  ...props
}: Props) => {
  const { colors } = useTheme();

  return (
    <Flex
      direction={layout === "horizontal" ? "row" : "column"}
      align={layout === "horizontal" ? "center" : "start"}
      style={[
        { backgroundColor: colors.background },
        { borderColor: colors.border },
        styles.formGroup,
        props.wrapperStyle,
      ]}
    >
      {label && (
        <Flex style={labelWrapperStyle}>
          {props.required && (
            <Text style={[styles.required, props.requiredStyle]}>*</Text>
          )}
          <Text style={[styles.label, labelStyle]}>{label}</Text>
        </Flex>
      )}
      <View style={[styles.body, bodyStyle]}>
        <Form.Item {...props} noStyle>
          {children}
        </Form.Item>
      </View>
    </Flex>
  );
};

const styles = StyleSheet.create({
  formGroup: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    // borderColor: Colors.lightGray200,
    marginBottom: 15,
  },
  required: {
    fontSize: 17,
    color: Colors.danger,
    marginRight: 5,
  },
  label: {
    fontSize: 17,
    fontWeight: 500,
  },
  body: {
    flex: 1,
  },
});

export default Item;
