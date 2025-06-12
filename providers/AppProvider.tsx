import React from "react";
import { User, onAuthStateChanged, getAuth } from "firebase/auth";
import transactionController from "../controllers/transactionController";
import { Transaction } from "../models/Transaction";
import positionController from "../controllers/positionController";
import { Position } from "../models/Position";
import accountController from "../controllers/accountController";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppContextType {
  user: User | null;
  transactions: Transaction[];
  positions: Position[];
  signIn: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<User>;
  signOut: () => void;
  refetchTransaction: () => Promise<Transaction[]>;
  reloadAuth: () => void;
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
  const [positions, setPositions] = React.useState<Position[]>([]);

  React.useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  React.useEffect(() => {
    positionController.all(transactions).then(setPositions);
  }, [JSON.stringify(transactions)]);

  const handleAuthStateChanged = React.useCallback((user) => {
    setUser(user);
    if (user) {
      refetchTransaction();
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

  const refetchTransaction = React.useCallback(async () => {
    const newTransactions = await transactionController.all();
    setTransactions(newTransactions);
    return newTransactions;
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
        transactions,
        positions,
        signIn,
        signOut,
        refetchTransaction,
        reloadAuth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
