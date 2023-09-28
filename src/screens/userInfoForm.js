import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const apiBaseUrl = 'https://apiprod.dialafrika.com/organisation/';
const registrationUrl = 'https://chatdesk-prod.dialafrika.com/mobilechat/initialize-livechat/without-client/';

const UserInfoForm = ({  onUserDataSaved, orgId, socketId }) => { // Accept socketId as a prop
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
        // Registration was successful, you can handle the response here
        const responseData = await response.json();
        console.log('Registration response:', responseData);
  
        // Notify the parent component that user data has been saved
        onUserDataSaved();
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };
  

  return (
    <View>
    <Text>Name:</Text>
    <TextInput value={name} onChangeText={(text) => setName(text)} />

    <Text>Email:</Text>
    <TextInput value={email} onChangeText={(text) => setEmail(text)} />

    <Text>Phone Number:</Text>
    <TextInput value={phoneNumber} onChangeText={(text) => setPhoneNumber(text)} />

    <Text>Initial Message:</Text>
    <TextInput
      value={initialMessage}
      onChangeText={(text) => setInitialMessage(text)}
      placeholder="Enter a message for the Agent"
    />

    <TouchableOpacity onPress={handleSave}>
      <Text>Save</Text>
    </TouchableOpacity>
  </View>
  );
};

export default UserInfoForm;
