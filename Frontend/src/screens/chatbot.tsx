import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import { OpenRouter } from '@openrouter/sdk';

// 1. Initialize OpenRouter
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

  // Function to Clear Chat (Your 10th Commit Change)
  const clearChat = () => {
    setMessages([
      { id: Date.now().toString(), role: 'assistant', content: 'Chat cleared. How can I help you now?' },
    ]);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
    };

    setMessages((prev) => [userMsg, ...prev]);
    const currentInput = inputText;
    setInputText('');
    setLoading(true);

    try {
      const completion = await openRouter.chat.send({
        model: 'deepseek/deepseek-r1:free',
        messages: [
          { role: 'system', content: 'You are Teera, a helpful AI assistant.' },
          ...messages.slice().reverse().map((m) => ({ role: m.role, content: m.content })),
          { role: 'user', content: currentInput },
        ],
        stream: false,
      } as any);

      const aiResponse = completion.choices[0].message.content as string;

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse || 'I am sorry, I received an empty response.',
      };

      setMessages((prev) => [aiMsg, ...prev]);
    } catch (error) {
      console.error("API Error:", error);
      const errorMsg: Message = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: '⚠️ Connection failed. Please check your internet or API key.',
      };
      setMessages((prev) => [errorMsg, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Updated Header with Clear Button */}
      <View style={styles.header}>
        <View style={{ width: 60 }} /> {/* Spacer to center title */}
        <Text style={styles.headerTitle}>Teera AI 🌿</Text>
        <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Background Image Wrap */}
      <ImageBackground
        source={require('../../src/assets/background.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          inverted
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={[
              styles.bubble,
              item.role === 'user' ? styles.userBubble : styles.aiBubble
            ]}>
              <Text style={item.role === 'user' ? styles.userText : styles.aiText}>
                {item.content}
              </Text>
            </View>
          )}
        />
      </ImageBackground>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        verticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Message Teera..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, { opacity: loading ? 0.5 : 1 }]}
            onPress={sendMessage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.sendButtonText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FB' },
  header: {
    padding: 16,
    backgroundColor: '#1B5E20',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  clearButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  clearButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  backgroundImage: { flex: 1, width: '100%' },
  listContent: { paddingVertical: 10 },
  bubble: {
    marginVertical: 6,
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 18,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#1B5E20',
    borderBottomRightRadius: 2,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderBottomLeftRadius: 2,
  },
  userText: { color: '#fff', fontSize: 16 },
  aiText: { color: '#333', fontSize: 16 },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ECEFF1',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    backgroundColor: '#F1F3F4',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 8,
    color: '#000'
  },
  sendButton: {
    backgroundColor: '#1B5E20',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
});