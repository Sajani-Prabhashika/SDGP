import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';

const { width, height } = Dimensions.get('window');

// Default placeholder treatments to fall back on
const defaultTreatments = [
  "Remove and destroy infected plant parts immediately to prevent spread.",
  "Ensure good air circulation around the plants by proper spacing and pruning.",
  "Avoid overhead watering; rather water at the base to keep foliage dry.",
  "Apply appropriate organic or chemical treatment/fungicides as directed on the label.",
  "Monitor plants regularly to catch and manage the disease early."
];

export default function TreatmentOptions() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>(); 
  const route = useRoute<any>();

  const prediction = route.params?.prediction || "Unknown Disease"; 
  const category = route.params?.category || "Unknown Category";
  const severity = route.params?.severity || "Unknown";
  
  const treatmentSteps = route.params?.treatments || defaultTreatments;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background || '#F9F9F9' }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Treatment Plan</Text>
        <View style={styles.backBtnPlaceholder} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.subtitle}>Recommended options for</Text>
          <Text style={styles.mainTitle}>{prediction}</Text>
          
          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Ionicons name="leaf" size={14} color="#437C60" />
              <Text style={styles.tagText}>{category}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: '#FFF4E5' }]}>
              <Ionicons name="flame" size={14} color="#F2994A" />
              <Text style={[styles.tagText, { color: '#F2994A' }]}>{severity} Severity</Text>
            </View>
          </View>
        </View>

        <View style={styles.stepsContainer}>
          <Text style={styles.sectionHeader}>Action Steps</Text>
          
          {treatmentSteps.map((step: string, index: number) => (
            <View key={index} style={styles.stepCard}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Suggestion / Alert Card */}
        <View style={styles.alertCard}>
          <Ionicons name="information-circle" size={28} color="#219653" />
          <View style={styles.alertTextContainer}>
            <Text style={styles.alertTitle}>Important Note</Text>
            <Text style={styles.alertDesc}>
              Always test any new chemical or organic treatment on a small portion of the plant before applying it entirely. Wear protective gear if needed.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: Platform.OS === 'android' ? 30 : 10,
  },
  backBtn: {
    width: 44, height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
  },
  backBtnPlaceholder: { width: 44, height: 44 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  
  scrollView: { flex: 1 },
  scrollContent: { padding: 20 },
  
  titleSection: { marginBottom: 30 },
  subtitle: { fontSize: 14, color: '#888', fontWeight: '600', marginBottom: 5 },
  mainTitle: { fontSize: 26, fontWeight: '800', color: '#1A1C1B', marginBottom: 15 },
  
  tagsContainer: { flexDirection: 'row', gap: 10 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF5F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6
  },
  tagText: { fontSize: 13, fontWeight: '700', color: '#437C60' },

  stepsContainer: { marginBottom: 30 },
  sectionHeader: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 15 },
  
  stepCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    alignItems: 'flex-start'
  },
  stepNumberContainer: {
    width: 30, height: 30,
    borderRadius: 15,
    backgroundColor: '#437C60',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 15
  },
  stepNumber: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  stepText: { fontSize: 15, color: '#4F4F4F', lineHeight: 22, flex: 1 },

  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderRadius: 16,
    alignItems: 'flex-start'
  },
  alertTextContainer: { marginLeft: 15, flex: 1 },
  alertTitle: { fontSize: 16, fontWeight: '700', color: '#2E7D32', marginBottom: 5 },
  alertDesc: { fontSize: 14, color: '#388E3C', lineHeight: 20 }
});
