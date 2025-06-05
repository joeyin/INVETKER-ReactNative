import React from "react";
import FormView from "@/components/FormView";
import Form, { Input } from "@/components/Form";
import {
  useNavigation,
  ParamListBase,
  NavigationProp,
} from "@react-navigation/native";
import Colors from "@/constants/Colors";
import { Text, StyleSheet, FlatList } from "react-native";
import List from "@/components/List";
import Tickers from "@/assets/tickers.json";
import { Flex } from "@ant-design/react-native";
import { Ticker } from "@/models/Ticker";

const SelectTickerScreen = () => {
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();
  const [form] = Form.useForm();
  const [search, setSearch] = React.useState("");
  const [tickers, setTickers] = React.useState(Tickers);

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

  const Item = React.memo((item: Ticker) => (
    <List.Item
      touchable
      onPress={() =>
        navigate("NewTransaction", { ticker: item.ticker }, { pop: true })
      }
      style={{
        padding: 10,
        justifyContent: "flex-start",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Flex>
        <Text style={styles.value}>{item.ticker}</Text>
      </Flex>
      <Text style={styles.name}>{item.name}</Text>
    </List.Item>
  ));

  return (
    <FormView
      title="Ticker"
      allowSave={false}
      style={{ backgroundColor: Colors.white, borderRadius: 8 }}
      subTitle={
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
      }
    >
      <FlatList
        data={tickers}
        renderItem={({ item }) => <Item {...item} />}
        keyExtractor={(item) => item.ticker}
        showsVerticalScrollIndicator={false}
      />
    </FormView>
  );
};

const styles = StyleSheet.create({
  name: {
    fontSize: 13,
    color: Colors.secondary,
  },
  value: {
    fontSize: 15,
    color: Colors.black,
    fontWeight: 500,
  },
});

export default SelectTickerScreen;
