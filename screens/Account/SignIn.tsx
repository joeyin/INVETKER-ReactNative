import * as React from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Form, Input, Button, Flex, Switch } from "@ant-design/react-native";
import { useToggle } from "../../hooks";
import { useApp } from "../../providers/AppProvider";
import Colors from "../../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../../App";
import PasswordEyeToggle from "../../components/PasswordEyeToggle";

const SignInScreen = () => {
  const { signIn } = useApp();
  const isLoading = useToggle();
  const passwordVisible = useToggle();
  const [form] = Form.useForm();
  const { navigate } = useNavigation<StackNavigation>();

  React.useEffect(() => {
    (async () => {
      const email = await AsyncStorage.getItem("email");
      const password = await AsyncStorage.getItem("password");

      email && form.setFieldValue("email", email);
      password && form.setFieldValue("password", password);
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
            source={require("../../assets/brand.png")}
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
          styles={{
            Body: {
              borderTopWidth: 0,
            },
            BodyBottomLine: {
              display: "none",
            },
          }}
          style={styles.form}
          autoComplete="false"
          initialValues={{
            rememberMe: true,
          }}
        >
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <Form.Item
              name="email"
              rules={[
                { required: true },
                { type: "email", message: "Invalid email format" },
              ]}
              noStyle
            >
              <Input
                textContentType="oneTimeCode"
                placeholder="required"
                inputStyle={styles.input}
                placeholderTextColor={Colors.gray600}
              />
            </Form.Item>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <Form.Item name="password" rules={[{ required: true }]} noStyle>
              <Input
                textContentType="oneTimeCode"
                placeholder="required"
                type={passwordVisible.state ? "text" : "password"}
                inputStyle={styles.input}
                placeholderTextColor={Colors.gray600}
                suffix={
                  <PasswordEyeToggle
                    visible={passwordVisible.state}
                    onPress={passwordVisible.toggle}
                  />
                }
              />
            </Form.Item>
          </View>

          <Flex justify="end" style={{ marginBottom: 20 }}>
            <Text style={{ marginRight: 18 }}>Remember Me</Text>
            <Form.Item name="rememberMe" noStyle valuePropName="checked">
              <Switch color={Colors.primary} />
            </Form.Item>
          </Flex>

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
  formGroup: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: Colors.gray400,
    marginBottom: 15,
  },
  label: {
    fontSize: 15,
    fontWeight: 700,
    color: Colors.black,
    marginBlock: 5,
  },
  input: {
    fontSize: 17,
    color: Colors.black,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderBottomWidth: 0,
  },
});

export default SignInScreen;
