import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


// Screen Imports
import HomeScreen from './src/screens/homePage'; 
import CalendarScreen from './src/screens/calander';
import ScanScreen from './src/screens/Scanpage';
import NotificationsScreen from './src/screens/Notification'; 
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen'; 
import LoginPage from './src/screens/LoginPage';
import SignUpPage from './src/screens/Signup';
import ResultPage from './src/screens/Result page';


 

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
          <Tab.Screen name="Calendar" component={CalendarScreen} />
          <Tab.Screen name="Scan" component={ScanScreen} />
          <Tab.Screen name="Notification" component={NotificationsScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
          <Tab.Screen name="EditProfile" component={EditProfileScreen} />
          <Tab.Screen name="Login" component={LoginPage} />
          <Tab.Screen name="SignUp" component={SignUpPage} />
          <Tab.Screen name="Result" component={ResultPage} />
          
          
          
          
        </Tab.Navigator>
      </NavigationContainer>
   
  );
}