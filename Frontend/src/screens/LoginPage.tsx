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

// This is a Functional Component written in TypeScript (TSX)
const App: React.FC = () => {
  // 'useState' stores what the user types
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <SafeAreaView style={styles.container}>
      {/* This makes the status bar (clock/battery) look nice */}
      <StatusBar barStyle="dark-content" />

      <Text style={styles.logoText}>Teera</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sign in with email.</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true} // Hides the password dots
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 50,
    color: '#345E41',
    marginBottom: 40,
    fontWeight: '300',
  },
  card: {
    backgroundColor: '#F0FEE3',
    width: '85%',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    height: 50,
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
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;