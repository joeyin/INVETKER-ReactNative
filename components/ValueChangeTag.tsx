import Colors from "@/constants/Colors";
import { Flex } from "@ant-design/react-native";
import React from "react";
import { Text, StyleSheet, StyleProp, TextStyle } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { formatDecimal } from "@/helpers/formatHelpers";

type Props = {
  value: string | number;
  style?: StyleProp<TextStyle> | undefined;
  arrow?: boolean;
  unit?: string | React.ReactNode;
  suffix?: string | React.ReactNode;
  prefix?: string | React.ReactNode;
  format?: "Integer" | "Decimal";
  signed?: boolean;
  colored?: boolean;
};

const ValueChangeTag = ({
  value,
  style,
  arrow,
  unit,
  prefix,
  suffix,
  format,
  signed,
  colored = true,
}: Props) => {
  const number = typeof value === "number" ? value : parseFloat(value);
  const color = colored ? number === 0 ? "" : number > 0 ? styles.success : styles.danger : "";
  return (
    <Flex align="center">
      {arrow &&
        (number == 0 ? (
          ""
        ) : number > 0 ? (
          <AntDesign name="caretup" size={13} style={[color, styles.caret]} />
        ) : (
          <AntDesign name="caretdown" size={13} style={[color, styles.caret]} />
        ))}
      <Text style={[color, style]}>
        {prefix &&
          (typeof prefix === "function" ? prefix : <Text>{prefix}</Text>)}
        {signed && (number > 0 ? "+" : "")}
        {!format
          ? value
          : format === "Decimal"
            ? formatDecimal(number)
            : formatDecimal(number)}
        {unit && (typeof unit === "function" ? unit : <Text>{unit}</Text>)}
        {suffix &&
          (typeof suffix === "function" ? suffix : <Text>{suffix}</Text>)}
      </Text>
    </Flex>
  );
};

const styles = StyleSheet.create({
  caret: {
    marginRight: 5,
  },
  success: {
    color: Colors.success,
  },
  danger: {
    color: Colors.danger,
  },
});

export default ValueChangeTag;
