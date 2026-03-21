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
  StatusBar
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';

const { width } = Dimensions.get('window');

export default function CalendarScreen() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<any>();
  
  const [selectedDate, setSelectedDate] = useState('');
  // reminders is now an object where each key is a date string 
  // and the value is an ARRAY of reminder objects.
  const [reminders, setReminders] = useState<Record<string, any[]>>({}); 
  
  const [remName, setRemName] = useState('');
  const [remDesc, setRemDesc] = useState('');

  const markedDates = useMemo(() => {
    let marked: any = {};
    Object.keys(reminders).forEach((date) => {
      // If the array for this date has items, show the dot
      if (reminders[date].length > 0) {
        marked[date] = { marked: true, dotColor: '#2E7D32' };
      }
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

  const handleSaveReminder = () => {
    if (!selectedDate) {
      Alert.alert("Date Required", "Please tap a date on the calendar first.");
      return;
    }

    if (!remName.trim()) {
      Alert.alert("Title Required", "Please enter a name for this reminder.");
      return;
    }

    const newReminder = {
      id: Date.now().toString(), // Unique ID for mapping
      name: remName.trim(),
      desc: remDesc.trim(),
    };

    setReminders((prev) => {
      // Get existing array for this date, or start a new one
      const existingForDate = prev[selectedDate] || [];
      return {
        ...prev,
        [selectedDate]: [...existingForDate, newReminder],
      };
    });

    // Clear inputs
    setRemName('');
    setRemDesc('');
    // Note: We keep selectedDate so user can add another task to the same day quickly
    Alert.alert("Success", `Reminder added for ${selectedDate}`);
  };

  const screenBgColor = isDark ? '#121212' : '#F0F9F1';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screenBgColor }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={screenBgColor} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={26} color={theme.text} />
            </TouchableOpacity>
            
            <View style={styles.headerTextContainer}>
              <Text style={[styles.title, { color: theme.text }]}>Set Reminder</Text>
              <Text style={[styles.subtitle, { color: theme.subText }]}>Add multiple tasks per day</Text>
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
              Selected: <Text style={{ color: '#2E7D32' }}>{selectedDate || 'Tap a date'}</Text>
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

            <TouchableOpacity 
              style={[styles.button, { opacity: (!selectedDate || !remName.trim()) ? 0.7 : 1 }]} 
              onPress={handleSaveReminder}
            >
              <Text style={styles.buttonText}>Add Reminder</Text>
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
              // Sort dates chronologically
              Object.keys(reminders).sort().map((date) => (
                <View key={date}>
                  {/* Date Header for each group of reminders */}
                  <View style={styles.dateGroupHeader}>
                    <Ionicons name="calendar-outline" size={14} color="#2E7D32" />
                    <Text style={[styles.dateGroupText, { color: theme.subText }]}>{date}</Text>
                  </View>
                  
                  {/* Map through the array of reminders for this specific date */}
                  {reminders[date].map((item: any) => (
                    <View key={item.id} style={[styles.reminderCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                      <Text style={[styles.cardName, { color: theme.text }]}>{item.name}</Text>
                      {item.desc ? <Text style={[styles.cardDesc, { color: theme.subText }]}>{item.desc}</Text> : null}
                    </View>
                  ))}
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
  headerContainer: { flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, marginTop: 25, marginBottom: 20 },
  backButton: { padding: 5 },
  headerTextContainer: { alignItems: 'center' },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 13, marginTop: 4 },
  calendarWrapper: { width: width - 30, borderRadius: 20, borderWidth: 1, overflow: 'hidden', elevation: 4 },
  formContainer: { width: '100%', paddingHorizontal: 20, marginTop: 25 },
  label: { fontSize: 15, fontWeight: "700", marginBottom: 12 },
  input: { borderRadius: 12, padding: 15, fontSize: 15, borderWidth: 1, marginBottom: 12 },
  textArea: { height: 80, textAlignVertical: 'top' },
  button: { backgroundColor: "#2E7D32", paddingVertical: 16, borderRadius: 15, alignItems: "center", marginTop: 5 },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  remindersListView: { width: '100%', paddingHorizontal: 20, marginTop: 30 },
  listTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15 },
  dateGroupHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: 10 },
  dateGroupText: { marginLeft: 6, fontSize: 13, fontWeight: "bold", textTransform: 'uppercase' },
  reminderCard: { padding: 14, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: "#2E7D32", borderWidth: 1, marginBottom: 8 },
  cardName: { fontSize: 16, fontWeight: "600" },
  cardDesc: { fontSize: 14, marginTop: 2 },
  emptyContainer: { alignItems: 'center', marginTop: 20 },
  emptyText: { marginTop: 10, fontSize: 14, fontStyle: 'italic' }
});