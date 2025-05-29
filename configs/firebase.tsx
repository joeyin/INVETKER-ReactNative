import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  // @ts-ignore
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD8UQzbXPRfECfOhJPgjlALUKPnUO_6aC8",
  authDomain: "invetker-b26e8.firebaseapp.com",
  projectId: "invetker-b26e8",
  storageBucket: "invetker-b26e8.firebasestorage.app",
  messagingSenderId: "1027866234022",
  appId: "1:1027866234022:web:327154b79b408d944af867"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth };
