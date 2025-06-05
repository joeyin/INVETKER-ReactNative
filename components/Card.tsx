import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Colors from "@/constants/Colors";

type Props = {
  style?: StyleProp<ViewStyle> | undefined;
  headerStyle?: StyleProp<ViewStyle> | undefined;
  children: React.ReactNode;
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
};

const Card = ({ children, style, headerStyle, title, subtitle }: Props) => (
  <View style={[styles.container, style]}>
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
);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    borderRadius: 8,
    backgroundColor: Colors.white,
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
