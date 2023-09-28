import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkUserInfo = async () => {
      try {
        const name = await AsyncStorage.getItem('name');
        const email = await AsyncStorage.getItem('email');
        const phoneNumber = await AsyncStorage.getItem('phoneNumber');

        // Check if any of the user info is missing
        if (name && email && phoneNumber) {
          navigation.navigate('ChatScreen');
        } else {
          navigation.navigate('UserInfoForm');
        }
      } catch (error) {
        console.error('Error checking user info:', error);
        navigation.navigate('UserInfoForm');
      }
    };

    checkUserInfo();
  }, [navigation]);

  return (
    <View>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default SplashScreen;
