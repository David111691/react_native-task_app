import { router } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import formatDateTime from "@/utils/formatDate";
import uuid from "react-native-uuid";
import GlobalStyles from "../GlobalStyles";
import { Task } from "../types/Task";
import { loadTasks, saveTasks } from "../utils/storage";

import { Provider as PaperProvider, Snackbar } from "react-native-paper";
import {
  DatePickerModal,
  en as enLocale,
  registerTranslation,
  TimePickerModal,
} from "react-native-paper-dates";

export default function AddTaskScreen() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [tempDate, setTempDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  registerTranslation("en", enLocale);

  const handleSave = async () => {
    if (isSaving) return;

    if (!title || !desc || !date || !location) {
      setSnackbarMessage("Please fill out all fields");
      setSnackbarVisible(true);
      return;
    }

    const newTask: Task = {
      id: uuid.v4(),
      title,
      description: desc,
      date: date,
      location,
      status: "Pending",
    };

    try {
      setIsSaving(true);
      setSnackbarMessage("saving");
      setSnackbarVisible(true);
      const current = await loadTasks();

      const updated = [...current, newTask];
      await saveTasks(updated);
      router.back();
    } catch (err) {
      setSnackbarMessage("Failed to save task.");
      setSnackbarVisible(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView style={GlobalStyles.SafeAreaContainer}>
        <ScrollView>
          <View style={GlobalStyles.ContentWrapper}>
            <Text style={styles.heading}>Add New Task</Text>

            <TextInput
              placeholder="Title"
              placeholderTextColor={"#999"}
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              placeholder="Description"
              placeholderTextColor={"#999"}
              style={styles.input}
              value={desc}
              onChangeText={setDesc}
            />
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ fontSize: 16, color: date ? "#000" : "#999" }}>
                {date ? formatDateTime(date) : "Select Date and Time"}
              </Text>
            </TouchableOpacity>
            <TextInput
              placeholder="Location"
              placeholderTextColor={"#999"}
              style={styles.input}
              value={location}
              onChangeText={setLocation}
            />

            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save Task</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <DatePickerModal
          locale="en"
          mode="single"
          visible={showDatePicker}
          date={date}
          onDismiss={() => setShowDatePicker(false)}
          onConfirm={({ date: selectedDate }) => {
            setShowDatePicker(false);
            if (selectedDate) {
              const newDate = new Date(selectedDate);
              setTempDate(newDate);
              setShowTimePicker(true);
            }
          }}
        />

        <TimePickerModal
          visible={showTimePicker}
          onDismiss={() => setShowTimePicker(false)}
          onConfirm={({ hours, minutes }) => {
            setShowTimePicker(false);
            if (tempDate) {
              const updatedDate = new Date(tempDate);
              updatedDate.setHours(hours);
              updatedDate.setMinutes(minutes);
              setDate(updatedDate);
              setTempDate(undefined);
            }
          }}
          hours={date ? date.getHours() : 0}
          minutes={date ? date.getMinutes() : 0}
          label="Select time"
        />

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          action={{
            label: "OK",
            onPress: () => setSnackbarVisible(false),
          }}
          style={{
            marginBottom: 70,
            maxWidth: 400,
            width: "100%",
            alignSelf: "center",
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    fontSize: 16,
    width: "100%",
    maxWidth: 400,
  },
  button: {
    borderWidth: 1,
    borderColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#fff",
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
