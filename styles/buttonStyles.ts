import { ThemeColors } from "@/utils/theme";
import { StyleSheet } from "react-native";

export const createButtonStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    button: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 24,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      minHeight: 52,
    },
    destructive: {
      backgroundColor: theme.error,
    },
    text: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
      letterSpacing: 0.5,
    },
    disabled: {
      backgroundColor: theme.textDisabled,
      opacity: 0.6,
    },
  });

export const createRecordingButtonStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      paddingHorizontal: 20,
    },
    mainButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 3,
    },
    mainButtonRecording: {
      backgroundColor: theme.error,
      shadowColor: theme.error,
      borderColor: theme.primaryLight,
    },
    mainButtonIdle: {
      backgroundColor: theme.primary,
      shadowColor: theme.primary,
      borderColor: theme.primaryLight,
    },
    cancelButton: {
      marginTop: 16,
      backgroundColor: theme.cancelButton,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    cancelButtonText: {
      color: "white",
      fontSize: 14,
      fontWeight: "600",
    },
    cancelButtonIcon: {
      marginRight: 6,
    },
    recordingIndicator: {
      marginTop: 12,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.primaryLight,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.primaryLight,
    },
    recordingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.error,
      marginRight: 8,
    },
    recordingText: {
      color: theme.error,
      fontSize: 14,
      fontWeight: "600",
    },
    instructions: {
      color: theme.textSecondary,
      fontSize: 14,
      textAlign: "center",
      marginTop: 12,
      lineHeight: 20,
    },
    instructionsSubtext: {
      fontSize: 12,
      color: theme.textTertiary,
    },
  });
