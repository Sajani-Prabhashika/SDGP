import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teera</Text>
      <Text style={styles.subtitle}>Protect your Cinnamon crops.</Text>

      <View style={styles.card}>
        <Text style={styles.instruction}>
          Detect diseases like Rough Bark and Stripe Canker instantly.
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Scan')}
      >
        <Text style={styles.buttonText}>📷 Scan Your Plant Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1fbf5c',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#15803d',
    marginBottom: 40,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    marginBottom: 40,
    elevation: 2,
  },
  instruction: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#166534',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});