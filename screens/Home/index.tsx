import React from "react";
import { View, StyleSheet } from "react-native";
import ScrollView from "@/components/Layout/ScrollView";
import TopPortfolio from "./TopPortfolio";
import { useApp } from "@/providers/AppProvider";
import News from "./News";
import { useTranslation } from "react-i18next";

function HomeScreen() {
  const { t } = useTranslation();
  const { positions } = useApp();

  return (
    <ScrollView title={t("explore")}>
      <View style={styles.container}>
        <News />
        {positions.length > 0 && <TopPortfolio positions={positions} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    gap: 20,
  },
});

export default HomeScreen;
