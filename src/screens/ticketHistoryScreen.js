import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TicketHistoryScreen = ({ route }) => {
  const { orgId, clientId } = route.params;
  const [ticketHistory, setTicketHistory] = useState([]);

  useEffect(() => {
    const fetchTicketHistory = async () => {
      try {
        const response = await fetch(
          `https://your-api-url.com/webchat/client-tickets/?organizationId=${orgId}&clientId=${clientId}`
        );

        if (response.ok) {
          const data = await response.json();
          setTicketHistory(data.data);
        } else {
          console.error('Failed to fetch ticket history');
        }
      } catch (error) {
        console.error('Error fetching ticket history:', error);
      }
    };

    fetchTicketHistory();
  }, [orgId, clientId]);

  return (
    <View>
      <Text>Ticket History</Text>
      <FlatList
        data={ticketHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>Subject: {item.subject}</Text>
            <Text>Created At: {item.created_at}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default TicketHistoryScreen;
