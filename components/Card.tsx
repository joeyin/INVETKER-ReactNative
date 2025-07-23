import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Colors from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { Text } from "./Text";

type Props = {
  style?: StyleProp<ViewStyle> | undefined;
  headerStyle?: StyleProp<ViewStyle> | undefined;
  children: React.ReactNode;
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
};

const Card = ({ children, style = {}, headerStyle, title, subtitle }: Props) => {
  const { colors } = useTheme();

  return (
    <View style={[{ backgroundColor: colors.card }, styles.container, style]}>
      {
        title && (
          <View style={[styles.header, headerStyle]}>
            {title &&
              (typeof title === "function" ? (
                title
              ) : (
                <Text style={styles.title}>{title}</Text>
              ))}
            {subtitle &&
              (typeof subtitle === "function" ? (
                subtitle
              ) : (
                <Text style={styles.subtitle}>{subtitle}</Text>
              ))}
          </View>
        )
      }
      {children}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#919191",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.18,
    shadowRadius: 5.68,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  title: {
    fontSize: 21,
    fontWeight: 700,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.secondary,
  },
  header: {
    marginBottom: 10,
  },
});

export default Card;
