import React from "react";
import FormView from "@/components/Layout/FormView";
import Form, { Input } from "@/components/Form";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useApp } from "@/providers/AppProvider";
import Colors from "@/constants/Colors";
import { Image, StyleSheet } from "react-native";
import commentController from "@/controllers/commentController";

const AddCommmentScreen = () => {
  const { goBack } = useNavigation();
  const { user } = useApp();
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
      title="Comment"
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
            input: styles.input,
          }}
          placeholder={`What do you think about ${route.params.ticker}?`}
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
    borderWidth: 1,
    borderColor: Colors.lightGray200,
    borderRadius: 6,
    backgroundColor: Colors.white,
  },
});

export default AddCommmentScreen;
