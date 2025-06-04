import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "@ant-design/react-native";
import { AppProvider, useApp } from "./providers/AppProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import enUS from "@ant-design/react-native/lib/locale-provider/en_US";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { StatusBar } from "react-native";
import PortfolioScreen from "@/screens/Portfolio";
import FavoritesScreen from "@/screens/Favorites";
import Colors from "@/constants/Colors";
import HomeScreen from "@/screens/Home";
import TransactionsScreen from "@/screens/Transactions";
import SignInScreen from "@/screens/Account/SignIn";
import SettingsScreen from "@/screens/Settings";
import SignUpScreen from "@/screens/Account/SignUp";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

function MainTabNavigator() {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: Colors.lightGray },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Portfolio"
        component={PortfolioScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pie-chart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="arrow-swap" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="favorite" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
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
    </Stack.Navigator>
  );
}

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
  },
};

const AntdTheme = {
  primary_button_fill: Colors.primary,
  primary_button_fill_tap: Colors.yellow300,
};

export default function App() {
  useFonts({
    antoutline: require("@ant-design/icons-react-native/fonts/antoutline.ttf"),
  });

  return (
    <Provider locale={enUS} theme={AntdTheme}>
      <AppProvider>
        <NavigationContainer theme={MyTheme}>
          <GestureHandlerRootView>
            <StatusBar
              barStyle="dark-content"
              backgroundColor={Colors.lightGray}
            />
            <RootNavigator />
          </GestureHandlerRootView>
        </NavigationContainer>
      </AppProvider>
    </Provider>
  );
}
