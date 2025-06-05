import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import ActionSheet from "react-native-actions-sheet";
import Colors from "@/constants/Colors";
import { Flex } from "@ant-design/react-native";
import Entypo from "@expo/vector-icons/Entypo";
import {
  formatDecimal,
  formatLocalizedCapitalized,
} from "@/helpers/formatHelpers";

function TickerDetail({ payload }) {
  const { ticker } = payload;

  const OpenURLButton = ({ url }) => {
    const handlePress = React.useCallback(async () => {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);

    return (
      <TouchableOpacity onPress={handlePress}>
        <Flex>
          <Entypo name="link" size={16} color={Colors.blue} />
          <Text style={{ ...styles.value, marginLeft: 6, color: Colors.blue }}>
            {url}
          </Text>
        </Flex>
      </TouchableOpacity>
    );
  };

  return (
    <ActionSheet
      containerStyle={{
        height: 680,
        backgroundColor: Colors.lightGray,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Information</Text>
        <View style={styles.container}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Ticker</Text>
            <Text style={styles.value}>{ticker.ticker || "-"}</Text>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Company</Text>
            <Text style={styles.value}>{ticker.company || "-"}</Text>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Country</Text>
            <Text style={styles.value}>
              {ticker?.locale?.toUpperCase() || "-"}
            </Text>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Industry</Text>
            <Text style={styles.value}>
              {formatLocalizedCapitalized(
                ticker.sic_description || ticker.industry || "-"
              )}
            </Text>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Price</Text>
            <Text style={styles.value}>{formatDecimal(ticker.price)}</Text>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Currency</Text>
            <Text style={styles.value}>
              {ticker?.currency_name?.toUpperCase() || "-"}
            </Text>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Market Cap</Text>
            <Text style={styles.value}>{formatDecimal(ticker.market_cap)}</Text>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Website</Text>
            {ticker.weburl ? <OpenURLButton url={ticker.weburl} /> : <Text>-</Text>}
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>List Date</Text>
            <Text style={styles.value}>{ticker.list_date || "-"}</Text>
          </View>
          <View style={{ ...styles.formGroup, borderBottomWidth: 0 }}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{ticker.description || "-"}</Text>
          </View>
        </View>
      </ScrollView>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomWidth: 0,
    marginBottom: 25,
    marginHorizontal: 15,
    paddingHorizontal: 16,
  },
  title: {
    marginTop: 15,
    marginBottom: 10,
    marginHorizontal: 15,
    fontSize: 35,
    fontWeight: "bold",
  },
  formGroup: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: Colors.lightGray200,
  },
  label: {
    fontSize: 12,
    color: Colors.secondary,
    marginBlock: 2,
  },
  value: {
    fontSize: 17,
    color: Colors.black,
  },
});

export default TickerDetail;
