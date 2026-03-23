import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  SafeAreaView,
  Alert 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  
  // You can replace this with your actual user data/state
  const username = "User"; 

  const handleUploadImage = () => {
    // This is a placeholder for your image picker logic
    Alert.alert("Upload", "Opening Gallery...");
    // navigation.navigate('Gallery'); // If you have a gallery screen
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Upper Middle Greeting */}
      <View style={styles.headerGreeting}>
        <Text style={[styles.greetingText, { color: theme.text }]}>Hello, {username}!</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        

        {/* Hero Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Plant Care Guide</Text>
            <Text style={styles.heroSubtitle}>Help you taking good care of the plants</Text>
          </View>
          <Ionicons name="leaf" size={70} color="#A5D6A7" style={styles.heroIcon} />
        </View>

        {/* Action Cards Section 1: Diseases */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Detect Diseases</Text>
        <View style={styles.actionRow}>
          {/* Scan Button REMOVED from here as requested */}
          
          <TouchableOpacity 
            style={[styles.fullWidthActionCard, { backgroundColor: theme.card }]} 
            onPress={handleUploadImage}
          >
            <View style={[styles.iconWrapper, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="image-outline" size={32} color="#2E7D32" />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>Upload Image from Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Support & Help Section */}
        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 25 }]}>Support & Help</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate('Community')}
          >
            <View style={[styles.iconWrapper, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="people-outline" size={32} color="#1976D2" />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>Community</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate('Chatbot')}
          >
            <View style={[styles.iconWrapper, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="chatbubble-ellipses-outline" size={32} color="#F57C00" />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>AI Chatbot</Text>
          </TouchableOpacity>
        </View>

        {/* Debug Section: View Result Page Directly */}
        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 25 }]}>Developer Tools</Text>
        <TouchableOpacity 
          style={[styles.fullWidthActionCard, { backgroundColor: theme.card }]} 
          onPress={() => navigation.navigate('Result', {
            imageUri: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2026&auto=format&fit=crop',
            prediction: 'Rough Bark Disease',
            diagnosisText: 'Rough Bark Disease (88% confidence)',
            confidence: '88%',
            severity: 'Medium',
            description: 'Early symptoms of bark cracking and unusual texture observed. This typically occurs due to nutrient imbalance or fungal infection.',
            category: 'Fungal'
          })}
        >
          <View style={[styles.iconWrapper, { backgroundColor: '#FFEBEE' }]}>
            <Ionicons name="bug-outline" size={32} color="#D32F2F" />
          </View>
          <Text style={[styles.actionText, { color: theme.text }]}>View Sample Result (Debug)</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom Navigation Bar (Scan Button remains here) */}
      <View style={[styles.bottomNav, { backgroundColor: theme.card }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="#2E7D32" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Calendar')}>
          <Ionicons name="calendar-outline" size={24} color={theme.subText} />
        </TouchableOpacity>
        
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity 
            style={[styles.floatingButton, { borderColor: theme.background }]} 
            onPress={() => navigation.navigate('Scan')}
          >
            <Ionicons name="scan" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Notification')}>
          <Ionicons name="notifications-outline" size={24} color={theme.subText} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={24} color={theme.subText} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGreeting: {
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 5,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  scrollContent: { padding: 20, paddingTop: 15, paddingBottom: 110 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 16 },
  searchIcon: { marginLeft: 10 },
  heroCard: {
    backgroundColor: '#2E7D32', 
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
    position: 'relative',
    overflow: 'hidden', 
  },
  heroTextContainer: { flex: 1, zIndex: 2 },
  heroTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  heroSubtitle: { fontSize: 14, color: '#E8F5E9' },
  heroIcon: { position: 'absolute', right: -10, bottom: -15, opacity: 0.8, zIndex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionCard: {
    width: '47%', 
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  fullWidthActionCard: {
    width: '100%', 
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  iconWrapper: {
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    // Note: for the Community/Chatbot section, I kept the margin bottom in a separate style if needed
  },
  actionText: { fontSize: 16, fontWeight: '700' },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 25, 
    borderTopRightRadius: 25,
    elevation: 20, 
  },
  navItem: { padding: 10 },
  floatingButtonContainer: { position: 'relative', top: -25 },
  floatingButton: {
    backgroundColor: '#2E7D32',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4, 
  }
});
