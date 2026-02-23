import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ViewStyle, TextStyle } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';

const OtpScreen: React.FC = () => {
  // Using a Ref in TS allows VS Code to know exactly what methods are available
  const otpInput = useRef<OTPTextInput>(null);

  const handleVerify = () => {
    // Logic for verification
    console.log("Verifying...");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>We Just sent an SMS</Text>
        <Text style={styles.subtitle}>
          Enter the Security code we sent to{"\n"}
          <Text style={styles.phoneNumber}>+94 791234567 ✏️</Text>
        </Text>

        <OTPTextInput 
          ref={otpInput}
          handleTextChange={(code: string) => console.log(code)}
          inputCount={6}
          tintColor="#6A9C78"
          offTintColor="#C1D8C3"
          containerStyle={styles.otpContainer}
          textInputStyle={styles.otpInput as TextStyle}
        />

        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>verify</Text>
        </TouchableOpacity>

        <Text style={styles.resendText}>Didn't receive code ?</Text>
        <Text style={styles.timerText}>
          <Text style={styles.resendLink}>Resend</Text>  - 00 : 36
        </Text>
      </View>
    </SafeAreaView>
  );
};

// Defining styles with types ensures layout consistency
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' } as ViewStyle,
  content: { flex: 1, alignItems: 'center', paddingTop: 80, paddingHorizontal: 20 } as ViewStyle,
  title: { fontSize: 18, fontWeight: '500', marginBottom: 10 } as TextStyle,
  subtitle: { textAlign: 'center', color: '#333', marginBottom: 30, lineHeight: 22 } as TextStyle,
  phoneNumber: { fontWeight: 'bold' } as TextStyle,
  otpContainer: { marginBottom: 40 } as ViewStyle,
  otpInput: {
    backgroundColor: '#C1D8C3',
    borderRadius: 8,
    borderWidth: 1,
    width: 45,
    height: 55,
    textAlign: 'center',
  } as TextStyle,
  button: {
    backgroundColor: '#4A7664',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 25,
    marginBottom: 20,
  } as ViewStyle,
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' } as TextStyle,
  resendText: { color: '#333', marginBottom: 5 } as TextStyle,
  resendLink: { color: '#1A5D44', fontWeight: 'bold' } as TextStyle,
  timerText: { color: '#333' } as TextStyle
});

export default OtpScreen;