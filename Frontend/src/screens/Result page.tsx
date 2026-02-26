import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator,
  ImageBackground,
  StatusBar
} from 'react-native';

// Using RN Vector Icons for CLI compatibility
import Icon from 'react-native-vector-icons/Ionicons';

export default function ScanningFinish() {
  // 1. App State for loading and animation
  const [isLoading, setIsLoading] = useState(true);
  const [currentPercentage, setCurrentPercentage] = useState(0); 
  
  // Final accuracy result from your ML logic
  const finalResultPercentage = 80; 

  // 2. Simulate ML Model processing time (3 seconds)
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); 

    return () => clearTimeout(loadingTimer);
  }, []);

  // 3. Percentage counting animation (Triggers after loading)
  useEffect(() => {
    if (!isLoading) {
      let counter = 0;
      const countInterval = setInterval(() => {
        counter += 1;
        setCurrentPercentage(counter);

        if (counter >= finalResultPercentage) {
          clearInterval(countInterval);
        }
      }, 20); 

      return () => clearInterval(countInterval);
    }
  }, [isLoading, finalResultPercentage]);

  // Loading Screen UI
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
        <ActivityIndicator size="large" color="#1E8449" />
        <Text style={styles.loadingText}>Analyzing leaf with ML Model...</Text>
        <Text style={styles.subLoadingText}>Please wait</Text>
      </SafeAreaView>
    );
  }

  // Result Screen UI
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      
      {/* Header section with status icon */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Scanning Finish</Text>
        <Icon name="checkmark-circle" size={24} color="#1E8449" />
      </View>

      {/* Disease Result Card */}
      <View style={styles.cardBorder}>
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=500&auto=format&fit=crop' }} 
          style={styles.cardBackground}
          imageStyle={{ opacity: 0.3 }} 
        >
          {/* Information Overlay */}
          <View style={styles.resultOverlay}>
            
            {/* Animated Progress Circle */}
            <View style={styles.circleGraph}>
              <Text style={styles.percentageText}>{currentPercentage}%</Text>
            </View>

            {/* Identified Disease Name */}
            <Text style={styles.diseaseText}>Rough Bark Disease</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.buttonText}>See Treatment Options</Text>
        </TouchableOpacity>

        <View style={styles.rowButtons}>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.buttonText}>Exit</Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subLoadingText: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 18,
    color: '#000',
    marginRight: 5,
    fontWeight: '600',
  },
  cardBorder: {
    width: '85%',
    height: 400,
    borderColor: '#1E8449', 
    borderWidth: 3,
    borderRadius: 15,
    overflow: 'hidden', 
    backgroundColor: '#E8F5E9',
  },
  cardBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultOverlay: {
    backgroundColor: 'white',
    width: '100%',
    paddingVertical: 40,
    alignItems: 'center',
    elevation: 3, // Android shadow effect
  },
  circleGraph: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#942949', 
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  percentageText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FF3B30',
  },
  diseaseText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonsContainer: {
    width: '85%',
    marginTop: 30,
  },
  primaryButton: {
    backgroundColor: '#A5E0A7', 
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    backgroundColor: '#A5E0A7', 
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '48%', 
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  }
});