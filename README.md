# DialAfrika React Native SDK

The DialAfrika React Native SDK allows you to integrate DialAfrika's Ticketing services into your React Native applications. This SDK provides access to features such as live chat and support ticket creation.
### Prerequisites

Before you begin, make sure you have the following:

- Node.js and npm (or Yarn) installed on your development machine.
- React Native development environment set up.

### Installation

To install the DialAfrika React Native SDK, you can use npm or Yarn:

```bash
npm install dialafrika-react-native-sdk
# or
yarn add dialafrika-react-native-sdk
```

### Configuration

To use the SDK, you need an API key obtained from DialAfrika. Follow these steps:

1. Sign up or log in to your DialAfrika  account.
2. Initialize the SDK with your API key in your React Native app:

```javascript
import DialAfrikaSDK from 'dialafrika-react-native-sdk';

// Initialize the SDK with your API key
DialAfrikaSDK.initialize({
  apiKey: 'YOUR_API_KEY_HERE',
});
```

Replace `'YOUR_API_KEY_HERE'` with your actual API key.

### Usage

#### Live Chat

You can integrate live chat into your app using the following code:

```javascript
import DialAfrikaSDK from 'dialafrika-react-native-sdk';

// Start a live chat session
DialAfrikaSDK.startLiveChat();

// Listen for incoming chat messages
DialAfrikaSDK.onMessage((message) => {
  // Handle incoming message
});
```

#### Support Tickets

Create a support ticket using the SDK:

```javascript
import DialAfrikaSDK from 'dialafrika-react-native-sdk';

// Create a support ticket
DialAfrikaSDK.createSupportTicket({
  subject: 'Issue with app',
  description: 'I am facing an issue with your app.',
})
  .then((ticket) => {
    // Handle ticket creation success
    console.log('Ticket created:', ticket);
  })
  .catch((error) => {
    // Handle ticket creation error
    console.error('Ticket creation failed:', error);
  });
```