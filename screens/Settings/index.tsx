import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

function SettingsScreen() {

  return (
    <SafeAreaView edges={["top"]}>
      <Text>Settings</Text>
    </SafeAreaView>
  );
}

export default SettingsScreen;