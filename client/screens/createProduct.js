import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../firebase';

// Component for creating a new product
const CreateProduct = ({ navigation }) => {
  // States to hold form data
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // Function to pick an image from the device gallery
  const pickImageAsync = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera roll permissions are required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Function to capture an image using the device camera
  const takePhotoAsync = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permissions are required!');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Function to validate inputs and save the product
  const handleSaveProduct = async () => {
    // Input validation checks
    if (!title.trim() || !description.trim() || !location.trim()) {
      Alert.alert('Validation Error', 'All fields must be filled.');
      return;
    }
    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      Alert.alert('Validation Error', 'Enter a valid price.');
      return;
    }
    if (!selectedImage) {
      Alert.alert('Validation Error', 'Please select an image.');
      return;
    }

    // Forming the product data with an image for upload
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', parseFloat(price));
    formData.append('location', location);
    formData.append('userId', auth.currentUser.uid);
    formData.append('image', {
      uri: selectedImage,
      name: selectedImage.split('/').pop(),
      type: `image/${selectedImage.split('.').pop()}`,
    });

    try {
      // Sending the product data to the server
      const response = await fetch('http://10.0.2.2:3001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });

      if (response.ok) 
      {
        Alert.alert('Success', 'Product added successfully.');
        navigation.goBack(); // Navigate back after success
      } 
      else {
        Alert.alert('Error', 'Failed to add the product.');
      }
    } 
    catch (error) {
      Alert.alert('Error', 'Server error occurred.');
    }
  };

  // Function to cancel and navigate back
  const handleCancel = () => {
    navigation.goBack();
  };

  // UI for the Create Product form
  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Ad</Text>

      {/* Form inputs */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} placeholder="Title" placeholderTextColor="#EEEEEE" value={title} onChangeText={setTitle}/>

        <Text style={styles.label}>Description</Text>
        <TextInput style={styles.input} placeholder="Description" placeholderTextColor="#EEEEEE" value={description} onChangeText={setDescription}/>

        <Text style={styles.label}>Price</Text>
        <TextInput style={styles.input} placeholder="Price" placeholderTextColor="#EEEEEE" keyboardType="numeric" value={price} onChangeText={setPrice}/>

        <Text style={styles.label}>Location</Text>
        <TextInput style={styles.input} placeholder="Location" placeholderTextColor="#EEEEEE" value={location} onChangeText={setLocation}/>

        {/* Image selection buttons */}
        <View style={styles.imageButtonContainer}>
          <TouchableOpacity onPress={pickImageAsync} style={styles.imageButton}>
            <Text style={styles.imageButtonText}>Select Image</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={takePhotoAsync} style={styles.imageButton}>
            <Text style={styles.imageButtonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Preview selected image */}
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
        )}
      </ScrollView>

      {/* Save and Cancel buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProduct}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styling for components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },

  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#EEEEEE',
    textAlign: 'center',
    paddingTop: 40,
  },

  content: {
    padding: 20,
  },

  label: {
    fontSize: 16,
    color: '#00ADB5',
  },

  input: {
    backgroundColor: '#393E46',
    color: '#EEEEEE',
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
  },
  
  imageButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  imageButton: {
    backgroundColor: '#00ADB5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },  

  imageButtonText: {
    color: '#EEEEEE',
    fontSize: 16,
    fontWeight: 'bold',
  },

  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
    resizeMode: 'contain',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  saveButton: {
    backgroundColor: '#00ADB5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },

  saveButtonText: {
    color: '#EEEEEE',
    fontSize: 16,
    fontWeight: 'bold',
  },

  cancelButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },

  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateProduct;