import React, { useState, useMemo, useEffect } from 'react';
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
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import { BASE_URL } from '../config';

const { width } = Dimensions.get('window');

export default function CalendarScreen() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<any>();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [reminders, setReminders] = useState<any>({}); 
  
  const [remName, setRemName] = useState('');
  const [remDesc, setRemDesc] = useState('');

  const fetchReminders = async () => {
    try {
      const storedUid = await AsyncStorage.getItem('user_uid') || 'test_uid_123';
      const res = await fetch(`${BASE_URL}/api/get-reminders/${storedUid}`);
      const data = await res.json();
      if (res.ok) {
        // Transform the array from backend into the { "YYYY-MM-DD": { name, desc } } object expected by the UI
        const transformed: any = {};
        data.forEach((item: any) => {
          transformed[item.date] = { name: item.name, desc: item.description };
        });
        setReminders(transformed);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const markedDates = useMemo(() => {
    let marked: any = {};
    Object.keys(reminders).forEach((date) => {
      marked[date] = { marked: true, dotColor: '#2E7D32' };
    });
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: '#2E7D32',
      };
    }
    return marked;
  }, [selectedDate, reminders]);

  const handleSaveReminder = async () => {
    if (!selectedDate) {
      Alert.alert("Error", "Please select a date.");
      return;
    }
    if (!remName.trim()) {
      Alert.alert("Error", "Please enter a reminder title.");
      return;
    }

    try {
      const storedUid = await AsyncStorage.getItem('user_uid') || 'test_uid_123';
      const res = await fetch(`${BASE_URL}/api/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: storedUid,
          reminder_name: remName,
          description: remDesc,
          date: selectedDate
        })
      });
      if (res.ok) {
        Alert.alert("Saved", `Reminder set for ${selectedDate}`);
        setRemName('');
        setRemDesc('');
        fetchReminders(); // Refresh the list from backend
      } else {
        Alert.alert("Error", "Failed to save reminder.");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Network Error", "Could not connect to the server.");
    }
  };

  // Hardcode background to match your profile screen dark mode perfectly
  const screenBgColor = isDark ? '#121212' : '#F0F9F1';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screenBgColor }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={screenBgColor} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          
          {/* --- Header with Back Button --- */}
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={26} color={theme.text} />
            </TouchableOpacity>
            
            <View style={styles.headerTextContainer}>
              <Text style={[styles.title, { color: theme.text }]}>Set Reminder</Text>
              <Text style={[styles.subtitle, { color: theme.subText }]}>Select a date and enter details</Text>
            </View>
            
            <View style={{ width: 26 }} /> 
          </View>

          <View style={[styles.calendarWrapper, { borderColor: theme.border, backgroundColor: theme.card }]}>
            <Calendar
              enableSwipeMonths={true} 
              onDayPress={(day: any) => setSelectedDate(day.dateString)}
              markedDates={markedDates}
              theme={{
                calendarBackground: theme.card,
                selectedDayBackgroundColor: '#2E7D32',
                todayTextColor: '#2E7D32',
                dayTextColor: theme.text,
                arrowColor: '#2E7D32',
                monthTextColor: theme.text,
                textMonthFontWeight: 'bold',
              }}
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={[styles.label, { color: theme.text }]}>
              Selected: <Text style={{ color: '#2E7D32' }}>{selectedDate || 'Select a date'}</Text>
            </Text>
            
            <TextInput
              style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
              placeholder="Reminder Name (e.g. Watering)"
              value={remName}
              onChangeText={setRemName}
              placeholderTextColor={theme.subText}
            />

            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
              placeholder="Description (optional)"
              value={remDesc}
              onChangeText={setRemDesc}
              multiline={true}
              numberOfLines={3}
              placeholderTextColor={theme.subText}
            />

            <TouchableOpacity style={styles.button} onPress={handleSaveReminder}>
              <Text style={styles.buttonText}>Save Reminder</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.remindersListView}>
            <Text style={[styles.listTitle, { color: theme.text }]}>Upcoming Tasks</Text>
            {Object.keys(reminders).length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="notifications-off-outline" size={40} color={theme.subText} />
                <Text style={[styles.emptyText, { color: theme.subText }]}>No reminders set yet.</Text>
              </View>
            ) : (
              /* --- The Fixed Line is Below! No extra bracket --- */
              Object.keys(reminders).sort().map((date) => (
                <View key={date} style={[styles.reminderCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.cardHeader}>
                    <Ionicons name="calendar-outline" size={16} color="#2E7D32" />
                    <Text style={[styles.cardDate, { color: theme.subText }]}>{date}</Text>
                  </View>
                  <Text style={[styles.cardName, { color: theme.text }]}>{reminders[date].name}</Text>
                  {reminders[date].desc ? <Text style={[styles.cardDesc, { color: theme.subText }]}>{reminders[date].desc}</Text> : null}
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
  container: { flex: 1 },
  headerContainer: { 
    flexDirection: 'row', 
    alignItems: "center", 
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 25, 
    marginBottom: 20 
  },
  backButton: { padding: 5 },
  headerTextContainer: { alignItems: 'center' },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 13, marginTop: 4 },
  calendarWrapper: {
    width: width - 30,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  formContainer: { width: '100%', paddingHorizontal: 20, marginTop: 25 },
  label: { fontSize: 15, fontWeight: "700", marginBottom: 12 },
  input: { borderRadius: 12, padding: 15, fontSize: 15, borderWidth: 1, marginBottom: 12 },
  textArea: { height: 90, textAlignVertical: 'top' },
  button: {
    backgroundColor: "#2E7D32", 
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 5,
    elevation: 3,
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  remindersListView: { width: '100%', paddingHorizontal: 20, marginTop: 30 },
  listTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15 },
  reminderCard: {
    padding: 16,
    borderRadius: 15,
    borderLeftWidth: 5,
    borderLeftColor: "#2E7D32", 
    borderWidth: 1,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  cardDate: { marginLeft: 6, fontSize: 13, fontWeight: "600" },
  cardName: { fontSize: 16, fontWeight: "700" },
  cardDesc: { fontSize: 14, marginTop: 4, lineHeight: 20 },
  emptyContainer: { alignItems: 'center', marginTop: 20 },
  emptyText: { marginTop: 10, fontSize: 14, fontStyle: 'italic' }
});
