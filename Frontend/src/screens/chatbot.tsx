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
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Ayubowan! I am Teera, powered by DeepSeek. How can I help you today?' },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!inputText.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: inputText };
    setMessages((prev) => [userMsg, ...prev]);
    const currentInput = inputText;
    setInputText('');
    setLoading(true);

    try {
      const completion = await openRouter.chat.send({
        model: 'deepseek/deepseek-r1:free', 
        messages: [
          { role: 'system', content: 'You are Teera, a helpful AI assistant.' },
          ...messages.slice().reverse().map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: currentInput }
        ],
      } as any);
      const aiResponse = completion.choices[0].message.content as string;
      setMessages((prev) => [{ id: (Date.now() + 1).toString(), role: 'assistant', content: aiResponse }, ...prev]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return <SafeAreaView style={{flex: 1}}></SafeAreaView>; 
}