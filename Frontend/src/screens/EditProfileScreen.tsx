import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Keyboard,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
<<<<<<< HEAD
import { useTheme } from '../ThemeContext';
=======
import { useTheme } from '../ThemeContext'; 
>>>>>>> 25f9e421f8e0dee42a7c331c89b24592e4793029

const EditProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { theme, isDark } = useTheme();

<<<<<<< HEAD
  const [name, setName] = useState('Wasantha Ranasinghe');
  const [email, setEmail] = useState('wasantha@gmail.com');
  const [phone, setPhone] = useState('+94 77 123 4567');
=======
  // Profile States
  const [name, setName] = useState('Wasantha Ranasinghe');
  const [email, setEmail] = useState('wasantha@gmail.com');
  const [phone, setPhone] = useState('+94 77 123 4567');
  const [location, setLocation] = useState('Colombo, Sri Lanka');
>>>>>>> 25f9e421f8e0dee42a7c331c89b24592e4793029
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/120");

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  const handlePhotoPress = () => {
    Alert.alert(
      "Change Profile Picture",
      "Do you want to open the gallery to change your photo?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => openGallery() }
      ]
    );
  };

  const openGallery = async () => {
    const options: any = { mediaType: 'photo', quality: 1 };
    const result = await launchImageLibrary(options);

<<<<<<< HEAD
    // Added check for "didCancel" or empty assets
    if (!result.didCancel && result.assets && result.assets.length > 0) {
=======
    if (result.assets && result.assets.length > 0) {
>>>>>>> 25f9e421f8e0dee42a7c331c89b24592e4793029
      const uri = result.assets[0].uri;
      if (uri) setProfilePic(uri);
    }
  };

  const handleSave = () => {
<<<<<<< HEAD
=======
    // Validation
>>>>>>> 25f9e421f8e0dee42a7c331c89b24592e4793029
    if (!name.trim()) {
      Alert.alert("Error", "Full Name cannot be empty.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    Keyboard.dismiss();
    Alert.alert("Success", "Profile updated successfully!", [
      { text: "OK", onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
<<<<<<< HEAD
=======
      {/* Header */}
>>>>>>> 25f9e421f8e0dee42a7c331c89b24592e4793029
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Edit Profile</Text>
<<<<<<< HEAD
        {/* FIXED: Changed <div> to <View> */}
=======
>>>>>>> 25f9e421f8e0dee42a7c331c89b24592e4793029
        <View style={{ width: 28 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
<<<<<<< HEAD
=======
        {/* Profile Picture */}
>>>>>>> 25f9e421f8e0dee42a7c331c89b24592e4793029
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image 
              source={{ uri: profilePic }} 
              style={[styles.profileImage, { borderColor: theme.card }]} 
            />
            <TouchableOpacity style={styles.cameraButton} onPress={handlePhotoPress}>
              <Ionicons name="camera" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.userNameTitle, { color: theme.text }]}>Hello, {name.split(' ')[0]}!</Text>
        </View>

<<<<<<< HEAD
=======
        {/* Form */}
>>>>>>> 25f9e421f8e0dee42a7c331c89b24592e4793029
        <View style={[styles.formContainer, { backgroundColor: theme.card }]}>
          
          <Text style={[styles.inputLabel, { color: theme.subText }]}>Full Name</Text>
          <View style={[styles.inputWrapper, { backgroundColor: theme.background, borderColor: isDark ? '#444' : '#E0E0E0' }]}>
            <Ionicons name="person-outline" size={20} color="#2E7D32" style={styles.inputIcon} />
            <TextInput
<<<<<<< HEAD
              style={[styles.input, { color: theme.text }]}
              value={name}
              onChangeText={setName}
              placeholder="e.g. John Doe"
              placeholderTextColor={theme.subText}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
=======
              ref={nameRef}
              style={[styles.input, { color: theme.text }]}
              value={name}
              onChangeText={setName}
>>>>>>> 25f9e421f8e0dee42a7c331c89b24592e4793029
            />
          </View>

          <Text style={[styles.inputLabel, { color: theme.subText }]}>Email Address</Text>
          <View style={[styles.inputWrapper, { backgroundColor: theme.background, borderColor: isDark ? '#444' : '#E0E0E0' }]}>
            <Ionicons name="mail-outline" size={20} color="#2E7D32" style={styles.inputIcon} />
            <TextInput
              ref={emailRef}
              style={[styles.input, { color: theme.text }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
<<<<<<< HEAD
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="example@mail.com"
              placeholderTextColor={theme.subText}
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current?.focus()}
=======
>>>>>>> 25f9e421f8e0dee42a7c331c89b24592e4793029
            />
          </View>

          <Text style={[styles.inputLabel, { color: theme.subText }]}>Phone Number</Text>
          <View style={[styles.inputWrapper, { backgroundColor: theme.background, borderColor: isDark ? '#444' : '#E0E0E0' }]}>
            <Ionicons name="call-outline" size={20} color="#2E7D32" style={styles.inputIcon} />
            <TextInput
              ref={phoneRef}
              style={[styles.input, { color: theme.text }]}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
<<<<<<< HEAD
              placeholder="+94 77 123 4567"
              placeholderTextColor={theme.subText}
              returnKeyType="done"
              onSubmitEditing={handleSave}
=======
>>>>>>> 25f9e421f8e0dee42a7c331c89b24592e4793029
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
<<<<<<< HEAD
};
=======
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  imageContainer: { alignItems: 'center', marginTop: 10, marginBottom: 30 },
  imageWrapper: { position: 'relative' },
  profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 4 },
  userNameTitle: { marginTop: 15, fontSize: 22, fontWeight: 'bold' },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 5,
    backgroundColor: '#2E7D32',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    elevation: 5,
  },
  formContainer: {
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 15 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 15,
    height: 55,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1,
>>>>>>> 25f9e421f8e0dee42a7c331c89b24592e4793029
