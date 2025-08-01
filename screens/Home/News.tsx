import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { Flex } from "@ant-design/react-native";
import Colors from "@/constants/Colors";
import marketController from "@/controllers/marketController";
import moment from "moment";
import Card from "@/components/Card";
import Image from "@/components/Image";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/Text";
import { useTheme } from "@react-navigation/native";

const LIMIT = 10;

const News = () => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const [news, setNews] = React.useState([]);

  React.useEffect(() => {
    marketController.fetchNews().then(i => setNews(i.slice(0, LIMIT)));
  }, []);

  const Category = ({ type }) => {
    const color =
      type === "top news"
        ? Colors.danger
        : type === "technology"
        ? Colors.success
        : Colors.primary;
    return (
      <View
        style={{
          backgroundColor: color,
          paddingVertical: 3,
          paddingHorizontal: 5,
          borderRadius: 5,
        }}
      >
        <Text style={{ fontSize: 11, color: Colors.white, fontWeight: 400 }}>
          {t(type)}
        </Text>
      </View>
    );
  };

  const openURL = React.useCallback((url: string) => {
    Linking.canOpenURL(url).then(() => Linking.openURL(url))
  }, [])

  const Item = ({ index, item }) => (
    <TouchableOpacity onPress={() => openURL(item.url)}>
      <Flex
        direction="row"
        style={[
          styles.news,
          { borderBottomColor: colors.border },
          index === LIMIT - 1 && {
            marginBottom: 0,
            borderBottomWidth: 0,
            paddingBottom: 0,
          },
        ]}
      >
        <Image
          source={{ uri: item.image }}
          style={{ width: 120, height: 80 }}
          resizeMode="center"
        />
        <Flex align="start" direction="column" style={{ flex: 1, gap: 4 }}>
          <Category type={item.category} />
          <Text style={styles.headline} numberOfLines={2}>
            {item.headline}
          </Text>
          <Flex wrap="wrap">
            <Text style={styles.footer}>{item.source}</Text>
            <Text style={styles.footer}> - </Text>
            <Text style={styles.footer}>
              {moment(item.datetime * 1000).locale(i18n.language).fromNow()}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </TouchableOpacity>
  );

  return (
    <Card title={t("news")}>
      {news.map((i, index) => (
        <Item key={index} index={index} item={i} />
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  news: {
    marginBottom: 12,
    gap: 12,
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  headline: {
    fontSize: 14,
    fontWeight: 500,
  },
  footer: {
    fontSize: 12,
    fontWeight: 400,
    color: Colors.secondary,
  },
});

export default News;
