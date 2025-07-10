import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView as RNScrollView,
  Text,
} from "react-native";
import ScrollView from "@/components/Layout/ScrollView";
import Colors from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useToggle } from "@/hooks";
import { Flex, Tabs } from "@ant-design/react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tickerController from "@/controllers/tickerController";
import ValueChangeTag from "@/components/ValueChangeTag";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
  RouteProp,
  useRoute,
  useNavigation,
  ParamListBase,
  NavigationProp,
} from "@react-navigation/native";
import favoriteController from "@/controllers/favoriteController";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useApp } from "@/providers/AppProvider";
import { formatDecimal } from "@/helpers/formatHelpers";

function ProfileScreen() {
  const { favorites, refetchFavorite } = useApp();
  const { goBack } = useNavigation();
  const { bottom } = useSafeAreaInsets();
  const route: RouteProp<{ [x: string]: any }> = useRoute();
  const tabs = [
    { title: "Profile" },
    { title: "News" },
    { title: "Comments" },
  ];
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();
  const ticker = route.params.ticker;
  const isLiked = useToggle(favorites.includes(ticker));

  const [currentTab, setCurrentTab] = React.useState(0);
  const [quote, setQuote] = React.useState(undefined);

  React.useEffect(() => {
    tickerController.quote(ticker).then(setQuote);

    const intervalId = setInterval(() => {
      tickerController.quote(ticker).then(setQuote);
    }, 60000);

    return () => clearInterval(intervalId)
  }, []);

  React.useEffect(() => {
    if (favorites.includes(ticker)) {
      isLiked.on();
    } else {
      isLiked.off();
    }
  }, [favorites]);

  const handleLike = React.useCallback(() => {
    favoriteController.toggle(ticker).then(refetchFavorite);
  }, []);

  const color = React.useMemo(
    () =>
      quote?.d == 0
        ? {}
        : quote?.d > 0
          ? { color: Colors.success }
          : { color: Colors.danger },
    [quote?.d]
  );

  return (
    <ScrollView
      scrollEnabled={false}
      contentContainerStyle={{ flex: 1 }}
      style={{
        marginBottom: bottom,
      }}
      title={ticker}
      left={
        <TouchableOpacity onPress={goBack}>
          <FontAwesome name="angle-left" size={30} color={Colors.black} />
        </TouchableOpacity>
      }
      right={
        <TouchableOpacity onPress={handleLike}>
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
      <View
        style={{
          ...styles.container,
          paddingBottom: bottom * 1.6,
        }}
      >
        <Flex style={{ gap: 10, paddingHorizontal: 15 }}>
          <Flex style={{ gap: 3, height: "100%" }}>
            {quote?.d == 0 ? (
              ""
            ) : quote?.d > 0 ? (
              <AntDesign name="caretup" size={13} style={[color, styles.caret]} />
            ) : (
              <AntDesign
                name="caretdown"
                size={13}
                style={[color, styles.caret]}
              />
            )}
            <Text style={[color, styles.price]}>{formatDecimal(quote?.c)}</Text>
          </Flex>
          <Flex style={{ height: "100%" }}>
            <ValueChangeTag
              value={quote?.d}
              style={styles.text}
              format="Decimal"
              signed
            />
            <ValueChangeTag
              prefix="("
              suffix=")"
              value={quote?.dp}
              style={styles.text}
              unit="%"
              format="Decimal"
            />
          </Flex>
        </Flex>
        <TouchableOpacity
          onPress={() =>
            navigate("AddComment", { ticker: route.params.ticker })
          }
          activeOpacity={0.8}
          style={[styles.button, currentTab === 2 && { display: "flex" }]}
        >
          <FontAwesome5 name="pen" size={20} color={Colors.white} />
        </TouchableOpacity>
        <Tabs
          tabs={tabs}
          tabBarBackgroundColor="transparent"
          tabBarTextStyle={{ fontSize: 15, fontWeight: 500 }}
          tabBarActiveTextColor={Colors.primary}
          tabBarInactiveTextColor={Colors.secondary}
          tabBarUnderlineStyle={{ backgroundColor: Colors.primary }}
          onTabClick={(_, index) => setCurrentTab(index)}
        >
          <RNScrollView style={styles.tab}>
            <Text>Profile</Text>
          </RNScrollView>
          <RNScrollView style={styles.tab}>
            <Text>News</Text>
          </RNScrollView>
          <RNScrollView style={styles.tab}>
            <Text>Comments</Text>
          </RNScrollView>
        </Tabs>
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
  button: {
    width: 50,
    height: 50,
    backgroundColor: Colors.primary,
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    display: "none",
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.28,
    shadowRadius: 5.68,
    elevation: 2,
  },
  price: {
    fontSize: 19,
    fontWeight: 500,
  },
  text: {
    fontSize: 15,
    fontWeight: 400,
  },
  caret: {
    marginRight: 2,
  },
});

export default ProfileScreen;
