import { ThemeColors } from "@/utils/theme";
import { StyleSheet } from "react-native";

export const createInputFieldStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    input: {
      height: 52,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.inputBackground,
      fontSize: 16,
      color: theme.textPrimary,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    multilineInput: {
      height: 120,
      paddingTop: 16,
      paddingBottom: 16,
    },
  });
