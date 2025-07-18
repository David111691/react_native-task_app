import formatDateTime from "@/utils/formatDate";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Task } from "../types/Task";

type Props = {
  task: Task;
  onDelete: (id: string) => void;
  onPress: () => void;
};

export default function TaskItem({ task, onDelete, onPress }: Props) {
  // Returns a color based on the task status
  function getStatusColor(status: string): string {
    const normalizedStatus = status.replace(/\s+/g, "").toLowerCase();

    switch (normalizedStatus) {
      case "pending":
        return "#FFA500";
      case "completed":
        return "#00C853";
      case "inprogress":
        return "#2979FF";
      case "cancelled":
        return "#D50000";
      default:
        return "#000";
    }
  }

  return (
    // Main container for the task item
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View>
        {/* Task title*/}
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {task.title}
        </Text>

        {/* Formatted date */}
        <Text>{formatDateTime(task.date)}</Text>

        {/* status label */}
        <Text style={{ color: getStatusColor(task.status), fontWeight: "500" }}>
          Status: {task.status}
        </Text>
      </View>

      {/* Delete button*/}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(task.id)}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// Styles for the task item
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    maxWidth: 400,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    height: 28,
    width: 28,
    paddingLeft: 1,
    paddingBottom: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
