import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

function HomeScreen() {

  return (
    <SafeAreaView edges={["top"]}>
      <Text>Home</Text>
    </SafeAreaView>
  );
}

export default HomeScreen;