import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { app } from "@/configs/firebase";
import { getFirestore } from "firebase/firestore";
import { Transaction, NewTransaction, Action } from "@/models/Transaction";
import accountController from "./accountController";
import { Position } from "@/models/Position";

class TransactionController {
  collectionRef = collection(getFirestore(app), "transactions");

  async get(id: string) {
    try {
      const userId = accountController.getUserId();
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const transaction = docSnap.data() as Transaction;
      if (transaction.userId !== userId) {
        throw new Error("Unauthorized access to transaction.");
      }

      return { id: docSnap.id, ...transaction };
    } catch (error) {
      console.error("Error fetching transaction:", error);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const userId = accountController.getUserId();
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Transaction not found.");
      }

      const transaction = docSnap.data() as Transaction;
      if (transaction.userId !== userId) {
        throw new Error("Unauthorized access to delete transaction.");
      }

      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  }

  async insert(transaction: NewTransaction, positions: Position[]) {
    try {
      if (transaction.action === Action.SELL) {
        const ticker = positions.find(p => p.ticker === transaction.ticker);
        if (!ticker || ticker.position < transaction.quantity) {
          throw new Error("Insufficient quantity to sell");
        }
      }

      const userId = accountController.getUserId();
      const docRef = await addDoc(this.collectionRef, {
        userId,
        ...transaction,
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  }

  async all() {
    try {
      const userId = accountController.getUserId();
      const querySnapshot = await getDocs(this.collectionRef);
      const transactions: Transaction[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Transaction;
        if (data.userId === userId) {
          transactions.push({ id: doc.id, ...data });
        }
      });

      return transactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }
}

export default new TransactionController();
