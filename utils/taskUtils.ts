import { TaskData, TaskSection } from "@/model/task";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import isoWeek from "dayjs/plugin/isoWeek";

// Extensions for filtering completed tasks
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isoWeek);
const isThisWeek = (date: dayjs.Dayjs) => {
  const startOfWeek = dayjs().startOf("isoWeek"); // Monday as per ISO 8601
  const endOfWeek = dayjs().endOf("isoWeek");
  return date.isAfter(startOfWeek) && date.isBefore(endOfWeek);
};

// Function for sorting tasks into sections that will be displayed to the user
export function groupUpcomingTasksByDate(tasks: TaskData[]): TaskSection[] {
  // Declare timestamp variables
  const now = dayjs();
  const todayStart = now.startOf("day");
  const tomorrowStart = todayStart.add(1, "day");
  const dayAfterTomorrowStart = tomorrowStart.add(1, "day");

  // Declare sections
  const overdue: TaskData[] = [];
  const today: TaskData[] = [];
  const tomorrow: TaskData[] = [];
  const comingUp: TaskData[] = [];

  // Cycle through all tasks to sort them
  tasks.forEach((task) => {
    const taskTime = dayjs(task.dueDate);

    if (taskTime.isBefore(todayStart)) {
      overdue.push(task);
    } else if (taskTime.isBefore(tomorrowStart)) {
      today.push(task);
    } else if (taskTime.isBefore(dayAfterTomorrowStart)) {
      tomorrow.push(task);
    } else {
      comingUp.push(task);
    }
  });

  // Declare the sections return variable
  const sections: TaskSection[] = [];

  // Add appropriate sections
  if (overdue.length) sections.push({ title: "Overdue", data: overdue });
  // Ensure today's tasks are consistently ordered by their 'order' field
  if (today.length)
    sections.push({
      title: "Today",
      data: [...today].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    });
  if (tomorrow.length) sections.push({ title: "Tomorrow", data: tomorrow });
  if (comingUp.length) sections.push({ title: "Coming Up", data: comingUp });

  return sections;
}

// Function for grouping completed tasks into sections that will be displayed to the user
export function groupCompletedTasksByDate(tasks: TaskData[]): TaskSection[] {
  // Declare sections
  const today: TaskData[] = [];
  const yesterday: TaskData[] = [];
  const thisWeek: TaskData[] = [];
  const older: TaskData[] = [];

  // Cycle through each task and add it to the appropriate section
  tasks.forEach((task) => {
    const date = dayjs(task.dueDate);

    if (date.isToday()) {
      today.push(task);
    } else if (date.isYesterday()) {
      yesterday.push(task);
    } else if (isThisWeek(date)) {
      thisWeek.push(task);
    } else {
      older.push(task);
    }
  });

  // Declare the sections return variable
  const sections: TaskSection[] = [];

  // Add appropriate sections
  if (today.length) sections.push({ title: "Today", data: today });
  if (yesterday.length) sections.push({ title: "Yesterday", data: yesterday });
  if (thisWeek.length) sections.push({ title: "This Week", data: thisWeek });
  if (older.length) sections.push({ title: "Older", data: older });

  return sections;
}

// Function which will update task in place (to be used in views)
export function toggleTaskCompletedOnView(
  tasks: TaskData[],
  id: string,
): TaskData[] {
  return tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task,
  );
}
