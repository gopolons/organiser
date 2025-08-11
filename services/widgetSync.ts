import { TaskData } from "@/model/task";
import { isSimulator } from "@/utils/deviceUtils";
import { NativeModules } from "react-native";

const { TaskSync } = NativeModules;

// Service for syncing tasks between widgets and User Defaults via native module
export class WidgetService {
  // Syncs provided tasks with User Defaults
  static async syncTasksToWidget(tasks: TaskData[]) {
    // Check if the device is simulator
    if (await isSimulator()) {
      return;
    }

    try {
      const widgetTasks = tasks.map((task) => ({
        id: task.id,
        name: task.name,
        description: task.description,
        dueDate: task.dueDate,
        completed: task.completed,
        tags: task.tags,
      }));

      const tasksJson = JSON.stringify(widgetTasks);
      await TaskSync.syncTasksToWidget(tasksJson);
    } catch (error) {
      // FIX ME: DEBUG
      console.log(`Failed to sync tasks to widget: ${error}`);
    }
  }

  // Fetches tasks from user defaults
  static async getTasksFromWidget(): Promise<TaskData[]> {
    // Check if the device is simulator
    if (await isSimulator()) {
      return [];
    }

    return new Promise((resolve, reject) => {
      TaskSync.getTasksFromWidget((error: any, result: string) => {
        if (error) {
          // FIX ME: DEBUG
          console.error("Failed to get tasks from widget:", error);
          reject(error);
          return;
        }

        try {
          const widgetTasks = JSON.parse(result);
          // Convert back to TaskData format
          const tasks: TaskData[] = widgetTasks.map((task: any) => ({
            id: task.id,
            name: task.name,
            description: task.description,
            completed: task.completed,
            dueDate: task.dueDate * 1000,
            tags: task.tags || [],
          }));

          resolve(tasks);
        } catch (parseError) {
          // FIX ME: DEBUG
          console.error("Failed to parse widget tasks:", parseError);
          reject(parseError);
        }
      });
    });
  }
}
