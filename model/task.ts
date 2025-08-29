export interface TaskData {
  id: string;
  name: string;
  description: string;
  dueDate: number;
  completed: boolean;
  tags: string[];
  order: number;
}

export interface TaskSection {
  title: string;
  data: TaskData[];
}
