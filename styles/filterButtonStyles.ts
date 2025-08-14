import { StyleSheet } from "react-native";
import { ThemeColors } from "@/utils/theme";

export function createFilterButtonStyles(theme: ThemeColors) {
  return StyleSheet.create({
    buttonContainer: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      position: "relative",
    },
    buttonText: {
      fontSize: 16,
      color: theme.primary,
      fontWeight: "600",
    },
    badgeContainer: {
      position: "absolute",
      top: -4,
      right: -4,
      backgroundColor: "#FF3B30",
      borderRadius: 999,
      minWidth: 18,
      height: 18,
      paddingHorizontal: 4,
      alignItems: "center",
      justifyContent: "center",
    },
    badgeText: {
      color: "white",
      fontSize: 12,
      fontWeight: "700",
    },
  });
}
