import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "react-native-uuid";

class FileController {
  async uploadFile(fileUri: string): Promise<string> {
    try {
      const storage = getStorage();
      const ext = fileUri.split(".").pop()?.toLowerCase() || "jpg";
      const randomFilename = `${uuid.v4()}.${ext}`;
      const storageRef = ref(storage, `users/${randomFilename}`);

      const response = await fetch(fileUri);
      if (!response.ok) {
        throw new Error("Failed to fetch file URI.");
      }

      const blob = await response.blob();
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Uploading File Failed:", error);
      throw error;
    }
  }
}

export default new FileController();
