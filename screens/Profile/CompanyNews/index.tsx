import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { Flex } from "@ant-design/react-native";
import Colors from "@/constants/Colors";
import moment from "moment";
import Card from "@/components/Card";
import tickerController from "@/controllers/tickerController";
import { News } from "@/models/News";
import Image from "@/components/Image";

type Props = {
  ticker: string;
  visible: boolean;
};

const CompanyNews = ({ ticker, visible }: Props) => {
  const [news, setNews] = React.useState<News[]>(undefined);

  React.useEffect(() => {
    if (visible && !news) {
      tickerController.news(ticker).then(i => setNews(i.slice(0, 20)));
    }
  }, [visible]);

  const openURL = React.useCallback((url: string) => {
    Linking.canOpenURL(url).then(() => Linking.openURL(url))
  }, [])

  const Item = ({ index, item }) => (
    <TouchableOpacity onPress={() => openURL(item.url)}>
      <Flex
        direction="row"
        style={[
          styles.news,
          index === (news.length - 1) && {
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
          <Text style={styles.headline} numberOfLines={2}>
            {item.headline}
          </Text>
          <Flex wrap="wrap">
            <Text style={styles.footer}>{item.source}</Text>
            <Text style={styles.footer}> - </Text>
            <Text style={styles.footer}>
              {moment(item.datetime * 1000).format("MMM DD, YYYY HH:mm")}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </TouchableOpacity>
  );

  return (
    <Card style={{ backgroundColor: "transparent", paddingHorizontal: 0, paddingVertical: 0 }}>
      {news && news.map((i, index) => (
        <Item key={index} index={index} item={i} />
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  news: {
    marginBottom: 12,
    gap: 12,
    borderBottomColor: Colors.lightGray200,
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

export default CompanyNews;
