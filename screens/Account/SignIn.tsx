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
import Colors from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "@/App";
import Form, { Input, Switch } from "@/components/Form";

const SignInScreen = () => {
  const { signIn } = useApp();
  const isLoading = useToggle();
  const [form] = Form.useForm();
  const { navigate } = useNavigation<StackNavigation>();

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
      Alert.alert("Error", error.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    const message = Object.values(errorInfo.errorFields)
      .map((field: any) => field.errors.join("\n"))
      .join("\n");

    Alert.alert("Error", message);
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
          <Text style={styles.brandText}>
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
            label="Email"
            name="email"
            rules={[
              { required: true },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input textContentType="oneTimeCode" placeholder="required" />
          </Form.Item>

          <Form.Item
            required
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="required" />
          </Form.Item>

          <Form.Item
            label="Remember Me"
            name="rememberMe"
            valuePropName="checked"
            layout="horizontal"
            labelStyle={{ fontWeight: "normal" }}
            wrapperStyle={{ justifyContent: "flex-end", borderBottomWidth: 0 }}
          >
            <Switch color={Colors.primary} />
          </Form.Item>

          <Button
            size="large"
            type="primary"
            onPress={onSubmit}
            disabled={isLoading.state}
            loading={isLoading.state}
            style={{
              borderRadius: 10,
              height: "auto",
              paddingVertical: 15,
              marginBottom: 18,
            }}
          >
            <Text
              style={{ fontWeight: 600, fontSize: 18, color: Colors.white }}
            >
              Sign In
            </Text>
          </Button>

          <Flex justify="center">
            <Text
              style={{ fontWeight: 300, marginRight: 6, color: Colors.black }}
            >
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigate("SignUp")}>
              <Text style={{ fontWeight: 500, color: Colors.black }}>
                Sign Up
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
  background: {
    width: "100%",
    height: "100%",
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
    color: Colors.black,
    opacity: 0.6,
  },
  form: {
    backgroundColor: "transparent",
    marginHorizontal: 15,
    paddingHorizontal: 15,
  },
});

export default SignInScreen;
