import { EmptyListView } from "@/components/emptyListView";
import { TaskCell } from "@/components/taskCell";
import { TaskData } from "@/model/task";
import { AsyncTaskPersistence } from "@/services/persistence";
import { createGlobalStyles } from "@/styles/globalStyles";
import { createTableComponentsStyles } from "@/styles/tableComponentsStyles";
import {
  groupUpcomingTasksByDate,
  toggleTaskCompletedOnView,
} from "@/utils/taskUtils";
import { useTheme } from "@/utils/theme";
import useToDoTabViewModel from "@/viewmodels/useToDoTabViewModel";
import { useFocusEffect, useRouter, useNavigation } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Text, View, FlatList } from "react-native";
import {
  NestableDraggableFlatList,
  NestableScrollContainer,
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import FilterButton from "@/components/filterButton";
import FilterSheet from "@/components/filterSheet";
import { getStartOfToday } from "@/utils/dateUtils";

// Tab where the user can see their upcoming to do tasks
export default function ToDoTab() {
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
  const {
    fetchIncompleteTasksFromPersistence,
    toggleTaskStatus,
    updateTasksOrder,
    loading,
  } = useToDoTabViewModel(
    // NOTE: Can be replaced with DummyTaskPersistence for debug purposes
    AsyncTaskPersistence,
  );

  // Function for fetching task data from view model
  async function fetchData() {
    const response = await fetchIncompleteTasksFromPersistence();
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

  // Function for updating task order in persistence - only used for today's date
  async function updateOrder(data: TaskData[]) {
    const taskIds = data.map((task) => {
      return task.id;
    });

    const response = await updateTasksOrder(taskIds, getStartOfToday());
    if (response.success) {
      fetchData();
    } else {
      Alert.alert(
        "Error updating task order!",
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

  // Prepare sections
  const sections = useMemo(
    () => groupUpcomingTasksByDate(filteredTasks),
    [filteredTasks],
  );

  // Handle drag end for today's tasks
  const onTodayDragEnd = useCallback(
    async ({ data }: { data: TaskData[] }) => {
      // Optimistically update local order
      const idToOrder = new Map<string, number>(
        data.map((task, index) => [task.id, index]),
      );
      setTasks((prev) =>
        prev.map((t) =>
          idToOrder.has(t.id) ? { ...t, order: idToOrder.get(t.id)! } : t,
        ),
      );

      await updateOrder(data);
    },
    [setTasks],
  );

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

        {!filteredTasks.length ? (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <EmptyListView
              title="No Upcoming Tasks!"
              description="You're all up to date"
              iconName="trophy"
            />
          </View>
        ) : (
          <NestableScrollContainer
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {sections.map((section) => (
              <View key={section.title}>
                <Text style={tableComponentsStyles.sectionHeader}>
                  {section.title}
                </Text>
                {section.title === "Today" && selectedTags.length === 0 ? (
                  <NestableDraggableFlatList
                    data={[...section.data].sort(
                      (a, b) => (a.order ?? 0) - (b.order ?? 0),
                    )}
                    keyExtractor={(item) => item.id}
                    onDragEnd={onTodayDragEnd}
                    activationDistance={8}
                    renderItem={({
                      item,
                      drag,
                    }: RenderItemParams<TaskData>) => (
                      <ScaleDecorator>
                        <TaskCell
                          task={item}
                          toggleCompletionStatus={() =>
                            updateTaskStatus(item.id)
                          }
                          showTaskDetails={() => showTaskDetails(item.id)}
                          onLongPress={drag}
                        />
                      </ScaleDecorator>
                    )}
                    scrollEnabled={false}
                  />
                ) : (
                  <FlatList
                    data={section.data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TaskCell
                        task={item}
                        toggleCompletionStatus={() => updateTaskStatus(item.id)}
                        showTaskDetails={() => showTaskDetails(item.id)}
                      />
                    )}
                    scrollEnabled={false}
                  />
                )}
              </View>
            ))}
          </NestableScrollContainer>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
