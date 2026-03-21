import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert // Correctly imported Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';

const LoginPage: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme, isDark } = useTheme();
  
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = () => {
  if (username.trim() !== '' && password.trim() !== '') {
    // Replace 'Login' with 'Home' so 'Back' doesn't go back to Login
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  } else {
    Alert.alert("Error", "Please enter your details"); //
  }
};

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? theme.background : '#F0F9F1' }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerSection}>
            <View style={styles.logoCircle}>
              <Ionicons name="leaf" size={50} color="#437C60" />
            </View>
            <Text style={[styles.logoText, { color: theme.text }]}>Teera</Text>
            <Text style={[styles.subLogoText, { color: theme.subText }]}>Care for your plants, everyday.</Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Welcome Back</Text>

            <View style={[styles.inputContainer, { backgroundColor: isDark ? theme.background : '#F9F9F9' }]}>
              <Ionicons name="person-outline" size={20} color="#437C60" style={styles.icon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Username or Email"
                placeholderTextColor={isDark ? "#888" : "#A8D5BA"}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: isDark ? theme.background : '#F9F9F9' }]}>
              <Ionicons name="lock-closed-outline" size={20} color="#437C60" style={styles.icon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Password"
                placeholderTextColor={isDark ? "#888" : "#A8D5BA"}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#437C60" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={{ color: theme.subText }}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signUpText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ... keep your existing styles ...

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  headerSection: { alignItems: 'center', marginBottom: 40 },
  logoCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center',
    elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
    marginBottom: 15,
  },
  logoText: { fontSize: 42, fontWeight: '700', letterSpacing: 1 },
  subLogoText: { fontSize: 14, marginTop: 5 },
  card: {
    width: '100%', padding: 30, borderRadius: 30,
    alignItems: 'center', elevation: 8, shadowColor: '#000',
    shadowOpacity: 0.1, shadowRadius: 15,
  },
  cardTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 25 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    width: '100%', height: 55, borderRadius: 15,
    paddingHorizontal: 15, marginBottom: 15,
    borderWidth: 1, borderColor: 'rgba(67, 124, 96, 0.1)',
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText: { color: '#437C60', fontWeight: '600', fontSize: 13 },
  button: {
    backgroundColor: '#437C60', width: '100%', height: 55,
    borderRadius: 15, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#437C60', shadowOpacity: 0.3, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  footerRow: { flexDirection: 'row', marginTop: 25 },
  signUpText: { color: '#437C60', fontWeight: 'bold' },
});

export default LoginPage;