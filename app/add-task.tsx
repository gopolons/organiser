import { AppButton } from "@/components/appButton";
import { InputField } from "@/components/inputField";
import { FormSubmitHandler } from "@/model/FormTypes";
import { AsyncTaskPersistence } from "@/services/persistence";
import { createAddNewTaskStyles } from "@/styles/addNewTaskStyles";
import { convertToISO8601 } from "@/utils/dateUtils";
import { useTheme } from "@/utils/theme";
import useAddTaskViewModel from "@/viewmodels/useAddTaskViewModel";
import { useTaskForm } from "@/viewmodels/useTaskForm";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function AddTaskView() {
  // Router declaration
  const router = useRouter();

  // Theme declaration
  const theme = useTheme();
  const addNewTaskStyles = createAddNewTaskStyles(theme);

  // State task variables which will be used for collecting user input
  const { formState, validation, handlers } = useTaskForm();

  // View model variables for fetching and manipulating data
  const { addNewTaskToPersistence, loading } = useAddTaskViewModel(
    // NOTE: Can be replaced with DummyTaskPersistence for debug purposes
    AsyncTaskPersistence,
  );

  // A function for saving the task into the persistent storage via view model
  const saveTask: FormSubmitHandler = async (formData) => {
    if (!validation.isValid) {
      Alert.alert(
        "Missing title",
        validation.fieldErrors.title || "Please enter a title for your task.",
      );
      return;
    }

    const response = await addNewTaskToPersistence(
      formData.name,
      formData.description,
      formData.dueDate,
      formData.tags,
    );

    if (response.success && response.data) {
      // Redirect the user to the page with new task details
      router.replace({
        pathname: "/task-details",
        params: { taskID: response.data },
      });
    } else {
      Alert.alert(
        "Error Adding Task!",
        response.error || "Something went wrong. Please try again later.",
      );
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={addNewTaskStyles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={addNewTaskStyles.scrollView}
            contentContainerStyle={addNewTaskStyles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            {/* Header */}
            <View style={addNewTaskStyles.header}>
              <Text style={addNewTaskStyles.headerTitle}>Add New Task</Text>
              <Text style={addNewTaskStyles.headerSubtitle}>
                Create a new task to stay organized and productive
              </Text>
            </View>

            {/* Title Input */}
            <View style={addNewTaskStyles.inputSection}>
              <Text style={addNewTaskStyles.inputLabel}>Task Title *</Text>
              <InputField
                value={formState.name}
                onChangeText={handlers.setName}
                placeholder="Enter task title..."
                returnKeyType="next"
              />
              {/* {Field specific error} */}
              {validation.fieldErrors.title && (
                <Text
                  style={{ color: theme.error, fontSize: 12, marginTop: 4 }}
                >
                  {validation.fieldErrors.title}
                </Text>
              )}
            </View>

            {/* Description Input */}
            <View style={addNewTaskStyles.inputSection}>
              <Text style={addNewTaskStyles.inputLabel}>Description</Text>
              <InputField
                value={formState.description}
                onChangeText={handlers.setDescription}
                placeholder="Enter task description (optional)..."
                multiline={true}
                numberOfLines={4}
              />
            </View>

            {/* Tags Section */}
            <View style={addNewTaskStyles.inputSection}>
              <Text style={addNewTaskStyles.inputLabel}>Tags</Text>
              <InputField
                value={formState.tagText}
                onChangeText={handlers.handleTagInput}
                onSubmitEditing={handlers.handleTagSubmit}
                placeholder="Type a tag and press space"
                returnKeyType="done"
              />
              {formState.tags.length > 0 && (
                <View style={addNewTaskStyles.tagsContainer}>
                  {formState.tags.map((tag) => (
                    <View key={tag} style={addNewTaskStyles.tagChip}>
                      <Text style={addNewTaskStyles.tagText}>{tag}</Text>
                      <Ionicons
                        name="close"
                        size={14}
                        color={theme.textTertiary}
                        onPress={() => handlers.removeTag(tag)}
                        style={addNewTaskStyles.tagRemoveIcon}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Due Date Section */}
            <View style={addNewTaskStyles.calendarSection}>
              <Text style={addNewTaskStyles.inputLabel}>Due Date</Text>

              <View style={addNewTaskStyles.calendarContainer}>
                <Calendar
                  firstDay={1}
                  onDayPress={(day) => {
                    handlers.setDueDate(day.timestamp);
                  }}
                  markedDates={{
                    [convertToISO8601(formState.dueDate)]: {
                      selected: true,
                      marked: true,
                      selectedColor: theme.primary,
                    },
                  }}
                  theme={{
                    backgroundColor: theme.calendarBackground,
                    calendarBackground: theme.calendarBackground,
                    textSectionTitleColor: theme.textPrimary,
                    selectedDayBackgroundColor: theme.calendarSelected,
                    selectedDayTextColor: "#FFFFFF",
                    todayTextColor: theme.calendarToday,
                    dayTextColor: theme.calendarText,
                    textDisabledColor: theme.calendarDisabled,
                    dotColor: theme.primary,
                    selectedDotColor: "#FFFFFF",
                    arrowColor: theme.primary,
                    monthTextColor: theme.textPrimary,
                    indicatorColor: theme.primary,
                    textDayFontWeight: "500",
                    textMonthFontWeight: "600",
                    textDayHeaderFontWeight: "600",
                    textDayFontSize: 16,
                    textMonthFontSize: 18,
                    textDayHeaderFontSize: 14,
                  }}
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={addNewTaskStyles.actionSection}>
              <AppButton
                title={loading ? "Adding task..." : "Create Task"}
                onPress={() => saveTask(formState)}
                disabled={!validation.isValid || loading}
              />
            </View>

            {/* Form Validation Hint */}
            {!validation.isValid && (
              <View style={addNewTaskStyles.validationHint}>
                <Ionicons
                  name="information-circle"
                  size={20}
                  color={theme.warning}
                />
                <View>
                  {validation.errors.map((error, index) => (
                    <Text key={index} style={addNewTaskStyles.validationText}>
                      {error}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
