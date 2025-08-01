import React from "react";
import { ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Flex } from "@ant-design/react-native";
import Colors from "@/constants/Colors";
import Card from "@/components/Card";
import {
  useNavigation,
  ParamListBase,
  NavigationProp,
  useTheme,
} from "@react-navigation/native";
import ValueChangeTag from "@/components/ValueChangeTag";
import Image from "@/components/Image";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/Text";

const TopPortfolio = ({ positions }) => {
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Card
      headerStyle={{ paddingHorizontal: 15 }}
      title={t("top portfolio positions")}
      subtitle={t("your current top-performing holdings")}
      style={{ paddingHorizontal: 0 }}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 15, minHeight: 105 }}>
        {positions
          .filter((p) => p.unrealizedProfit > 0)
          .sort((a, b) => b.unrealizedProfit - a.unrealizedProfit)
          .map((p) => (
            <TouchableOpacity
              key={p.ticker}
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                ...styles.item
              }}
              onPress={() => navigate("Profile", { ticker: p.ticker })}
            >
              <Image
                source={{ uri: p.logo }}
                style={{ width: 105, height: 105, borderRadius: 0 }}
                displayName={<Text>{p.ticker}</Text>}
                type="logo"
              />
              <Flex
                style={styles.detail}
                direction="column"
                align="start"
                justify="center"
              >
                <Text style={styles.ticker}>{p.ticker}</Text>
                <Flex>
                  <Text style={styles.text}>{t("position")}: </Text>
                  <ValueChangeTag
                    style={styles.text}
                    value={p.position}
                    format="Decimal"
                    colored={false}
                  />
                </Flex>
                <Flex>
                  <Text style={styles.text}>{t("price")}: </Text>
                  <ValueChangeTag
                    style={styles.text}
                    value={p.price}
                    format="Decimal"
                    colored={false}
                  />
                </Flex>
                <Flex>
                  <Text style={styles.text}>{t("daily P&L")}: </Text>
                  <ValueChangeTag
                    style={styles.text}
                    value={p.dailyProfit}
                    format="Decimal"
                  />
                </Flex>
                <Flex>
                  <Text style={styles.text}>{t("unrlzd P&L")}: </Text>
                  <ValueChangeTag
                    style={styles.text}
                    value={p.unrealizedProfit}
                    format="Decimal"
                  />
                </Flex>
              </Flex>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </Card>
  );
};

const styles = StyleSheet.create({
  item: {
    display: "flex",
    flexDirection: "row",
    borderRadius: 10,
    // backgroundColor: Colors.white,
    borderWidth: 1,
    // borderColor: Colors.lightGray200,
    overflow: "hidden",
    shadowColor: "#919191",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.18,
    shadowRadius: 5.68,
    elevation: 2,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  detail: {
    paddingHorizontal: 12,
    gap: 2,
    minWidth: 150,
  },
  ticker: {
    fontSize: 13,
    fontWeight: "bold",
  },
  text: {
    fontSize: 11,
    fontWeight: "light",
  },
});

export default TopPortfolio;
