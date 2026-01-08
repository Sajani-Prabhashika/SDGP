import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { 
  Camera, 
  useCameraDevice, 
  useCameraPermission, 
  useFrameProcessor,
  runAtTargetFps 
} from 'react-native-vision-camera';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { useSharedValue, Worklets } from 'react-native-worklets-core';

export default function ScanScreen() {
  // 1. Permissions & Device Setup
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  
  // 2. Load the AI Model
  const objectDetection = useTensorflowModel(require('../assets/teera_model.tflite'));
  const model = objectDetection.state === "loaded" ? objectDetection.model : undefined;

  // 3. Load the Resize Plugin
  const { resize } = useResizePlugin();

  // 4. UI State
  const [prediction, setPrediction] = useState("Scanning plant...");
  const [confidence, setConfidence] = useState(0);

  // 5. Define Labels (MUST match your folders: 0=First Folder, 1=Second Folder)
  // Since we don't know exact alphabetic order of your folders, update this if it's swapped!
  const LABELS = ["Rough Bark", "Stripe Canker"]; 

  useEffect(() => {
    requestPermission();
  }, []);

  // 6. The Frame Processor (Runs continuously)
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    
    if (model == null) return;

    // Run AI 2 times per second (Saves battery)
    runAtTargetFps(2, () => {
      
      // A. Resize 4K frame to 224x224 (Model Input)
      const resized = resize(frame, {
        scale: { width: 224, height: 224 },
        pixelFormat: 'rgb',
        dataType: 'uint8',
      });

      // B. Run Model
      const output = model.runSync([resized]);
      
      // C. Get Results (Output is an array of probabilities, e.g. [0.1, 0.9])
      const probabilities = output[0]; // This depends on model shape, usually it's the first array

      if (probabilities) {
        // Find which index has the highest score
        // Basic logic to find max value in a JS array (manual loop for Worklets)
        let maxScore = 0;
        let maxIndex = 0;
        
        // Loop through the output array (usually has 2 items for your 2 diseases)
        for (let i = 0; i < probabilities.length; i++) {
            const score = probabilities[i] as number;

            if (score > maxScore) {
                maxScore = score;
                maxIndex = i;
            }
        }

        // D. Update UI
        const resultText = LABELS[maxIndex] || "Unknown";
        const resultConf = Math.round(maxScore * 100);

        Worklets.runOnJS(setPrediction)(resultText);
        Worklets.runOnJS(setConfidence)(resultConf);
      }
    });
  }, [model]);

  if (!hasPermission) return <View style={styles.center}><Text>No Camera Permission</Text></View>;
  if (device == null) return <View style={styles.center}><Text>No Camera Device</Text></View>;
  if (objectDetection.state === "loading") return <ActivityIndicator size="large" color="#00ff00" style={styles.center} />;

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        pixelFormat="yuv"
      />
      
      {/* Result Overlay */}
      <View style={styles.overlay}>
        <Text style={styles.label}>Detected Disease:</Text>
        <Text style={styles.result}>{prediction}</Text>
        <Text style={styles.confidence}>Confidence: {confidence}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5
  },
  label: { fontSize: 14, color: '#555' },
  result: { fontSize: 24, fontWeight: 'bold', color: '#e74c3c', marginTop: 5 },
  confidence: { fontSize: 16, color: '#2ecc71', marginTop: 5, fontWeight: '600' }
});