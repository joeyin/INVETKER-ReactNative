import React from "react";
import FormView from "@/components/Layout/FormView";
import Form, { Input } from "@/components/Form";
import accountController from "@/controllers/accountController";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useApp } from "@/providers/AppProvider";
import Colors from "@/constants/Colors";
import { useTranslation } from "react-i18next";

const EditNameScreen = () => {
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const { user, reloadAuth } = useApp();
  const { colors } = useTheme();

  const handleOnFinish = React.useCallback((values) => {
    accountController.updateProfile(values).then(() => {
      goBack();
      reloadAuth();
    });
  }, []);

  return (
    <FormView
      title={t("name")}
      onFinish={handleOnFinish}
      initialValues={{ displayName: user.displayName }}
      style={{ margin: 10 }}
    >
      <Form.Item
        rules={[{ required: true }]}
        name="displayName"
        layout="horizontal"
        wrapperStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
      >
        <Input
          placeholder="required"
          style={{
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 6,
            backgroundColor: colors.card,
          }}
        />
      </Form.Item>
    </FormView>
  );
};

export default EditNameScreen;
