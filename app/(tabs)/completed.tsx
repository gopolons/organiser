import { EmptyListView } from "@/components/emptyListView";
import FilterButton from "@/components/filterButton";
import FilterSheet from "@/components/filterSheet";
import { TaskCell } from "@/components/taskCell";
import { TaskData } from "@/model/task";
import { AsyncTaskPersistence } from "@/services/persistence";
import { createGlobalStyles } from "@/styles/globalStyles";
import { createTableComponentsStyles } from "@/styles/tableComponentsStyles";
import {
  groupCompletedTasksByDate,
  toggleTaskCompletedOnView,
} from "@/utils/taskUtils";
import { useTheme } from "@/utils/theme";
import useCompletedTabViewModel from "@/viewmodels/useCompletedTabViewModel";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, SectionList, Text, View } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// Tab where the user can see their completed tasks
export default function CompletedTab() {
  // Theme declaration
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const tableComponentsStyles = createTableComponentsStyles(theme);
  const insets = useSafeAreaInsets();

  // Navigation variable
  const navigation = useNavigation();
  // Router variable
  const router = useRouter();
  // State task variables which will be used for displaying and updating upcoming tasks
  const [tasks, setTasks] = useState<TaskData[] | []>([]);
  // State tags variable which will keep all of the present tags that the user can sort existing tags by
  const [tags, setTags] = useState<string[]>([]);
  // Filter UI state
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // View model variables for fetching and manipulating data
  const { fetchCompletedTasksFromPersistence, toggleTaskStatus, loading } =
    useCompletedTabViewModel(
      // NOTE: Can be replaced with DummyTaskPersistence for debug purposes
      AsyncTaskPersistence,
    );

  // Function for fetching task data from view model
  async function fetchData() {
    const response = await fetchCompletedTasksFromPersistence();
    if (response.success && response.data) {
      setTasks(response.data);
      // Collect tags from the fetched tasks
      collectTags(response.data);
    } else {
      Alert.alert(
        "Error fetching tasks from persistence!",
        response.error || "Something went wrong, please try again later.",
      );
    }
  }

  // Derived tasks based on selected tags
  const filteredTasks = useMemo(() => {
    if (selectedTags.length === 0) return tasks;
    return tasks.filter((task) =>
      task.tags.some((tag) => selectedTags.includes(tag)),
    );
  }, [tasks, selectedTags]);

  // Function for collecting tags from tasks when the view appears
  async function collectTags(todos: TaskData[]) {
    const tagSet = new Set<string>();
    todos.forEach((element) => {
      element.tags.forEach((tag) => {
        tagSet.add(tag);
      });
    });
    setTags(Array.from(tagSet));
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
        response.error || "Something went wrong, please try again later.",
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
    }, []),
  );

  // Update header filter button (with badge) when tasks or selected tags change
  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        tasks.length > 0 ? (
          <View style={{ marginRight: 8 }}>
            <FilterButton
              badgeCount={selectedTags.length}
              onPress={() => setFilterVisible(true)}
              accessibilityLabel="Filter tasks"
              accessibilityHint="Opens filter selection"
            />
          </View>
        ) : null,
    });
  }, [navigation, tasks, selectedTags]);

  // Ensure tags are kept in sync when task list changes (covers any changes beyond initial fetch)
  useEffect(() => {
    collectTags(tasks);
  }, [tasks]);

  // Function for selecting tags on filter sheet
  function toggleTagSelection(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={globalStyles.container}>
        <FilterSheet
          visible={isFilterVisible}
          tags={tags}
          selectedTags={selectedTags}
          insets={insets}
          onToggleTag={toggleTagSelection}
          onClear={() => setSelectedTags([])}
          onClose={() => setFilterVisible(false)}
        />
        <SectionList
          key={tasks.length === 0 ? "empty" : "populated"}
          sections={groupCompletedTasksByDate(filteredTasks)}
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
          scrollEnabled={!!filteredTasks.length}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
