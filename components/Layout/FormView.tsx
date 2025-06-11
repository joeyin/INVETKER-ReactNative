import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Colors from "@/constants/Colors";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToggle } from "@/hooks";
import Form from "@/components/Form";
import { Flex, FormProps } from "@ant-design/react-native";

interface Props extends Omit<FormProps, "title"> {
  title: string | React.ReactNode;
  onFinish?: (values: any) => void;
  children: React.ReactNode;
  allowSave?: boolean;
  subTitle?: React.ReactNode;
}

const FormView = ({
  children,
  subTitle,
  title,
  onFinish,
  allowSave = true,
  ...props
}: Props) => {
  const { goBack } = useNavigation();
  const isLoading = useToggle();
  const [form] = Form.useForm();
  const { top } = useSafeAreaInsets();

  const handleOnSubmit = () => {
    isLoading.on();
    form.submit();
  };

  const handleOnFinish = async (values) => {
    isLoading.on();
    try {
      onFinish && onFinish(values);
    } catch (error) {
      isLoading.off();
      Alert.alert("Error", error.message);
    }
  };

  const handleOnFinishFailed = (errorInfo) => {
    const message = Object.values(errorInfo.errorFields)
      .map((field: any) => field.errors.join("\n"))
      .join("\n");

    Alert.alert("Error", message);
    isLoading.toggle();
  };

  return (
    <View style={{ paddingTop: top }}>
      <View style={headerStyles.container}>
        <Flex>
          <View style={headerStyles.leftContainer}>
            <TouchableOpacity onPress={goBack}>
              <FontAwesome name="angle-left" size={30} color={Colors.black} />
            </TouchableOpacity>
          </View>
          <View style={headerStyles.centerContainer}>
            {typeof title === "function" ? (
              title
            ) : (
              <Text style={headerStyles.title}>{title}</Text>
            )}
          </View>
          <View style={headerStyles.rightContainer}>
            {allowSave && (
              <TouchableOpacity onPress={handleOnSubmit}>
                <Text style={{ fontSize: 17, color: Colors.primary }}>
                  Save
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Flex>
        {subTitle}
      </View>

      <Form
        form={form}
        onFinish={handleOnFinish}
        onFinishFailed={handleOnFinishFailed}
        autoComplete="false"
        {...props}
      >
        {children}
      </Form>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray800,
  },
  leftContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: "flex-start",
    alignItems: "center",
    overflow: "hidden",
    width: 80,
  },
  centerContainer: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  rightContainer: {
    flexDirection: "row-reverse",
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "hidden",
    width: 80,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default FormView;
