import React from "react";
import { User, onAuthStateChanged, getAuth } from "firebase/auth";
import transactionController from "@/controllers/transactionController";
import { Transaction } from "@/models/Transaction";
import positionController from "@/controllers/positionController";
import { Position } from "@/models/Position";
import accountController from "@/controllers/accountController";
import AsyncStorage from "@react-native-async-storage/async-storage";
import favoriteController from "@/controllers/favoriteController";
import themeService from "@services/themeService";
import storageService from "@services/storageService";
import i18n from "@/i18n";
import moment from "moment";

interface AppContextType {
  user: User | null;
  favorites: string[];
  transactions: Transaction[];
  positions: Position[];
  theme: string;
  locale: string;
  lastUpdated: moment.Moment;
  signIn: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<User>;
  signOut: () => void;
  refetchTransaction: () => Promise<Transaction[]>;
  reloadAuth: () => void;
  refetchFavorite: () => void;
}

export const AppContext = React.createContext<AppContextType | undefined>(
  undefined
);

export const useApp = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = React.useState<User | null | undefined>(undefined);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [lastUpdated, setLastUpdated] = React.useState<moment.Moment>();
  const [positions, setPositions] = React.useState<Position[]>([]);
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [theme, setTheme] = React.useState(null);
  const [locale, setLocale] = React.useState(null);

  React.useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  React.useEffect(() => {
    i18n.on("languageChanged", setLocale);
    themeService.on("themeChanged", setTheme);
  }, []);

  React.useEffect(() => {
    positionController.all(transactions).then((r) => {
      setPositions(r);
      setLastUpdated(moment());
    });
  }, [JSON.stringify(transactions)]);

  const handleAuthStateChanged = React.useCallback((user) => {
    setUser(user);
    if (user) {
      refetchTheme();
      refetchLocale();
      refetchTransaction();
      refetchFavorite();
    }
  }, []);

  const reloadAuth = React.useCallback(() => {
    getAuth()
      .currentUser.reload()
      .then(() => {
        setUser({ ...getAuth().currentUser });
      })
      .catch((error) => {
        console.error("Failed to reload user:", error);
      });
  }, []);

  const refetchFavorite = React.useCallback(async () => {
    const newFavorites = await favoriteController.all();
    setFavorites(newFavorites);
    return newFavorites;
  }, []);

  const refetchTransaction = React.useCallback(async () => {
    const newTransactions = await transactionController.all();
    setTransactions(newTransactions);
    return newTransactions;
  }, []);

  const refetchTheme = React.useCallback(() => {
    storageService.read("theme").then(setTheme);
  }, []);

  const refetchLocale = React.useCallback(() => {
    storageService.read("locale").then(setLocale);
  }, []);

  const signIn = React.useCallback(
    async (email: string, password: string, rememberMe: boolean = false) => {
      try {
        const userCredential = await accountController.signIn(email, password);
        if (rememberMe) {
          await AsyncStorage.setItem("email", email);
          await AsyncStorage.setItem("password", password);
        } else {
          await AsyncStorage.removeItem("email");
          await AsyncStorage.removeItem("password");
        }
        await AsyncStorage.setItem("rememberMe", rememberMe ? "true" : "false");
        return userCredential.user;
      } catch (error) {
        console.error("Sign in failed:", error);
        throw error;
      }
    },
    []
  );

  const signOut = React.useCallback(async () => {
    try {
      await accountController.signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
      throw error;
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        favorites,
        transactions,
        positions,
        theme,
        locale,
        lastUpdated,
        signIn,
        signOut,
        refetchTransaction,
        reloadAuth,
        refetchFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
