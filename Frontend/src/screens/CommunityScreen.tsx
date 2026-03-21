import React, { useState } from 'react';
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
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../ThemeContext';

const { width } = Dimensions.get('window');


const POSTS_DATA = [
  {
    id: '1',
    userName: 'Kusal Mendis',
    userHandle: '@kusal_plants',
    userImg: 'https://i.pravatar.cc/150?u=kusal',
    postText: 'මගේ ගහේ කොළ ටිකක් කහ පාට වේගෙන එනවා. මේක රෝගයක්ද නැත්නම් වතුර මදි කමද? 🤔 #PlantCare ',
    postImg: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800',
    likes: 124,
    comments: 18,
    time: '2h',
    isVerified: true
  },
  {
    id: '2',
    userName: 'Nimmi Perera',
    userHandle: '@nimmi_garden',
    userImg: 'https://i.pravatar.cc/150?u=nimmi',
    postText: 'Finally my orchids are blooming! 🌸 මෙන්න රහස: මම සතියකට පාරක් පොල්කිරි මිශ්‍රණයක් පාවිච්චි කළා.',
    postImg: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800',
    likes: 342,
    comments: 45,
    time: '5h',
    isVerified: false
  }
];

export default function CommunityScreen() {
  const { theme } = useTheme();
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  const toggleLike = (id: string) => {
    setLikedPosts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const renderItem = ({ item }: { item: typeof POSTS_DATA[0] }) => {
    const isLiked = likedPosts.includes(item.id);

    return (
      <View style={[styles.postCard, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        {/* User Info Header */}
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

        {/* Post Content */}
        <Text style={[styles.postBody, { color: theme.text }]}>{item.postText}</Text>
        
        {item.postImg && (
          <Image source={{ uri: item.postImg }} style={styles.postImage} />
        )}

        {/* Interaction Bar */}
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

          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="chatbubble-outline" size={20} color={theme.subText} />
            <Text style={[styles.actionText, { color: theme.subText }]}>{item.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="repeat-outline" size={22} color={theme.subText} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="share-outline" size={20} color={theme.subText} />
          </TouchableOpacity>
        </View>

        {/* Quick Comment Input */}
        <View style={styles.commentRow}>
           <Image source={{ uri: 'https://i.pravatar.cc/150?u=my_user' }} style={styles.smallAvatar} />
           <View style={[styles.inputField, { backgroundColor: theme.background }]}>
              <TextInput 
                placeholder="Post your reply..." 
                placeholderTextColor={theme.subText}
                style={{ color: theme.text, paddingVertical: 5, fontSize: 13 }}
              />
           </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      
      {/* Community Header */}
      <View style={[styles.topNav, { borderBottomColor: theme.border }]}>
        <Image source={{ uri: 'https://i.pravatar.cc/150?u=my_user' }} style={styles.topAvatar} />
        <Text style={[styles.topTitle, { color: theme.text }]}>Teera Community</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={POSTS_DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Floating Action Button (New Post) */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={30} color="#FFF" />
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
    bottom: 25,
    right: 20,
    backgroundColor: '#437C60',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5
  }
});