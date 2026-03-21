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
import { useTheme } from '../ThemeContext';

const EditProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { theme, isDark } = useTheme();

  const [name, setName] = useState('Wasantha Ranasinghe');
  const [email, setEmail] = useState('wasantha@gmail.com');
  const [phone, setPhone] = useState('+94 77 123 4567');
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

    // Added check for "didCancel" or empty assets
    if (!result.didCancel && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (uri) setProfilePic(uri);
    }
  };

  const handleSave = () => {
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Edit Profile</Text>
        {/* FIXED: Changed <div> to <View> */}
        <View style={{ width: 28 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
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

        <View style={[styles.formContainer, { backgroundColor: theme.card }]}>
          
          <Text style={[styles.inputLabel, { color: theme.subText }]}>Full Name</Text>
          <View style={[styles.inputWrapper, { backgroundColor: theme.background, borderColor: isDark ? '#444' : '#E0E0E0' }]}>
            <Ionicons name="person-outline" size={20} color="#2E7D32" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              value={name}
              onChangeText={setName}
              placeholder="e.g. John Doe"
              placeholderTextColor={theme.subText}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
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
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="example@mail.com"
              placeholderTextColor={theme.subText}
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current?.focus()}
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
              placeholder="+94 77 123 4567"
              placeholderTextColor={theme.subText}
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};