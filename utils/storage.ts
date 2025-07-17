import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../types/Task";

const TASKS_KEY = "@tasks";

export const loadTasks = async (): Promise<Task[]> => {
  const data = await AsyncStorage.getItem(TASKS_KEY);
  if (!data) return [];

  const tasksRaw = JSON.parse(data);

  const tasks = tasksRaw.map((task: Task) => ({
    ...task,
    date: new Date(task.date),
  }));

  return tasks;
};

export const saveTasks = async (tasks: Task[]) => {
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};
