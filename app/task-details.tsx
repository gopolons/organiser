import { AppButton } from "@/components/appButton";
import { InputField } from "@/components/inputField";
import { TaskData } from "@/model/task";
import { AsyncTaskPersistence } from "@/services/persistence";
import { createTaskDetailsStyles } from "@/styles/taskDetailsStyles";
import { convertToISO8601, isOverdue } from "@/utils/dateUtils";
import { useTheme } from "@/utils/theme";
import useTaskDetailsViewModel from "@/viewmodels/useTaskDetailsViewModel";
import { useTaskForm } from "@/viewmodels/useTaskForm";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function TaskDetailsView() {
  // Theme declaration
  const theme = useTheme();
  const taskDetailsStyles = createTaskDetailsStyles(theme);

  // Task ID acquired from the navigation path parameters
  const { taskID } = useLocalSearchParams<{ taskID: string }>();

  // State task variables which will be used for collecting user input
  const { formState, validation, handlers } = useTaskForm();
  const [initialTask, setInitialTask] = useState<TaskData | null>(null);

  // View model variables for fetching and manipulating data
  const { fetchTaskById, updateTaskDetails, deleteTask, loading } =
    useTaskDetailsViewModel(
      // NOTE: Can be replaced with DummyTaskPersistence for debug purposes
      AsyncTaskPersistence,
    );

  // Function for fetching task details from persistence
  async function fetchTaskDetails() {
    const response = await fetchTaskById(taskID);
    if (response.success && response.data) {
      setInitialTask(response.data);
      handlers.populateData(response.data);
    } else {
      Alert.alert(
        "Error Fetching Task Details!",
        response.error || "Something went wrong. Please try again later.",
        [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ],
      );
    }
  }

  // Function for storing updated task details in persistence
  async function storeTaskDetails() {
    // Check if task is valid
    if (!validation.isValid) return;
    if (!initialTask) return;

    const task: TaskData = {
      id: initialTask.id,
      name: formState.name,
      description: formState.description,
      dueDate: formState.dueDate,
      completed: formState.completed,
      tags: formState.tags,
      order: initialTask.order,
    };

    // Update task details in persistence
    const response = await updateTaskDetails(task);
    if (!response.success) {
      Alert.alert(
        "Error Updating Task Details!",
        response.error || "Something went wrong. Please try again later.",
      );
    }
  }

  // Function to delete task
  async function handleDeleteTask() {
    if (!initialTask) return;

    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const response = await deleteTask(initialTask.id);
            if (response.success) {
              router.back();
            } else {
              Alert.alert(
                "Error Deleting Task!",
                response.error ||
                  "Something went wrong. Please try again later.",
              );
            }
          },
        },
      ],
    );
  }

  // Function to get status text and color
  function getStatusInfo() {
    if (!initialTask)
      return { text: "Loading...", color: taskDetailsStyles.statusText };

    if (formState.completed) {
      return { text: "Completed", color: taskDetailsStyles.completedStatus };
    } else if (isOverdue(formState.dueDate)) {
      return { text: "Overdue", color: taskDetailsStyles.overdueStatus };
    } else {
      return { text: "Pending", color: taskDetailsStyles.pendingStatus };
    }
  }

  // Fetch task details on mount
  useEffect(() => {
    fetchTaskDetails();
  }, []);

  // Store updated task details when task changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formState && initialTask) {
        storeTaskDetails();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formState]);

  if (!initialTask) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={taskDetailsStyles.container}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 16, color: theme.textSecondary }}>
              Loading task details...
            </Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={taskDetailsStyles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={taskDetailsStyles.scrollView}
            contentContainerStyle={taskDetailsStyles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            {/* Task Title and Description */}
            <View style={taskDetailsStyles.taskContent}>
              {/* Title Input with an icon */}
              <View style={taskDetailsStyles.titleRow}>
                <Ionicons
                  name="text"
                  size={20}
                  color={theme.textTertiary}
                  style={taskDetailsStyles.titleIcon}
                />
                <TextInput
                  style={taskDetailsStyles.taskTitle}
                  value={formState.name}
                  onChangeText={handlers.setName}
                  placeholder="Enter task name..."
                  placeholderTextColor={taskDetailsStyles.placeholderText.color}
                  editable={true}
                  multiline={true}
                  textAlignVertical="top"
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

              <View style={taskDetailsStyles.descriptionRow}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color={theme.textTertiary}
                  style={taskDetailsStyles.descriptionIcon}
                />
                <TextInput
                  style={taskDetailsStyles.taskDescription}
                  value={formState.description}
                  onChangeText={handlers.setDescription}
                  placeholder="Add description..."
                  placeholderTextColor={taskDetailsStyles.placeholderText.color}
                  editable={true}
                  multiline={true}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Divider */}
            <View style={taskDetailsStyles.divider} />

            {/* Status Button - Moved underneath divider */}
            <View style={taskDetailsStyles.statusSection}>
              <TouchableOpacity
                style={taskDetailsStyles.statusButton}
                onPress={() => handlers.setCompletion(!formState.completed)}
                disabled={loading}
              >
                <View style={taskDetailsStyles.statusContent}>
                  <Ionicons
                    name={
                      formState.completed
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={20}
                    color={
                      formState.completed
                        ? theme.completed
                        : theme.textSecondary
                    }
                  />
                  <Text
                    style={[taskDetailsStyles.statusText, statusInfo.color]}
                  >
                    {statusInfo.text}
                  </Text>
                </View>
              </TouchableOpacity>
              {/* Tags Section */}
              <View style={{ marginTop: 12 }}>
                <Text style={taskDetailsStyles.fieldLabel}>Tags</Text>
                <InputField
                  value={formState.tagText}
                  onChangeText={handlers.handleTagInput}
                  onSubmitEditing={handlers.handleTagSubmit}
                  placeholder="Type a tag and press space"
                  returnKeyType="done"
                />
                {formState.tags.length > 0 && (
                  <View style={taskDetailsStyles.tagsContainer}>
                    {formState.tags.map((tag) => (
                      <View key={tag} style={taskDetailsStyles.tagChip}>
                        <Text
                          style={taskDetailsStyles.tagText}
                          onPress={() => handlers.removeTag(tag)}
                        >
                          {tag}
                        </Text>
                        <Ionicons
                          name="close"
                          size={14}
                          color={theme.textTertiary}
                          onPress={() => handlers.removeTag(tag)}
                          style={taskDetailsStyles.tagRemoveIcon}
                        />
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Calendar Section */}
            <View style={taskDetailsStyles.calendarSection}>
              <Text style={taskDetailsStyles.fieldLabel}>Select Due Date</Text>
              <View style={taskDetailsStyles.calendarContainer}>
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

            {/* Delete Button */}
            <View style={taskDetailsStyles.actionSection}>
              <AppButton
                title="Delete Task"
                onPress={handleDeleteTask}
                type="destructive"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
