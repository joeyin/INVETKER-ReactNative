import React from "react";
import { UserCredential, User } from "firebase/auth";
import accountController from "../controllers/accountController";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppContextType {
  user: User | null;
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<User>;
  signOut: () => void;
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
  const [user, setUser] = React.useState<User | null>(null);

  const signIn = React.useCallback(
    async (email: string, password: string, rememberMe: boolean = false) => {
      try {
        const userCredential = await accountController.signIn(email, password);
        setUser(userCredential.user);
        if (rememberMe) {
          await AsyncStorage.setItem("email", email);
          await AsyncStorage.setItem("password", password);
        }
        return userCredential.user;
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },
    []
  );

  const signOut = React.useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
