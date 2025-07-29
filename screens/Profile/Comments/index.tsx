import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import Colors from "@/constants/Colors";
import List from "@/components/List";
import { Flex } from "@ant-design/react-native";
import commentController from "@/controllers/commentController";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";
import Image from "@/components/Image";
import { useTranslation } from "react-i18next";
import { Comment } from "@/models/Comment";
import { Text } from "@/components/Text";

type Props = {
  ticker: string;
  visible: boolean;
};

const Comments = ({ ticker, visible }: Props) => {
  const { t, i18n } = useTranslation();
  const [comments, setComments] = React.useState<Comment[]>(undefined);

  useFocusEffect(
    React.useCallback(() => {
      if (visible) {
        commentController.get(ticker).then(setComments);
      }
    }, [visible])
  );

  return (
    <ScrollView>
      {comments?.length === 0 ? (
        <Text style={styles.content}>{t("no comments yet.")}</Text>
      ) : (
        <List style={styles.container}>
          {comments && comments.map((c) => (
            <List.Item key={c.id} style={{ alignItems: "center" }}>
              <Image
                source={{ uri: c.avatar?.toString() }}
                style={styles.avatar}
                resizeMode="cover"
                type="avatar"
                displayName={c.displayName}
              />
              <Flex
                align="start"
                direction="column"
                style={{ flex: 1, marginLeft: 15, gap: 3 }}
              >
                <Text style={styles.name}>{c.displayName}</Text>
                <Text style={styles.content}>{c.comment}</Text>
                <Text style={styles.footer}>
                  {moment(c.datetime).locale(i18n.language).fromNow()}
                </Text>
              </Flex>
            </List.Item>
          ))}
        </List>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  name: {
    fontSize: 15,
    fontWeight: 600,
  },
  content: {
    fontSize: 14,
    fontWeight: 300,
  },
  footer: {
    fontSize: 12,
    fontWeight: 400,
    color: Colors.secondary,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
});

export default Comments;
