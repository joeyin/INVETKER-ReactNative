import React from "react";
import { Switch as AntSwitch, SwitchProps } from "@ant-design/react-native";
import Colors from "@/constants/Colors";

const Switch = (props: SwitchProps) => (
  <AntSwitch color={Colors.primary} {...props} />
);

export default Switch;
