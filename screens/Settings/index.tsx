import React from "react";
import {
  View,
  StyleSheet,
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
import Image from "@/components/Image";
import { useTranslation } from "react-i18next";
import storageService from "@services/storageService";
import { Picker } from "@/components/Form";
import themeService from "@services/themeService";
import { Text } from "@/components/Text";

const SettingsScreen = () => {
  const { signOut, user, reloadAuth, theme } = useApp();
  const { t, i18n } = useTranslation();
  const isLoading = useToggle();
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        return Alert.alert(
          t("error"),
          t("please allow the app to access your photos so you can upload or select images.")
        );
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.6,
      });

      if (!result.canceled) {
        isLoading.on();
        const photoURL = await fileController.uploadFile(result.assets[0].uri);
        await accountController.updateProfile({ photoURL });
        isLoading.off();
        reloadAuth();
      }
    } catch (error) {
      isLoading.off();
      Alert.alert(t("error"), error.message);
    }
  };

  const changeLanguage = (locale: string) => {
    i18n.changeLanguage(locale);
    storageService.store("locale", locale)
  };

  const changeTheme = (theme: string) => {
    themeService.changeTheme(theme);
    storageService.store("theme", theme)
  };

  return (
    <ScrollView title={t("settings")}>
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
              type="avatar"
              displayName={user.displayName}
              source={{
                uri: user.photoURL,
              }}
              style={{ flex: 1 }}
              resizeMode="cover"
            />
          )}
        </TouchableHighlight>

        <List section={t("account").toUpperCase()}>
          <List.Item>
            <Text style={styles.name}>{t("email")}</Text>
            <Text style={styles.value}>{user.email}</Text>
          </List.Item>
          <List.Item touchable onPress={() => navigate("EditName")}>
            <Text style={styles.name}>{t("name")}</Text>
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

        <List section={t("general").toUpperCase()}>
          <List.Item>
            <Text style={styles.name}>{t("language")}</Text>
            <Picker
              defaultValue={[i18n.language]}
              styles={{
                wrapperStyle: { height: 20 },
                textStyle: { color: Colors.secondary },
              }}
              data={[
                { label: t("en"), value: "en" },
                { label: t("zh-TW"), value: "zh-TW" },
                { label: t("zh-CN"), value: "zh-CN" },
                { label: t("hi-IN"), value: "hi-IN" },
              ]}
              onOk={(k, i) => changeLanguage(i.items[0].value as string)}
            />
          </List.Item>
          <List.Item>
            <Text style={styles.name}>{t("theme")}</Text>
            <Picker
              defaultValue={[theme]}
              styles={{
                wrapperStyle: { height: 20 },
                textStyle: { color: Colors.secondary },
              }}
              data={[
                { label: t("light"), value: "light" },
                { label: t("dark"), value: "dark" },
              ]}
              onOk={(k, i) => changeTheme(i.items[0].value as string)}
            />
          </List.Item>
        </List>

        <List>
          <List.Item touchable onPress={signOut}>
            <Text style={[styles.name, { color: Colors.danger }]}>
              {t("sign out")}
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
  },
  value: {
    fontSize: 16,
    color: Colors.secondary,
  },
});

export default SettingsScreen;
