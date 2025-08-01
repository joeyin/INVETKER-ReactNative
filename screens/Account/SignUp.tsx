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
import { useNavigation, ParamListBase, NavigationProp, useTheme } from '@react-navigation/native';
import accountController from "@/controllers/accountController";
import Form, { Input } from "@/components/Form";
import { useTranslation } from "react-i18next";

const SignUpScreen = () => {
  const { t } = useTranslation();
  const isLoading = useToggle();
  const [form] = Form.useForm();
  const { goBack, navigate }: NavigationProp<ParamListBase> = useNavigation();
  const { colors } = useTheme();

  const onSubmit = () => {
    isLoading.on();
    form.submit();
  };

  const onFinish = async (values) => {
    isLoading.on();
    try {
      await accountController.signUp(values.name, values.email, values.password);
      Alert.alert("Success", "You have signed up successfully.");
      navigate("SignIn");
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
            label={t("name")}
            name="name"
            rules={[
              { required: true },
            ]}
            labelStyle={{ fontSize: 15 }}
            requiredStyle={{ fontSize: 15 }}
          >
            <Input placeholder={t("required")} />
          </Form.Item>

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
            <Input placeholder={t("required")} />
          </Form.Item>

          <Form.Item
            required
            label={t("password")}
            name="password"
            rules={[{ required: true }, { min: 6 }]}
            labelStyle={{ fontSize: 15 }}
            requiredStyle={{ fontSize: 15 }}
          >
            <Input.Password placeholder={t("required")} />
          </Form.Item>

          <Form.Item
            required
            label={t("confirm password")}
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true },
              { min: 6 },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
            labelStyle={{ fontSize: 15 }}
            requiredStyle={{ fontSize: 15 }}
          >
            <Input.Password placeholder={t("required")} />
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
              style={{ fontWeight: 600, fontSize: 18, color: colors.text }}
            >
              {t("sign up")}
            </Text>
          </Button>

          <Flex justify="center">
            <Text
              style={{
                fontWeight: 300,
                marginRight: 6,
                color: colors.text,
              }}
            >
              {t("already have an account?")}
            </Text>
            <TouchableOpacity onPress={goBack}>
              <Text style={{ fontWeight: 500, color: colors.text }}>
                {t("sign in")}
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

export default SignUpScreen;
