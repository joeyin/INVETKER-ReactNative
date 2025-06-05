import React from "react";
import { TouchableOpacity, View, Text, TextStyle } from "react-native";
import {
  Picker as AntPicker,
  PickerProps,
  Flex,
} from "@ant-design/react-native";
import Colors from "@/constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";
import { PickerStyle } from "@ant-design/react-native/lib/picker/style";

interface Props extends PickerProps {
  styles?: Partial<PickerStyle> & { textStyle?: TextStyle }
}

export const Picker = ({
  okText = "OK",
  styles = {},
  ...props
}: Props) => {
  const CustomChildren = (props) => (
    <View style={{ height: 35, justifyContent: "center" }}>
      {props.children}
      <TouchableOpacity onPress={props.onPress}>
        <Flex>
          <Text style={[{ fontSize: 17 }, styles.textStyle]}>{props.extra}</Text>
          <Entypo name="select-arrows" style={[{ fontSize: 15 }, styles.textStyle]} />
        </Flex>
      </TouchableOpacity>
    </View>
  );

  return (
    <AntPicker
      styles={Object.assign(
        {
          okText: { color: Colors.primary },
          dismissText: { color: Colors.primary },
        },
        styles
      )}
      okText={okText}
      {...props}
    >
      <CustomChildren />
    </AntPicker>
  );
};

export default Picker;
