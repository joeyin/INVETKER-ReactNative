import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { app } from "@/configs/firebase";
import { getFirestore } from "firebase/firestore";
import accountController from "./accountController";

class FavoriteController {
  collectionRef = collection(getFirestore(app), "favorites");

  async delete(ticker: string): Promise<void> {
    try {
      const userId = accountController.getUserId();
      const q = query(
        this.collectionRef,
        where("ticker", "==", ticker),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error("Favorite not found.");
      }
      const docRef = querySnapshot.docs[0].ref;
      return await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting favorite:", error);
      throw error;
    }
  }

  async insert(ticker: string): Promise<string> {
    try {
      const userId = accountController.getUserId();
      const docRef = await addDoc(this.collectionRef, {
        userId,
        ticker,
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  }

  async toggle(ticker: string): Promise<void | string> {
    try {
      const userId = accountController.getUserId();
      const q = query(
        this.collectionRef,
        where("ticker", "==", ticker),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return this.insert(ticker);
      }
      return this.delete(ticker);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  }

  async all(): Promise<string[]> {
    try {
      const userId = accountController.getUserId();
      const q = query(this.collectionRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const favorites: string[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        favorites.push(data.ticker);
      });
      return favorites;
    } catch (error) {
      console.error("Error fetching favorites:", error);
      throw error;
    }
  }
}

export default new FavoriteController();
