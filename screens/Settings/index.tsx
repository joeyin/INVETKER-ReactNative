import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import NavigationFlatListView from "../../components/NavigationFlatListView";
import { Flex } from "@ant-design/react-native";
import Colors from "../../constants/Colors";
import { useApp } from "../../providers/AppProvider";

const SettingsScreen = () => {
  const { signOut, user } = useApp();

  const sections = React.useMemo(
    () => [
      {
        title: "ACCOUNT",
        items: [{ name: "Email", value: user.email }],
      },
      {
        title: "",
        items: [
          { name: "Signout", onPress: signOut, textColor: Colors.danger },
        ],
      },
    ],
    [user]
  );

  const renderItem = ({ item, index }) => {
    const { items, title } = item;
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{title}</Text>
        {items.map((i) => (
          <View
            key={index}
            style={styles.itemWrapper}
          >
            {i.onPress ? (
              <TouchableOpacity onPress={i.onPress} style={styles.item}>
                <Text style={{ ...styles.name, color: i.textColor }}>
                  {i.name}
                </Text>
              </TouchableOpacity>
            ) : (
              <Flex justify="between" style={styles.item}>
                <Text style={styles.name}>{i.name}</Text>
                <Text style={styles.value}>{i.value}</Text>
              </Flex>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <NavigationFlatListView
      title="Settings"
      data={sections}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    marginBottom: 15,
    marginTop: 10,
  },
  itemWrapper: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomWidth: 0,
  },
  item: {
    borderColor: Colors.lightGray200,
    marginHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    fontSize: 13,
    marginBottom: 10,
    marginHorizontal: 16,
    color: Colors.secondary,
  },
  name: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
  },
});

export default SettingsScreen;
