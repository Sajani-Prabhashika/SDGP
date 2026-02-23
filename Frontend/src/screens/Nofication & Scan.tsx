import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// 1. Camera & Gallery Imports
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

// 1. YOUR REAL SCAN SCREEN (With Camera)
const ScanScreen: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  // Added boolean type for the torch state
  const [torchOn, setTorchOn] = useState<boolean>(false);

  if (!permission) return <View style={styles.cameraContainer} />;

  if (!permission.granted) {
    return (
      <View style={[styles.cameraContainer, { justifyContent: 'center' }]}>
        <Text style={{ marginBottom: 20, fontSize: 18 }}>We need access to your camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={{ color: 'white', fontSize: 18 }}>Allow Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const openGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({x
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) Alert.alert("Image Selected!");
  };

  const takePhoto = () => {
    Alert.alert("Snap!", "Photo captured.");
  };

  return (
    <View style={styles.cameraContainer}>
      <View style={styles.cameraHeader}>
        <Text style={styles.cameraHeaderText}>Scan Your Plant</Text>
      </View>

      <CameraView 
        style={styles.cameraBox} 
        facing="back" 
        enableTorch={torchOn} 
      />

      <View style={styles.cameraBottomRow}>
        <TouchableOpacity style={styles.smallButton} onPress={() => setTorchOn(!torchOn)}>
          <Ionicons name={torchOn ? "flashlight" : "flashlight-outline"} size={30} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bigButton} onPress={takePhoto}>
          <Ionicons name="aperture" size={60} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallButton} onPress={openGallery}>
          <Ionicons name="image-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 2. YOUR NOTIFICATIONS SCREEN
const NotificationsScreen: React.FC = () => {
  return (
    <ScrollView style={styles.pageContainer}>
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={28} color="black" />
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <View style={[styles.card, styles.alertCard]}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.alertCardTitle}>Outbreak Alert</Text>
          <Ionicons name="alert-circle-outline" size={20} color="#D32F2F" />
        </View>
        <Text style={styles.cardText}>
          Rough bark disease detected nearby see more....
        </Text>
      </View>

      <View style={[styles.card, styles.infoCard]}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.infoCardTitle}>Cultivation Tip for January</Text>
          <Ionicons name="information-circle-outline" size={20} color="#1E8449" />
        </View>
        <Text style={styles.cardText}>
          Do you know that regular pruning encourages more shoots, which improves bark yield over time.
        </Text>
      </View>
    </ScrollView>
  );
};

// 3. MAIN APP & NAVIGATION BAR
export default function App() {
  // Added explicit string typing to the active tab state
  const [activeTab, setActiveTab] = useState<string>('Scan'); 

  return (
    <SafeAreaView style={styles.container}>
      
      {/* SCREEN CONTENT AREA */}
      <View style={styles.contentArea}>
        {activeTab === 'Notifications' && <NotificationsScreen />}
        {activeTab === 'Scan' && <ScanScreen />}
        {activeTab === 'Home' && <View style={styles.centerScreen}><Text>Home Page</Text></View>}
        {activeTab === 'Calendar' && <View style={styles.centerScreen}><Text>Calendar Page</Text></View>}
        {activeTab === 'Profile' && <View style={styles.centerScreen}><Text>Profile Page</Text></View>}
      </View>

      {/* BOTTOM NAVIGATION BAR */}
      <View style={styles.navBar}>
        
        <View style={styles.navLeftRight}>
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Home')}>
            <Ionicons name={activeTab === 'Home' ? "home" : "home-outline"} size={24} color={activeTab === 'Home' ? "#1E8449" : "gray"} />
            <Text style={[styles.navText, activeTab === 'Home' && styles.navTextActive]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Calendar')}>
            <Ionicons name={activeTab === 'Calendar' ? "calendar" : "calendar-outline"} size={24} color={activeTab === 'Calendar' ? "#1E8449" : "gray"} />
            <Text style={[styles.navText, activeTab === 'Calendar' && styles.navTextActive]}>Calendar</Text>
          </TouchableOpacity>
        </View>

        {/* MIDDLE SCAN BUTTON */}
        <View style={styles.middleButtonContainer}>
          <TouchableOpacity style={styles.middleScanButton} onPress={() => setActiveTab('Scan')}>
            <Ionicons name="scan" size={36} color={activeTab === 'Scan' ? "#1E8449" : "black"} />
          </TouchableOpacity>
        </View>

        <View style={styles.navLeftRight}>
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Notifications')}>
            <Ionicons name={activeTab === 'Notifications' ? "notifications" : "notifications-outline"} size={24} color={activeTab === 'Notifications' ? "#1E8449" : "gray"} />
            <Text style={[styles.navText, activeTab === 'Notifications' && styles.navTextActive]}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Profile')}>
            <Ionicons name={activeTab === 'Profile' ? "person" : "person-outline"} size={24} color={activeTab === 'Profile' ? "#1E8449" : "gray"} />
            <Text style={[styles.navText, activeTab === 'Profile' && styles.navTextActive]}>Profile</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

// ==========================================
// 4. COMBINED STYLES
// ==========================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  contentArea: { flex: 1 },
  centerScreen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // -- Camera Styles --
  cameraContainer: { flex: 1, alignItems: 'center', paddingTop: 20 },
  cameraHeader: { marginBottom: 20 },
  cameraHeaderText: { fontSize: 20, fontWeight: 'bold' },
  cameraBox: {
    width: '80%', height: 450, borderColor: '#2E7D32', borderWidth: 3,
    borderRadius: 15, overflow: 'hidden'
  },
  cameraBottomRow: {
    flexDirection: 'row', width: '80%', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 30,
  },
  smallButton: {
    width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: 'black',
    justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',
  },
  bigButton: { justifyContent: 'center', alignItems: 'center' },
  permissionButton: { backgroundColor: '#2E7D32', padding: 15, borderRadius: 10 },

  // -- Notification Styles --
  pageContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  card: { padding: 20, borderRadius: 15, marginBottom: 15 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  cardText: { fontSize: 15, color: '#333', lineHeight: 22 },
  alertCard: { backgroundColor: '#FFCCB6' },
  alertCardTitle: { fontWeight: 'bold', fontSize: 16, color: '#000' },
  infoCard: { backgroundColor: '#A5E0A7' },
  infoCardTitle: { fontWeight: 'bold', fontSize: 16, color: '#000' },

  // -- Navigation Bar Styles --
  navBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 5,
    borderTopWidth: 1, borderColor: '#E0E0E0',
  },
  navLeftRight: { flexDirection: 'row', flex: 1, justifyContent: 'space-around' },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 10, color: 'gray', marginTop: 4 },
  navTextActive: { color: '#1E8449', fontWeight: 'bold' },
  middleButtonContainer: {
    width: 70, alignItems: 'center', justifyContent: 'center'
  },
  middleScanButton: {
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F0F0',
    width: 60, height: 60, borderRadius: 15, borderWidth: 1, borderColor: '#CCC',
    transform: [{ translateY: -15 }], 
  }
});