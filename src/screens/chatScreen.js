import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const chatBaseUrl = `https://chatdesk-prod.dialafrika.com/webchat/initialize-livechat/with-client/`;


const ChatScreen = ({ socketId, orgId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [ticketId, setTicketId] = useState(null); // State for storing ticketId
  const [clientId, setClientId] = useState(null); // State for storing clientId
  const [loadingClientId, setLoadingClientId] = useState(true); // Loading state for clientId

  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const storedClientId = await AsyncStorage.getItem('clientId');
        if (storedClientId) {
          setClientId(storedClientId);
        }
      } catch (error) {
        console.error('Error fetching clientId:', error);
      } finally {
        setLoadingClientId(false);
      }
    };

    fetchClientId();
  }, []);

  useEffect(() => {
    if (!loadingClientId) {
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
    }
  }, [socketId, loadingClientId]);

  const sendMessage = async () => {
    if (!clientId) {
      console.error('Client ID is not available');
      return;
    }

    try {
      const messagePayload = {
        clientId: clientId,
        ticketMessage: message,
        socketId: socketId,
      };

      console.log('Sending message payload:', messagePayload); // Log the message payload

      const response = await fetch(`${chatBaseUrl}?organizationId=${orgId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Message sent successfully. Response:', responseData);
  
        // Clear the input field
        setMessage('');
  
        // Add the sent message to the messages state
        const newMessage = {
          _id: responseData.messageId, // Use the actual message ID if available
          text: message, // Use the message content
          createdAt: new Date(), // Use the current date/time
          user: {
            _id: clientId,
            name: 'You', // Set the sender's name (you can customize this)
          },
        };
  
        setMessages([...messages, newMessage]);
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loadingClientId) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Display the chat messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => (item && item._id ? item._id.toString() : '')}
        renderItem={({ item }) => (
          <View style={item.user._id === clientId ? styles.userMessageContainer : styles.agentMessageContainer}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />


      {/* Input field and send button */}
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          placeholder="Type your message..."
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#007BFF',
    maxWidth: '70%',
    borderRadius: 8,
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  agentMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    maxWidth: '70%',
    borderRadius: 8,
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#EFEFEF',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    width: 60,
    height: 40,
    backgroundColor: '#007BFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
