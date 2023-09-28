import io from 'socket.io-client';

const serverUrl = 'https://chatdesk-prod.dialafrika.com/mobilechat/1/process';

const SocketService = {
  socket: null,
  connect: (orgId) => {
    SocketService.socket = io(serverUrl, {
      query: {
        orgId: orgId,
      },
    });

    SocketService.socket.on('connect', () => {
      console.log('Connected to server');
    });

    // Add more event listeners and message handling here
  },

  disconnect: () => {
    if (SocketService.socket) {
      SocketService.socket.disconnect();
    }
  },

  // Add methods for sending messages and handling other socket events
};

export default SocketService;
