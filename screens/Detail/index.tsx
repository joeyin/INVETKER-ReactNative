import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import ScrollView from "@/components/Layout/ScrollView";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import Colors from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useToggle } from "@/hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function DetailScreen() {
  const { goBack } = useNavigation();
  const isLiked = useToggle();
  const { bottom } = useSafeAreaInsets();
  const route: RouteProp<{ [x: string]: any }> = useRoute();

  return (
    <ScrollView
      scrollEnabled={false}
      contentContainerStyle={{ flex: 1 }}
      style={{
        marginBottom: bottom,
      }}
      title={route.params.ticker}
      left={
        <TouchableOpacity onPress={goBack}>
          <FontAwesome name="angle-left" size={30} color={Colors.black} />
        </TouchableOpacity>
      }
      right={
        <TouchableOpacity onPress={() => isLiked.toggle()}>
          {isLiked.state ? (
            <MaterialIcons name="favorite" size={24} color={Colors.danger} />
          ) : (
            <MaterialIcons
              name="favorite-outline"
              size={24}
              color={Colors.black}
            />
          )}
        </TouchableOpacity>
      }
    >
      <View style={{
        ...styles.container,
        paddingBottom: bottom * 1.6,
      }}>
        <Text>Detail Screen</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    flex: 1,
  },
  tab: {
    flex: 1,
    padding: 15,
  },
});

export default DetailScreen;
