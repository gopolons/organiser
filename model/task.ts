export type TaskData = {
  id: string;
  name: string;
  description: string;
  dueDate: number;
  completed: boolean;
};

export type TaskSection = {
  title: string;
  data: TaskData[];
};
