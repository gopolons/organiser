import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@/utils/theme";
import { EdgeInsets } from "react-native-safe-area-context";
import { createFilterSheetStyles } from "@/styles/filterSheetStyles";

export type FilterSheetProps = {
  visible: boolean;
  tags: string[];
  selectedTags: string[];
  insets: EdgeInsets;
  onToggleTag: (tag: string) => void;
  onClear: () => void;
  onClose: () => void;
};

export default function FilterSheet({
  visible,
  tags,
  selectedTags,
  insets,
  onToggleTag,
  onClear,
  onClose,
}: FilterSheetProps) {
  const theme = useTheme();
  const styles = createFilterSheetStyles(theme, insets);
  const selectedCount = selectedTags.length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Filter by tags</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.doneLabel}>Done</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.subHeaderRow}>
            <Text style={styles.subHeaderText}>
              {selectedCount === 0
                ? "Showing all tasks"
                : `Selected: ${selectedCount}`}
            </Text>
            {selectedCount > 0 && (
              <Pressable onPress={onClear}>
                <Text style={styles.clearText}>Clear</Text>
              </Pressable>
            )}
          </View>
          {tags.length === 0 ? (
            <Text style={styles.noTagsText}>No tags available</Text>
          ) : (
            <ScrollView>
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <Pressable
                    key={tag}
                    onPress={() => onToggleTag(tag)}
                    style={[
                      styles.tagRow,
                      isSelected ? styles.tagRowSelected : undefined,
                    ]}
                  >
                    <Text style={styles.tagText}>{tag}</Text>
                    <Text
                      style={[
                        styles.checkText,
                        isSelected ? styles.checkTextSelected : undefined,
                      ]}
                    >
                      {isSelected ? "✓" : ""}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
