import { app } from "../configs/firebase";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

class AccountController {
  auth = getAuth(app)

  getUserId() {
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
}

export default new AccountController();
