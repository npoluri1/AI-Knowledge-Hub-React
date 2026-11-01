import AsyncStorage from "@react-native-async-storage/async-storage";
import { setSavedApiUrl } from "./client";

const STORAGE_KEY = "aikh.apiBaseUrl";

/** Load the user-saved API URL from device storage and apply it globally. */
export async function loadSavedApiUrl(): Promise<void> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved && saved.trim()) setSavedApiUrl(saved.trim());
  } catch {
    // Storage unavailable — keep default URL.
  }
}
