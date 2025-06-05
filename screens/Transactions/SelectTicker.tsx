import React from "react";
import FormView from "@/components/FormView";
import Form, { Input } from "@/components/Form";
import {
  useNavigation,
  ParamListBase,
  NavigationProp,
} from "@react-navigation/native";
import Colors from "@/constants/Colors";
import { Text, StyleSheet, FlatList, Image, View } from "react-native";
import List from "@/components/List";
import Tickers from "@/assets/tickers.json";
import { Flex } from "@ant-design/react-native";
import { Ticker } from "@/models/Ticker";
import LOGODEV_API_KEY from "@/configs/logodev";
import { formatLocalizedCapitalized } from "@/helpers/formatHelpers";

const ITEM_HEIGHT = 53;

const TickerItem = React.memo(
  ({ item, onPress }: { item: Ticker; onPress: () => void }) => {
    const [imgLoadFailed, setImgLoadFailed] = React.useState(false);
    const uri = `https://img.logo.dev/ticker/${item.ticker}?token=${LOGODEV_API_KEY}&format=webp&retina=true`;

    return (
      <List.Item touchable onPress={onPress} style={styles.item}>
        {imgLoadFailed ? (
          <View style={styles.defaultLogo}>
            <Text style={styles.defaultLogoText}>
              {formatLocalizedCapitalized(item.ticker[0])}
            </Text>
          </View>
        ) : (
          <Image
            source={{ uri }}
            style={styles.logo}
            onError={() => setImgLoadFailed(true)}
          />
        )}

        <Flex style={{ flex: 1 }} direction="column" align="start">
          <Text style={styles.value}>{item.ticker}</Text>
          <Text style={styles.name}>{item.name}</Text>
        </Flex>
      </List.Item>
    );
  }
);

const SelectTickerScreen = () => {
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();
  const [form] = Form.useForm();
  const [search, setSearch] = React.useState("");
  const [tickers, setTickers] = React.useState<Ticker[]>(Tickers);

  React.useEffect(() => {
    if (search === "") {
      setTickers(Tickers);
    } else {
      const filtered = Tickers.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.ticker.toLowerCase().includes(search.toLowerCase())
      );
      setTickers(filtered);
    }
  }, [search]);

  const subTitle = React.useMemo(
    () => (
      <Form form={form} style={{ marginHorizontal: 10 }}>
        <Form.Item
          name="search"
          layout="horizontal"
          wrapperStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
        >
          <Input
            placeholder="Search"
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

  const handleNavigate = React.useCallback(
    (ticker: string) => {
      navigate("NewTransaction", { ticker }, { pop: true });
    },
    []
  );

  const renderItem = React.useCallback(
    ({ item }: { item: Ticker }) => (
      <TickerItem item={item} onPress={() => handleNavigate(item.ticker)} />
    ),
    []
  );

  return (
    <FormView
      title="Ticker"
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
    fontWeight: "600",
  },
  logo: {
    width: 33,
    height: 33,
    borderRadius: 5,
    marginRight: 15,
  },
  defaultLogo: {
    width: 33,
    height: 33,
    borderRadius: 5,
    marginRight: 15,
    backgroundColor: Colors.lightGray,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  defaultLogoText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.secondary,
  },
});

export default SelectTickerScreen;
