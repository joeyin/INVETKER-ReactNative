import React from "react";
import { Text, Alert, TouchableOpacity, StyleSheet, View } from "react-native";
import Colors from "@/constants/Colors";
import transactionController from "@/controllers/transactionController";
import { Action } from "@/models/Transaction";
import NavigationScrollView from "@/components/NavigationScrollView";
import {
  useRoute,
  useNavigation,
  ParamListBase,
  NavigationProp,
  RouteProp,
} from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useApp } from "@/providers/AppProvider";
import { useToggle } from "@/hooks";
import Form, { Input, Picker, DatePicker } from "@/components/Form";
import Card from "@/components/Card";

const NewTransaction = () => {
  const { navigate, goBack }: NavigationProp<ParamListBase> = useNavigation();
  const isLoading = useToggle();
  const { refetchTransaction, positions } = useApp();
  const [form] = Form.useForm();
  const route: RouteProp<{ [x: string]: any }> = useRoute();

  const onSubmit = () => {
    isLoading.on();
    form.submit();
  };

  const onFinish = async (values) => {
    try {
      await transactionController.insert({
        ticker: values.ticker,
        quantity: parseFloat(values.quantity),
        action: values.action[0],
        price: parseFloat(values.price),
        fee: parseFloat(values.fee),
        date: new Date(values.date).getTime(),
      }, positions);
      refetchTransaction();
      goBack();
      isLoading.toggle();
    } catch (error) {
      Alert.alert("Error", error.message);
      isLoading.toggle();
    }
  };

  const onFinishFailed = (errorInfo) => {
    const message = Object.values(errorInfo.errorFields)
      .map((field: any) => field.errors.join("\n"))
      .join("\n");

    Alert.alert("Error", message);
    isLoading.toggle();
  };

  const checkNumber = (_: any, value: any) => {
    if (parseFloat(value) > 0) {
      return Promise.resolve();
    }
    let message = `${_.field} must be greater than zero.`;
    return Promise.reject(
      new Error(message.charAt(0).toUpperCase() + message.slice(1))
    );
  };

  React.useEffect(() => {
    form.setFieldsValue({ ticker: route?.params?.ticker });
  }, [route?.params?.ticker]);

  return (
    <NavigationScrollView
      title="New Transaction"
      left={
        <TouchableOpacity onPress={goBack}>
          <FontAwesome name="angle-left" size={30} color={Colors.black} />
        </TouchableOpacity>
      }
      right={
        <TouchableOpacity disabled={isLoading.state} onPress={onSubmit}>
          <Text style={{ fontSize: 17, color: Colors.primary }}>Save</Text>
        </TouchableOpacity>
      }
    >
      <View style={styles.container}>
        <Card style={{ paddingVertical: 0 }}>
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
              quantity: "0",
              action: [Action.BUY],
              price: "0",
              fee: "0",
              date: new Date(),
            }}
            styles={{
              Body: {
                backgroundColor: Colors.white,
              },
            }}
          >
            <Form.Item
              name="ticker"
              rules={[
                {
                  required: true,
                },
              ]}
              wrapperStyle={{ display: "none" }}
            >
              <Input
                placeholder="required"
                inputStyle={{ textAlign: "right", color: Colors.secondary }}
              />
            </Form.Item>

            <Form.Item
              label="Ticker"
              layout="horizontal"
              bodyStyle={{ alignItems: "flex-end" }}
              wrapperStyle={{ marginBottom: 0 }}
              labelStyle={{ fontWeight: "normal" }}
            >
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  height: 35,
                  alignItems: "center",
                }}
                onPress={() => navigate("SelectTicker")}
              >
                <Text style={[{ fontSize: 17, color: Colors.secondary }]}>
                  {route.params?.ticker ?? "Select Ticker"}
                </Text>
                <FontAwesome
                  name="angle-right"
                  size={25}
                  color={Colors.secondary}
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            </Form.Item>

            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[
                {
                  required: true,
                  validator: checkNumber,
                },
              ]}
              layout="horizontal"
              wrapperStyle={{ marginBottom: 0 }}
              labelStyle={{ fontWeight: "normal" }}
            >
              <Input
                placeholder="required"
                inputStyle={{ textAlign: "right", color: Colors.secondary }}
                keyboardType="decimal-pad"
              />
            </Form.Item>

            <Form.Item
              label="Action"
              name="action"
              rules={[
                {
                  required: true,
                },
              ]}
              layout="horizontal"
              bodyStyle={{ alignItems: "flex-end" }}
              wrapperStyle={{ marginBottom: 0 }}
              labelStyle={{ fontWeight: "normal" }}
            >
              <Picker
                styles={{
                  textStyle: { color: Colors.secondary },
                }}
                data={[
                  { label: "BUY", value: Action.BUY },
                  { label: "SELL", value: Action.SELL },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Date"
              name="date"
              rules={[
                {
                  required: true,
                },
              ]}
              layout="horizontal"
              wrapperStyle={{ marginBottom: 0 }}
              labelStyle={{ fontWeight: "normal" }}
            >
              <DatePicker />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  validator: checkNumber,
                },
              ]}
              layout="horizontal"
              wrapperStyle={{ marginBottom: 0 }}
              labelStyle={{ fontWeight: "normal" }}
            >
              <Input
                placeholder="required"
                inputStyle={{ textAlign: "right", color: Colors.secondary }}
                keyboardType="decimal-pad"
              />
            </Form.Item>

            <Form.Item
              label="Fee"
              name="fee"
              rules={[
                {
                  required: true,
                  validator: checkNumber,
                },
              ]}
              layout="horizontal"
              wrapperStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
              labelStyle={{ fontWeight: "normal" }}
            >
              <Input
                placeholder="required"
                inputStyle={{ textAlign: "right", color: Colors.secondary }}
                keyboardType="decimal-pad"
              />
            </Form.Item>
          </Form>
        </Card>
      </View>
    </NavigationScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    gap: 20,
  },
});

export default NewTransaction;
