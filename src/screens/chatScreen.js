import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
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
        // Clear the input field after sending the message
        setMessage('');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.user._id === clientId ? styles.userMessage : styles.agentMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={(text) => setMessage(text)}
          placeholder="Type your message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messagesContainer: {
    paddingVertical: 10,
  },
  messageContainer: {
    alignSelf: 'flex-start',
    maxWidth: '70%',
    borderRadius: 8,
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007BFF',
    color: '#FFFFFF',
  },
  agentMessage: {
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
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
