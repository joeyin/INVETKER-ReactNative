import React from "react";
import FormView from "@/components/Layout/FormView";
import Form, { Input } from "@/components/Form";
import accountController from "@/controllers/accountController";
import { useNavigation } from "@react-navigation/native";
import { useApp } from "@/providers/AppProvider";
import Colors from "@/constants/Colors";

const EditNameScreen = () => {
  const { goBack } = useNavigation();
  const { user, reloadAuth } = useApp();

  const handleOnFinish = React.useCallback((values) => {
    accountController.updateProfile(values).then(() => {
      goBack()
      reloadAuth()
    });
  }, []);

  return (
    <FormView
      title="Name"
      onFinish={handleOnFinish}
      initialValues={{ displayName: user.displayName }}
      style={{ margin: 10, backgroundColor: Colors.white, paddingHorizontal: 15, borderRadius: 8 }}
    >
      <Form.Item
        rules={[{ required: true }]}
        name="displayName"
        layout="horizontal"
        wrapperStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
      >
        <Input placeholder="required" />
      </Form.Item>
    </FormView>
  );
};

export default EditNameScreen;
