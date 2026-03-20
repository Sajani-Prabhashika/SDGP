import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


// Screen Imports
import HomeScreen from './src/screens/homePage'; 


import EditProfileScreen from './src/screens/EditProfileScreen'; 

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          backBehavior="history" 
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' }, 
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          
          
        </Tab.Navigator>
      </NavigationContainer>
   
  );
}