import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

function FavoritesScreen() {

  return (
    <SafeAreaView edges={["top"]}>
      <Text>Favorites</Text>
    </SafeAreaView>
  );
}

export default FavoritesScreen;