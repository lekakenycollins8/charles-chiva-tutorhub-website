# Chiva TutorHub Chat and Messaging System Plan

This document outlines the plan for implementing a chat popup and messaging system for the Chiva TutorHub website, allowing potential clients to easily communicate with the tutoring service.

## Overview

The chat system will consist of two main components:
1. A client-facing chat popup widget accessible from any page on the website
2. An admin interface for managing and responding to messages

## Technology Stack

- **Frontend**: React with Next.js 15
- **UI Components**: shadcn UI components with Tailwind CSS
- **State Management**: Zustand for local state management
- **Real-time Communication**: Server-sent events or polling (simpler) or WebSockets (more complex but real-time)
- **Database**: MongoDB for message storage

## Chat Widget Implementation

### User Interface

The chat widget will have the following components:

1. **Chat Button**
   - Fixed position in the bottom-right corner of the screen
   - Visible on all pages
   - Displays a notification badge when there are unread admin responses

2. **Chat Popup Window**
   - Opens when the chat button is clicked
   - Header with tutor name and status indicator
   - Message history area
   - Message input field
   - Send button
   - Close button

3. **Initial State**
   - Welcome message from the tutor
   - Brief instructions on how to use the chat
   - Optional pre-defined quick questions

### Functionality

1. **Message Sending**
   - Users can type and send messages
   - Messages are stored in MongoDB
   - Confirmation when message is sent

2. **User Identification**
   - First-time users will be prompted for their name and email
   - Information stored in browser localStorage
   - No account creation required for users

3. **Message History**
   - Chat history is preserved between sessions using localStorage
   - Limited to recent conversations (e.g., last 30 days)

4. **Notifications**
   - Visual indicator when the admin has responded
   - Optional browser notifications (with user permission)

## Admin Messaging Interface

### User Interface

1. **Message Center Dashboard**
   - List of all conversations
   - Unread message indicators
   - Search and filter options
   - Sorting by date, read/unread status

2. **Conversation View**
   - Full message history with a specific user
   - User information (name, email)
   - Message input field for responses
   - Option to mark conversations as resolved

3. **Notification Settings**
   - Email notifications for new messages
   - Browser notifications
   - Notification frequency settings

### Functionality

1. **Message Management**
   - View all incoming messages
   - Respond to messages
   - Mark messages as read/unread
   - Archive old conversations

2. **User Management**
   - View user information
   - Add notes to user profiles
   - Block users if necessary (spam prevention)

3. **Analytics**
   - Message volume over time
   - Response time metrics
   - Common topics or questions

## Database Schema

```prisma
model Message {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  conversationId String   @db.ObjectId
  sender        String   // "user" or "admin"
  content       String
  timestamp     DateTime @default(now())
  isRead        Boolean  @default(false)
  
  conversation  Conversation @relation(fields: [conversationId], references: [id])
}

model Conversation {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  userName      String
  userEmail     String
  startedAt     DateTime @default(now())
  lastMessageAt DateTime @default(now())
  isResolved    Boolean  @default(false)
  
  messages      Message[]
}
```

## API Endpoints

### User-Facing Endpoints

```
POST /api/messages
- Create a new message in a conversation
- Body: { conversationId, content }

GET /api/messages/:conversationId
- Get all messages for a specific conversation
- Query params: { limit, offset }

POST /api/conversations
- Start a new conversation
- Body: { userName, userEmail }
```

### Admin-Only Endpoints

```
GET /api/admin/conversations
- Get all conversations
- Query params: { limit, offset, isResolved, search }

PUT /api/admin/messages/:id/read
- Mark a message as read
- No body required

POST /api/admin/messages
- Send a message as admin
- Body: { conversationId, content }

PUT /api/admin/conversations/:id/resolve
- Mark a conversation as resolved
- Body: { isResolved }
```

## Implementation Approach

### Phase 1: Basic Messaging

1. **Setup Database Models**
   - Create Conversation and Message models
   - Set up API endpoints

2. **Implement Chat Widget UI**
   - Create chat button component
   - Build chat popup window
   - Implement message input and display

3. **Implement Basic Admin Interface**
   - Create conversation list view
   - Build message thread view
   - Implement admin response functionality

### Phase 2: Enhanced Features

1. **User Identification**
   - Add user information collection
   - Implement localStorage for persistence

2. **Message History**
   - Implement conversation retrieval
   - Add pagination for long conversations

