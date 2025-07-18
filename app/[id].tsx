import formatDateTime from "@/utils/formatDate";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GlobalStyles from "../GlobalStyles";
import { Task } from "../types/Task";
import { loadTasks, saveTasks } from "../utils/storage";

export default function TaskDetailsScreen() {
  // Get the task ID from route parameters
  const { id } = useLocalSearchParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);

  // Load the task by ID when the screen mounts
  useEffect(() => {
    loadTasks().then((tasks) => {
      const found = tasks.find((t) => t.id === id);
      if (found) setTask(found);
    });
  }, [id]);

  // Update task status and go back to the list
  const updateStatus = async (status: Task["status"]) => {
    const tasks = await loadTasks();
    const updated = tasks.map((t) => (t.id === id ? { ...t, status } : t));
    await saveTasks(updated);
    router.back();
  };

  // Delete task and return to the list
  const handleDelete = async () => {
    const tasks = await loadTasks();
    const updated = tasks.filter((t) => t.id !== id);
    await saveTasks(updated);
    router.back();
  };

  // If task not found yet, return null
  if (!task) return null;

  return (
    <SafeAreaView style={GlobalStyles.SafeAreaContainer}>
      <ScrollView>
        <View style={GlobalStyles.ContentWrapper}>
          {/* Task details card */}
          <View style={styles.card}>
            <Text style={styles.title}>{task.title}</Text>

            <View style={styles.row}>
              <Text style={styles.emoji}>📅</Text>
              <Text style={styles.text}>{formatDateTime(task.date)}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.emoji}>📍</Text>
              <Text style={styles.text}>{task.location}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.emoji}>📝</Text>
              <Text style={styles.text}>{task.description}</Text>
            </View>

            <Text style={styles.status}>Status: {task.status}</Text>
          </View>

          {/* Status update buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => updateStatus("In Progress")}
            >
              <Text style={styles.buttonText}>In Progress</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => updateStatus("Completed")}
            >
              <Text style={styles.buttonText}>Completed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => updateStatus("Cancelled")}
            >
              <Text style={styles.buttonText}>Cancelled</Text>
            </TouchableOpacity>

            {/* Delete button */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  emoji: {
    width: 24,
    fontSize: 16,
    textAlign: "center",
    marginRight: 4,
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
    color: "#555",
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 10,
  },
  buttonGroup: {
    gap: 12,
    marginTop: 10,
    alignItems: "center",
  },
  button: {
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
  },
  deleteButton: {
    borderWidth: 2,
    borderColor: "#FF3B30",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
