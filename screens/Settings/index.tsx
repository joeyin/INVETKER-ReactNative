import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Flex } from "@ant-design/react-native";
import Colors from "@/constants/Colors";
import { useApp } from "@/providers/AppProvider";
import {
  useNavigation,
  ParamListBase,
  NavigationProp,
} from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import ScrollView from "@/components/Layout/ScrollView";
import List from "@/components/List";
import * as ImagePicker from "expo-image-picker";
import accountController from "@/controllers/accountController";
import { useToggle } from "@/hooks";
import fileController from "@/controllers/fileController";

const SettingsScreen = () => {
  const { signOut, user } = useApp();
  const isLoading = useToggle();
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        return Alert.alert(
          "Error",
          "Please allow the app to access your photos so you can upload or select images."
        );
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.6,
      });

      if (!result.canceled) {
        isLoading.on();
        const photoURL = await fileController.uploadFile(
          result.assets[0].uri
        );
        await accountController.updateProfile({ photoURL });
        isLoading.off();
      }
    } catch (error) {
      isLoading.off();
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView title="Settings">
      <View style={styles.container}>
        <TouchableHighlight
          disabled={isLoading.state}
          style={{
            width: 150,
            height: 150,
            borderRadius: 100,
            alignSelf: "center",
            borderColor: Colors.primary,
            borderWidth: 6,
            overflow: "hidden",
            justifyContent: "center",
            alignContent: "center",
          }}
          underlayColor="transparent"
          onPress={pickImage}
        >
          {isLoading.state ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <Image
              source={{
                uri: user.photoURL,
              }}
              style={{ flex: 1 }}
              resizeMode="cover"
            />
          )}
        </TouchableHighlight>

        <List section="ACCOUNT">
          <List.Item>
            <Text style={styles.name}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>
          </List.Item>
          <List.Item touchable onPress={() => navigate("EditName")}>
            <Text style={styles.name}>Name</Text>
            <Flex align="center">
              <Text style={styles.value}>{user.displayName ?? "-"}</Text>
              <FontAwesome
                name="angle-right"
                size={25}
                color={Colors.secondary}
                style={{ marginLeft: 10 }}
              />
            </Flex>
          </List.Item>
        </List>

        {/* <List section="GENERAL">
          <List.Item>
            <Text style={styles.name}>Language</Text>
            <Text style={styles.value}>English</Text>
          </List.Item>
          <List.Item>
            <Text style={styles.name}>Theme</Text>
            <Text style={styles.value}>Light</Text>
          </List.Item>
        </List> */}

        <List>
          <List.Item touchable onPress={signOut}>
            <Text style={[styles.name, { color: Colors.danger }]}>
              Sign Out
            </Text>
          </List.Item>
        </List>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    gap: 30,
  },
  name: {
    fontSize: 16,
    color: Colors.black,
  },
  value: {
    fontSize: 16,
    color: Colors.secondary,
  },
});

export default SettingsScreen;
