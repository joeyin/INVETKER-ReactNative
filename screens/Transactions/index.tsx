import React from "react";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import FlatListView from "@/components/Layout/FlatListView";
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
  useTheme,
} from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/Text";

function TransactionsScreen() {
  const { t } = useTranslation();
  const { transactions, refetchTransaction, positions } = useApp();
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();
  const { colors } = useTheme();

  const sortedTransactions = React.useMemo(
    () =>
      [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [transactions]
  );

  const handleDelete = React.useCallback(
    (id: string) => {
      Alert.alert(
        t("confirm deletion"),
        t("are you sure you want to delete this transaction?"),
        [
          {
            text: t('cancel'),
          },
          {
            text: t('delete'), onPress: () => {
              transactionController
                .delete(id, positions)
                .then(refetchTransaction)
                .catch((error) => Alert.alert(t("error"), error.message));
            }
          },
        ]
      );
    },
    [refetchTransaction, positions]
  );

  const renderRightActions = React.useCallback(
    (item: Transaction) => (
      <TouchableOpacity
        style={styles.deleteBlock}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteText}>{t("delete")}</Text>
      </TouchableOpacity>
    ),
    [handleDelete]
  );

  const renderItem = React.useCallback(({ item }: { item: Transaction }) => {
    const color = item.action === Action.BUY ? Colors.success : Colors.danger;
    const actionText = item.action === Action.BUY ? t("buy") : t("sell");
    return (
      <View style={[{ borderColor: colors.border }, styles.itemContainer]}>
        <Flex justify="between" align="center" style={styles.item}>
          <Text style={styles.ticker}>{item.ticker}</Text>
          <Text style={styles.date}>
            {moment(item.date).locale("en").format("YYYY-MM-DD")}
          </Text>
        </Flex>

        {[
          { label: t("action"), value: actionText, color },
          { label: t("quantity"), value: formatDecimal(item.quantity) },
          { label: t("price"), value: `$${formatDecimal(item.price)}` },
          { label: t("fee"), value: `$${formatDecimal(item.fee)}` },
          {
            label: t("amount"),
            value: `$${formatDecimal(item.price * item.quantity + item.fee)}`,
            color,
          },
        ].map(({ label, value, color = colors.text }, index) => (
          <Flex
            key={label}
            justify="between"
            align="center"
            style={index !== 4 && { ...styles.item }}
          >
            <Text style={styles.name}>{label}</Text>
            <Text style={[styles.value, { color }]}>{value}</Text>
          </Flex>
        ))}
      </View>
    );
  }, [colors]);

  return (
    <FlatListView
      title={t("transactions")}
      right={
        <TouchableOpacity onPress={() => navigate("NewTransaction")}>
          <Feather name="plus" size={24} color={colors.text} />
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
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  item: {
    marginBottom: 2,
  },
  ticker: {
    fontSize: 15,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: Colors.secondary,
  },
  name: {
    color: Colors.secondary,
    fontSize: 12,
    fontWeight: 300,
  },
  value: {
    fontSize: 14,
    fontWeight: 600,
  },
});

export default TransactionsScreen;
