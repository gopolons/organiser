import { ThemeColors } from "@/utils/theme";
import { StyleSheet } from "react-native";

export const createTaskCellStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      marginVertical: 6,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    completedContainer: {
      backgroundColor: theme.surfaceSecondary,
      borderLeftColor: theme.completed,
      opacity: 0.8,
    },
    overdueContainer: {
      borderLeftColor: theme.overdue,
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    titleContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.textPrimary,
      flex: 1,
    },
    completedTitle: {
      textDecorationLine: "line-through",
      color: theme.textDisabled,
    },
    overdueBadge: {
      backgroundColor: theme.primaryLight,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginHorizontal: 10,
      borderRadius: 12,
    },
    overdueText: {
      fontSize: 10,
      fontWeight: "600",
      color: theme.overdue,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: theme.border,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.surface,
    },
    checkedBox: {
      backgroundColor: theme.completed,
      borderColor: theme.completed,
    },
    description: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
      marginBottom: 12,
    },
    completedDescription: {
      color: theme.textDisabled,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    dateText: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    completedDateText: {
      color: theme.textDisabled,
    },
    statusContainer: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      backgroundColor: theme.surfaceSecondary,
    },
    statusText: {
      fontSize: 11,
      fontWeight: "500",
    },
    pendingStatus: {
      color: theme.pending,
    },
    completedStatus: {
      color: theme.completed,
    },
  });
