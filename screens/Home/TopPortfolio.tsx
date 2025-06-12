import React from "react";
import {
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { formatDecimal } from "@/helpers/formatHelpers";
import { Flex } from "@ant-design/react-native";
import Colors from "@/constants/Colors";
import Card from "@/components/Card";
import { useNavigation, ParamListBase,  NavigationProp } from '@react-navigation/native';

const TopPortfolio = ({ positions }) => {
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();

  return (
    <Card
      title="Top Portfolio Positions"
      subtitle="Your current top-performing holdings"
      style={{ paddingRight: 0 }}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {positions
          .filter((p) => p.unrealizedProfit > 0)
          .sort((a, b) => b.unrealizedProfit - a.unrealizedProfit)
          .map((p) => (
            <TouchableOpacity
              key={p.ticker}
              style={styles.item}
              onPress={() => navigate("Detail", { ticker: p.ticker })}
            >
              <Image
                source={{ uri: p.logo }}
                style={{ width: 105, height: 105 }}
              />
              <Flex
                style={styles.detail}
                direction="column"
                align="start"
                justify="center"
              >
                <Text style={styles.ticker}>{p.ticker}</Text>
                <Flex>
                  <Text style={styles.text}>Position: </Text>
                  <Text style={styles.text}>{formatDecimal(p.position)}</Text>
                </Flex>
                <Flex>
                  <Text style={styles.text}>Price: </Text>
                  <Text style={styles.text}>{formatDecimal(p.price)}</Text>
                </Flex>
                <Flex>
                  <Text style={styles.text}>Daily P&L: </Text>
                  <Text
                    style={[
                      styles.text,
                      p.dailyProfit > 0
                        ? styles.profitPositive
                        : styles.profitNegative,
                    ]}
                  >
                    {formatDecimal(p.dailyProfit)}
                  </Text>
                </Flex>
                <Flex>
                  <Text style={styles.text}>Unrlzd P&L: </Text>
                  <Text
                    style={[
                      styles.text,
                      p.unrealizedProfit > 0
                        ? styles.profitPositive
                        : styles.profitNegative,
                    ]}
                  >
                    {formatDecimal(p.unrealizedProfit)}
                  </Text>
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
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray200,
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
  profitPositive: {
    color: Colors.success,
  },
  profitNegative: {
    color: Colors.danger,
  },
});

export default TopPortfolio;
