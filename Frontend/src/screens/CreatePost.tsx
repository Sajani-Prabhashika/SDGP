import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';

// Standard icons for the app interface
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';

export default function CreatePost() {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  
  // States to hold our post data and the loading spinner status
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // This function handles opening the gallery and picking a photo
  const pickImage = () => {
    // Fixed: Added 'as const' to quality to satisfy TypeScript's strict rules
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1 as const, 
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        // Fixed: Used double quotes so the apostrophe in "didn't" doesn't break the code
        console.log("User didn't pick anything from the gallery");
      } else if (response.errorMessage) {
        Alert.alert('Picker Error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        // Saving the image path so we can show a preview on screen
        setSelectedImage(response.assets[0].uri || null);
      }
    });
  };

  // This runs when the "Post" button is clicked
  const handlePost = async () => {
    // Basic check: Don't let the user post an empty screen
    if (!description.trim() && !selectedImage) {
      Alert.alert("Hold on!", "You need to add a message or a photo to post.");
      return;
    }

    setIsUploading(true);
    
    try {
      const storedUid = await AsyncStorage.getItem('user_uid') || 'test_uid_123';
      
      const formData = new FormData();
      formData.append('uid', storedUid);
      formData.append('postText', description);
      
      if (selectedImage) {
        formData.append('image', {
          uri: selectedImage,
          name: 'post_image.jpg',
          type: 'image/jpeg'
        } as any);
      }

      const response = await fetch(`${BASE_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setIsUploading(false);
        navigation.navigate('Community');
      } else {
        setIsUploading(false);
        Alert.alert("Upload Failed", data.error || "Could not create post.");
      }
    } catch (error) {
      console.error(error);
      setIsUploading(false);
      Alert.alert("Error", "Failed to connect to server.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        {/* Header with navigation and action buttons */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.cancelBtn, { color: theme.text }]}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.postBtn, (!description && !selectedImage) && styles.disabledBtn]} 
            onPress={handlePost}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.postBtnText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Box where user types their status/question */}
          <TextInput
            placeholder="Tell the community about your plants..."
            placeholderTextColor={theme.subText}
            multiline
            style={[styles.input, { color: theme.text }]}
            value={description}
            onChangeText={setDescription}
          />

          {/* If an image is selected, show it. Otherwise, show the upload box. */}
          {selectedImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              {/* Button to clear the photo and try again */}
              <TouchableOpacity 
                style={styles.removeImgBtn} 
                onPress={() => setSelectedImage(null)}
              >
                <Ionicons name="close-circle" size={36} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.uploadPlaceholder, { backgroundColor: theme.card }]} 
              onPress={pickImage}
            >
              <Ionicons name="images-outline" size={50} color="#437C60" />
              <Text style={{ color: theme.subText, marginTop: 12, fontWeight: '500' }}>
                Add a photo to your post
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 15, 
    borderBottomWidth: 0.5 
  },
  cancelBtn: { fontSize: 16, fontWeight: '500' },
  postBtn: { 
    backgroundColor: '#437C60', 
    paddingHorizontal: 22, 
    paddingVertical: 10, 
    borderRadius: 25 
  },
  disabledBtn: { opacity: 0.4 },
  postBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  scrollContent: { padding: 20 },
  input: { 
    fontSize: 19, 
    minHeight: 150, 
    textAlignVertical: 'top'
  },
  imagePreviewContainer: { 
    borderRadius: 20, 
    overflow: 'hidden', 
    marginTop: 15,
    elevation: 4 
  },
  previewImage: { width: '100%', height: 350, resizeMode: 'cover' },
  removeImgBtn: { 
    position: 'absolute', 
    top: 15, 
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20
  },
  uploadPlaceholder: { 
    width: '100%', 
    height: 250, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderStyle: 'dashed', 
    borderWidth: 2, 
    borderColor: '#437C60' 
  }
});
