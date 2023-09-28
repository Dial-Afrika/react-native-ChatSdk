import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';

const chatBaseUrl = 'https://chatdesk-prod.dialafrika.com/mobilechat/';

const ChatScreen = ({ clientId, socketId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = io(`${chatBaseUrl}${socketId}/process`);

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('message_from_agent', (data) => {
      // Handle incoming messages from the agent
      const newMessage = {
        _id: data.messageId, // Use a unique ID for the message
        text: data.message,
        createdAt: new Date(data.timestamp), // Use the timestamp from the server
        user: {
          _id: data.senderId, // Use the sender's ID from the server
          name: data.senderName, // Use the sender's name from the server
        },
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      // Clean up socket connection when unmounting
      socket.disconnect();
    };
  }, [socketId]);

  const sendMessage = () => {
    // Send the message to the server
    // Use the clientId, socketId, and message state
    // Send a POST request to the server with this information
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Display the chat messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.user.name}</Text>
            <Text>{item.text}</Text>
          </View>
        )}
      />

      {/* Input field and send button */}
      <TextInput
        value={message}
        onChangeText={(text) => setMessage(text)}
        placeholder="Type your message..."
      />
      <TouchableOpacity onPress={sendMessage}>
        <Text>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatScreen;
