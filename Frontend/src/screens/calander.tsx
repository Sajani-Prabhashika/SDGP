import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Define the shape of a single reminder
interface Reminder {
  id: number;
  name: string;
  desc: string;
}

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  // reminders is now an object where each key (date) holds an array of Reminder objects
  const [reminders, setReminders] = useState<{ [key: string]: Reminder[] }>({});
  
  const [remName, setRemName] = useState('');
  const [remDesc, setRemDesc] = useState('');

  const markedDates = useMemo(() => {
    let marked: any = {};
    Object.keys(reminders).forEach((date) => {
      if (reminders[date].length > 0) {
        marked[date] = { marked: true, dotColor: '#3A7D58' };
      }
    });
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: '#407B60',
      };
    }
    return marked;
  }, [selectedDate, reminders]);

  const handleSaveReminder = () => {
    if (!selectedDate) {
      Alert.alert("Error", "Please select a date on the calendar first.");
      return;
    }
    if (!remName.trim()) {
      Alert.alert("Error", "Please enter a reminder Title.");
      return;
    }

    const newReminder: Reminder = {
      id: Date.now(),
      name: remName.trim(),
      desc: remDesc.trim(),
    };

    setReminders((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newReminder],
    }));

    setRemName('');
    setRemDesc('');
    Keyboard.dismiss();
    Alert.alert("Success", `Reminder added for ${selectedDate}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
            
            <View style={styles.header}>
              <Text style={styles.title}>Set Reminder</Text>
              <Text style={styles.subtitle}>Select a date and enter details below</Text>
            </View>

            <View style={styles.calendarWrapper}>
              <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={markedDates}
                theme={{
                  selectedDayBackgroundColor: '#407B60',
                  todayTextColor: '#3A7D58',
                  arrowColor: '#407B60',
                  dotColor: '#407B60',
                  monthTextColor: '#1B4D3E',
                  textDayFontWeight: '500',
                }}
              />
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.label}>Selected Date: {selectedDate || 'Select from calendar'}</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Reminder Name (e.g. Add Pesticides)"
                value={remName}
                onChangeText={setRemName}
                placeholderTextColor="#666"
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description (optional)"
                value={remDesc}
                onChangeText={setRemDesc}
                multiline={true}
                numberOfLines={3}
                placeholderTextColor="#666"
              />

              <TouchableOpacity style={styles.button} onPress={handleSaveReminder}>
                <Text style={styles.buttonText}>Save Reminder</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.remindersListView}>
              <Text style={styles.listTitle}>Upcoming Reminders</Text>
              {Object.keys(reminders).length === 0 ? (
                <Text style={styles.emptyText}>No reminders set yet.</Text>
              ) : (
                Object.keys(reminders).sort().map((date) => (
                  reminders[date].map((item) => (
                    <View key={item.id} style={styles.reminderCard}>
                      <View style={styles.cardHeader}>
                        <Ionicons name="calendar" size={16} color="#407B60" />
                        <Text style={styles.cardDate}>{date}</Text>
                      </View>
                      <Text style={styles.cardName}>{item.name}</Text>
                      {item.desc ? <Text style={styles.cardDesc}>{item.desc}</Text> : null}
                    </View>
                  ))
                ))
              )}
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { alignItems: "center", marginTop: 20, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#1B4D3E" },
  subtitle: { fontSize: 14, color: "#666", marginTop: 4 },
  calendarWrapper: {
    width: width - 40,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formContainer: { width: '100%', paddingHorizontal: 25, marginTop: 25 },
  label: { fontSize: 14, color: "#3A7D58", fontWeight: "700", marginBottom: 10 },
  input: {
    backgroundColor: "#F1F8E9",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#1B4D3E",
    borderWidth: 1,
    borderColor: "#C5E1A5",
    marginBottom: 12,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  button: {
    backgroundColor: "#407B60", 
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  remindersListView: { width: '100%', paddingHorizontal: 25, marginTop: 30 },
  listTitle: { fontSize: 18, fontWeight: "bold", color: "#1B4D3E", marginBottom: 15 },
  reminderCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#407B60",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  cardDate: { marginLeft: 6, fontSize: 12, color: "#666", fontWeight: "600" },
  cardName: { fontSize: 16, fontWeight: "bold", color: "#222" },
  cardDesc: { fontSize: 14, color: "#555", marginTop: 4 },
  emptyText: { fontStyle: 'italic', color: '#999', textAlign: 'center', marginTop: 10 }
});