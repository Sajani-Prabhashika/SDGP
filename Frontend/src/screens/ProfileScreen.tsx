import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  StatusBar
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import { BASE_URL } from '../config';

// Translations & Storage
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme, isDark, toggleTheme } = useTheme(); 
  const { t, i18n } = useTranslation();

  // State for our custom Dropdowns
  const [showThemeDrop, setShowThemeDrop] = useState(false);
  const [showLangDrop, setShowLangDrop] = useState(false);

  // Hardcode the background so it actually goes fully dark!
  const screenBgColor = isDark ? '#121212' : '#F0F9F1';

  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfile();
    });
    fetchProfile();
    return unsubscribe;
  }, [navigation]);

  const fetchProfile = async () => {
    try {
      const storedUid = await AsyncStorage.getItem('user_uid') || 'test_uid_123';
      const res = await fetch(`${BASE_URL}/api/profile/${storedUid}`);
      const data = await res.json();
      if (res.ok) {
        setUserData(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  };

  // Dropdown Action: Change Language
  const handleLanguageSelect = async (lang: string) => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
      try {
        await AsyncStorage.setItem('user-language', lang);
      } catch (error) {
        console.error("Error saving language", error);
      }
    }
    setShowLangDrop(false); // Close dropdown
    
    // Push the preference update to the backend
    try {
      const storedUid = await AsyncStorage.getItem('user_uid') || 'test_uid_123';
      await fetch(`${BASE_URL}/api/profile/${storedUid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang === 'en' ? "English" : "Sinhala" })
      });
    } catch(e) {}
  };

  // Dropdown Action: Change Theme
  const handleThemeSelect = async (selectDark: boolean) => {
    if (isDark !== selectDark) {
      toggleTheme();
    }
    setShowThemeDrop(false); // Close dropdown
    
    // Push the preference update to the backend
    try {
      const storedUid = await AsyncStorage.getItem('user_uid') || 'test_uid_123';
      await fetch(`${BASE_URL}/api/profile/${storedUid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectDark ? "Dark" : "Light" })
      });
    } catch(e) {}
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screenBgColor }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={screenBgColor} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={26} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>{t('profileTitle')}</Text>
          {/* Empty view to keep title centered */}
          <View style={{ width: 26 }} />
        </View>

        {/* --- Profile Info Card --- */}
        <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color="#FFF" />
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>{userData?.full_name || 'Loading...'}</Text>
          <Text style={[styles.userEmail, { color: theme.subText }]}>{userData?.email || ''}</Text>

          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editButtonText}>{t('editProfile')}</Text>
          </TouchableOpacity>
        </View>

        {/* --- Settings Menu --- */}
        <View style={styles.menuContainer}>
          <Text style={[styles.sectionTitle, { color: theme.subText }]}>{t('preferences')}</Text>

          {/* --- THEME DROPDOWN --- */}
          <View style={[styles.dropdownWrapper, { backgroundColor: theme.card }]}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => setShowThemeDrop(!showThemeDrop)}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: 'rgba(67, 124, 96, 0.1)' }]}>
                  <Ionicons name="moon-outline" size={20} color="#437C60" />
                </View>
                {/* Changed the name to "Mood" as requested */}
                <Text style={[styles.menuText, { color: theme.text }]}>
                  Mood: {isDark ? 'Dark' : 'Light'}
                </Text>
              </View>
              <Ionicons name={showThemeDrop ? "chevron-up" : "chevron-down"} size={20} color={theme.subText} />
            </TouchableOpacity>

            {/* Theme Dropdown Options (Kept unchanged) */}
            {showThemeDrop && (
              <View style={[styles.dropdownList, { borderTopColor: isDark ? '#333' : '#EEE' }]}>
                <TouchableOpacity style={styles.dropdownOption} onPress={() => handleThemeSelect(false)}>
                  <Text style={{ color: theme.text, fontSize: 16 }}>Light Theme</Text>
                  {!isDark && <Ionicons name="checkmark" size={20} color="#437C60" />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownOption} onPress={() => handleThemeSelect(true)}>
                  <Text style={{ color: theme.text, fontSize: 16 }}>Dark Theme</Text>
                  {isDark && <Ionicons name="checkmark" size={20} color="#437C60" />}
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* --- LANGUAGE DROPDOWN --- */}
          <View style={[styles.dropdownWrapper, { backgroundColor: theme.card }]}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => setShowLangDrop(!showLangDrop)}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: 'rgba(67, 124, 96, 0.1)' }]}>
                  <Ionicons name="language-outline" size={20} color="#437C60" />
                </View>
                <Text style={[styles.menuText, { color: theme.text }]}>
                  {t('language')}: {i18n.language === 'en' ? 'English' : 'සිංහල'}
                </Text>
              </View>
              <Ionicons name={showLangDrop ? "chevron-up" : "chevron-down"} size={20} color={theme.subText} />
            </TouchableOpacity>

            {/* Language Dropdown Options */}
            {showLangDrop && (
              <View style={[styles.dropdownList, { borderTopColor: isDark ? '#333' : '#EEE' }]}>
                <TouchableOpacity style={styles.dropdownOption} onPress={() => handleLanguageSelect('en')}>
                  <Text style={{ color: theme.text, fontSize: 16 }}>English</Text>
                  {i18n.language === 'en' && <Ionicons name="checkmark" size={20} color="#437C60" />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownOption} onPress={() => handleLanguageSelect('si')}>
                  <Text style={{ color: theme.text, fontSize: 16 }}>සිංහල</Text>
                  {i18n.language === 'si' && <Ionicons name="checkmark" size={20} color="#437C60" />}
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Text style={[styles.sectionTitle, { color: theme.subText, marginTop: 20 }]}>{t('account')}</Text>

          {/* Logout Button */}
          <TouchableOpacity 
            style={[styles.menuItemSingle, { backgroundColor: theme.card, marginTop: 10 }]} 
            onPress={handleLogout}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconWrapper, { backgroundColor: 'rgba(255, 59, 48, 0.1)' }]}>
                <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
              </View>
              <Text style={[styles.menuText, { color: '#FF3B30', fontWeight: 'bold' }]}>{t('logout')}</Text>
            </View>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 20 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  backButton: {
    padding: 5,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  profileCard: {
    alignItems: 'center', padding: 25, borderRadius: 25,
    elevation: 5, shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 10, marginBottom: 30,
  },
  avatarContainer: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#437C60', justifyContent: 'center',
    alignItems: 'center', marginBottom: 15,
  },
  userName: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  userEmail: { fontSize: 14, marginBottom: 20 },
  editButton: {
    backgroundColor: '#437C60', paddingVertical: 10, paddingHorizontal: 25,
    borderRadius: 20,
  },
  editButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  menuContainer: { width: '100%' },
  sectionTitle: { fontSize: 14, fontWeight: '600', textTransform: 'uppercase', marginBottom: 10, marginLeft: 10 },
  
  // Dropdown Wrappers
  dropdownWrapper: {
    borderRadius: 20,
    marginBottom: 12,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5,
    overflow: 'hidden', 
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 15,
  },
  menuItemSingle: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 15, borderRadius: 20, marginBottom: 12,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5,
  },
  dropdownList: {
    borderTopWidth: 1,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  menuText: { fontSize: 16, fontWeight: '500' },
});

export default ProfileScreen;
