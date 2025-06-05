import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { formatDecimal } from "../../helpers/formatHelpers";
import { Flex } from "@ant-design/react-native";
import Colors from "../../constants/Colors";
import { SheetManager } from 'react-native-actions-sheet';

const TopPortfolio = ({ positions }) => {
  return (
    <View>
      <Text style={styles.title}>Top Portfolio Positions</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Flex>
              {positions
                .filter((p) => p.unrealizedProfit > 0)
                .sort((a, b) => b.unrealizedProfit - a.unrealizedProfit)
                .map((p, index) => (
                  <TouchableOpacity
                    key={p.ticker}
                    style={{
                      ...styles.card,
                      marginLeft: index === 0 ? 15 : 0,
                    }}
                    onPress={() => {
                      SheetManager.show("TickerDetail", {
                        payload: {
                          ticker: p
                        }
                      })
                    }}
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
                        <Text style={styles.text}>
                          {formatDecimal(p.position)}
                        </Text>
                      </Flex>
                      <Flex>
                        <Text style={styles.text}>Price: </Text>
                        <Text style={styles.text}>
                          {formatDecimal(p.price)}
                        </Text>
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
            </Flex>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: "bold",
    paddingBottom: 5,
    marginHorizontal: 15,
  },
  card: {
    display: "flex",
    flexDirection: "row",
    borderRadius: 12,
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
  closeButton: {
    marginTop: 20,
    fontSize: 16,
    color: "blue",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TopPortfolio;
