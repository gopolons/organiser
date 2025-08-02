import { Linking } from "react-native";

// A function for redirecting the user to app permission settings
export const openAppSettings = () => {
  try {
    Linking.openSettings();
  } catch (error) {
    alert("Unable to open settings");
  }
};
