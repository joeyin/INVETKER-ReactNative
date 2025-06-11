import React from "react";
import {
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import Colors from "@/constants/Colors";
import { Flex, Form, FormItemProps } from "@ant-design/react-native";

interface Props extends FormItemProps {
  children: React.ReactNode;
  requiredStyle?: StyleProp<ViewStyle | TextStyle>;
  labelWrapperStyle?: ViewStyle;
  bodyStyle?: ViewStyle;
}

const Item = ({ children, layout, label, labelWrapperStyle, labelStyle, bodyStyle, ...props }: Props) => (
  <Flex
    direction={layout === "horizontal" ? "row" : "column"}
    align={layout === "horizontal" ? "center" : "start"}
    style={[styles.formGroup, props.wrapperStyle]}
  >
    {
      label && (
        <Flex style={labelWrapperStyle}>
          {props.required && (
            <Text style={[styles.required, props.requiredStyle]}>*</Text>
          )}
          <Text style={[styles.label, labelStyle]}>{label}</Text>
        </Flex>
      )
    }
    <View style={[styles.body, bodyStyle]}>
      <Form.Item {...props} noStyle>
        {children}
      </Form.Item>
    </View>
  </Flex>
);

const styles = StyleSheet.create({
  formGroup: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: Colors.lightGray200,
    marginBottom: 15
  },
  required: {
    fontSize: 17,
    color: Colors.danger,
    marginRight: 5,
  },
  label: {
    fontSize: 17,
    fontWeight: 500,
    color: Colors.black,
  },
  body:{
    flex: 1,
  },
});

export default Item;
