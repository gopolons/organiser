import { AppButton } from "@/components/appButton";
import { TaskData } from "@/model/task";
import { AsyncTaskPersistence } from "@/services/persistence";
import { createTaskDetailsStyles } from "@/styles/taskDetailsStyles";
import { convertToISO8601, isOverdue } from "@/utils/dateUtils";
import { useTheme } from "@/utils/theme";
import useTaskDetailsViewModel from "@/viewmodels/useTaskDetailsViewModel";
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
  const [task, setTask] = useState<TaskData | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<number>(Date.now());

  // View model variables for fetching and manipulating data
  const {
    fetchTaskById,
    toggleTaskStatus,
    updateTaskDetails,
    deleteTask,
    loading,
  } = useTaskDetailsViewModel(
    // NOTE: Can be replaced with DummyTaskPersistence for debug purposes
    AsyncTaskPersistence
  );

  // Function for fetching task details from persistence
  async function fetchTaskDetails() {
    const response = await fetchTaskById(taskID);
    if (response.success && response.data) {
      setTask(response.data);
      setName(response.data.name);
      setDescription(response.data.description);
      setDueDate(response.data.dueDate);
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
        ]
      );
    }
  }

  // Function for storing updated task details in persistence
  async function storeTaskDetails() {
    // Check if task exists
    if (!task) return;
    // Update task details in state
    task.name = name;
    task.description = description;
    task.dueDate = dueDate;
    // Update task details in persistence
    const response = await updateTaskDetails(task);
    if (!response.success) {
      Alert.alert(
        "Error Updating Task Details!",
        response.error || "Something went wrong. Please try again later."
      );
    }
  }

  // Function to toggle task completion status
  async function handleToggleStatus() {
    if (!task) return;
    const response = await toggleTaskStatus(task.id);
    if (response.success) {
      // Fetch the updated task to get the new status
      const updatedTaskResponse = await fetchTaskById(task.id);
      if (updatedTaskResponse.success && updatedTaskResponse.data) {
        setTask(updatedTaskResponse.data);
      }
    } else {
      Alert.alert(
        "Error Updating Task Status!",
        response.error || "Something went wrong. Please try again later."
      );
    }
  }

  // Function to delete task
  async function handleDeleteTask() {
    if (!task) return;

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
            const response = await deleteTask(task.id);
            if (response.success) {
              router.back();
            } else {
              Alert.alert(
                "Error Deleting Task!",
                response.error ||
                  "Something went wrong. Please try again later."
              );
            }
          },
        },
      ]
    );
  }

  // Function to get status text and color
  function getStatusInfo() {
    if (!task)
      return { text: "Loading...", color: taskDetailsStyles.statusText };

    if (task.completed) {
      return { text: "Completed", color: taskDetailsStyles.completedStatus };
    } else if (isOverdue(task.dueDate)) {
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
    if (task) {
      storeTaskDetails();
    }
  }, [name, description, dueDate]);

  if (!task) {
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
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter task name..."
                  placeholderTextColor={taskDetailsStyles.placeholderText.color}
                  editable={true}
                  multiline={true}
                  textAlignVertical="top"
                />
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
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Add description..."
                  placeholderTextColor={taskDetailsStyles.placeholderText.color}
                  editable={true}
                  multiline={true}
                  textAlignVertical="top"
                />
              </View>
              {/* Overdue Label */}
              {!task.completed && isOverdue(task.dueDate) && (
                <View style={taskDetailsStyles.overdueLabel}>
                  <Ionicons name="warning" size={16} color={theme.overdue} />
                  <Text style={taskDetailsStyles.overdueText}>Overdue</Text>
                </View>
              )}
            </View>

            {/* Divider */}
            <View style={taskDetailsStyles.divider} />

            {/* Status Button - Moved underneath divider */}
            <View style={taskDetailsStyles.statusSection}>
              <TouchableOpacity
                style={taskDetailsStyles.statusButton}
                onPress={handleToggleStatus}
                disabled={loading}
              >
                <View style={taskDetailsStyles.statusContent}>
                  <Ionicons
                    name={
                      task.completed ? "checkmark-circle" : "ellipse-outline"
                    }
                    size={20}
                    color={
                      task.completed ? theme.completed : theme.textSecondary
                    }
                  />
                  <Text
                    style={[taskDetailsStyles.statusText, statusInfo.color]}
                  >
                    {statusInfo.text}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Calendar Section */}
            <View style={taskDetailsStyles.calendarSection}>
              <Text style={taskDetailsStyles.fieldLabel}>Select Due Date</Text>
              <View style={taskDetailsStyles.calendarContainer}>
                <Calendar
                  firstDay={1}
                  onDayPress={(day) => {
                    setDueDate(day.timestamp);
                  }}
                  markedDates={{
                    [convertToISO8601(dueDate)]: {
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
