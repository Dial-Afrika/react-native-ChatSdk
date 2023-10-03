import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import io from 'socket.io-client';

const chatBaseUrl = 'https://chatdesk-prod.dialafrika.com/mobilechat/';

const ChatScreen = ({ clientId, socketId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [ticketId, setTicketId] = useState(null); // State for storing ticketId

  useEffect(() => {
    const socket = io(`${chatBaseUrl}${socketId}/process`);

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('message_from_agent', (data) => {
      // Handle incoming messages from the agent
      const newMessage = {
        _id: data.messageId,
        text: data.message,
        createdAt: new Date(data.timestamp),
        user: {
          _id: data.senderId,
          name: data.senderName,
        },
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Initialize a new chat session and capture the ticketId
    socket.emit('initiate_chat', (data) => {
      const receivedTicketId = data.ticketId;
      setTicketId(receivedTicketId);
      console.log('Ticket ID:', receivedTicketId); // Log the captured ticketId
    });

    return () => {
      // Clean up socket connection when unmounting
      socket.disconnect();
    };
  }, [socketId]);

  const sendMessage = async () => {
    try {
      // Check if clientId is available
      if (!clientId) {
        console.error('Client ID is not available');
        return;
      }
  
      const messagePayload = {
        clientId: clientId,
        ticketMessage: message,
        socketId: socketId,
      };
  
      console.log('Sending message payload:', messagePayload); // Log the message payload
  
      const response = await fetch(`${chatBaseUrl}${socketId}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Message sent successfully. Response:', responseData);
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
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
