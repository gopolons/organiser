import { TaskData } from "@/model/task";
import { TaskPersistence } from "@/services/persistence";
import { useState } from "react";

export interface TaskDetailsViewModel {
  fetchTaskById: (
    id: string,
  ) => Promise<{ success: boolean; data?: TaskData; error?: string }>;
  updateTaskDetails: (
    data: TaskData,
  ) => Promise<{ success: boolean; error?: string }>;
  deleteTask: (id: string) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

export default function useTaskDetailsViewModel(
  persistence: TaskPersistence,
): TaskDetailsViewModel {
  // Loading state passed into the view
  const [loading, setLoading] = useState(false);

  // Function for fetching task by ID from persistence & handling errors appropriately
  const fetchTaskById = async (id: string) => {
    setLoading(true);
    let data: TaskData;
    try {
      data = await persistence.getTaskById(id);
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

  // Function for updating task details in persistence
  const updateTaskDetails = async (data: TaskData) => {
    setLoading(true);
    try {
      await persistence.updateTask(data);
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

  // Function for deleting task from persistence
  const deleteTask = async (id: string) => {
    setLoading(true);
    try {
      await persistence.deleteTask(id);
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
    fetchTaskById,
    updateTaskDetails,
    deleteTask,
    loading,
  };
}
