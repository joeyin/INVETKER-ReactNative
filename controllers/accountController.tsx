import { app } from "../configs/firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

class AccountController {
  auth = getAuth(app);

  getUserId(): string {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      throw new Error("User is not authenticated.");
    }
    return uid;
  }

  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signOut() {
    return signOut(this.auth);
  }
}

export default new AccountController();
