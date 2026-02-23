import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { OpenRouter } from '@openrouter/sdk';

const OPENROUTER_API_KEY = 'AIzaSyDjBIwuscn8X5S--r3RvHprliAoRR0oJq4';

const openRouter = new OpenRouter({
  apiKey: OPENROUTER_API_KEY,
});

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function App() {
  return <SafeAreaView style={{flex: 1}}></SafeAreaView>;
}