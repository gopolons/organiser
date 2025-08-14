import { StyleSheet } from "react-native";
import { ThemeColors } from "@/utils/theme";
import type { EdgeInsets } from "react-native-safe-area-context";

export function createFilterSheetStyles(
  theme: ThemeColors,
  insets: EdgeInsets,
) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    sheetContainer: {
      backgroundColor: theme.surface,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 16 + insets.bottom,
      maxHeight: "70%",
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 25,
    },
    doneLabel: {
      fontSize: 16,
      color: theme.primary,
      fontWeight: "600",
    },
    headerTitle: { fontSize: 18, fontWeight: "600", color: theme.textPrimary },
    subHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    subHeaderText: { color: theme.textSecondary },
    clearText: { color: theme.primary, fontWeight: "600" },
    noTagsText: { color: theme.textSecondary, marginVertical: 8 },
    tagRow: {
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 8,
      backgroundColor: theme.surfaceSecondary,
      borderWidth: 1,
      borderColor: theme.borderSecondary,
      marginBottom: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    tagRowSelected: {
      backgroundColor: theme.primaryLight,
      borderColor: theme.primary,
    },
    tagText: { fontSize: 16, color: theme.textPrimary },
    checkText: { fontSize: 16, color: theme.textTertiary },
    checkTextSelected: { color: theme.primary },
  });
}
