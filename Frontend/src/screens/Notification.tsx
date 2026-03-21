import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';

export default function NotificationScreen() {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();

  // Teera Brand Colors
  const primaryGreen = "#437C60";
  const lightGreenBg = "#E8F5E9"; // Soft botanical green tint

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      
      {/* --- Top Header --- */}
      <View style={[styles.topHeader, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={26} color={theme.text} />
        </TouchableOpacity>
        
        <Text style={[styles.pageTitle, { color: theme.text }]}>Notifications</Text>

        <TouchableOpacity 
          style={styles.profileIcon}
          onPress={() => navigation.navigate('Profile')} 
        >
          <Ionicons name="person-circle-outline" size={30} color={primaryGreen} />
        </TouchableOpacity>
      </View>

      {/* --- Content Section --- */}
      <View style={styles.content}>
        {/* Updated Circle and Icon Colors */}
        <View style={[styles.iconCircle, { backgroundColor: theme.dark ? '#1B2E22' : lightGreenBg }]}>
          <Ionicons name="notifications-outline" size={60} color={primaryGreen} />
        </View>
        
        <Text style={[styles.emptyTitle, { color: theme.text }]}>No new notifications</Text>
        
        {/* Updated Subtitle with a hint of green-gray */}
        <Text style={[styles.emptySubtitle, { color: theme.dark ? '#A5D6A7' : '#556B5D' }]}>
          We'll notify you when your plants need water or someone interacts with your posts.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: { padding: 5 },
  pageTitle: { fontSize: 18, fontWeight: '700' },
  profileIcon: { padding: 5 },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  }
});