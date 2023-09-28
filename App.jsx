import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './src/screens/splashScreen'; // Import your SplashScreen component
import UserInfoForm from './src/screens/userInfoForm'; // Import your UserInfoForm component
import ChatScreen from './src/screens/chatScreen'; // Import your ChatScreen component

const apiBaseUrl = 'https://apiprod.dialafrika.com/organisation/';
const chatBaseUrl = 'https://chatdesk-prod.dialafrika.com/mobilechat/';
const socketUrl = 'https://chatdesk-prod.dialafrika.com';

export default function App() {
  const [orgId, setOrgId] = useState(null);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [socketId, setSocketId] = useState(null); // Define socketId here

  useEffect(() => {
    const fetchOrgIdAndSocketId = async () => {
      const apiKey = 'a191dc5a-d5be-49f3-90b6-2d1b22d9c9cf'; // Replace with the actual API key
      try {
        const response = await fetch(apiBaseUrl + apiKey);
        if (response.ok) {
          const data = await response.json();

          // Store the organization ID in AsyncStorage
          await AsyncStorage.setItem('orgId', data.id);

          setOrgId(data.id);

          // Establish a socket connection here
          const socket = io(socketUrl, {
            // Additional socket connection configuration
          });

          socket.on('connect', () => {
            // Capture the socket ID after a successful connection
            const socketId = socket.id;

            // Store the socket ID in AsyncStorage and set it in state
            AsyncStorage.setItem('socketId', socketId);
            setSocketId(socketId); // Set socketId in state
          });
        } else {
          console.error('Failed to fetch organization ID');
        }
      } catch (error) {
        console.error('Error fetching organization ID:', error);
      }
    };

    fetchOrgIdAndSocketId();
  }, []);

  useEffect(() => {
    const checkUserData = async () => {
      try {
        // Check if user data is already stored
        const name = await AsyncStorage.getItem('name');
        const email = await AsyncStorage.getItem('email');
        const phoneNumber = await AsyncStorage.getItem('phoneNumber');

        if (name && email && phoneNumber) {
          setUserDataLoaded(true);
        } else {
          setUserDataLoaded(false);
        }
      } catch (error) {
        console.error('Error checking user data:', error);
      }
    };

    checkUserData();
  }, []);

  if (!orgId) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!userDataLoaded) {
    return (
      <UserInfoForm
          onUserDataSaved={() => setUserDataLoaded(true)}
          orgId={orgId}
          socketId={socketId}
      />

    );
  }

  return <ChatScreen />;
}
