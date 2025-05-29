import * as React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../../App";

const SignInScreen = () => {
  const { navigate } = useNavigation<StackNavigation>();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TouchableOpacity onPress={() => navigate("SignUp")}>
        <Text style={{ fontWeight: 500, color: Colors.black }}>Sign Up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SignInScreen;
