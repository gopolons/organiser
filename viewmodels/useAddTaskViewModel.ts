import { TaskData } from "@/model/task";
import { TaskPersistence } from "@/services/persistence";
import { randomUUID } from "expo-crypto";
import { useState } from "react";
import "react-native-get-random-values";

export default function useAddTaskViewModel(persistence: TaskPersistence) {
  // Variables for keeping track of loading state
  const [loading, setLoading] = useState(false);

  // Function for fetching data from persistence & handling errors appropriately
  const addNewTaskToPersistence = async (
    name: string,
    description: string,
    dueDate: number
  ) => {
    setLoading(true);
    const task: TaskData = {
      id: randomUUID(),
      name: name,
      description: description,
      dueDate: dueDate,
      completed: false,
    };
    try {
      await persistence.addTask(task);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    } finally {
      setLoading(false);
    }

    return { success: true, data: task.id };
  };

  return { addNewTaskToPersistence, loading };
}
