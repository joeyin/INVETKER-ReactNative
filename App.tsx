import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "@ant-design/react-native";
import { AppProvider, useApp } from "./providers/AppProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import PortfolioScreen from "@/screens/Portfolio";
import FavoritesScreen from "@/screens/Favorites";
import Colors from "@/constants/Colors";
import HomeScreen from "@/screens/Home";
import TransactionsScreen from "@/screens/Transactions";
import NewTransactionScreen from "@/screens/Transactions/NewTransaction";
import SignInScreen from "@/screens/Account/SignIn";
import SettingsScreen from "@/screens/Settings";
import SignUpScreen from "@/screens/Account/SignUp";
import EditNameScreen from "@/screens/Settings/EditName";
import ProfileScreen from "@/screens/Profile";
import TickerListScreen from "./screens/TickerList";
import AddCommmentScreen from "@/screens/Profile/Comments/AddComment";
import { useTranslation, I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import storageService from "@services/storageService";
import enUS from "@ant-design/react-native/lib/locale-provider/en_US";
import zhCN from "@ant-design/react-native/lib/locale-provider/zh_CN";
import hiIN from "@/locales/antd/hiIN";
import zhTW from "@/locales/antd/zhTW";
import themeService from "@services/themeService";
import moment from "moment";
import "moment/locale/zh-tw";
import "moment/locale/zh-cn";
import "moment/locale/hi";
import { useColorScheme, StatusBar } from "react-native";
import { getLocales } from "expo-localization";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

function MainTabNavigator(props) {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: Colors.lightGray },
      }}
    >
      <Tab.Screen
        name={t("home")}
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={t("portfolio")}
        component={PortfolioScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pie-chart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={t("transactions")}
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="arrow-swap" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={t("favorites")}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="favorite" color={color} size={size} />
          ),
        }}
      >
        {() => <FavoritesScreen {...props} />}
      </Tab.Screen>
      <Tab.Screen
        name={t("settings")}
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-sharp" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user } = useApp();

  const onSelectTicker = React.useCallback((navigation, ticker) => {
    const { getState, navigate } = navigation;
    const state = getState();
    const routes = state.routes;
    const currentIndex = state.index;
    const previousRoute = routes[currentIndex - 1];
    const previousScreenName = previousRoute?.name;
    navigate(previousScreenName, { ticker }, { pop: true });
  }, []);

  if (user === undefined) {
    return null;
  }

  if (!user) {
    return (
      <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="NewTransaction" component={NewTransactionScreen} />
      <Stack.Screen name="TickerList">
        {(props) => (
          <TickerListScreen
            {...props}
            onFinished={(ticker) => onSelectTicker(props.navigation, ticker)}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="EditName" component={EditNameScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="AddComment" component={AddCommmentScreen} />
    </Stack.Navigator>
  );
}

const AntdTheme = {
  primary_button_fill: Colors.primary,
  primary_button_fill_tap: Colors.yellow300,
};

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    border: "rgb(39, 39, 41)",
    primary: Colors.primary,
  },
};

const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: Colors.lightGray200,
    primary: Colors.primary,
  },
};

const SUPPORTED_LANGUAGES = {
  "zh-hant": "zh-TW",
  "zh-hans": "zh-CN",
  "hi-in": "hi-IN",
  hi: "hi-IN",
  en: "en",
};

export default function App() {
  const [locale, setLocale] = React.useState("en");
  const [theme, setTheme] = React.useState(null);
  const colorScheme = useColorScheme();

  useFonts({
    antoutline: require("@ant-design/icons-react-native/fonts/antoutline.ttf"),
  });

  const refetchLocale = React.useCallback(async () => {
    const stored = await storageService.read("locale");
    if (stored) {
      i18n.changeLanguage(stored);
      setLocale(stored);
      return;
    }

    const getTag = ({ languageCode, languageScriptCode }) =>
      (languageScriptCode
        ? `${languageCode}-${languageScriptCode}`
        : languageCode
      ).toLowerCase();

    const locales = getLocales();
    const match = locales.find((locale) => SUPPORTED_LANGUAGES[getTag(locale)]);
    const lang = match ? SUPPORTED_LANGUAGES[getTag(match)] : "en";

    i18n.changeLanguage(lang);
    setLocale(lang);
  }, []);

  const refetchTheme = React.useCallback(async () => {
    setTheme((await storageService.read("theme")) || colorScheme);
  }, [colorScheme]);

  React.useEffect(() => {
    refetchTheme();
  }, [colorScheme]);

  React.useEffect(() => {
    const onLangChanged = (lng) =>
      lng ? (setLocale(lng), moment().locale(lng)) : refetchLocale();
    const onThemeChanged = (theme) =>
      theme ? setTheme(theme) : refetchTheme();

    i18n.on("languageChanged", onLangChanged);
    themeService.on("themeChanged", onThemeChanged);

    refetchLocale();
    refetchTheme();

    return () => {
      i18n.off("languageChanged", onLangChanged);
      themeService.off("themeChanged", onThemeChanged);
    };
  }, []);

  const myTheme = React.useMemo(
    () => (theme === "dark" ? MyDarkTheme : MyLightTheme),
    [theme]
  );

  const currentLocale = React.useMemo(() => {
    switch (locale) {
      case "zh-TW":
        return zhTW;
      case "zh-CN":
        return zhCN;
      case "hi-IN":
        return hiIN;
      default:
        return enUS;
    }
  }, [locale]);

  const barStyle = React.useMemo(
    () => (theme === "dark" ? "light-content" : "dark-content"),
    [theme]
  );

  return (
    <Provider locale={currentLocale} theme={AntdTheme}>
      <I18nextProvider i18n={i18n} defaultNS={"translation"}>
        <AppProvider>
          <NavigationContainer theme={myTheme}>
            <GestureHandlerRootView>
              <StatusBar barStyle={barStyle} />
              <RootNavigator />
            </GestureHandlerRootView>
          </NavigationContainer>
        </AppProvider>
      </I18nextProvider>
    </Provider>
  );
}
