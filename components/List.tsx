import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import Card from "./Card";
import { Flex } from "@ant-design/react-native";
import { useTheme } from "@react-navigation/native";
import { Text } from "./Text";

const List = ({ section = undefined, children, style = {}, ...props }) => {
  const { colors } = useTheme();

  return (
    <View>
      {section && <Text style={styles.section}>{section}</Text>}
      {children && (
        <Card style={[styles.card, style]} {...props}>
          {React.Children.map(children, (child, index) =>
            React.cloneElement(child, {
              style:
                React.Children.count(children) === 1
                  ? {
                    borderBottomWidth: 0,
                    paddingBottom: 0,
                    ...child?.props?.style,
                  }
                  : index === children.length - 1
                    ? {
                      borderBottomWidth: 0,
                      paddingBottom: 0,
                      ...child?.props?.style,
                    }
                    : child?.props?.style,
            })
          )}
        </Card>
      )}
    </View>
  )
};

const ListItem = ({
  children,
  style = {},
  touchable = false,
  onPress = () => { },
}: {
  children?: React.ReactNode;
  style?: ViewStyle;
  touchable?: boolean;
  onPress?: () => void;
}) => {
  const { colors } = useTheme();

  return touchable ? (
    <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
      <Flex direction="row" justify="between" style={[{ borderBottomColor: colors.border }, styles.item, style]}>
        {children}
      </Flex>
    </TouchableOpacity>
  ) : (
    <View style={[{ borderBottomColor: colors.border }, styles.item, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
  section: {
    fontSize: 13,
    marginBottom: 10,
    marginHorizontal: 15,
    // color: Colors.secondary,
  },
  item: {
    // borderBottomColor: Colors.lightGray200,
    borderBottomWidth: 1,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

List.Item = ListItem;

export default List;
