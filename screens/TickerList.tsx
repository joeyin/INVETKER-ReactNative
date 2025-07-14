import React from "react";
import FormView from "@/components/Layout/FormView";
import Form, { Input } from "@/components/Form";
import Colors from "@/constants/Colors";
import { StyleSheet, FlatList, Text } from "react-native";
import List from "@/components/List";
import { Flex } from "@ant-design/react-native";
import { Ticker } from "@/models/Ticker";
import Image from "@/components/Image";
import LOGODEV_API_KEY from "@/configs/logodev";
import { useTranslation } from "react-i18next";

const ITEM_HEIGHT = 53;

const TickerListScreen = ({ onFinished }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [search, setSearch] = React.useState("");
  const [data, setData] = React.useState<Ticker[]>([]);
  const [tickers, setTickers] = React.useState<Ticker[]>(data);

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://www.sec.gov/files/company_tickers.json");
      return await response.json();
    }
    fetchData().then(d => {
      setData(Object.keys(d).map(i => d[i]))
    });
  }, [])

  React.useEffect(() => {
    if (search === "") {
      setTickers(data);
    } else {
      const filtered = data.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.ticker.toLowerCase().includes(search.toLowerCase())
      );
      setTickers(filtered);
    }
  }, [search, data]);

  const subTitle = React.useMemo(
    () => (
      <Form form={form} style={{ marginHorizontal: 10 }}>
        <Form.Item
          name="search"
          layout="horizontal"
          wrapperStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
        >
          <Input
            placeholder={t("search")}
            inputStyle={{
              backgroundColor: Colors.gray800,
              borderRadius: 6,
              height: 36,
              paddingHorizontal: 13,
              marginBottom: 5,
            }}
            onChangeText={setSearch}
          />
        </Form.Item>
      </Form>
    ),
    []
  );

  const renderItem = React.useCallback(
    ({ item }) => (
      <List.Item
        touchable
        onPress={() => onFinished(item.ticker)}
        style={styles.item}
      >
        <Image
          style={styles.logo}
          displayName={item.ticker}
          type="logo"
          resizeMode="cover"
          source={{
            uri: `https://img.logo.dev/ticker/${item.ticker}?token=${LOGODEV_API_KEY}&format=png&retina=true`,
          }}
        />
        <Flex style={{ flex: 1 }} direction="column" align="start">
          <Text style={styles.value}>{item.ticker}</Text>
          <Text style={styles.name}>{item.title}</Text>
          {/* <HTMLView
            stylesheet={styles}
            value={`<value>${item.ticker}</value>`}
          />
          <HTMLView stylesheet={styles} value={`<name>${item.name}</name>`} /> */}
        </Flex>
      </List.Item>
    ),
    []
  );

  return (
    <FormView
      title={t("ticker")}
      allowSave={false}
      style={styles.container}
      subTitle={subTitle}
    >
      <FlatList
        data={tickers}
        renderItem={renderItem}
        keyExtractor={(item) => item.ticker}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        showsVerticalScrollIndicator={false}
      />
    </FormView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    height: "100%",
  },
  item: {
    padding: 10,
  },
  name: {
    fontSize: 13,
    color: Colors.secondary,
  },
  value: {
    fontSize: 15,
    color: Colors.black,
    fontWeight: 600,
  },
  logo: {
    width: 33,
    height: 33,
    marginRight: 15,
    backgroundColor: Colors.lightGray,
  },
});

export default TickerListScreen;
