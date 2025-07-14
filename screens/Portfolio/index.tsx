import React from 'react';
import { View, StyleSheet } from 'react-native';
import ScrollView from "@/components/Layout/ScrollView";
import Header from "./Header";
import Holdings from "./Holdings";
import { useApp } from '@/providers/AppProvider';
import { useTranslation } from 'react-i18next';

function PortfolioScreen() {
  const { t } = useTranslation();
  const { positions } = useApp()

  return (
    <ScrollView title={t("portfolio")} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.header}>
        <Header positions={positions} />
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
});

export default PortfolioScreen;