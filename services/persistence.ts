import { TaskData } from "@/model/task";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WidgetService } from "./widgetSync";

// Inteface which persistence providers will have to implement
export interface TaskPersistence {
  getAllTasks(): Promise<TaskData[]>;
  getIncompleteTasks(): Promise<TaskData[]>;
  getCompletedTasks(): Promise<TaskData[]>;
  toggleTaskStatus(id: string): Promise<void>;
  addTask(task: TaskData): Promise<void>;
  getTaskById(id: string): Promise<TaskData>;
  updateTask(task: TaskData): Promise<void>;
  deleteTask(id: string): Promise<void>;
  updateOrder(taskIds: string[], date: number): Promise<void>;
}

const TASKS_KEY = "TASKS";

// A helper function for syncing with iOS User Defaults for widgets
export async function syncToWidget() {
  const tasks = await loadTasks();
  await WidgetService.syncTasksToWidget(tasks);
}

// A helper function for syncing local DB with data from iOS User Defaults
export async function syncFromWidget(): Promise<void> {
  try {
    // Get all available tasks
    const appTasks = await AsyncTaskPersistence.getAllTasks();
    const widgetTasks = await WidgetService.getTasksFromWidget();

    let hasChanges = false;

    // Cycle through each task & update it in local DB if status is different
    for (const widgetTask of widgetTasks) {
      const appTask = appTasks.find((t) => t.id === widgetTask.id);
      if (appTask && !appTask.completed && widgetTask.completed) {
        await AsyncTaskPersistence.toggleTaskStatus(widgetTask.id);
        hasChanges = true;
      }
    }

    // If we made changes, sync the updated state back to widget
    // This ensures both stores are consistent
    if (hasChanges) {
      await syncToWidget();
    }
  } catch (error) {
    // FIX ME: DEBUG
    console.error("Failed to sync from widget:", error);
  }
}

async function loadTasks(): Promise<TaskData[]> {
  const json = await AsyncStorage.getItem(TASKS_KEY);
  // Check that the json is not empty
  if (!json) {
    return [];
  }

  const rawTasks = JSON.parse(json);

  const tasks = rawTasks.map((task: any) => ({
    id: task.id,
    name: task.name,
    description: task.description,
    dueDate: task.dueDate,
    completed: task.completed,
    tags: task.tags || [],
    order: task.order ?? 0,
  }));

  return tasks;
}

async function saveTasks(tasks: TaskData[]): Promise<void> {
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export const AsyncTaskPersistence: TaskPersistence = {
  async getAllTasks() {
    return await loadTasks();
  },

  async getIncompleteTasks() {
    const tasks = await loadTasks();
    return tasks.filter((task) => !task.completed);
  },

  async getCompletedTasks() {
    const tasks = await loadTasks();
    return tasks.filter((task) => task.completed);
  },

  async toggleTaskStatus(id: string) {
    const tasks = await loadTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Task not found");
    tasks[index].completed = !tasks[index].completed;
    await saveTasks(tasks);
    await syncToWidget();
  },

  async addTask(task: TaskData) {
    const tasks = await loadTasks();
    tasks.push(task);
    await saveTasks(tasks);
    await syncToWidget();
  },

  async getTaskById(id: string) {
    const tasks = await loadTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new Error("Task not found");
    return task;
  },

  async updateTask(task: TaskData) {
    const tasks = await loadTasks();
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index === -1) throw new Error("Task not found");
    tasks[index] = task;
    await saveTasks(tasks);
    await syncToWidget();
  },

  async deleteTask(id: string) {
    const tasks = await loadTasks();
    const updatedTasks = tasks.filter((task) => task.id !== id);
    await saveTasks(updatedTasks);
    await syncToWidget();
  },
  async updateOrder(taskIds: string[], date: number) {
    const tasks = await loadTasks();

    const targetDateTasks = tasks.filter((task) => task.dueDate === date);
    const otherTasks = tasks.filter((task) => task.dueDate !== date);

    const taskMap = new Map(targetDateTasks.map((task) => [task.id, task]));

    const reorderedTasks = taskIds.map((id, index) => {
      const task = taskMap.get(id);
      if (!task) throw new Error(`Task with id ${id} not found`);
      return { ...task, order: index + 1 };
    });

    const allTasks = [...otherTasks, ...reorderedTasks];
    await saveTasks(allTasks);
    await syncToWidget();
  },
};
