import * as Device from "expo-device";

// A utility function for checking if the current environment is simulator
export async function isSimulator() {
  return !Device.isDevice;
}
