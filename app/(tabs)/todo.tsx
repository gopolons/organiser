import { EmptyListView } from "@/components/emptyListView";
import { TaskCell } from "@/components/taskCell";
import { TaskData } from "@/model/task";
import { AsyncTaskPersistence } from "@/services/persistence";
import { globalStyles } from "@/styles/globalStyles";
import { tableComponentsStyles } from "@/styles/tableComponentsStyles";
import {
  groupUpcomingTasksByDate,
  toggleTaskCompletedOnView,
} from "@/utils/taskUtils";
import useToDoTabViewModel from "@/viewmodels/useToDoTabViewModel";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, SectionList, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Tab where the user can see their upcoming to do tasks
export default function ToDoTab() {
  // Router variable
  const router = useRouter();
  // State task variables which will be used for displaying and updating upcoming tasks
  const [tasks, setTasks] = useState<TaskData[] | []>([]);
  // View model variables for fetching and manipulating data
  const { fetchIncompleteTasksFromPersistence, toggleTaskStatus, loading } =
    useToDoTabViewModel(
      // NOTE: Can be replaced with DummyTaskPersistence for debug purposes
      AsyncTaskPersistence
    );

  // Function for fetching task data from view model
  async function fetchData() {
    const response = await fetchIncompleteTasksFromPersistence();
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
          sections={groupUpcomingTasksByDate(tasks)}
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
              title="No Upcoming Tasks!"
              description="You're all up to date"
              iconName="trophy"
            />
          )}
          scrollEnabled={!!tasks.length}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
