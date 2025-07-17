export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Cancelled";

export interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  status: TaskStatus;
}
