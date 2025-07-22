import { RecordingButton } from "@/components/appButton";
import { TaskCell } from "@/components/taskCell";
import { OpenAIService } from "@/services/openai";
import { AsyncTaskPersistence } from "@/services/persistence";
import { RecordingServiceImplementation } from "@/services/recording";
import { assistantTabStyles } from "@/styles/assistantTabStyles";
import { TaskData } from "@/types/task";
import useAssistantTabViewModel from "@/viewmodels/useAssistantTabViewModel";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

export default function AssistantTab() {
  // Declare view state variables
  const [tasks, setTasks] = useState<TaskData[]>([]);
  // Declare variables from view model used to determine the state of the view & process data
  const {
    startRecording,
    processRecording,
    cancelRecording,
    saveTaskInPersistence,
    recorderState,
    loading,
  } = useAssistantTabViewModel(
    RecordingServiceImplementation(),
    OpenAIService,
    // NOTE: Can be replaced with DummyTaskPersistence for debug purposes
    AsyncTaskPersistence
  );

  // Function to stop recording and process data
  async function stopRecording() {
    const result = await processRecording();
    if (result.success && result.data) {
      setTasks(result.data);
    } else {
      Alert.alert(
        "Error Processing Recording!",
        result.error ?? "Something went wrong. Please try again later."
      );
    }
  }

  // Function to save the provided task into persistence
  async function saveTask(task: TaskData) {
    const filteredTasks = tasks.filter((t) => t.id !== task.id);
    setTasks(filteredTasks);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const result = await saveTaskInPersistence(task);
    if (!result.success) {
      Alert.alert(
        "Error Saving Task!",
        result.error ?? "Something went wrong. Please try again later."
      );
    }
  }

  // Function to delete a task
  function deleteTask(taskId: string) {
    const filteredTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(filteredTasks);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  // Render swipe actions
  const renderSwipeActions = (task: TaskData) => {
    const renderRightActions = () => (
      <View style={assistantTabStyles.swipeActionRight}>
        <Ionicons name="trash-outline" size={24} color="white" />
        <Text style={assistantTabStyles.swipeActionText}>Delete</Text>
      </View>
    );

    const renderLeftActions = () => (
      <View style={assistantTabStyles.swipeActionLeft}>
        <Ionicons name="checkmark-outline" size={24} color="white" />
        <Text style={assistantTabStyles.swipeActionText}>Save</Text>
      </View>
    );

    return (
      <Swipeable
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        onSwipeableRightOpen={() => deleteTask(task.id)}
        onSwipeableLeftOpen={() => saveTask(task)}
        rightThreshold={40}
        leftThreshold={40}
        friction={2}
        overshootRight={false}
        overshootLeft={false}
      >
        <TaskCell
          task={task}
          toggleCompletionStatus={() => {
            // Disabled - no interaction allowed
          }}
          showTaskDetails={() => {
            // Disabled - no interaction allowed
          }}
        />
      </Swipeable>
    );
  };

  // Swipe instructions component
  const SwipeInstructions = () => (
    <View style={assistantTabStyles.swipeInstructionsContainer}>
      <View style={assistantTabStyles.swipeInstructionsRow}>
        <View style={assistantTabStyles.swipeInstructionLeft}>
          <Ionicons
            name="arrow-back"
            size={16}
            color="#EF4444"
            style={assistantTabStyles.swipeInstructionIcon}
          />
          <Text style={assistantTabStyles.swipeInstructionTextRight}>
            Swipe left to delete
          </Text>
        </View>
        <View style={assistantTabStyles.swipeInstructionRight}>
          <Text style={assistantTabStyles.swipeInstructionTextLeft}>
            Swipe right to save
          </Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color="#10B981"
            style={assistantTabStyles.swipeInstructionIcon}
          />
        </View>
      </View>
      <Text style={assistantTabStyles.swipeInstructionNote}>
        Tasks are read-only in this view. Use swipe gestures to manage them.
      </Text>
    </View>
  );

  // Loading overlay component
  const LoadingOverlay = () => (
    <View style={assistantTabStyles.loadingOverlay}>
      <View style={assistantTabStyles.loadingModal}>
        <View style={assistantTabStyles.loadingSpinnerContainer}>
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size={24} color="#3B82F6" />
          </View>
        </View>
        <Text style={assistantTabStyles.loadingTitle}>
          Processing Recording...
        </Text>
        <Text style={assistantTabStyles.loadingSubtitle}>
          Converting your voice to tasks
        </Text>
      </View>
    </View>
  );

  return (
    <View style={assistantTabStyles.container}>
      {/* Main content area */}
      {tasks.length ? (
        <View style={assistantTabStyles.taskListContainer}>
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderSwipeActions(item)}
            contentContainerStyle={assistantTabStyles.flatList}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View style={assistantTabStyles.itemSeparator} />
            )}
          />
          <SwipeInstructions />
        </View>
      ) : (
        <View style={assistantTabStyles.emptyStateContainer}>
          <Ionicons
            name="mic-outline"
            size={64}
            color="#9CA3AF"
            style={assistantTabStyles.emptyStateIcon}
          />
          <Text style={assistantTabStyles.emptyStateText}>
            No tasks to display. Start recording to generate tasks!
          </Text>
          <Text style={assistantTabStyles.emptyStateSubtext}>
            Swipe left to save • Swipe right to delete
          </Text>
        </View>
      )}

      {/* Recording button at the bottom */}
      <View style={assistantTabStyles.recordingSection}>
        <RecordingButton
          isRecording={recorderState.isRecording}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onCancelRecording={cancelRecording}
          disabled={loading}
        />
      </View>

      {loading && <LoadingOverlay />}
    </View>
  );
}
