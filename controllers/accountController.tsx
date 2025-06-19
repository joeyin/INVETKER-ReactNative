import { app } from "@/configs/firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile as firebaseUpdateProfile,
  UserCredential,
} from "firebase/auth";
import { doc, setDoc, collection, getFirestore } from "firebase/firestore";
import { sha256 } from "react-native-sha256";

type ProfileProps = {
  displayName?: string | null;
  photoURL?: string | null;
};

class AccountController {
  collectionRef = collection(getFirestore(app), "profiles");

  async updateProfile(profile: ProfileProps): Promise<void> {
    try {
      const userId = this.getUserId();
      const docRef = doc(this.collectionRef, userId);
      await setDoc(docRef, profile, { merge: true });
      return firebaseUpdateProfile(getAuth(app).currentUser, profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  getUserId(): string {
    const uid = getAuth(app).currentUser?.uid;
    if (!uid) {
      throw new Error("User is not authenticated.");
    }
    return uid;
  }

  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(getAuth(app), email, password);
  }

  async signUp(
    displayName: string,
    email: string,
    password: string
  ): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(
      getAuth(app),
      email,
      password
    );
    const encode = await sha256(email.toLocaleLowerCase());
    this.updateProfile({
      displayName,
      photoURL: `https://www.gravatar.com/avatar/${encode}?d=404&size=256`,
    });
    return userCredential;
  }

  signOut(): Promise<void> {
    return signOut(getAuth(app));
  }
}

export default new AccountController();
