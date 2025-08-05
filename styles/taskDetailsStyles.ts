import { ThemeColors } from "@/utils/theme";
import { StyleSheet } from "react-native";

export const createTaskDetailsStyles = (theme: ThemeColors) =>
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
      paddingBottom: 120, // Extra padding to ensure delete button is accessible with keyboard
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
    taskContent: {
      marginBottom: 16,
    },
    taskTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.textPrimary,
      lineHeight: 32,
      marginBottom: 8,
      flex: 1,
      paddingHorizontal: 0,
    },
    taskDescription: {
      fontSize: 16,
      color: theme.textSecondary,
      lineHeight: 24,
      textAlignVertical: "top",
      flex: 1,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    titleIcon: {
      marginRight: 8,
    },
    statusButton: {
      marginBottom: 8,
      padding: 0,
    },
    descriptionRow: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    descriptionIcon: {
      marginRight: 8,
      marginTop: 9,
    },
    overdueLabel: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme.primaryLight,
      borderRadius: 6,
      alignSelf: "flex-start",
    },
    overdueText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.overdue,
      marginLeft: 6,
    },
    divider: {
      height: 1,
      backgroundColor: theme.borderSecondary,
      marginTop: 0,
      marginBottom: 24,
    },
    fieldSection: {
      marginBottom: 24,
    },
    fieldLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.textSecondary,
      marginBottom: 8,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    editableField: {
      fontSize: 16,
      color: theme.textPrimary,
      lineHeight: 24,
      paddingVertical: 4,
      paddingHorizontal: 0,
    },
    multilineField: {
      minHeight: 80,
      textAlignVertical: "top",
    },
    dateField: {
      fontSize: 16,
      color: theme.textPrimary,
      lineHeight: 24,
      paddingVertical: 4,
      paddingHorizontal: 0,
    },
    placeholderText: {
      color: theme.textDisabled,
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
      gap: 12,
    },
    statusSection: {
      marginBottom: 24,
    },
    statusContainer: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    statusContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    statusText: {
      fontSize: 16,
      color: theme.textPrimary,
      fontWeight: "500",
    },
    completedStatus: {
      color: theme.completed,
    },
    pendingStatus: {
      color: theme.pending,
    },
    overdueStatus: {
      color: theme.overdue,
    },
  });
