import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function ResultPage() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Extract backend data from route params
  const prediction = route.params?.prediction || "Healthy";
  const uploadedImage = route.params?.imageUri || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2026&auto=format&fit=crop";
  const confidence = route.params?.confidence || "0%";
  const severity = route.params?.severity || "Low";
  const description = route.params?.description || "No specific details provided by the analysis.";
  const category = route.params?.category || (prediction === "Healthy" ? "Healthy" : "Fungal");

  const isIssue = prediction !== "Healthy";
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background Image / Header */}
      <View style={styles.imageHeader}>
        <Image source={{ uri: uploadedImage }} style={styles.mainImage} />

        {/* Top Navigation Overlay */}
        <SafeAreaView style={styles.navOverlay}>
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>

            <Text style={styles.overlayTitle}>Diagnosis Result</Text>

            <TouchableOpacity style={styles.navBtn}>
              <Ionicons name="share-social-outline" size={22} color="#333" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Floating Status Badge */}
        <View style={styles.statusBadge}>
          <Ionicons
            name={isIssue ? "alert-circle" : "checkmark-circle"}
            size={18}
            color={isIssue ? "#F2994A" : "#219653"}
          />
          <Text style={[styles.statusBadgeText, { color: isIssue ? "#333" : "#219653" }]}>
            {isIssue ? "Issue Detected" : "Healthy Plant"}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Spacer for the Image Header */}
        <View style={styles.headerSpacer} />

        {/* The Result Card */}
        <View style={[styles.resultCard, { backgroundColor: '#FFF' }]}>

          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.primaryLabel}>PRIMARY DIAGNOSIS</Text>
              <Text style={styles.diagnosisTitle}>{prediction}</Text>
            </View>
            <View style={[styles.categoryTag, { backgroundColor: isIssue ? '#EDF5F1' : '#E8F5E9' }]}>
              <Text style={[styles.categoryText, { color: isIssue ? '#437C60' : '#2E7D32' }]}>{category}</Text>
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

          {/* Stat Row: Confidence & Severity */}
          <View style={styles.statsRow}>
            {/* Confidence Card */}
            <View style={styles.statBox}>
              <View style={[styles.statIconWrapper, { backgroundColor: '#F2F9F5' }]}>
                <Ionicons name="shield-checkmark" size={24} color="#437C60" />
              </View>
              <Text style={styles.statValue}>{confidence}</Text>
              <Text style={styles.statLabel}>Confidence</Text>
            </View>

            {/* Severity Card */}
            <View style={styles.statBox}>
              <View style={[styles.statIconWrapper, { backgroundColor: '#FFF9F0' }]}>
                <Ionicons name="flame" size={24} color="#F2994A" />
              </View>
              <Text style={styles.statValue}>{severity}</Text>
              <Text style={styles.statLabel}>Severity</Text>
            </View>
          </View>

          {/* Dynamic Description Box */}
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>

          {/* Action Button */}
          {isIssue && (
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
              style={styles.actionButton}
              onPress={() => navigation.navigate('TreatmentOptions', {
                prediction,
                category,
                severity,
                treatments: route.params?.treatments || []
              })}
            >
              <Text style={styles.actionButtonText}>View Treatment Options</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageHeader: {
    position: 'absolute',
    top: 0,
    width: width,
    height: height * 0.45,
    zIndex: 1
  },
  mainImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  navOverlay: { width: '100%' },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginTop: Platform.OS === 'android' ? 40 : 10,
  },
  navBtn: {
    width: 44, height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5
  },
  overlayTitle: { color: '#333', fontSize: 17, fontWeight: '700' },
  statusBadge: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10,
    elevation: 5
  },
  statusBadgeText: { fontSize: 13, fontWeight: '700', marginLeft: 6 },

  scrollView: { flex: 1, zIndex: 2 },
  scrollContent: {},
  headerSpacer: { height: height * 0.4 },
  resultCard: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    minHeight: height * 0.6,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20,
    elevation: 10
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25
  },
  primaryLabel: { fontSize: 12, fontWeight: '800', color: '#BDBDBD', letterSpacing: 1, marginBottom: 5 },
  diagnosisTitle: { fontSize: 26, fontWeight: 'bold', color: '#1A1C1B' },
  categoryTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  categoryText: { fontSize: 13, fontWeight: '700' },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30
  },
  statBox: {
    width: (width - 90) / 2,
    alignItems: 'center'
  },
  statIconWrapper: {
    width: 56, height: 56,
    borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12
  },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1A1C1B', marginBottom: 2 },
  statLabel: { fontSize: 12, color: '#BDBDBD', fontWeight: '600' },

  descriptionBox: {
    backgroundColor: '#F9F9F9',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30
  },
  descriptionText: {
    fontSize: 15, color: '#4F4F4F',
    lineHeight: 24, fontStyle: 'italic',
    textAlign: 'center'
  },

  actionButton: {
    backgroundColor: '#437C60',
    borderRadius: 18,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#437C60', shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }
  },
  actionButtonText: { color: '#FFF', fontSize: 17, fontWeight: '700' }
});
