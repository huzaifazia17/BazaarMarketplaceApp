import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import Signin from './screens/signin';
import Signup from './screens/signup';
import Home from './screens/home';
import PostProduct from './screens/products';
import Profile from './screens/profile';
import CreateProduct from './screens/createProduct';
import EditProduct from './screens/editProduct';
import ViewProduct from './screens/viewProduct';
import { Ionicons } from '@expo/vector-icons';

// Create navigators for stack and tab navigation
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Define the TabNavigator function that renders the bottom tab navigation
function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home" // Set the initial tab to the Home screen
      screenOptions={({ route }) => ({
        // Configure screen options based on the current route
        tabBarIcon: ({ color, size }) => {
          // Set icons for each tab
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Post') iconName = 'add-circle'; 
          else if (route.name === 'Profile') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#00ADB5', 
        tabBarInactiveTintColor: '#EEEEEE',
        headerShown: false, 
        tabBarStyle: { backgroundColor: '#222831' }, 
      })}
    >
      {/* Define each tab and its corresponding component */}
      <Tab.Screen name="Home" component={ScreenWrapper(Home)} />
      <Tab.Screen name="Post" component={ScreenWrapper(PostProduct)} />
      <Tab.Screen name="Profile" component={ScreenWrapper(Profile)} />
    </Tab.Navigator>
  );
}

// Helper function to wrap screens with a consistent global container style
function ScreenWrapper(ScreenComponent) {
  return (props) => (
    <View style={styles.globalContainer}>
      <ScreenComponent {...props} />
    </View>
  );
}

// Main App component with navigation setup
export default function App() {
  return (
    <NavigationContainer>
      {/* Stack Navigator to manage screen transitions */}
      <Stack.Navigator
        initialRouteName="Signin" // Set the initial screen to Signin
        screenOptions={{ headerShown: false }} // Hide headers for all screens in the stack
      >
        {/* Define each stack screen and its corresponding component */}
        <Stack.Screen name="Signin" component={ScreenWrapper(Signin)} />
        <Stack.Screen name="Signup" component={ScreenWrapper(Signup)} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="CreateProduct" component={ScreenWrapper(CreateProduct)} />
        <Stack.Screen name="EditProduct" component={ScreenWrapper(EditProduct)} />
        <Stack.Screen name="ViewProduct" component={ScreenWrapper(ViewProduct)} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Define global styles for the app
const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#222831',
  },
});
