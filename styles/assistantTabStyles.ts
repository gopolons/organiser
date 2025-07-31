import { ThemeColors } from "@/utils/theme";
import { StyleSheet } from "react-native";

export const createAssistantTabStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    recordingSection: {
      paddingVertical: 20,
      backgroundColor: theme.surfaceSecondary,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSecondary,
    },
    taskListContainer: {
      flex: 1,
    },
    flatList: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    itemSeparator: {
      height: 8,
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
      backgroundColor: theme.background,
    },
    emptyStateIcon: {
      marginBottom: 16,
    },
    emptyStateText: {
      color: theme.textSecondary,
      fontSize: 16,
      textAlign: "center",
      lineHeight: 24,
    },
    emptyStateSubtext: {
      color: theme.textTertiary,
      fontSize: 14,
      textAlign: "center",
      marginTop: 8,
    },
    swipeInstructionsContainer: {
      paddingHorizontal: 16,
      paddingVertical: 20,
      backgroundColor: theme.surfaceSecondary,
      borderTopWidth: 1,
      borderTopColor: theme.borderSecondary,
    },
    swipeInstructionsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    swipeInstructionLeft: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 24,
    },
    swipeInstructionRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    swipeInstructionIcon: {
      marginRight: 4,
    },
    swipeInstructionTextLeft: {
      color: theme.completed,
      fontSize: 14,
      fontWeight: "600",
    },
    swipeInstructionTextRight: {
      color: theme.error,
      fontSize: 14,
      fontWeight: "600",
    },
    swipeInstructionNote: {
      color: theme.textSecondary,
      fontSize: 12,
      textAlign: "center",
      lineHeight: 16,
    },
    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    loadingModal: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 32,
      alignItems: "center",
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    loadingSpinnerContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.surfaceSecondary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
      // Ensure the ActivityIndicator is perfectly centered
      position: "relative",
      // Force perfect centering
      flexDirection: "row",
      // Additional centering properties
      overflow: "hidden",
    },
    loadingTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.textPrimary,
      marginBottom: 8,
    },
    loadingSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
    swipeActionRight: {
      backgroundColor: theme.error,
      justifyContent: "center",
      alignItems: "center",
      width: 80,
      height: "100%",
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
    },
    swipeActionLeft: {
      backgroundColor: theme.completed,
      justifyContent: "center",
      alignItems: "center",
      width: 80,
      height: "100%",
      borderTopLeftRadius: 12,
      borderBottomLeftRadius: 12,
    },
    swipeActionText: {
      color: "white",
      fontSize: 12,
      marginTop: 4,
    },
  });
