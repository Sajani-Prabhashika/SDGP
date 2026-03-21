import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert,
  Animated,
  Dimensions
} from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // Navigation එක සඳහා

const { width } = Dimensions.get('window');
const SCAN_BOX_SIZE = width * 0.7; 

const Scanpage = () => {
  const navigation = useNavigation<any>(); // Navigation object එක initialize කිරීම
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flash, setFlash] = useState<'on' | 'off'>('off');
  
  const cameraRef = useRef<Camera>(null); 
  const device = useCameraDevice('back');

  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: SCAN_BOX_SIZE - 4, 
          duration: 2000,             
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,                 
          duration: 2000,             
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [scanLineAnim]);

  // --- Photo එක ගත්තට පස්සේ Result Page එකට යෑම ---
  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto({ flash: flash });
        console.log("Photo saved at:", photo.path);
        
        // Result Screen එකට Navigate කිරීම සහ photo path එක data එකක් විදිහට යැවීම
        navigation.navigate('Result', { photoPath: photo.path });
        
      } catch (error) {
        Alert.alert("Error", "Failed to take photo.");
      }
    }
  };

  const toggleFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  };

  const openGallery = () => {
    Alert.alert("Gallery", "Gallery picker functionality goes here!");
  };

  if (hasPermission === null) return <ActivityIndicator size="large" style={styles.center} />;
  if (hasPermission === false) return <Text style={styles.center}>No access to camera</Text>;
  if (device == null) return <Text style={styles.center}>Camera device not found</Text>;

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true} 
      />

      <View style={styles.overlay}>
        
        {/* Top Bar with Back Button & Flash */}
        <View style={styles.topBar}>
          {/* --- Back Button --- */}
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>

          {/* Flash Button */}
          <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
            <Ionicons 
              name={flash === 'on' ? "flash" : "flash-off"} 
              size={28} 
              color={flash === 'on' ? "#F2C94C" : "#FFF"} 
            />
          </TouchableOpacity>
        </View>

        {/* Scan Box Area */}
        <View style={styles.scanBoxContainer} pointerEvents="none">
          <View style={styles.scanBox}>
            <Animated.View 
              style={[
                styles.scanLine, 
                { transform: [{ translateY: scanLineAnim }] }
              ]} 
            />
          </View>
          <Text style={styles.scanText}>Position plant or code in the frame</Text>
        </View>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.iconButton} onPress={openGallery}>
            <Ionicons name="images-outline" size={32} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.shutterButtonOuter} onPress={takePhoto}>
            <View style={styles.shutterButtonInner} />
          </TouchableOpacity>

          <View style={{ width: 50 }} /> 
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', color: 'white' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Back Button සහ Flash දෙපැත්තට කරන්න
    marginTop: 40,
  },
  scanBoxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  scanBox: {
    width: SCAN_BOX_SIZE,
    height: SCAN_BOX_SIZE,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  scanLine: {
    width: '100%',
    height: 3,
    backgroundColor: '#437C60', 
    elevation: 5,
  },
  scanText: {
    color: '#FFF',
    marginTop: 20,
    fontSize: 14,
    fontWeight: '500',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconButton: {
    width: 50, height: 50,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 25,
  },
  shutterButtonOuter: {
    width: 70, height: 70,
    borderRadius: 35, borderWidth: 4, borderColor: '#FFF',
    justifyContent: 'center', alignItems: 'center',
  },
  shutterButtonInner: {
    width: 54, height: 54,
    borderRadius: 27, backgroundColor: '#FFF',
  },
});

export default Scanpage;