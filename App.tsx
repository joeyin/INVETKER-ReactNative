import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  NavigationProp,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "@ant-design/react-native";
import { AppProvider, useApp } from "./providers/AppProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import Fontisto from "@expo/vector-icons/Fontisto";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import enUS from "@ant-design/react-native/lib/locale-provider/en_US";
import Colors from "./constants/Colors";
import HomeScreen from "./screens/Home";
import TransactionsScreen from "./screens/Transactions";
import SettingsScreen from "./screens/Settings";
import SignUpScreen from "./screens/Account/SignUp";
import SignInScreen from "./screens/Account/SignIn";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { StatusBar } from "react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// https://stackoverflow.com/questions/68739045/how-to-properly-type-usenavigation-in-react-navigation
export type ScreenNames = [
  "Home",
  "Transactions",
  "Settings",
  "SignUp",
  "SignIn"
];
export type RootStackParamList = Record<ScreenNames[number], undefined>;
export type StackNavigation = NavigationProp<RootStackParamList>;

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
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="arrow-swap" color={color} size={size} />
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
  return (
    <Provider locale={enUS} theme={AntdTheme}>
      <AppProvider>
        <NavigationContainer theme={MyTheme}>
          <GestureHandlerRootView>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.lightGray} />
            <RootNavigator />
          </GestureHandlerRootView>
        </NavigationContainer>
      </AppProvider>
    </Provider>
  );
}
