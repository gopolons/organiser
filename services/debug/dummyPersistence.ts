import { TaskPersistence } from "../persistence";

// Dummy data for development purposes
const dataStore = [
  {
    id: "1",
    name: "Buy milk",
    description: "Get oat milk from store",
    dueDate: Date.now() - 86400000, // yesterday
    completed: true,
  },
  {
    id: "2",
    name: "Clean room",
    description: "Do it before mom visits",
    dueDate: Date.now(),
    completed: false,
  },
  {
    id: "3",
    name: "Workout",
    description: "Leg day 💪",
    dueDate: Date.now() + 86400000, // tomorrow
    completed: false,
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

  async toggleTaskStatus(id) {
    const index = dataStore.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Task not found");
    dataStore[index].completed = !dataStore[index].completed;
  },
  async addTask(task) {
    dataStore.push(task);
  },
  async getTaskById(id) {
    const index = dataStore.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Task not found");
    return dataStore[index];
  },
  async updateTask(task) {
    const index = dataStore.findIndex((t) => t.id === task.id);
    if (index === -1) throw new Error("Task not found");
    dataStore[index] = task;
  },
  async deleteTask(id) {
    const index = dataStore.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Task not found");
    dataStore.splice(index, 1);
  },
};
