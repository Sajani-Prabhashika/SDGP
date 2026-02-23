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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Teera AI 🌿</Text></View>
      <FlatList
        ref={flatListRef}
        data={messages}
        inverted
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={item.role === 'user' ? styles.userText : styles.aiText}>{item.content}</Text>
          </View>
        )}
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={inputText} onChangeText={setInputText} multiline />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendButtonText}>Send</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FB' },
  header: { padding: 16, backgroundColor: '#1B5E20', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  bubble: { marginVertical: 6, marginHorizontal: 12, padding: 12, borderRadius: 18, maxWidth: '85%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#1B5E20' },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0E0' },
  userText: { color: '#fff' },
  aiText: { color: '#333' },
  inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#3e8eb6', borderRadius: 20, paddingHorizontal: 16 },
  sendButton: { backgroundColor: '#1B5E20', padding: 10, borderRadius: 20 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
});