import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import NavigationFlatListView from "@/components/NavigationFlatListView";
import Feather from "@expo/vector-icons/Feather";
import Colors from "@/constants/Colors";
import transactionController from "@/controllers/transactionController";
import moment from "moment";
import { Action, Transaction } from "@/models/Transaction";
import { formatDecimal } from "@/helpers/formatHelpers";
import SwipeableFlatList from "rn-gesture-swipeable-flatlist";
import { Flex } from "@ant-design/react-native";
import { useApp } from "@/providers/AppProvider";
import {
  useNavigation,
  ParamListBase,
  NavigationProp,
} from "@react-navigation/native";
import List from "@/components/List";

function TransactionsScreen() {
  const { transactions, refetchTransaction } = useApp();
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();

  const sortedTransactions = React.useMemo(
    () =>
      [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [transactions]
  );

  const handleDelete = React.useCallback(
    (id: string) => {
      transactionController.delete(id).then(refetchTransaction);
    },
    [refetchTransaction]
  );

  const renderRightActions = React.useCallback(
    (item: Transaction) => (
      <TouchableOpacity
        style={styles.deleteBlock}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    ),
    [handleDelete]
  );

  const renderItem = React.useCallback(({ item }: { item: Transaction }) => {
    const color = item.action === Action.BUY ? Colors.success : Colors.danger;
    return (
      <List.Item style={styles.item}>
        {[
          {
            label: <Text style={styles.ticker}>{item.ticker}</Text>,
            value: (
              <Text style={styles.date}>
                {moment(item.date).format("YYYY-MM-DD")}
              </Text>
            ),
          },
          {
            label: "Action",
            value: <Text style={[styles.value, { color }]}>{item.action}</Text>,
          },
          { label: "Quantity", value: formatDecimal(item.quantity) },
          { label: "Price", value: `$${formatDecimal(item.price)}` },
          { label: "Fee", value: `$${formatDecimal(item.fee)}` },
          {
            label: "Amount",
            value: (
              <Text style={[styles.value, { color }]}>{`$${formatDecimal(
                item.price * item.quantity + item.fee
              )}`}</Text>
            ),
          },
        ].map(({ label, value }, index) => (
          <Flex
            key={index}
            justify="between"
            style={[styles.column, index === 5 && { marginBottom: 0 }]}
          >
            {typeof label === "function" ? (
              label
            ) : (
              <Text style={styles.name}>{label}</Text>
            )}
            {typeof value === "function" ? (
              value
            ) : (
              <Text style={styles.value}>{value}</Text>
            )}
          </Flex>
        ))}
      </List.Item>
    );
  }, []);

  return (
    <NavigationFlatListView
      title="Transactions"
      right={
        <TouchableOpacity onPress={() => navigate("NewTransaction")}>
          <Feather name="plus" size={24} color="black" />
        </TouchableOpacity>
      }
      data={sortedTransactions}
      renderItem={({ item }) => (
        <SwipeableFlatList
          data={[item]}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          renderRightActions={() => renderRightActions(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  deleteBlock: {
    paddingHorizontal: 15,
    backgroundColor: Colors.danger,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    color: Colors.white,
    fontSize: 16,
  },
  item: {
    padding: 10,
    justifyContent: "flex-start",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  column: {
    width: "100%",
    marginBottom: 3,
  },
  ticker: {
    fontSize: 15,
    fontWeight: 600,
    color: Colors.black,
  },
  date: {
    fontSize: 13,
    fontWeight: 300,
    color: Colors.secondary,
  },
  name: {
    color: Colors.secondary,
    fontSize: 13,
    fontWeight: 300,
  },
  value: {
    fontSize: 14,
    fontWeight: 600,
  },
});

export default TransactionsScreen;
