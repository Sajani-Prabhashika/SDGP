import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';

export default function NotificationScreen() {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      
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
          <Ionicons name="person-circle-outline" size={30} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      {/* --- Content Section --- */}
      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: theme.card }]}>
          <Ionicons name="notifications-outline" size={60} color={theme.subText} />
        </View>
        <Text style={[styles.emptyTitle, { color: theme.text }]}>No new notifications</Text>
        <Text style={[styles.emptySubtitle, { color: theme.subText }]}>
          We'll notify you when something arrives!
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    padding: 5,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  profileIcon: {
    padding: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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