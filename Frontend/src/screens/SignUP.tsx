import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform 
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, ScrollView 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';

const SignUpPage: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme, isDark } = useTheme();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? theme.background : '#E8F5E9' }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
      >
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
              value={email}
              onChangeText={setEmail}
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
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#437C60" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={{ color: theme.subText }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      {/* 1. Improved StatusBar Logic */}
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={isDark ? theme.background : '#E8F5E9'} 
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* 2. Added ScrollView to prevent overflow on smaller screens */}
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: theme.subText }]}>Join the Teera community today!</Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.card }]}>
            {/* Inputs remain the same for now, but wrapped in themed containers */}
            <View style={[styles.inputContainer, { backgroundColor: isDark ? theme.background : '#F5F5F5' }]}>
              <Ionicons name="person-outline" size={20} color="#437C60" style={styles.icon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Full Name"
                placeholderTextColor={isDark ? "#888" : "#A8D5BA"}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: isDark ? theme.background : '#F5F5F5' }]}>
              <Ionicons name="mail-outline" size={20} color="#437C60" style={styles.icon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Email Address"
                placeholderTextColor={isDark ? "#888" : "#A8D5BA"}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: isDark ? theme.background : '#F5F5F5' }]}>
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

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.buttonText}>Sign Up</Text>
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
  innerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingVertical: 40 
  },
  headerSection: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 5 },
  card: { width: '100%', padding: 25, borderRadius: 30, elevation: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', height: 55, borderRadius: 15, paddingHorizontal: 15, marginBottom: 15 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  button: { backgroundColor: '#437C60', width: '100%', height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  footerRow: { flexDirection: 'row', marginTop: 25, justifyContent: 'center' },
  loginText: { color: '#437C60', fontWeight: 'bold' },
});

export default SignUpPage;