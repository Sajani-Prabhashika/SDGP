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
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginPage: React.FC = () => {
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    // For now, just navigate to Home
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>Teera</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Sign in with email.</Text>

              <TextInput
                style={styles.input}
                placeholder="Username or Email"
                placeholderTextColor="#95c69c"
                autoCapitalize="none"
                autoCorrect={false}
                value={username}
                onChangeText={setUsername}
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#95c69c"
                secureTextEntry={true} 
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log in</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={{ marginTop: 20 }} 
                onPress={() => navigation.navigate('SignUp')}
              >
                <Text style={{ color: '#345E41', fontSize: 14 }}>
                  Don't have an account? <Text style={{ fontWeight: 'bold' }}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a5bb72',
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoText: {
    fontSize: 55,
    color: '#345E41',
    fontWeight: '300',
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#F0FEE3',
    width: '85%',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    // Android Shadow
    elevation: 4,
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#A8D5BA',
    color: '#000',
  },
  button: {
    backgroundColor: '#437C60',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LoginPage;