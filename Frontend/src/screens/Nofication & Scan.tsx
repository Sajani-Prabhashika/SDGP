import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 1. Camera and Gallery Imports
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

// Define valid tab names
type TabName = 'Home' | 'Calendar' | 'Scan' | 'Notifications' | 'Profile';

// SCAN SCREEN COMPONENT
const ScanScreen: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState<boolean>(false);

  if (!permission) return <View style={styles.cameraContainer} />;

  if (!permission.granted) {
    return (
      <View style={styles.centerScreen}>
        <Text style={{ marginBottom: 20 }}>Camera access is required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={{ color: 'white' }}>Allow Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) Alert.alert("Success", "Image selected");
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
          <Ionicons name={torchOn ? "flashlight" : "flashlight-outline"} size={28} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Alert.alert("Snap!")}>
          <Ionicons name="aperture" size={70} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallButton} onPress={openGallery}>
          <Ionicons name="image-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// NOTIFICATIONS SCREEN COMPONENT
const NotificationsScreen: React.FC = () => (
  <ScrollView style={styles.pageContainer}>
    <View style={styles.header}>
      <Ionicons name="chevron-back" size={28} color="black" />
      <Text style={styles.headerTitle}>Notifications</Text>
      <View style={{ width: 28 }} />
    </View>

    <View style={[styles.card, styles.alertCard]}>
      <Text style={styles.alertCardTitle}>Outbreak Alert</Text>
      <Text style={styles.cardText}>Rough bark disease detected nearby.</Text>
    </View>
  </ScrollView>
);

// MAIN APP COMPONENT
export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('Scan');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.contentArea}>
          {activeTab === 'Notifications' && <NotificationsScreen />}
          {activeTab === 'Scan' && <ScanScreen />}
          {activeTab === 'Home' && <View style={styles.centerScreen}><Text>Home</Text></View>}
          {activeTab === 'Calendar' && <View style={styles.centerScreen}><Text>Calendar</Text></View>}
          {activeTab === 'Profile' && <View style={styles.centerScreen}><Text>Profile</Text></View>}
        </View>

        <View style={styles.navBar}>
          <View style={styles.navLeftRight}>
            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Home')}>
              <Ionicons name="home-outline" size={24} color={activeTab === 'Home' ? "#1E8449" : "gray"} />
              <Text style={activeTab === 'Home' ? styles.navTextActive : styles.navText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Calendar')}>
              <Ionicons name="calendar-outline" size={24} color={activeTab === 'Calendar' ? "#1E8449" : "gray"} />
              <Text style={activeTab === 'Calendar' ? styles.navTextActive : styles.navText}>Calendar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.middleButtonContainer}>
            <TouchableOpacity style={styles.middleScanButton} onPress={() => setActiveTab('Scan')}>
              <Ionicons name="scan" size={32} color={activeTab === 'Scan' ? "#21aa5a" : "black"} />
            </TouchableOpacity>
          </View>

          <View style={styles.navLeftRight}>
            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Notifications')}>
              <Ionicons name="notifications-outline" size={24} color={activeTab === 'Notifications' ? "#1E8449" : "gray"} />
              <Text style={activeTab === 'Notifications' ? styles.navTextActive : styles.navText}>Alerts</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Profile')}>
              <Ionicons name="person-outline" size={24} color={activeTab === 'Profile' ? "#1E8449" : "gray"} />
              <Text style={activeTab === 'Profile' ? styles.navTextActive : styles.navText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

// STYLES TYPED PROPERLY
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' } as ViewStyle,
  container: { flex: 1 } as ViewStyle,
  contentArea: { flex: 1 } as ViewStyle,
  centerScreen: { flex: 1, justifyContent: 'center', alignItems: 'center' } as ViewStyle,
  cameraContainer: { flex: 1, alignItems: 'center', paddingTop: 20 } as ViewStyle,
  cameraHeader: { marginBottom: 20 } as ViewStyle,
  cameraHeaderText: { fontSize: 20, fontWeight: 'bold' } as TextStyle,
  cameraBox: { width: 300, height: '90%', borderRadius: 20, overflow: 'hidden', backgroundColor: 'black' } as ViewStyle,
  cameraBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', marginTop: 20 } as ViewStyle,
  smallButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#EEE', justifyContent: 'center', alignItems: 'center' } as ViewStyle,
  permissionButton: { padding: 15, backgroundColor: 'green', borderRadius: 10 } as ViewStyle,
  pageContainer: { flex: 1, padding: 20 } as ViewStyle,
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } as ViewStyle,
  headerTitle: { fontSize: 22, fontWeight: 'bold' } as TextStyle,
  card: { padding: 15, borderRadius: 10, marginBottom: 10 } as ViewStyle,
  alertCard: { backgroundColor: '#FFE0E0' } as ViewStyle,
  alertCardTitle: { fontWeight: 'bold', color: 'red' } as TextStyle,
  cardText: { fontSize: 14 } as TextStyle,
  navBar: { flexDirection: 'row', height: 70, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#DDD' } as ViewStyle,
  navLeftRight: { flex: 2, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' } as ViewStyle,
  navItem: { alignItems: 'center' } as ViewStyle,
  navText: { fontSize: 10, color: 'gray' } as TextStyle,
  navTextActive: { fontSize: 10, color: '#1E8449', fontWeight: 'bold' } as TextStyle,
  middleButtonContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' } as ViewStyle,
  middleScanButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', marginTop: -30, borderWidth: 1, borderColor: '#DDD' } as ViewStyle,
});