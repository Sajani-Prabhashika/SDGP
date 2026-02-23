import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";

const ProfileScreen = () => {
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  const languages = [
    { label: "English", value: "English" },
    { label: "සිංහල", value: "Sinhala" },
  ];

  const selectLanguage = (lang) => { 
    setSelectedLang(lang);
    setLangModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: "https://via.placeholder.com/110" }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraIcon}>
              <Feather name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>Wasantha Ranasinghe</Text>
          <Text style={styles.email}>wasantha@gmail.com</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Options Section */}
        <View style={styles.optionsSection}>
          
          {/* Language Row with Dropdown Trigger */}
          <TouchableOpacity 
            style={styles.optionRow} 
            onPress={() => setLangModalVisible(true)}
          >
            <View style={styles.optionLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="globe-outline" size={20} color="#407B60" />
              </View>
              <Text style={styles.optionText}>Language</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.selectedLangText}>{selectedLang === 'English' ? 'English' : 'සිංහල'}</Text>
              <Ionicons name="chevron-down" size={18} color="#ccc" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="contrast-outline" size={20} color="#407B60" />
              </View>
              <Text style={styles.optionText}>Theme</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.optionRow, { borderBottomWidth: 0 }]}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#FDECEA' }]}>
                <MaterialIcons name="logout" size={20} color="#E57373" />
              </View>
              <Text style={[styles.optionText, { color: "#E57373" }]}>Log Out</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Language Selection Modal (The Dropdown) */}
      <Modal
        visible={langModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setLangModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownMenu}>
              {languages.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownItem,
                    index !== languages.length - 1 && styles.dropdownDivider
                  ]}
                  onPress={() => selectLanguage(item.value)}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    selectedLang === item.value && { color: '#407B60', fontWeight: 'bold' }
                  ]}>
                    {item.label}
                  </Text>
                  {selectedLang === item.value && (
                    <Ionicons name="checkmark" size={18} color="#407B60" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}><Ionicons name="home-outline" size={22} color="#888" /><Text style={styles.navText}>Home</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem}><Ionicons name="calendar-outline" size={22} color="#888" /><Text style={styles.navText}>Calendar</Text></TouchableOpacity>
        <TouchableOpacity style={styles.scanWrapper}><View style={styles.scanButton}><Feather name="maximize" size={24} color="white" /></View></TouchableOpacity>
        <TouchableOpacity style={styles.navItem}><Ionicons name="notifications-outline" size={22} color="#888" /><Text style={styles.navText}>Alerts</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.activeDot} />
          <Image source={{ uri: "https://via.placeholder.com/26" }} style={styles.profileNavImage} />
          <Text style={[styles.navText, { color: "#407B60", fontWeight: '600' }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#222" },
  profileCard: { alignItems: "center", paddingVertical: 20 },
  imageWrapper: { position: "relative", marginBottom: 15 },
  profileImage: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#E1E1E1", borderWidth: 3, borderColor: "white" },
  cameraIcon: { position: "absolute", bottom: 0, right: 0, backgroundColor: "#407B60", padding: 8, borderRadius: 20 },
  name: { fontSize: 20, fontWeight: "700", color: "#222" },
  email: { fontSize: 14, color: "#888", marginBottom: 15 },
  editButton: { backgroundColor: "#407B60", paddingHorizontal: 25, paddingVertical: 8, borderRadius: 20 },
  editText: { color: "white", fontWeight: "600", fontSize: 14 },
  optionsSection: { backgroundColor: "white", marginHorizontal: 20, borderRadius: 15, paddingHorizontal: 15, marginTop: 10, elevation: 2 },
  optionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  optionLeft: { flexDirection: "row", alignItems: "center" },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#E8F5E9", justifyContent: "center", alignItems: "center", marginRight: 15 },
  optionText: { fontSize: 16, fontWeight: "500", color: "#333" },
  rowRight: { flexDirection: "row", alignItems: "center" },
  selectedLangText: { marginRight: 8, color: "#888", fontSize: 14 },
  
  // Dropdown Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center' },
  dropdownMenu: { width: 200, backgroundColor: 'white', borderRadius: 12, padding: 10, elevation: 5, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 10 },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10 },
  dropdownDivider: { borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dropdownItemText: { fontSize: 16, color: '#333' },

  bottomNav: { position: "absolute", bottom: 0, width: "100%", height: 80, backgroundColor: "white", flexDirection: "row", justifyContent: "space-around", alignItems: "center", borderTopWidth: 1, borderTopColor: "#EEE", paddingBottom: 15 },
  navItem: { alignItems: "center", justifyContent: "center" },
  navText: { fontSize: 10, marginTop: 4, color: "#888" },
  scanWrapper: { marginTop: -35 },
  scanButton: { width: 55, height: 55, borderRadius: 18, backgroundColor: "#407B60", justifyContent: "center", alignItems: "center", elevation: 5 },
  profileNavImage: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: "#407B60" },
  activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#407B60", position: "absolute", top: -8 }
});