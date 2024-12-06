import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

// ViewProduct component displays the details of a selected product
const ViewProduct = ({ route, navigation }) => {
  const { product } = route.params; // Retrieve the product details from route parameters
  const [userData, setUserData] = useState(null); // State to store user data of the product owner
  const [locationCoords, setLocationCoords] = useState(null); // State to store the product's location coordinates
  const [region, setRegion] = useState(null); // State to manage the map region

  // Fetch user data and coordinates when the component mounts
  useEffect(() => {
    fetchUserData(); // Fetch the product owner's data
    fetchCoordinates(product.location); // Fetch coordinates for the product's location
  }, []);

  // Fetch user information from the backend
  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:3001/api/user/${product.userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data); // Update user data state
      } else {
        console.error('Error fetching user data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Fetch coordinates for the product's location using an external API
  const fetchCoordinates = async (city) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=0bb96fbf1f97407ba07ad06abe10b843`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results[0]) {
          const { lat, lng } = data.results[0].geometry;
          const initialRegion = {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          };
          setLocationCoords({ latitude: lat, longitude: lng }); // Set location coordinates
          setRegion(initialRegion); // Set map region
        }
      } else {
        console.error('Error fetching coordinates');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handlers for zooming in and out on the map
  const zoomIn = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 2,
      longitudeDelta: prevRegion.longitudeDelta / 2,
    }));
  };

  const zoomOut = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  };

  // Render the product details
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Back button to navigate back to the previous screen */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={20} color="#222831" />
        </TouchableOpacity>

        {/* Display product image */}
        <Image source={{ uri: product.imageUrl }} style={styles.productImage} />

        {/* Product title and price */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>${product.price}</Text>
        </View>

        {/* Product description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>

        {/* Product location */}
        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.location}>{product.location}</Text>

        {/* Map displaying the product's location */}
        {region && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={region}
              scrollEnabled={false} // Disable map scrolling to avoid conflicts
            >
              <Marker coordinate={locationCoords} title={product.location} />
            </MapView>
            <View style={styles.zoomControls}>
              <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
                <Text style={styles.zoomText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
                <Text style={styles.zoomText}>-</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Contact information */}
        {userData && (
          <View style={styles.contactContainer}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <Text style={styles.contactInfo}>Phone Number: {userData.phoneNumber}</Text>
          </View>
        )}

        {/* User information */}
        {userData && (
          <View style={styles.userContainer}>
            <FontAwesome name="user-circle" size={50} color="#EEEEEE" style={styles.userIcon} />
            <Text style={styles.userName}>
              {userData.firstName} {userData.lastName}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// Styling for the components
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    backgroundColor: '#222831',
    padding: 20,
  },

  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 1,
    backgroundColor: '#00ADB5',
    padding: 10,
    borderRadius: 8,
  },

  productImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginTop: 60,
    marginBottom: 20,
    resizeMode: 'contain',
  },

  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EEEEEE',
    flex: 1,
    flexWrap: 'wrap',
  },

  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ADB5',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ADB5',
    marginTop: 10,
    marginBottom: 5,
  },

  description: {
    fontSize: 16,
    color: '#EEEEEE',
    marginBottom: 15,
  },

  location: {
    fontSize: 16,
    color: '#EEEEEE',
    marginBottom: 20,
  },

  mapContainer: {
    position: 'relative',
    width: '100%',
    height: 250,
    marginVertical: 20,
  },

  map: {
    flex: 1,
    borderRadius: 8,
  },
  
  zoomControls: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'column',
  },

  zoomButton: {
    backgroundColor: '#000000',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  zoomText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  contactContainer: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
  },

  contactInfo: {
    fontSize: 16,
    color: '#EEEEEE',
  },

  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  userIcon: {
    marginRight: 10,
  },
  
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EEEEEE',
  },
});

export default ViewProduct;