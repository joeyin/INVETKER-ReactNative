import React from "react";
import { View, StyleSheet } from "react-native";
import { formatDecimal } from "@/helpers/formatHelpers";
import Colors from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/Text";

const Header = ({ positions }) => {
  const { t } = useTranslation();
  const [netLiquidation, setNetLiquidation] = React.useState<number>(0);
  const [dailyProfit, setDailyProfit] = React.useState<number>(0);

  React.useEffect(() => {
    const updateValues = () => {
      const netLiquidationValue = positions.reduce(
        (acc, p) => acc + p.marketValue,
        0
      );
      const dailyProfitValue = positions.reduce(
        (acc, p) => acc + p.dailyProfit,
        0
      );
      setNetLiquidation(netLiquidationValue);
      setDailyProfit(dailyProfitValue);
    };
    updateValues();
  }, [positions]);

  const color = React.useMemo(() => {
    return dailyProfit === 0
      ? ""
      : dailyProfit > 0
      ? styles.success
      : styles.danger;
  }, [dailyProfit]);

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Text style={styles.name}>{t("net liquidation")}</Text>
        <Text style={styles.value}>{formatDecimal(netLiquidation)}</Text>
      </View>
      <View style={styles.column}>
        <Text style={[styles.name, color]}>{t("daily P&L")}</Text>
        <Text style={[styles.value, color]}>{formatDecimal(dailyProfit)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    justifyContent: "space-between",
  },
  column: {
    alignItems: "flex-start",
    flex: 1,
  },
  name: {
    fontSize: 12,
    fontWeight: 400,
  },
  value: {
    fontSize: 22,
    fontWeight: 600,
  },
  success: {
    color: Colors.success,
  },
  danger: {
    color: Colors.danger,
  },
});

export default Header;
