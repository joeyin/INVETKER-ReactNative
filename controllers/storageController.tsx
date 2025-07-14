import AsyncStorage from "@react-native-async-storage/async-storage";

class StorageController {
  async store(key: string, value: any) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error("Storing Value Failed:", error);
      return error;
    }
  }

  async read(key: string) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error("Reading Value Failed:", error);
      return error;
    }
  }
}

export default new StorageController();