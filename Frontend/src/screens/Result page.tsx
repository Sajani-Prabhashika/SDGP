import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator,
  Image,
  StatusBar,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';

const { width } = Dimensions.get('window');

export default function ScanningFinish() {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentPercentage, setCurrentPercentage] = useState(0); 
  const [uploadProgress, setUploadProgress] = useState(0); // New state for Progress Bar
  const confidenceScore = 88; 

  // Simulation for ML analysis with Progress Bar update
  useEffect(() => {
    // Increment progress bar over 2.5 seconds
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 1) {
          clearInterval(interval);
          return 1;
        }
        return prev + 0.01; 
      });
    }, 22);

    const timer = setTimeout(() => setIsLoading(false), 2500);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // Animated counter for confidence score (runs after loading)
  useEffect(() => {
    if (!isLoading) {
      let counter = 0;
      const interval = setInterval(() => {
        counter += 1;
        setCurrentPercentage(counter);
        if (counter >= confidenceScore) clearInterval(interval);
      }, 20); 
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <View style={styles.loaderContent}>
            <ActivityIndicator size="large" color="#437C60" />
            <Text style={[styles.loadingText, { color: theme.text }]}>Analyzing Plant Health...</Text>
            <Text style={[styles.subLoadingText, { color: theme.subText }]}>Running ML identification models</Text>
            
            {/* --- NEW PROGRESS BAR UI --- */}
            <View style={[styles.progressBarBackground, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                <View style={[styles.progressBarFill, { width: `${uploadProgress * 100}%` }]} />
            </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- CUSTOM HEADER --- */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.headerIcon, { backgroundColor: theme.card }]} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Diagnosis Result</Text>
          <TouchableOpacity style={[styles.headerIcon, { backgroundColor: theme.card }]}>
            <Ionicons name="share-social-outline" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* --- IMAGE SECTION --- */}
        <View style={styles.imageWrapper}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800' }} 
            style={styles.resultImage}
          />
          <View style={styles.statusBadge}>
            <Ionicons name="alert-circle" size={16} color="#FF9800" />
            <Text style={styles.statusBadgeText}>Issue Detected</Text>
          </View>
        </View>

        {/* --- INFO CARD --- */}
        <View style={[styles.mainCard, { backgroundColor: theme.card }]}>
          <div style={styles.diagnosisLabelRow}>
            <Text style={styles.label}>PRIMARY DIAGNOSIS</Text>
            <View style={styles.badgeSmall}>
                <Text style={styles.badgeTextSmall}>Fungal</Text>
            </View>
          </div>
          
          <Text style={[styles.diseaseTitle, { color: theme.text }]}>Rough Bark Disease</Text>
          
          <View style={styles.divider} />

          {/* STATS GRID */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(67, 124, 96, 0.1)' }]}>
                <Ionicons name="shield-checkmark" size={26} color="#437C60" />
              </View>
              <Text style={[styles.statValue, { color: theme.text }]}>{currentPercentage}%</Text>
              <Text style={[styles.statLabel, { color: theme.subText }]}>Confidence</Text>
            </View>

            <View style={styles.statBox}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
                <Ionicons name="flame" size={26} color="#FF9800" />
              </View>
              <Text style={[styles.statValue, { color: theme.text }]}>Medium</Text>
              <Text style={[styles.statLabel, { color: theme.subText }]}>Severity</Text>
            </View>
          </View>

          {/* DESCRIPTION */}
          <View style={[styles.descriptionBox, { backgroundColor: theme.background }]}>
            <Text style={[styles.descriptionText, { color: theme.text }]}>
              Early symptoms of bark cracking and unusual texture observed. This typically occurs due to nutrient imbalance or fungal infection.
            </Text>
          </View>
        </View>

        {/* --- ACTION BUTTONS --- */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity 
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('TreatmentOptions')} 
          >
            <Text style={styles.primaryBtnText}>See Treatment Options</Text>
            <Ionicons name="medical" size={20} color="#FFF" style={{marginLeft: 10}} />
          </TouchableOpacity>

          <View style={styles.secondaryRow}>
            <TouchableOpacity 
               style={[styles.secondaryBtn, { backgroundColor: theme.card, borderColor: '#437C60' }]}
               onPress={() => navigation.navigate('Scan')}
            >
              <Ionicons name="camera-reverse-outline" size={22} color="#437C60" />
              <Text style={styles.secondaryBtnTextGreen}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity 
               style={[styles.secondaryBtn, { backgroundColor: theme.card, borderColor: '#EEE' }]}
               onPress={() => navigation.navigate('Home')}
            >
              <Ionicons name="home-outline" size={22} color={theme.subText} />
              <Text style={[styles.secondaryBtnText, { color: theme.subText }]}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderContent: { alignItems: 'center' },
  loadingText: { marginTop: 20, fontSize: 18, fontWeight: 'bold' },
  subLoadingText: { marginTop: 8, fontSize: 14, opacity: 0.6 },
  
  // Progress Bar Styles
  progressBarBackground: {
    width: width * 0.65,
    height: 8,
    borderRadius: 4,
    marginTop: 30,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#437C60',
    borderRadius: 4,
  },

  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  headerIcon: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },

  imageWrapper: { paddingHorizontal: 20, marginTop: 10, position: 'relative' },
  resultImage: { width: '100%', height: 280, borderRadius: 30 },
  statusBadge: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    ...Platform.select({ android: { elevation: 5 }, ios: { shadowOpacity: 0.2 } })
  },
  statusBadgeText: { fontSize: 12, fontWeight: 'bold', marginLeft: 5, color: '#000' },

  mainCard: {
    margin: 20,
    borderRadius: 35,
    padding: 25,
    marginTop: -30,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  diagnosisLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 11, color: '#999', fontWeight: 'bold', letterSpacing: 1.2 },
  badgeSmall: { backgroundColor: 'rgba(67, 124, 96, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeTextSmall: { color: '#437C60', fontSize: 10, fontWeight: 'bold' },
  diseaseTitle: { fontSize: 26, fontWeight: '800', marginTop: 8 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 20 },
  
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 25 },
  statBox: { alignItems: 'center' },
  iconCircle: { width: 55, height: 55, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { fontSize: 12, marginTop: 2 },

  descriptionBox: { padding: 18, borderRadius: 20 },
  descriptionText: { textAlign: 'center', fontSize: 14, lineHeight: 22, fontStyle: 'italic' },

  buttonWrapper: { paddingHorizontal: 20, marginTop: 10 },
  primaryBtn: {
    backgroundColor: '#437C60',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 22,
    elevation: 4,
  },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  
  secondaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  secondaryBtn: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  secondaryBtnTextGreen: { color: '#437C60', fontWeight: 'bold', marginLeft: 8 },
  secondaryBtnText: { fontWeight: 'bold', marginLeft: 8 }
});