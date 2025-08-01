import * as FileSystem from "expo-file-system";

// Utility function for cleaning up audio files
export const cleanupAudioFile = async (uri: string) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(uri);
    }
  } catch (error) {
    alert(`Failed to clean up audio file: ${uri}, ${error}`);
  }
};
