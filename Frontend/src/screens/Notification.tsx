import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';

export default function NotificationScreen() {
  const navigation = useNavigation<any>();
  const { theme, isDark } = useTheme();
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // We are fetching for "test_uid_123" to match our mocked userid. 
  // In a real app this comes from Context or AsyncStorage!
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const storedUid = await AsyncStorage.getItem('user_uid') || 'test_uid_123';
      const res = await fetch(`${BASE_URL}/api/notifications/${storedUid}`);
      const data = await res.json();
      if (res.ok) {
        setNotifications(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.notificationCard, { backgroundColor: theme.card }]}>
      <View style={styles.iconContainer}>
        <Ionicons name="warning-outline" size={24} color="#D32F2F" />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.notifTitle, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.notifMessage, { color: theme.subText }]}>{item.message}</Text>
      </View>
    </View>
  );

  // Teera Brand Colors
  const primaryGreen = "#437C60";
  const lightGreenBg = "#E8F5E9"; // Soft botanical green tint

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      
      {/* --- Top Header --- */}
      <View style={[styles.topHeader, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.pageTitle, { color: theme.text }]}>Notifications</Text>
        <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle-outline" size={30} color="#2E7D32" />

        <TouchableOpacity 
          style={styles.profileIcon}
          onPress={() => navigation.navigate('Profile')} 
        >
          <Ionicons name="person-circle-outline" size={30} color={primaryGreen} />
        </TouchableOpacity>
      </View>

      {/* --- Content Section --- */}
      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#437C60" />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.centerContent}>
          <View style={[styles.iconCircle, { backgroundColor: theme.card }]}>
            <Ionicons name="notifications-outline" size={60} color={theme.subText} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>No new notifications</Text>
          <Text style={[styles.emptySubtitle, { color: theme.subText }]}>
            We'll notify you when something arrives!
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15 }}
        />
      )}
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
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 3,
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
  backButton: { padding: 5 },
  pageTitle: { fontSize: 18, fontWeight: '700' },
  profileIcon: { padding: 5 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  iconCircle: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  notificationCard: {
    flexDirection: 'row', padding: 15, borderRadius: 12, marginBottom: 15,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 3, alignItems: 'center'
  },
  iconContainer: {
    width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#FFEBEE',
    justifyContent: 'center', alignItems: 'center', marginRight: 15
  },
  textContainer: { flex: 1 },
  notifTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  notifMessage: { fontSize: 14, lineHeight: 20 }
});
