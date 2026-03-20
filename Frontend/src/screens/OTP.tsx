import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  ActivityIndicator,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  StatusBar,
  Platform
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

export default function OtpVerificationScreen() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [phoneNumber, setPhoneNumber] = useState<string>("+94 791234567");
  const [isEditingPhone, setIsEditingPhone] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(30); 
  const [isResendActive, setIsResendActive] = useState<boolean>(false);
  
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else {
      setIsResendActive(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds: number): string => {
    const secs = seconds % 60;
    return `00:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOtpChange = (text: string, index: number): void => {
    setError(null);
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1); 
    setOtp(newOtp);

    if (text.length > 0 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number): void => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (): Promise<void> => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }
    setIsVerifying(true);
    setError(null);

    // API Simulation
    setTimeout(() => {
      setIsVerifying(false);
      if (code !== "123456") {
        setError("The code you entered is incorrect.");
      } else {
        Alert.alert("Success", "Phone number verified!");
      }
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      <TouchableOpacity style={styles.backButton} onPress={() => Keyboard.dismiss()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Verification Code</Text>
        <Text style={styles.subtitle}>
          We have sent a 6-digit verification code to
        </Text>
        
        <View style={styles.phoneRow}>
          {isEditingPhone ? (
            <TextInput
              style={styles.phoneInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              autoFocus
              onSubmitEditing={() => setIsEditingPhone(false)}
            />
          ) : (
            <Text style={styles.phoneNumber}>{phoneNumber}</Text>
          )}
          <TouchableOpacity onPress={() => setIsEditingPhone(!isEditingPhone)}>
            <Ionicons name={isEditingPhone ? "checkmark" : "create-outline"} size={18} color="#437C60" style={{marginLeft: 8}} />
          </TouchableOpacity>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <View 
              key={index} 
              style={[
                styles.otpBoxWrapper,
                focusedIndex === index && styles.otpBoxFocused,
                error && styles.otpBoxError
              ]}
            >
              <TextInput
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={styles.otpBox}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                selectionColor="#437C60"
              />
            </View>
          ))}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color="#D32F2F" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.verifyButton, isVerifying && {backgroundColor: '#A5D6A7'}]} 
          onPress={handleVerify}
          disabled={isVerifying}
        >
          {isVerifying ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify Now</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendRow}>
          <Text style={styles.noCodeText}>Didn't receive the code? </Text>
          {isResendActive ? (
            <TouchableOpacity onPress={() => { setTimer(30); setIsResendActive(false); }}>
              <Text style={styles.resendText}>Resend Code</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>Resend in {formatTime(timer)}</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  backButton: { padding: 20, marginTop: Platform.OS === 'android' ? 10 : 0 },
  content: { paddingHorizontal: 30, alignItems: "center" },
  title: { fontSize: 28, fontWeight: "800", color: "#1A1A1A", marginBottom: 10 },
  subtitle: { fontSize: 15, color: "#666", textAlign: "center", lineHeight: 22 },
  phoneRow: { flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 40 },
  phoneNumber: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
  phoneInput: { fontSize: 16, fontWeight: "700", borderBottomWidth: 1, borderBottomColor: "#437C60", padding: 0 },
  
  otpContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 20 },
  otpBoxWrapper: {
    width: (Dimensions.get('window').width - 100) / 6, // Screen එකේ හැටියට boxes වල size හැදෙනවා
    height: 55,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
  },
  otpBoxFocused: { borderColor: "#437C60", backgroundColor: "#FFF" },
  otpBoxError: { borderColor: "#D32F2F", backgroundColor: "#FFEBEE" },
  otpBox: { fontSize: 22, fontWeight: "bold", color: "#1A1A1A", padding: 0 },

  errorContainer: { flexDirection: "row", alignItems: "center", marginBottom: 25, width: "100%" },
  errorText: { color: "#D32F2F", fontSize: 13, marginLeft: 5, fontWeight: "500" },

  verifyButton: {
    backgroundColor: "#437C60",
    width: "100%",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
        ios: { shadowColor: "#437C60", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
        android: { elevation: 5 }
    })
  },
  verifyButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },

  resendRow: { flexDirection: "row", marginTop: 25 },
  noCodeText: { color: "#666", fontSize: 14 },
  resendText: { color: "#437C60", fontWeight: "700", fontSize: 14 },
  timerText: { color: "#999", fontSize: 14, fontWeight: "600" },
});