3. **Admin Features**
   - Add search and filtering
   - Implement conversation resolution
   - Add user notes functionality

### Phase 3: Real-time Features

1. **Real-time Updates**
   - Implement polling or WebSockets
   - Add typing indicators

2. **Notifications**
   - Add browser notifications
   - Implement email notifications for admin

3. **Analytics**
   - Track message metrics
   - Generate basic reports

## Technical Considerations

### State Management

```javascript
// Example Zustand store for chat state
import create from 'zustand';

const useChatStore = create((set) => ({
  isOpen: false,
  messages: [],
  currentConversation: null,
  userInfo: null,
  
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  
  setUserInfo: (userInfo) => set({ userInfo }),
  
  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  loadMessages: (messages) => set({ messages }),
}));

export default useChatStore;
```

### API Calls

```javascript
// Example API functions
export async function sendMessage(conversationId, content) {
  const response = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationId, content }),
  });
  
  return response.json();
}

export async function getMessages(conversationId) {
  const response = await fetch(`/api/messages/${conversationId}`);
  return response.json();
}

export async function startConversation(userName, userEmail) {
  const response = await fetch('/api/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, userEmail }),
  });
  
  return response.json();
}
```

### Real-time Updates

For a simple implementation, polling can be used:

```javascript
// Example polling implementation
function useMessagePolling(conversationId, interval = 5000) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    if (!conversationId) return;
    
    const fetchMessages = async () => {
      const data = await getMessages(conversationId);
      setMessages(data);
    };
    
    // Initial fetch
    fetchMessages();
    
    // Set up polling
    const pollInterval = setInterval(fetchMessages, interval);
    
    return () => clearInterval(pollInterval);
  }, [conversationId, interval]);
  
  return messages;
}
```

For a more sophisticated approach, WebSockets can be used with a library like Socket.io.

## UI Components

### Chat Button

```jsx
// components/chat/ChatButton.jsx
import { useState, useEffect } from 'react';
import useChatStore from '@/store/chatStore';

export default function ChatButton() {
  const { toggleChat, unreadCount } = useChatStore();
  
  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg z-50"
    >
      <ChatIcon className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
```

### Chat Window

```jsx
// components/chat/ChatWindow.jsx
import { useState, useEffect, useRef } from 'react';
import useChatStore from '@/store/chatStore';

export default function ChatWindow() {
  const { isOpen, messages, currentConversation, userInfo, addMessage } = useChatStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add message to UI immediately
    const newMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    addMessage(newMessage);
    setInput('');
    
    // Send to server
    if (currentConversation) {
      await sendMessage(currentConversation.id, input);
    } else {
      // Start new conversation
      const conversation = await startConversation(userInfo.name, userInfo.email);
      setCurrentConversation(conversation);
      await sendMessage(conversation.id, input);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-lg shadow-xl z-50 flex flex-col">
      <div className="p-4 bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
        <h3 className="font-bold">Chat with Chiva TutorHub</h3>
        <button onClick={toggleChat}>×</button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 p-2 rounded ${
              message.sender === 'user'
                ? 'bg-blue-100 ml-auto'
                : 'bg-gray-100 mr-auto'
            }`}
          >
            {message.content}
            <div className="text-xs text-gray-500 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Security Considerations

1. **Input Validation**
   - Sanitize all user inputs to prevent XSS attacks
   - Validate email addresses and other user information

2. **Rate Limiting**
   - Implement rate limiting to prevent spam
   - Limit the number of messages a user can send in a given time period

3. **Admin Authentication**
   - Secure admin routes with proper authentication
   - Implement role-based access control

4. **Data Protection**
   - Store user information securely
   - Implement data retention policies
   - Comply with relevant privacy regulations

## Testing Plan

1. **Unit Testing**
   - Test individual components (chat button, window, message display)
   - Test API functions

2. **Integration Testing**
   - Test the full message flow from user to admin and back
   - Test persistence of conversations

3. **User Testing**
   - Test on different devices and browsers
   - Test with real users to gather feedback

## Deployment Considerations

1. **Performance**
   - Optimize message loading for speed
   - Implement pagination for long conversations

2. **Scalability**
   - Design the system to handle multiple concurrent users
   - Consider database indexing for faster queries

3. **Monitoring**
   - Set up logging for errors
   - Monitor message volume and response times
