import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Platform,
  ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../ThemeContext';
// Added this to handle moving between screens
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BASE_URL } from '../config';

const { width } = Dimensions.get('window');

export default function CommunityScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>(); // Hook to control navigation
  
  // State for dynamic posts from backend
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Track which posts are liked locally
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/posts`);
      const data = await response.json();
      if (response.ok) {
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const toggleLike = (id: string) => {
    setLikedPosts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  // This function builds each post card in the list
  const renderItem = ({ item }: { item: any }) => {
    const isLiked = likedPosts.includes(item.id);

    return (
      <View style={[styles.postCard, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        {/* Profile info and more options */}
        <View style={styles.postHeader}>
          <Image source={{ uri: item.userImg }} style={styles.avatar} />
          <View style={styles.nameContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.userName, { color: theme.text }]}>{item.userName}</Text>
              {item.isVerified && <Ionicons name="checkmark-circle" size={14} color="#1DA1F2" style={{marginLeft: 4}} />}
            </View>
            <Text style={[styles.userHandle, { color: theme.subText }]}>{item.userHandle} • {item.time}</Text>
          </View>
          <TouchableOpacity style={styles.moreIcon}>
            <Ionicons name="ellipsis-horizontal" size={20} color={theme.subText} />
          </TouchableOpacity>
        </View>

        {/* The actual post message and shared image */}
        <Text style={[styles.postBody, { color: theme.text }]}>{item.postText}</Text>
        
        {item.postImg && (
          <Image source={{ uri: item.postImg }} style={styles.postImage} />
        )}

        {/* Like, Comment, and Share buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => toggleLike(item.id)}>
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={22} 
              color={isLiked ? "#E0245E" : theme.subText} 
            />
            <Text style={[styles.actionText, { color: isLiked ? "#E0245E" : theme.subText }]}>
              {isLiked ? item.likes + 1 : item.likes}
            </Text>
          </TouchableOpacity>

          {/* Only Like/Heart button remains as requested */}
        </View>

        
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      
      {/* Main Header of the screen */}
      <View style={[styles.topNav, { borderBottomColor: theme.border }]}>
        <Image source={{ uri: 'https://i.pravatar.cc/150?u=my_user' }} style={styles.topAvatar} />
        <Text style={[styles.topTitle, { color: theme.text }]}>Teera Community</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* The scrolling feed of plant posts */}
      {loading && posts.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#437C60" />
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshing={loading}
          onRefresh={fetchPosts}
        />
      )}

      {/* IMPORTANT: This is the Plus Button. 
          When clicked, it links to the 'CreatePost' screen we registered in App.tsx.
      */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Ionicons name="add" size={34} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  topAvatar: { width: 32, height: 32, borderRadius: 16 },
  topTitle: { fontSize: 18, fontWeight: '800' },
  
  postCard: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
  },
  postHeader: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 8
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  nameContainer: { flex: 1 },
  userName: { fontWeight: 'bold', fontSize: 16 },
  userHandle: { fontSize: 13 },
  moreIcon: { padding: 5 },

  postBody: {
    paddingHorizontal: 15,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10
  },
  postImage: {
    width: width - 30,
    height: 250,
    borderRadius: 15,
    marginHorizontal: 15,
    resizeMode: 'cover',
    marginBottom: 10
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 5,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center' },
  actionText: { marginLeft: 6, fontSize: 13, fontWeight: '500' },

  commentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 12
  },
  smallAvatar: { width: 28, height: 28, borderRadius: 14, marginRight: 10 },
  inputField: {
    flex: 1,
    paddingHorizontal: 15,
    borderRadius: 20,
    justifyContent: 'center',
    height: 35
  },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    backgroundColor: '#437C60',
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 }
  }
});
