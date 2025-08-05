import { ThemeColors } from "@/utils/theme";
import { StyleSheet } from "react-native";

export const createAddNewTaskStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 100, // Extra padding for keyboard accessibility
    },
    header: {
      marginBottom: 32,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.textPrimary,
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      lineHeight: 22,
    },
    inputSection: {
      marginBottom: 24,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textPrimary,
      marginBottom: 8,
    },
    calendarSection: {
      marginBottom: 32,
    },
    calendarContainer: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    actionSection: {
      marginBottom: 20,
    },
    validationHint: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.primaryLight,
      borderRadius: 8,
      marginBottom: 20,
    },
    validationText: {
      marginLeft: 8,
      fontSize: 14,
      color: theme.warning,
      flex: 1,
    },
  });
