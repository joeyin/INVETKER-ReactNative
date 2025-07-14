import React from "react";
import { Table, Row } from "react-native-table-component";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Colors from "@/constants/Colors";
import { formatDecimal } from "@/helpers/formatHelpers";
import { useNavigation, ParamListBase, NavigationProp } from '@react-navigation/native';
import { useTranslation } from "react-i18next";

const widthArr = [90, 90, 80, 80, 100, 100, 80, 100, 100];

const Holdings = ({ positions }) => {
  const { t } = useTranslation();
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();

  const tableHead = React.useMemo(() => [
    t("ticker"),
    t("position"),
    t("price"),
    t("chg %"),
    t("cost basis"),
    t("mkt val"),
    t("avg price"),
    t("P&L"),
    t("unrlzd P&L"),
  ], []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("positions")}</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View>
          <Table>
            <Row
              style={styles.thead}
              textStyle={styles.theadText}
              data={tableHead}
              widthArr={widthArr}
            />
          </Table>
          <ScrollView
            style={styles.dataWrapper}
            showsVerticalScrollIndicator={false}
          >
            <Table>
              {positions
                .filter((p) => p.position)
                .map((p, index) => (
                  <Row
                    key={index}
                    data={[
                      <TouchableOpacity
                        onPress={() => navigate("Profile", { ticker: p.ticker })}
                      >
                        <Text>{p.ticker}</Text>
                      </TouchableOpacity>,
                      <Text>{formatDecimal(p.position)}</Text>,
                      <Text>{formatDecimal(p.price)}</Text>,
                      <Text
                        style={[
                          p.dailyProfit === 0
                            ? ""
                            : p.change > 0
                              ? styles.success
                              : styles.danger,
                        ]}
                      >
                        {formatDecimal(p.change)}%
                      </Text>,
                      <Text>{formatDecimal(p.cost)}</Text>,
                      <Text>{formatDecimal(p.marketValue)}</Text>,
                      <Text>{formatDecimal(p.avgPrice)}</Text>,
                      <Text
                        style={[
                          p.dailyProfit === 0
                            ? ""
                            : p.dailyProfit > 0
                              ? styles.success
                              : styles.danger,
                        ]}
                      >
                        {formatDecimal(p.dailyProfit)}
                      </Text>,
                      <Text
                        style={[
                          p.dailyProfit === 0
                            ? ""
                            : p.unrealizedProfit > 0
                              ? styles.success
                              : styles.danger,
                        ]}
                      >
                        {formatDecimal(p.unrealizedProfit)}
                      </Text>,
                    ]}
                    style={{
                      ...styles.tbody,
                      borderBottomWidth: index === positions.length - 1 ? 0 : 1,
                    }}
                    widthArr={widthArr}
                  />
                ))}
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
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
  success: {
    color: Colors.success,
  },
  danger: {
    color: Colors.danger,
  },
});

export default Holdings;
