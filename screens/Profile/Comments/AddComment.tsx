import React from "react";
import FormView from "@/components/Layout/FormView";
import Form, { Input } from "@/components/Form";
import { RouteProp, useNavigation, useRoute, useTheme } from "@react-navigation/native";
import { useApp } from "@/providers/AppProvider";
import Colors from "@/constants/Colors";
import { Image, StyleSheet } from "react-native";
import commentController from "@/controllers/commentController";
import { useTranslation } from "react-i18next";

const AddCommmentScreen = () => {
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const { user } = useApp();
  const { colors } = useTheme();
  const route: RouteProp<{ [x: string]: any }> = useRoute();

  const handleOnFinish = React.useCallback((values) => {
    commentController
      .insert({
        ticker: route.params.ticker,
        comment: values.comment,
      })
      .then(goBack);
  }, []);

  return (
    <FormView
      title={t("comment")}
      onFinish={handleOnFinish}
      style={{
        margin: 10,
      }}
    >
      <Form.Item
        rules={[{ required: true }]}
        name="comment"
        layout="horizontal"
        wrapperStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
        labelWrapperStyle={{ alignSelf: "flex-start", marginRight: 15 }}
        label={
          <Image
            source={{
              uri: user.photoURL,
            }}
            style={styles.avatar}
            resizeMode="cover"
          />
        }
      >
        <Input.TextArea
          rows={8}
          styles={{
            input: {
              ...styles.input,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 6,
              backgroundColor: colors.card,
            },
          }}
          placeholder={t("your thoughts", { ticker: route.params.ticker })}
        />
      </Form.Item>
    </FormView>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: 20,
  },
  input: {
    padding: 10,
  },
});

export default AddCommmentScreen;
