import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import TaskItem from "../components/TaskItem";
import { Task } from "../types/Task";
import { loadTasks, saveTasks } from "../utils/storage";

import GlobalStyles from "../GlobalStyles";

export default function TaskListScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [sortByDateDesc, setSortByDateDesc] = useState(true);
  const [statusPriority, setStatusPriority] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      loadTasks()
        .then(setTasks)
        .finally(() => setIsLoading(false));
    }, [])
  );

  const deleteTask = async (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    await saveTasks(updated);
  };

  function getSortedTasks(): Task[] {
    let sorted = [...tasks];

    if (statusPriority) {
      const normalizedPriority = statusPriority
        .toLowerCase()
        .replace(/\s/g, "");

      sorted.sort((a, b) => {
        const statusA = a.status.toLowerCase().replace(/\s/g, "");
        const statusB = b.status.toLowerCase().replace(/\s/g, "");

        if (statusA === normalizedPriority && statusB !== normalizedPriority)
          return -1;
        if (statusB === normalizedPriority && statusA !== normalizedPriority)
          return 1;
        return 0;
      });
    }

    if (statusPriority) return sorted;

    sorted.sort((a, b) => {
      console.log(a, b);
      const dateA = a.date.getTime();
      const dateB = b.date.getTime();
      return sortByDateDesc ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  }

  return (
    <SafeAreaView style={GlobalStyles.SafeAreaContainer}>
      <FlatList
        contentContainerStyle={[
          GlobalStyles.ContentWrapper,
          styles.flatListContent,
        ]}
        data={getSortedTasks()}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.heading}>My Tasks</Text>
              <View style={styles.button}>
                <Button title="Add Task" onPress={() => router.push("/add")} />
              </View>
            </View>

            <View style={styles.sortingComponent}>
              <View style={styles.button}>
                <Button
                  title={`Sort by Date: ${
                    sortByDateDesc ? "New → Old" : "Old → New"
                  }`}
                  onPress={() => {
                    setSortByDateDesc((prev) => !prev);
                    setStatusPriority(null);
                  }}
                  color={!statusPriority ? "#2196f3" : "#aaa"}
                />
              </View>

              <Text style={styles.textLabel}>Sort by Status:</Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                {["pending", "inProgress", "completed", "cancelled"].map(
                  (status) => (
                    <View style={styles.button} key={status}>
                      <Button
                        title={status}
                        onPress={() => {
                          setStatusPriority((prev) =>
                            prev === status ? null : status
                          );
                          setSortByDateDesc(true);
                        }}
                        color={statusPriority === status ? "#2196f3" : "#aaa"}
                      />
                    </View>
                  )
                )}
              </View>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onDelete={deleteTask}
            onPress={() => router.push(`/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator
              size="large"
              color="#2196f3"
              style={{ marginTop: 32 }}
            />
          ) : (
            <Text style={styles.emptyText}>No tasks added yet.</Text>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  flatListContent: {
    gap: 12,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    fontSize: 16,
    color: "#999",
  },
  textLabel: {
    fontWeight: "bold",
    paddingTop: 8,
  },
  button: {
    borderRadius: 8,
    overflow: "hidden",
  },
  sortingComponent: {
    alignItems: "center",
    marginBottom: 12,
  },
});
