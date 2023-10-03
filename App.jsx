import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/splashScreen';
import UserInfoForm from './src/screens/userInfoForm';
import ChatScreen from './src/screens/chatScreen';
import TicketHistoryScreen from './src/screens/ticketHistoryScreen';


const apiBaseUrl = 'https://apiprod.dialafrika.com/organisation/';
const chatBaseUrl = 'https://chatdesk-prod.dialafrika.com/mobilechat/';
const socketUrl = 'https://chatdesk-prod.dialafrika.com';

const Stack = createNativeStackNavigator();

export default function App() {
  const [orgId, setOrgId] = useState(null);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [socketId, setSocketId] = useState(null);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch organization ID
      const apiKey = 'a191dc5a-d5be-49f3-90b6-2d1b22d9c9cf'; // Replace with the actual API key
      try {
        const response = await fetch(apiBaseUrl + apiKey);
        if (response.ok) {
          const data = await response.json();
          await AsyncStorage.setItem('orgId', data.id.toString());
          setOrgId(data.id);

          // Establish a socket connection
          const socket = io(socketUrl, {
            // Additional socket connection configuration
          });

          socket.on('connect', () => {
            const socketId = socket.id;
            AsyncStorage.setItem('socketId', socketId);
            setSocketId(socketId);
          });
        } else {
          console.error('Failed to fetch organization ID');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      // Check if user data exists in AsyncStorage
      try {
        const name = await AsyncStorage.getItem('name');
        const email = await AsyncStorage.getItem('email');
        const phoneNumber = await AsyncStorage.getItem('phoneNumber');
        const clientId = await AsyncStorage.getItem('clientId');

        if (name && email && phoneNumber && clientId) {
          // All user data is available, set userDataLoaded to true
          setUserDataLoaded(true);
          setClientId(clientId); // Set clientId if it exists
        }
      } catch (error) {
        console.error('Error checking user data or clientId:', error);
      }
    };

    fetchData();
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

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UserInfoForm">
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="UserInfoForm">
          {props => (
            <UserInfoForm
              {...props}
              navigation={props.navigation} // Pass the navigation prop
              orgId={orgId}
              socketId={socketId}
              onUserDataSaved={() => {
                setUserDataLoaded(true);
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="ChatScreen">
          {props => (
            <ChatScreen {...props} clientId={clientId} socketId={socketId} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="TicketHistoryScreen"
          component={TicketHistoryScreen}
          initialParams={{ orgId: orgId, clientId: clientId }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
  
}

