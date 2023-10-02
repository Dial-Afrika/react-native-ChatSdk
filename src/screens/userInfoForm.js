import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { withNavigation } from 'react-navigation';


const apiBaseUrl = 'https://apiprod.dialafrika.com/organisation/';
const registrationUrl = 'https://chatdesk-prod.dialafrika.com/mobilechat/initialize-livechat/without-client/';

const UserInfoForm = ({ navigation, orgId, socketId, onUserDataSaved }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [initialMessage, setInitialMessage] = useState('');

  const handleSave = async () => {
    // Prepare the registration data
    const registrationData = {
      contactName: name,
      contactEmail: email,
      contactMobile: phoneNumber,
      socketId, // Use the socketId passed as a prop
      ticketMessage: initialMessage,
    };

    // Send a POST request to the registration URL
    try {
      const response = await fetch(`${registrationUrl}?organizationId=${orgId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (response.ok) {
        const responseData = await response.json();
        const clientId = responseData.data.clientId;
        console.log('Registration response:', responseData);

        await AsyncStorage.setItem('clientId', clientId);
        onUserDataSaved(); // Call the onUserDataSaved function here
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }

    navigation.navigate('ChatScreen'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text>Name:</Text>
        <TextInput
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
        />

        <Text>Email:</Text>
        <TextInput
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />

        <Text>Phone Number:</Text>
        <TextInput
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
          style={styles.input}
        />

        <Text>Initial Message:</Text>
        <TextInput
          value={initialMessage}
          onChangeText={(text) => setInitialMessage(text)}
          placeholder="Enter a message for the Agent"
          style={styles.input}
        />

        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 24,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  saveButton: {
    backgroundColor: 'orange',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});

export default withNavigation(UserInfoForm); 
