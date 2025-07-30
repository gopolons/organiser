import { ThemeColors } from "@/utils/theme";
import { StyleSheet } from "react-native";

export const createGlobalStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 16,
    },
    fab: {
      position: "absolute",
      right: 20,
      bottom: 100,
      backgroundColor: theme.primary,
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      elevation: 5, // for Android shadow
      shadowColor: theme.shadow, // iOS shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      zIndex: 100,
    },
  });
