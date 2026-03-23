import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, 
  Alert, ActivityIndicator, ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import { BASE_URL } from '../config';

const SignUpPage: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme, isDark } = useTheme();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNo, setPhoneNo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !phoneNo.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);

    // 10-second timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      console.log('Attempting signup to:', `${BASE_URL}/api/signup`);

      const response = await fetch(`${BASE_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          phone_number: phoneNo.trim(),
          full_name: name.trim()
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      console.log('Signup response:', response.status, data);

      if (response.ok) {
        Alert.alert("Success! 🎉", data.message || "Account created successfully.", [
          { text: "Go to Login", onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert("Signup Failed", data.error || data.message || "An unknown error occurred.");
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('Signup error:', error);

      if (error.name === 'AbortError') {
        Alert.alert(
          "Connection Timeout",
          `Could not reach the server at ${BASE_URL}.\n\nMake sure:\n• The backend is running (python app.py)\n• Your phone and computer are on the same Wi-Fi`
        );
      } else {
        Alert.alert(
          "Network Error",
          `Could not connect to the server.\n\nDetails: ${error.message}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? theme.background : '#E8F5E9' }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.headerSection}>
            <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: theme.subText }]}>Join the Teera community today!</Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.card }]}>
            
            {/* Full Name */}
            <View style={[styles.inputContainer, { backgroundColor: isDark ? theme.background : '#F5F5F5' }]}>
              <Ionicons name="person-outline" size={20} color="#437C60" style={styles.icon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Full Name"
                placeholderTextColor={isDark ? "#888" : "#A8D5BA"}
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
            </View>

            {/* Email */}
            <View style={[styles.inputContainer, { backgroundColor: isDark ? theme.background : '#F5F5F5' }]}>
              <Ionicons name="mail-outline" size={20} color="#437C60" style={styles.icon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Email Address"
                placeholderTextColor={isDark ? "#888" : "#A8D5BA"}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>

            {/* Phone Number */}
            <View style={[styles.inputContainer, { backgroundColor: isDark ? theme.background : '#F5F5F5' }]}>
              <Ionicons name="call-outline" size={20} color="#437C60" style={styles.icon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Phone Number"
                placeholderTextColor={isDark ? "#888" : "#A8D5BA"}
                keyboardType="phone-pad"
                value={phoneNo}
                onChangeText={setPhoneNo}
                editable={!loading}
              />
            </View>

            {/* Password */}
            <View style={[styles.inputContainer, { backgroundColor: isDark ? theme.background : '#F5F5F5' }]}>
              <Ionicons name="lock-closed-outline" size={20} color="#437C60" style={styles.icon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Password"
                placeholderTextColor={isDark ? "#888" : "#A8D5BA"}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#437C60" />
              </TouchableOpacity>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={[styles.buttonText, { marginLeft: 10 }]}>Creating Account...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={{ color: theme.subText }}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 40 },
  headerSection: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 5 },
  card: { width: '100%', padding: 25, borderRadius: 30, elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 15 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', height: 55, borderRadius: 15, paddingHorizontal: 15, marginBottom: 15 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  button: { backgroundColor: '#437C60', width: '100%', height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonDisabled: { backgroundColor: '#7aaa91', opacity: 0.8 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  footerRow: { flexDirection: 'row', marginTop: 25, justifyContent: 'center' },
  loginText: { color: '#437C60', fontWeight: 'bold' },
});

export default SignUpPage;
