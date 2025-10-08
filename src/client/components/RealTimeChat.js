import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../styles/RealTimeChat.css';

function RealTimeChat({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to chat server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from chat server');
    });

    newSocket.on('message', message => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('chatHistory', history => {
      setMessages(history);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = e => {
    e.preventDefault();
    if (newMessage.trim() && socket && user) {
      const message = {
        id: Date.now(),
        text: newMessage,
        username: user.username,
        timestamp: new Date().toISOString(),
      };

      socket.emit('message', message);
      setNewMessage('');
    }
  };

  const formatTime = timestamp => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>💬 Real-Time Chat</h2>
        <div className="connection-status">
          <span
            className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}
          >
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`message ${message.username === user?.username ? 'own-message' : ''}`}
            >
              <div className="message-header">
                <span className="username">{message.username}</span>
                <span className="timestamp">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <div className="message-content">{message.text}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {user ? (
        <form className="chat-input" onSubmit={sendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!isConnected || !newMessage.trim()}
            className="send-btn"
          >
            Send
          </button>
        </form>
      ) : (
        <div className="login-prompt">
          <p>Please log in to participate in the chat</p>
        </div>
      )}

      <div className="chat-info">
        <h3>🔧 Developer 3&apos;s Real-Time Features</h3>
        <div className="features-list">
          <div className="feature-item">✅ Socket.IO Integration</div>
          <div className="feature-item">✅ Real-time Messaging</div>
          <div className="feature-item">✅ Connection Status</div>
          <div className="feature-item">✅ Message History</div>
          <div className="feature-item">✅ Auto-scroll</div>
          <div className="feature-item">✅ User Authentication</div>
        </div>
      </div>
    </div>
  );
}

export default RealTimeChat;
