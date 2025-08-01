import * as React from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Flex } from "@ant-design/react-native";
import { useToggle } from "@/hooks";
import { useApp } from "@/providers/AppProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, ParamListBase, NavigationProp, useTheme } from '@react-navigation/native';
import Form, { Input, Switch } from "@/components/Form";
import { useTranslation } from "react-i18next";

const SignInScreen = () => {
  const { t } = useTranslation();
  const { signIn } = useApp();
  const isLoading = useToggle();
  const [form] = Form.useForm();
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();
  const { colors } = useTheme();

  React.useEffect(() => {
    (async () => {
      const email = await AsyncStorage.getItem("email");
      const password = await AsyncStorage.getItem("password");
      const rememberMe = await AsyncStorage.getItem("rememberMe");

      email && form.setFieldValue("email", email);
      password && form.setFieldValue("password", password);
      rememberMe === "true" && form.setFieldValue("rememberMe", true);
    })();
  }, []);

  const onSubmit = () => {
    isLoading.on();
    form.submit();
  };

  const onFinish = async (values) => {
    isLoading.on();
    try {
      await signIn(values.email, values.password, values.rememberMe);
    } catch (error) {
      isLoading.off();
      Alert.alert(t("error"), error.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    const message = Object.values(errorInfo.errorFields)
      .map((field: any) => field.errors.join("\n"))
      .join("\n");

    Alert.alert(t("error"), message);
    isLoading.toggle();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Flex
          direction="column"
          justify="center"
          align="center"
          style={styles.brandWrapper}
        >
          <Image
            resizeMode="contain"
            source={require("@/assets/brand.png")}
            style={styles.brand}
          />
          <Text style={{
            color: colors.text,
            ...styles.brandText
          }}>
            The Best Way to Track Your Stock Portfolio
          </Text>
        </Flex>

        <Form
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          style={styles.form}
          autoComplete="false"
        >
          <Form.Item
            required
            label={t("email")}
            name="email"
            rules={[
              { required: true },
              { type: "email", message: "Invalid email format" },
            ]}
            labelStyle={{ fontSize: 15 }}
            requiredStyle={{ fontSize: 15 }}
          >
            <Input textContentType="oneTimeCode" placeholder={t("required")} />
          </Form.Item>

          <Form.Item
            required
            label={t("password")}
            name="password"
            rules={[{ required: true }]}
            labelStyle={{ fontSize: 15 }}
            requiredStyle={{ fontSize: 15 }}
          >
            <Input.Password placeholder={t("required")} />
          </Form.Item>

          <Form.Item
            label={t("remember me")}
            name="rememberMe"
            valuePropName="checked"
            layout="horizontal"
            labelStyle={{ fontWeight: 300, marginRight: 15, fontSize: 15 }}
            wrapperStyle={{ justifyContent: "flex-end", borderBottomWidth: 0 }}
            bodyStyle={{ flex: 0 }}
          >
            <Switch />
          </Form.Item>

          <Button
            size="large"
            type="primary"
            onPress={onSubmit}
            disabled={isLoading.state}
            loading={isLoading.state}
            style={{
              borderRadius: 10,
              marginBottom: 18,
            }}
          >
            <Text
              style={{ fontWeight: 500, fontSize: 17, color: colors.text }}
            >
              {t("sign in")}
            </Text>
          </Button>

          <Flex justify="center">
            <Text
              style={{ fontWeight: 300, marginRight: 6, color: colors.text }}
            >
              {t("don't have an account?")}
            </Text>
            <TouchableOpacity onPress={() => navigate("SignUp")}>
              <Text style={{ fontWeight: 500, color: colors.text }}>
                {t("sign up")}
              </Text>
            </TouchableOpacity>
          </Flex>
        </Form>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  brandWrapper: {
    paddingVertical: 20,
    paddingHorizontal: 38,
    marginBottom: 15,
  },
  brand: {
    width: 300,
    height: 55,
    marginBottom: 8,
  },
  brandText: {
    fontWeight: 400,
    fontSize: 14,
    letterSpacing: 0.1,
    opacity: 0.6,
  },
  form: {
    marginHorizontal: 15,
    paddingHorizontal: 15,
    backgroundColor: "transparent"
  },
});

export default SignInScreen;
