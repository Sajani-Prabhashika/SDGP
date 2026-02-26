import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Teera</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sign in with email.</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#95c69c"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#95c69c"
          secureTextEntry={true} 
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a5bb72',
    alignItems: 'center',
    justifyContent: 'center',
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
    elevation: 4, // Android වල පෙනෙන shadow එක
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
  },
  button: {
    backgroundColor: '#437C60',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default LoginPage;
