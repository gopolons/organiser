import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "@/utils/theme";
import { createFilterButtonStyles } from "@/styles/filterButtonStyles";

type FilterButtonProps = {
  badgeCount?: number;
  onPress: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

export default function FilterButton({
  badgeCount = 0,
  onPress,
  accessibilityLabel = "Filter tasks",
  accessibilityHint = "Opens filter selection",
}: FilterButtonProps) {
  const theme = useTheme();
  const styles = createFilterButtonStyles(theme);
  const displayCount = Math.min(badgeCount, 99);

  return (
    <Pressable
      onPress={onPress}
      style={styles.buttonContainer}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      <Text style={styles.buttonText}>Filter</Text>
      {displayCount > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{displayCount}</Text>
        </View>
      )}
    </Pressable>
  );
}
