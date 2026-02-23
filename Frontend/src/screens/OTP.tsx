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
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function OtpVerificationScreen() {
  // Define state with explicit types
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [phoneNumber, setPhoneNumber] = useState<string>("+94 791234567");
  const [isEditingPhone, setIsEditingPhone] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(30); 
  const [isResendActive, setIsResendActive] = useState<boolean>(false);

  // Type the refs to hold TextInput instances or null
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendActive(true);
      // @ts-ignore - interval is handled by clearInterval
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Format timer (seconds: number) -> returns string
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes} : ${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleResend = (): void => {
    setTimer(30);
    setIsResendActive(false);
    Alert.alert("Sent", "New code sent successfully!");
  };

  const handleVerify = (): void => {
    const code = otp.join("");
    if (code.length < 6) {
      Alert.alert("Error", "Please enter the complete 6-digit code");
      return;
    }
    Alert.alert("Success", `Verifying code: ${code}`);
  };

  const handleOtpChange = (text: string, index: number): void => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // Auto-focus previous input on clear
    if (text.length === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number): void => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const toggleEditPhone = (): void => {
    if (isEditingPhone) Keyboard.dismiss();
    setIsEditingPhone(!isEditingPhone);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>We Just sent an SMS</Text>
        <Text style={styles.subtitle}>Enter the Security code we sent to</Text>

        <View style={styles.phoneContainer}>
          {isEditingPhone ? (
            <TextInput
              style={styles.phoneInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              autoFocus={true}
              onSubmitEditing={() => setIsEditingPhone(false)}
            />
          ) : (
            <Text style={styles.phoneNumber}>{phoneNumber}</Text>
          )}

          <TouchableOpacity onPress={toggleEditPhone} style={styles.iconButton}>
            <Ionicons
              name={isEditingPhone ? "checkmark-circle" : "pencil"}
              size={18}
              color="#3A7D58"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* OTP Inputs */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.otpBox}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            selectionColor="#3A7D58"
          />
        ))}
      </View>

      {/* Verify Button */}
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>verify</Text>
      </TouchableOpacity>

      {/* Footer / Resend Timer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Didn't receive code ?</Text>
        <View style={styles.resendContainer}>
          <TouchableOpacity onPress={handleResend} disabled={!isResendActive}>
            <Text
              style={[
                styles.resendLink,
                { opacity: isResendActive ? 1 : 0.5 },
              ]}
            >
              Resend
            </Text>
          </TouchableOpacity>
          <Text style={styles.timer}> - {formatTime(timer)}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "#222",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "#222",
    marginBottom: 8,
    textAlign: "center",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 30,
  },
  phoneNumber: {
    fontSize: 15,
    color: "#222",
    fontWeight: "600",
  },
  phoneInput: {
    fontSize: 15,
    color: "#222",
    fontWeight: "600",
    borderBottomWidth: 1,
    borderBottomColor: "#3A7D58",
    paddingVertical: 0,
    minWidth: 120,
    textAlign: "center",
  },
  iconButton: {
    marginLeft: 10,
    padding: 4,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 50,
  },
  otpBox: {
    width: 42,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "#C5E1A5",
    borderColor: "#81C784",
    fontSize: 20,
    color: "#1B4D3E",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#407B60",
    width: "60%",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "400",
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#222",
    marginBottom: 6,
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  resendLink: {
    color: "#004D40",
    fontWeight: "bold",
    fontSize: 14,
  },
  timer: {
    color: "#222",
    fontSize: 14,
  },
});