import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import Colors from "@/constants/Colors";
import { Flex } from "@ant-design/react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { formatDecimal } from "@/helpers/formatHelpers";
import List from "@/components/List";
import tickerController from "@/controllers/tickerController";

type Props = {
  ticker: string;
  visible: boolean;
};

const CompanyProfile = ({ ticker }: Props) => {
  const [profile, setProfile] = React.useState(undefined);

  React.useEffect(() => {
    tickerController.profile(ticker).then(setProfile);
  }, []);

  const OpenURLButton = ({ url }) => {
    const handlePress = React.useCallback(async () => {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Unsupported URL", `Cannot open this URL: ${url}`);
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
    <List style={styles.container}>
      <List.Item style={{ flexDirection: "column" }}>
        <Text style={styles.label}>Ticker</Text>
        <Text style={styles.value}>{profile?.ticker || "-"}</Text>
      </List.Item>
      <List.Item style={{ flexDirection: "column" }}>
        <Text style={styles.label}>Company</Text>
        <Text style={styles.value}>{profile?.name || "-"}</Text>
      </List.Item>
      <List.Item style={{ flexDirection: "column" }}>
        <Text style={styles.label}>Country</Text>
        <Text style={styles.value}>
          {profile?.locale?.toUpperCase() || "-"}
        </Text>
      </List.Item>
      <List.Item style={{ flexDirection: "column" }}>
        <Text style={styles.label}>Industry</Text>
        <Text style={styles.value}>{profile?.sic_description || "-"}</Text>
      </List.Item>
      <List.Item style={{ flexDirection: "column" }}>
        <Text style={styles.label}>Currency</Text>
        <Text style={styles.value}>
          {profile?.currency_name?.toUpperCase() || "-"}
        </Text>
      </List.Item>
      <List.Item style={{ flexDirection: "column" }}>
        <Text style={styles.label}>Market Cap</Text>
        <Text style={styles.value}>{formatDecimal(profile?.market_cap)}</Text>
      </List.Item>
      <List.Item style={{ flexDirection: "column" }}>
        <Text style={styles.label}>Website</Text>
        {profile?.homepage_url ? (
          <OpenURLButton url={profile.homepage_url} />
        ) : (
          <Text>-</Text>
        )}
      </List.Item>
      <List.Item style={{ flexDirection: "column" }}>
        <Text style={styles.label}>List Date</Text>
        <Text style={styles.value}>{profile?.list_date || "-"}</Text>
      </List.Item>
      <List.Item style={{ flexDirection: "column" }}>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{profile?.description || "-"}</Text>
      </List.Item>
    </List>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  formGroup: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: Colors.lightGray200,
  },
  label: {
    fontSize: 12,
    color: Colors.secondary,
    marginBottom: 3,
  },
  value: {
    fontSize: 15,
    color: Colors.black,
  },
});

export default CompanyProfile;
