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
  Platform
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [reminders, setReminders] = useState({}); // { 'YYYY-MM-DD': { name: '', desc: '' } }
  
  // Form States
  const [remName, setRemName] = useState('');
  const [remDesc, setRemDesc] = useState('');

  // Combine selection and reminder dots
  const markedDates = useMemo(() => {
    let marked = {};
    Object.keys(reminders).forEach((date) => {
      marked[date] = { marked: true, dotColor: '#3A7D58' };
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
      Alert.alert("Error", "Please select a date.");
      return;
    }
    if (!remName.trim()) {
      Alert.alert("Error", "Please enter a reminder Title.");
      return;
    }

    setReminders((prev) => ({
      ...prev,
      [selectedDate]: { name: remName, desc: remDesc },
    }));

    // Reset inputs
    setRemName('');
    setRemDesc('');
    Alert.alert("Saved", `Reminder set for ${selectedDate}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
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
              }}
            />
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>Selected Date: {selectedDate || 'None'}</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Reminder Name (e.g. Add Pesticides)"
              value={remName}
              onChangeText={setRemName}
              placeholderTextColor="#999"
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              value={remDesc}
              onChangeText={setRemDesc}
              multiline={true}
              numberOfLines={3}
              placeholderTextColor="#999"
            />

            <TouchableOpacity style={styles.button} onPress={handleSaveReminder}>
              <Text style={styles.buttonText}>save reminder</Text>
            </TouchableOpacity>
          </View>

          {/* Display Saved Reminders */}
          <View style={styles.remindersListView}>
            <Text style={styles.listTitle}>Upcoming Reminders</Text>
            {Object.keys(reminders).length === 0 ? (
              <Text style={styles.emptyText}>No reminders set.</Text>
            ) : (
              Object.keys(reminders).map((date) => (
                <View key={date} style={styles.reminderCard}>
                  <View style={styles.cardHeader}>
                    <Ionicons name="calendar" size={16} color="#407B60" />
                    <Text style={styles.cardDate}>{date}</Text>
                  </View>
                  <Text style={styles.cardName}>{reminders[date].name}</Text>
                  {reminders[date].desc ? <Text style={styles.cardDesc}>{reminders[date].desc}</Text> : null}
                </View>
              ))
            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { alignItems: "center", marginTop: 40, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "600", color: "#222" },
  subtitle: { fontSize: 14, color: "#666" },
  calendarWrapper: {
    width: width - 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#81C784",
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  formContainer: { width: '100%', paddingHorizontal: 25, marginTop: 20 },
  label: { fontSize: 14, color: "#3A7D58", fontWeight: "bold", marginBottom: 10 },
  input: {
    backgroundColor: "#C5E1A5",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: "#1B4D3E",
    borderWidth: 1,
    borderColor: "#81C784",
    marginBottom: 10,
  },
  textArea: { height: 70, textAlignVertical: 'top' },
  button: {
    backgroundColor: "#407B60", 
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "500", textTransform: 'lowercase' },
  remindersListView: { width: '100%', paddingHorizontal: 25, marginTop: 30 },
  listTitle: { fontSize: 17, fontWeight: "bold", color: "#1B4D3E", marginBottom: 15 },
  reminderCard: {
    backgroundColor: "#F1F8E9",
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#407B60",
    marginBottom: 10,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  cardDate: { marginLeft: 5, fontSize: 12, color: "#666", fontWeight: "600" },
  cardName: { fontSize: 16, fontWeight: "bold", color: "#222" },
  cardDesc: { fontSize: 14, color: "#444", marginTop: 4 },
  emptyText: { fontStyle: 'italic', color: '#aaa' }
});
