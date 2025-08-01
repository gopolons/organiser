import { useColorScheme as useSystemColorScheme } from "react-native";

export interface ThemeColors {
  // Background colors
  background: string;
  surface: string;
  surfaceSecondary: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;

  // Border colors
  border: string;
  borderSecondary: string;

  // Accent colors
  primary: string;
  primaryLight: string;
  success: string;
  warning: string;
  error: string;

  // Status colors
  pending: string;
  completed: string;
  overdue: string;

  // Shadow colors
  shadow: string;

  // Input colors
  inputBackground: string;
  inputPlaceholder: string;

  // Button colors
  cancelButton: string;

  // Calendar colors
  calendarBackground: string;
  calendarText: string;
  calendarSelected: string;
  calendarToday: string;
  calendarDisabled: string;
}

export const lightTheme: ThemeColors = {
  // Background colors
  background: "#F2F2F2",
  surface: "#FFFFFF",
  surfaceSecondary: "#F9FAFB",

  // Text colors
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",
  textDisabled: "#9CA3AF",

  // Border colors
  border: "#D1D5DB",
  borderSecondary: "#E5E7EB",

  // Accent colors
  primary: "#3B82F6",
  primaryLight: "#DBEAFE",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",

  // Status colors
  pending: "#F59E0B",
  completed: "#10B981",
  overdue: "#EF4444",

  // Shadow colors
  shadow: "#000000",

  // Input colors
  inputBackground: "#FFFFFF",
  inputPlaceholder: "#C7C7CD",

  // Button colors
  cancelButton: "#6B7280",

  // Calendar colors
  calendarBackground: "#FFFFFF",
  calendarText: "#1F2937",
  calendarSelected: "#3B82F6",
  calendarToday: "#3B82F6",
  calendarDisabled: "#9CA3AF",
};

export const darkTheme: ThemeColors = {
  // Background colors
  background: "#111827",
  surface: "#1F2937",
  surfaceSecondary: "#374151",

  // Text colors
  textPrimary: "#F9FAFB",
  textSecondary: "#D1D5DB",
  textTertiary: "#9CA3AF",
  textDisabled: "#6B7280",

  // Border colors
  border: "#374151",
  borderSecondary: "#4B5563",

  // Accent colors
  primary: "#3B82F6",
  primaryLight: "#1E3A8A",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",

  // Status colors
  pending: "#F59E0B",
  completed: "#10B981",
  overdue: "#EF4444",

  // Shadow colors
  shadow: "#000000",

  // Input colors
  inputBackground: "#374151",
  inputPlaceholder: "#6B7280",

  // Button colors
  cancelButton: "#4B5563",

  // Calendar colors
  calendarBackground: "#1F2937",
  calendarText: "#F9FAFB",
  calendarSelected: "#3B82F6",
  calendarToday: "#3B82F6",
  calendarDisabled: "#6B7280",
};

export function useTheme() {
  const colorScheme = useSystemColorScheme();
  return colorScheme === "dark" ? darkTheme : lightTheme;
}
