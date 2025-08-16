export type TaskData = {
  id: string;
  name: string;
  description: string;
  dueDate: number;
  completed: boolean;
  tags: string[];
};

export type TaskSection = {
  title: string;
  data: TaskData[];
};
