import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Colors from "../constants/Colors";

type Props = {
  visible: boolean;
  onPress: () => void
}

const PasswordEyeToggle = ({ visible, onPress }: Props) => (
  <TouchableOpacity onPress={onPress}>
    <Feather
      name={visible ? "eye" : "eye-off"}
      size={16}
      color={Colors.secondary}
    />
  </TouchableOpacity>
);

export default PasswordEyeToggle;