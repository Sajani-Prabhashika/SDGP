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
  StatusBar,
} from 'react-native';
import { OpenRouter } from '@openrouter/sdk';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../ThemeContext'; // Assuming your theme context path

const OPENROUTER_API_KEY = 'YOUR_ACTUAL_API_KEY';

const openRouter = new OpenRouter({
  apiKey: OPENROUTER_API_KEY,
});

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function ChatScreen() {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Ayubowan! I am Teera, your plant care assistant. How can I help you today?' },
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

    setMessages((prev) => [userMsg, ...prev]);
    const currentInput = inputText;
    setInputText('');
    setLoading(true);

    try {
      const completion = await openRouter.chat.send({
        model: 'deepseek/deepseek-r1:free', 
        messages: [
          { role: 'system', content: 'You are Teera, a knowledgeable plant care expert. Provide concise, helpful advice.' },
          ...messages.slice().reverse().map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: currentInput }
        ],
      } as any);

      const aiResponse = completion.choices[0].message.content as string;

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse || 'I am sorry, I am having trouble thinking right now.',
      };

      setMessages((prev) => [aiMsg, ...prev]);
    } catch (error) {
      const errorMsg: Message = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: '⚠️ Connection lost. Please check your internet.',
      };
      setMessages((prev) => [errorMsg, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Teera AI 🌿</Text>
        <Text style={[styles.headerStatus, { color: '#2E7D32' }]}>DeepSeek R1 Online</Text>
      </View>

      {/* Chat History */}
      <FlatList
        ref={flatListRef}
        data={messages}
        inverted
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[
            styles.bubble, 
            item.role === 'user' ? 
              [styles.userBubble, { backgroundColor: '#2E7D32' }] : 
              [styles.aiBubble, { backgroundColor: theme.card, borderColor: theme.border }]
          ]}>
            <Text style={[
              styles.messageText, 
              { color: item.role === 'user' ? '#FFF' : theme.text }
            ]}>
              {item.content}
            </Text>
          </View>
        )}
      />

      {/* Input Section */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={[styles.inputContainer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
            placeholder="Ask about plant care..."
            placeholderTextColor={theme.subText}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, { opacity: loading || !inputText.trim() ? 0.6 : 1 }]} 
            onPress={sendMessage}
            disabled={loading || !inputText.trim()}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerStatus: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  listContent: { paddingVertical: 20, paddingHorizontal: 15 },
  bubble: {
    marginVertical: 4,
    padding: 14,
    borderRadius: 20,
    maxWidth: '80%',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 2,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderBottomLeftRadius: 4,
  },
  messageText: { fontSize: 15, lineHeight: 22 },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    paddingBottom: Platform.OS === 'ios' ? 25 : 15,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 45,
    maxHeight: 100,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#2E7D32',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});