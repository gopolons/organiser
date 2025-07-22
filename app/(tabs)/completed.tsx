import { EmptyListView } from "@/components/emptyListView";
import { TaskCell } from "@/components/taskCell";
import { AsyncTaskPersistence } from "@/services/persistence";
import { globalStyles } from "@/styles/globalStyles";
import { tableComponentsStyles } from "@/styles/tableComponentsStyles";
import { TaskData } from "@/types/task";
import {
  groupCompletedTasksByDate,
  toggleTaskCompletedOnView,
} from "@/utils/taskUtils";
import useCompletedTabViewModel from "@/viewmodels/useCompletedTabViewModel";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, SectionList, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Tab where the user can see their completed tasks
export default function CompletedTab() {
  // Router variable
  const router = useRouter();
  // State task variables which will be used for displaying and updating upcoming tasks
  const [tasks, setTasks] = useState<TaskData[] | []>([]);
  // View model variables for fetching and manipulating data
  const { fetchCompletedTasksFromPersistence, toggleTaskStatus, loading } =
    useCompletedTabViewModel(
      // NOTE: Can be replaced with DummyTaskPersistence for debug purposes
      AsyncTaskPersistence
    );

  // Function for fetching task data from view model
  async function fetchData() {
    const response = await fetchCompletedTasksFromPersistence();
    if (response.success && response.data) {
      setTasks(response.data);
    } else {
      Alert.alert(
        "Error fetching tasks from persistence!",
        response.error || "Something went wrong, please try again later."
      );
    }
  }

  // Function for updating task status in view model
  async function updateTaskStatus(id: string) {
    const response = await toggleTaskStatus(id);
    if (response.success) {
      // Update task on view - do not fetch fresh data immediately
      const updatedTasks = toggleTaskCompletedOnView(tasks, id);
      setTasks(updatedTasks);
    } else {
      Alert.alert(
        "Error updating task status!",
        response.error || "Something went wrong, please try again later."
      );
    }
  }

  // Function for showing task details
  async function showTaskDetails(id: string) {
    router.push({
      pathname: "/task-details",
      params: { taskID: id },
    });
  }

  // Fetch data on appear
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={globalStyles.container}>
        <SectionList
          key={tasks.length === 0 ? "empty" : "populated"}
          sections={groupCompletedTasksByDate(tasks)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCell
              task={item}
              toggleCompletionStatus={() => updateTaskStatus(item.id)}
              showTaskDetails={() => showTaskDetails(item.id)}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={tableComponentsStyles.sectionHeader}>{title}</Text>
          )}
          contentContainerStyle={
            !tasks.length
              ? { flex: 1, justifyContent: "center" }
              : { paddingBottom: 80 }
          }
          ListEmptyComponent={() => (
            <EmptyListView
              title="No Completed Tasks!"
              description="Your completed tasks will appear here"
              iconName="tasks"
            />
          )}
          scrollEnabled={!!tasks.length}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
