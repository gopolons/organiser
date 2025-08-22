import { TaskData } from "@/model/task";
import { TaskPersistence } from "@/services/persistence";
import { useState } from "react";

export default function useToDoTabViewModel(persistence: TaskPersistence) {
  // Variables for keeping track of loading state
  const [loading, setLoading] = useState(false);

  // Function for fetching data from persistence & handling errors appropriately
  const fetchIncompleteTasksFromPersistence = async () => {
    setLoading(true);
    let data: TaskData[] = [];
    try {
      data = await persistence.getIncompleteTasks();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    } finally {
      setLoading(false);
    }

    return { success: true, data };
  };

  // Function for toggling task status in persistence & handling errors appropriately
  const toggleTaskStatus = async (taskId: string) => {
    setLoading(true);
    try {
      await persistence.toggleTaskStatus(taskId);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    } finally {
      setLoading(false);
    }

    return { success: true };
  };

  // Function for updating task order & handling errors appropriately
  const updateTasksOrder = async (taskIds: string[], date: number) => {
    setLoading(true);
    try {
      await persistence.updateOrder(taskIds, date);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    } finally {
      setLoading(false);
    }
    return { success: true };
  };

  return {
    fetchIncompleteTasksFromPersistence,
    toggleTaskStatus,
    updateTasksOrder,
    loading,
  };
}
