import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useSignUp } from '@clerk/clerk-expo';

const SignUpScreen = ({ navigation }) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isLoaded, signUp, setActive } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      setPendingVerification(true);
    } catch (err) {
      console.log('SignUp error:', err);
      setError(err.errors?.[0]?.message || 'Sign Up failed');
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    const trimmedCode = code.trim();

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: trimmedCode,
      });

      console.log('Verification code entered:', trimmedCode);
      console.log('Verification status:', signUpAttempt.status);

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        navigation.navigate('Home'); // Change to your main screen name
      } else {
        setError('Verification incomplete, Please try again!!');
      }
    } catch (err) {
      console.log('Verification error:', err);
      setError(
        err?.errors?.[0]?.message ||
        err?.longMessage ||
        'Verification failed'
      );
    }
  };

  const onSignIn = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {pendingVerification ? (
        <>
          <Text>Verify your email</Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder="Enter your verification code"
            keyboardType="numeric"
          />
          {/* {error ? <Text style={styles.error}>{error}</Text> : null} */}
          <TouchableOpacity style={styles.button} onPress={onVerifyPress}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Sign Up</Text>

          <TextInput
            style={styles.input}
            autoCapitalize="none"
            placeholder="Enter Email"
            onChangeText={setEmailAddress}
            value={emailAddress}
          />

          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Enter Password"
            onChangeText={setPassword}
            value={password}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={onSignIn}>
              <Text style={styles.signupText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 14,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#FF3B1D',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  footerText: {
    fontSize: 14,
    color: '#000',
  },
  signupText: {
    fontSize: 14,
    color: '#FF3B1D',
    marginLeft: 4,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
