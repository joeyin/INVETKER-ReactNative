import React from "react";
import { View, StyleSheet } from "react-native";
import ScrollView from "@/components/Layout/ScrollView";
import Header from "./Header";
import Holdings from "./Holdings";
import { useApp } from "@/providers/AppProvider";
import { useTranslation } from "react-i18next";
import { Clock } from "@/components/Clock";

function PortfolioScreen() {
  const { t } = useTranslation();
  const { positions, lastUpdated } = useApp();

  return (
    <ScrollView title={t("portfolio")} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.header}>
        <Header positions={positions} />
        <Clock time={lastUpdated} style={styles.lastUpdated} />
      </View>
      <View style={styles.holdings}>
        <Holdings positions={positions} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 13,
  },
  holdings: {
    flex: 1,
    marginBottom: 13,
  },
  lastUpdated: {
    marginLeft: 15,
  },
});

export default PortfolioScreen;
