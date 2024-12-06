import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { auth } from '../firebase';

// Component to display the user's own product listings
const Products = ({ navigation }) => {
  const [products, setProducts] = useState([]); // State to store the list of user's products
  const userId = auth.currentUser.uid; // Get the logged-in user's ID

  // Function to fetch products from the server for the current user
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `http://10.0.2.2:3001/api/products?userId=${userId}`
      );
      const data = await response.json();
      setProducts(data); // Update the state with the fetched products
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Refresh the product list when the component comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  // Navigate to the EditProduct screen with the selected product's details
  const handleProductPress = (product) => {
    navigation.navigate('EditProduct', { product });
  };

  // Render individual product items in the FlatList
  const renderProduct = ({ item }) => (
    <TouchableOpacity onPress={() => handleProductPress(item)}>
      <View style={styles.productBox}>
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{item.title}</Text>
          <Text style={styles.productDescription}>{item.description}</Text>
          <Text style={styles.productPrice}>${item.price}</Text>
        </View>

        <Image
          source={{ uri: item.imageUrl }}
          style={styles.productImage}
          onError={() => console.log('Error loading image:', item.imageUrl)}
        />
      </View>
    </TouchableOpacity>
  );

  // Render the main UI for the user's product listings
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Listings</Text>

      {/* Display a message if no listings are available or render the product list */}
      {products.length === 0 ? (
        <Text style={styles.noListings}>No listings</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id} // Unique key for each product
          contentContainerStyle={styles.list}
        />
      )}

      {/* Button to navigate to the CreateProduct screen */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateProduct')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styling for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },

  title: {
    fontSize: 34,
    marginBottom: 20,
    paddingTop: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#EEEEEE',
  },

  noListings: {
    fontSize: 20,
    color: '#EEEEEE',
    textAlign: 'center',
    marginTop: 50,
  },

  list: {
    paddingHorizontal: 20,
  },

  productBox: {
    flexDirection: 'row',
    backgroundColor: '#393E46',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },

  productInfo: {
    flex: 1,
    marginRight: 10,
  },

  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EEEEEE',
  },

  productDescription: {
    fontSize: 14,
    color: '#EEEEEE',
    marginVertical: 5,
  },

  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ADB5',
  },

  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },

  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#00ADB5',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    color: '#000000',
    fontSize: 35,
  },
});

export default Products;