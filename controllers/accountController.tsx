import { app } from "@/configs/firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile as firebaseUpdateProfile,
  UserCredential,
} from "firebase/auth";

type ProfileProps = {
  displayName?: string | null;
  photoURL?: string | null;
}

class AccountController {
  updateProfile(profile: ProfileProps): Promise<void> {
    return firebaseUpdateProfile(getAuth(app).currentUser, profile)
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

  signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(getAuth(app), email, password);
  }

  signOut(): Promise<void> {
    return signOut(getAuth(app));
  }
}

export default new AccountController();
