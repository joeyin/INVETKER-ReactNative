import React from "react";
import { TouchableOpacity, View, TextStyle, ViewStyle } from "react-native";
import {
  Picker as AntPicker,
  PickerProps,
  Flex,
} from "@ant-design/react-native";
import Colors from "@/constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";
import { PickerStyle } from "@ant-design/react-native/lib/picker/style";
import { Text } from "../Text";
import { useTranslation } from "react-i18next";

interface Props extends PickerProps {
  styles?: Partial<PickerStyle> & {
    textStyle?: TextStyle;
    wrapperStyle?: ViewStyle;
  };
}

export const Picker = ({ styles = {}, ...props }: Props) => {
  const { t } = useTranslation();

  const CustomChildren = (props) => (
    <View
      style={{ height: 35, justifyContent: "center", ...styles.wrapperStyle }}
    >
      {props.children}
      <TouchableOpacity onPress={props.onPress}>
        <Flex>
          <Text style={[{ fontSize: 17 }, styles.textStyle]}>
            {props.extra}
          </Text>
          <Entypo
            name="select-arrows"
            style={[{ fontSize: 15 }, styles.textStyle]}
          />
        </Flex>
      </TouchableOpacity>
    </View>
  );

  return (
    <AntPicker
      dismissText={t("cancel")}
      okText={t("ok")}
      styles={Object.assign(
        {
          okText: { color: Colors.primary },
          dismissText: { color: Colors.primary },
        },
        styles
      )}
      {...props}
    >
      <CustomChildren />
    </AntPicker>
  );
};

export default Picker;
