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
} from 'react-native';

// 1. Import the OpenRouter SDK
import { OpenRouter } from '@openrouter/sdk';

// 2. Initialize OpenRouter (Removed defaultHeaders to fix TS error)
// Replace this string with your actual sk-or-v1-... key
const OPENROUTER_API_KEY = 'YOUR_ACTUAL_OPENROUTER_API_KEY_HERE';

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

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
    };

    // Add user message to the UI immediately
    setMessages((prev) => [userMsg, ...prev]);
    const currentInput = inputText;
    setInputText('');
    setLoading(true);

    try {
      // 3. The API Call (Using the FREE DeepSeek model and bypassing TS strict types with "as any")
      const completion = await openRouter.chat.send({
        model: 'deepseek/deepseek-r1:free', 
        messages: [
          { role: 'system', content: 'You are Teera, a helpful AI assistant.' },
          ...messages.slice().reverse().map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: currentInput }
        ],
        stream: false,
      } as any);

      // 4. Extract Response (Forcing TS to recognize it as a string)
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Teera AI 🌿</Text>
      </View>

      {/* Chat List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        inverted // Keeps latest messages at the bottom
        keyExtractor={(item) => item.id}
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

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Message Teera..."
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

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FB' },
  header: {
    padding: 16,
    backgroundColor: '#1B5E20',
    alignItems: 'center',
    elevation: 4,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
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
    backgroundColor: '#FFFFFF',
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
    maxHeight: 100,
    backgroundColor: '#F1F3F4',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#1B5E20',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
});