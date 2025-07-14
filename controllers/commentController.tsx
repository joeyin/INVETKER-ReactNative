import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { app } from "@/configs/firebase";
import { getFirestore } from "firebase/firestore";
import accountController from "./accountController";
import { Comment, NewComment } from "@/models/Comment";

class CommentController {
  collectionRef = collection(getFirestore(app), "comments");

  async get(ticker: string): Promise<Comment[]> {
    try {
      const q = query(
        this.collectionRef,
        where("ticker", "==", ticker),
        orderBy("datetime", "desc"),
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return [];
      }
      const results = await Promise.all(
        querySnapshot.docs.map(async (commentDoc) => {
          const data = commentDoc.data();
          const userId = data.userId;
          let avatar = null;
          let displayName = null;
          try {
            const profileDocRef = doc(getFirestore(app), "profiles", userId);
            const profileSnap = await getDoc(profileDocRef);
            avatar = profileSnap.exists() ? profileSnap.data()?.photoURL ?? null : null;
            displayName = profileSnap.exists() ? profileSnap.data()?.displayName ?? null : null;
          } catch (e) {
            console.warn("Error fetching commenter profile:", userId, e);
          }
          return {
            id: commentDoc.id,
            avatar,
            displayName,
            ...data,
          };
        })
      );
      return results as Comment[];
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  }

  async insert(comment: NewComment) {
    try {
      const userId = accountController.getUserId();
      const docRef = await addDoc(this.collectionRef, {
        userId,
        datetime: Date.now(),
        ...comment,
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  }
}

export default new CommentController();
