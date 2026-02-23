import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const EditProfileScreen = () => {
  const [name, setName] = useState("Wasantha Ranasinghe");
  const [email, setEmail] = useState("wasantha@gmail.com");
  const [birthdate, setBirthdate] = useState("04-July-1965");
  const [location, setLocation] = useState("Galle");

  // Refs for focusing inputs
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const birthdateRef = useRef(null);
  const locationRef = useRef(null);

  const handleSave = () => {
    Keyboard.dismiss();
    alert("Profile Updated Successfully!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        {/* Profile Image Section */}
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: "https://via.placeholder.com/110" }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraIcon}>
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Input Fields Section */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Public Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={nameRef}
                style={styles.textInput}
                value={name}
                onChangeText={setName}
              />
              <TouchableOpacity onPress={() => nameRef.current?.focus()}>
                <Ionicons name="pencil" size={16} color="#3A7D58" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Private Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail Address</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={emailRef}
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => emailRef.current?.focus()}>
                <Ionicons name="pencil" size={16} color="#3A7D58" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Birthdate</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={birthdateRef}
                style={styles.textInput}
                value={birthdate}
                onChangeText={setBirthdate}
              />
              <TouchableOpacity onPress={() => birthdateRef.current?.focus()}>
                <Ionicons name="pencil" size={16} color="#3A7D58" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={locationRef}
                style={styles.textInput}
                value={location}
                onChangeText={setLocation}
              />
              <TouchableOpacity onPress={() => locationRef.current?.focus()}>
                <Ionicons name="pencil" size={16} color="#3A7D58" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Save Button - Styled like OTP Verify Button */}
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#222",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  imageWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#C5E1A5", // Matching OTP box light green
    borderWidth: 2,
    borderColor: "#81C784",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#407B60", // Matching OTP button green
    borderRadius: 15,
    padding: 6,
  },
  form: {
    width: "100%",
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    marginBottom: 15,
    letterSpacing: 1,
  },
  inputGroup: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  label: {
    fontSize: 13,
    color: "#407B60",
    fontWeight: "600",
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#222",
    paddingVertical: 4,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#407B60",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    alignSelf: "center",
    // Shadows matching your OTP button
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
});