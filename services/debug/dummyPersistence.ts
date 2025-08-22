import { TaskPersistence } from "../persistence";
import { TaskData } from "@/model/task";

// Dummy data for development purposes
const dataStore: TaskData[] = [
  {
    id: "1",
    name: "Buy milk",
    description: "Get oat milk from store",
    dueDate: Date.now() - 86400000, // yesterday
    completed: true,
    tags: [],
    order: 0,
  },
  {
    id: "2",
    name: "Clean room",
    description: "Do it before mom visits",
    dueDate: Date.now(),
    completed: false,
    tags: [],
    order: 0,
  },
  {
    id: "3",
    name: "Workout",
    description: "Leg day 💪",
    dueDate: Date.now() + 86400000, // tomorrow
    completed: false,
    tags: [],
    order: 0,
  },
];

// Dummy implementation for the task persistence interface (for development purposes)
export const DummyTaskPersistence: TaskPersistence = {
  async getAllTasks() {
    return [...dataStore];
  },

  async getIncompleteTasks() {
    return dataStore.filter((task) => !task.completed);
  },

  async getCompletedTasks() {
    return dataStore.filter((task) => task.completed);
  },

  async toggleTaskStatus(id: string) {
    const index = dataStore.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Task not found");
    dataStore[index].completed = !dataStore[index].completed;
  },
  async addTask(task: TaskData) {
    dataStore.push(task);
  },
  async getTaskById(id: string) {
    const index = dataStore.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Task not found");
    return dataStore[index];
  },
  async updateTask(task: TaskData) {
    const index = dataStore.findIndex((t) => t.id === task.id);
    if (index === -1) throw new Error("Task not found");
    dataStore[index] = task;
  },
  async deleteTask(id: string) {
    const index = dataStore.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Task not found");
    dataStore.splice(index, 1);
  },
  async updateOrder(taskIds: string[], date: number) {
    const target = dataStore.filter((t) => t.dueDate === date);
    const others = dataStore.filter((t) => t.dueDate !== date);
    const byId = new Map(target.map((t) => [t.id, t] as const));
    const reordered = taskIds.map((id, index) => {
      const task = byId.get(id);
      if (!task) throw new Error(`Task with id ${id} not found`);
      return { ...task, order: index + 1 } as TaskData;
    });
    // mutate in-place for simplicity
    dataStore.length = 0;
    dataStore.push(...others, ...reordered);
  },
};
