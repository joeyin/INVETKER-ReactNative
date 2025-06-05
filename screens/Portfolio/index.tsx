import React from 'react';
import { View, StyleSheet } from 'react-native';
import NavigationScrollView from "../../components/NavigationScrollView";
import Header from "./Header";
import Holdings from "./Holdings";
import { useApp } from '../../providers/AppProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SheetProvider } from "react-native-actions-sheet";
import './sheets';

function PortfolioScreen() {
  const { positions } = useApp()

  return (
    <NavigationScrollView title="Portfolio" contentContainerStyle={{ flex: 1 }}>
      <GestureHandlerRootView
        style={{
          flex: 1,
        }}>
        <SheetProvider context="global">
          <View style={styles.header}>
            <Header positions={positions} />
          </View>
          <View style={styles.holdings}>
            <Holdings positions={positions} />
          </View>
        </SheetProvider>
      </GestureHandlerRootView>
    </NavigationScrollView>
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