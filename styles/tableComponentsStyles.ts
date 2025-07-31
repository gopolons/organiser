import { ThemeColors } from "@/utils/theme";
import { StyleSheet } from "react-native";

export const createTableComponentsStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    placeholderContainer: {
      width: "100%",
      flexDirection: "column",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    iconContainer: {
      marginBottom: 24,
      padding: 16,
      borderRadius: 50,
      backgroundColor: theme.surfaceSecondary,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    titleText: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.textPrimary,
      textAlign: "center",
      marginBottom: 8,
      letterSpacing: 0.5,
    },
    descriptionText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 22,
      paddingHorizontal: 32,
      letterSpacing: 0.3,
    },
    sectionHeader: {
      fontSize: 18,
      fontWeight: "600",
      paddingVertical: 8,
      backgroundColor: theme.background,
      color: theme.textPrimary,
    },
  });
