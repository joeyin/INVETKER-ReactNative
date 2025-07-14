import React from "react";
import { Table, Row } from "react-native-table-component";
import {
  View,
  Text,
  ScrollView as RNScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Colors from "@/constants/Colors";
import { formatDecimal } from "@/helpers/formatHelpers";
import ValueChangeTag from "@/components/ValueChangeTag";
import {
  useNavigation,
  ParamListBase,
  NavigationProp,
} from "@react-navigation/native";
import ScrollView from "@/components/Layout/ScrollView";
import { useApp } from "@/providers/AppProvider";
import tickerController from "@/controllers/tickerController";
import { Quote } from "@/models/Quote";
import Feather from "@expo/vector-icons/Feather";
import favoriteController from "@/controllers/favoriteController";
import { useTranslation } from "react-i18next";

const widthArr = [90, 90, 80, 80, 90, 90, 90];

const FavoritesScreen = (props) => {
  const { t } = useTranslation();
  const { favorites, refetchFavorite } = useApp();
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();
  const [items, setItems] = React.useState<Array<{ ticker: string } & Quote>>(
    []
  );

  const tableHead = React.useMemo(() => [
    t("ticker"),
    t("price"),
    t("change"),
    t("chg %"),
    t("high"),
    t("low"),
    t("prior close"),
  ], []);

  React.useEffect(() => {
    const fetchQuotes = async () => {
      const result: Array<{ ticker: string } & Quote> = [];
      for (const ticker of favorites) {
        const quote = await tickerController.quote(ticker);
        result.push({ ticker, ...quote });
      }
      setItems(result);
    };
    fetchQuotes();
  }, [favorites]);

  React.useEffect(() => {
    if (props?.route?.params?.ticker) {
      favoriteController
        .toggle(props?.route?.params?.ticker)
        .then(refetchFavorite);
    }
  }, [props?.route?.params?.ticker]);

  return (
    <ScrollView
      title={t("favorites")}
      right={
        <TouchableOpacity onPress={() => navigate("TickerList")}>
          <Feather name="search" size={24} color="black" />
        </TouchableOpacity>
      }
    >
      <RNScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View>
          <Table>
            <Row
              style={styles.thead}
              textStyle={styles.theadText}
              data={tableHead}
              widthArr={widthArr}
            />
          </Table>
          <RNScrollView
            style={styles.dataWrapper}
            showsVerticalScrollIndicator={false}
          >
            <Table>
              {items.map((i, index) => (
                <Row
                  key={index}
                  data={[
                    <TouchableOpacity
                      onPress={() => navigate("Profile", { ticker: i.ticker })}
                    >
                      <Text>{i.ticker}</Text>
                    </TouchableOpacity>,
                    <Text>{formatDecimal(i.c)}</Text>,
                    <ValueChangeTag signed value={i.d} format="Decimal" />,
                    <ValueChangeTag value={i.dp} format="Decimal" suffix="%" />,
                    <ValueChangeTag
                      value={i.h}
                      format="Decimal"
                      colored={false}
                    />,
                    <ValueChangeTag
                      value={i.l}
                      format="Decimal"
                      colored={false}
                    />,
                    <ValueChangeTag
                      value={i.pc}
                      format="Decimal"
                      colored={false}
                    />,
                  ]}
                  style={{
                    ...styles.tbody,
                    borderBottomWidth: index === favorites.length - 1 ? 0 : 1,
                  }}
                  widthArr={widthArr}
                />
              ))}
            </Table>
          </RNScrollView>
        </View>
      </RNScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
  thead: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: Colors.lightGray200,
  },
  theadText: {
    fontSize: 11,
    color: Colors.secondary,
    fontWeight: 600,
  },
  tbody: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: Colors.lightGray200,
  },
  tbodyText: {
    fontSize: 14,
  },
  dataWrapper: { marginTop: -1 },
});

export default FavoritesScreen;
