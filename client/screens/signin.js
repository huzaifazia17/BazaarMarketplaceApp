import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

// Signin component allows users to log in with their email and password
const Signin = ({ navigation }) => {
  const [email, setEmail] = useState(''); // State to manage email input
  const [password, setPassword] = useState(''); // State to manage password input

  // Handle the sign-in process using Firebase authentication
  const handleSignin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password); // Authenticate user

      console.log('User signed in!');
      navigation.navigate('Main'); // Navigate to the main application screen upon success
    } 
    catch (error) {
      console.error(error); // Log error details
      alert('Invalid credentials'); // Show an error alert for invalid login
    }
  };

  // Render the sign-in screen UI
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      {/* Email input field */}
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#EEEEEE" onChangeText={setEmail} value={email} keyboardType="email-address" autoCapitalize="none"/>

      {/* Password input field */}
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#EEEEEE" onChangeText={setPassword} value={password} secureTextEntry/>

      {/* Sign-in button */}
      <TouchableOpacity style={styles.button} onPress={handleSignin}> 
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      {/* Link to the signup screen */}
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styling for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#222831',
  },

  title: {
    fontSize: 34,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#EEEEEE', 
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#393E46',
    marginBottom: 20,
    borderRadius: 8,
    paddingHorizontal: 15,
    color: '#EEEEEE', 
  },

  button: {
    backgroundColor: '#00ADB5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: '#EEEEEE',
    fontWeight: 'bold',
    fontSize: 16,
  },

  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#00ADB5',
    padding: 10
  },
});

export default Signin;