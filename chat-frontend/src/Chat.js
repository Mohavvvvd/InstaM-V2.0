import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import ChatIcon from './ChatIcon';

const socket = io('https://instam-v2-0.onrender.com');

function Chat() {
  const [roomId, setRoomId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [sender] = useState('User ' + Math.floor(Math.random() * 1000));
  const [joined, setJoined] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on('joinedRoom', (id) => {
      setJoined(true);
      setRoomId(id);
    });

    return () => {
      socket.off('message');
      socket.off('joinedRoom');
    };
  }, []);

  const joinRoom = () => {
    if (roomId) {
      setMessages([]);
      socket.emit('joinRoom', roomId);
    }
  };

  const sendMessage = (e) => {
    if (e) e.preventDefault();
    if (message && roomId) {
      socket.emit('message', { roomId, message, sender });
      setMessage('');
    }
  };

  const exitChat = () => {
    setMessages([]);
    setJoined(false);
    setRoomId('');
    socket.emit('leaveRoom', roomId);
  };

  // Handle pressing Enter to send
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      sendMessage(e);
    }
  };

  return (
    <div className="chat-container">
      <AnimatePresence>
        {!joined ? (
          <motion.div
            className="join-form"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="app-icon">
              <ChatIcon size={60} color="#3498db" />
            </div>
            <h2 className="app-title">InstaM v2.0 - Instant Messaging</h2>
            <p className="app-subtitle">Connect with others in real-time</p>
            
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <motion.button 
                onClick={joinRoom}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Join Room
              </motion.button>
            </div>
            
            <div className="tips">
              <p>📱 Share this ID with others to join the same room</p>
              <p>🔒 Each room is private to its participants</p>
            </div>
            
            {/* Copyright footer for join screen */}
            <div className="copyright-footer">
              <p>© {new Date().getFullYear()} Mohamed Ghoul Productions</p>
              <div className="social-links">
                <a href="https://github.com/mohavvvvd" target="_blank" rel="noopener noreferrer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/mohamed-ghoul-224982287" target="_blank" rel="noopener noreferrer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="chat-room"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="chat-header">
              <div className="room-info">
                <span className="room-id">Room: {roomId}</span>
                <span className="online-indicator">● Online</span>
              </div>
              <motion.button 
                onClick={exitChat}
                className="exit-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Exit
              </motion.button>
            </div>
            
            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="empty-messages">
                  <div className="empty-icon">💬</div>
                  <h3>No messages yet</h3>
                  <p>Be the first to send a message!</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    className={`message ${msg.sender === sender ? 'self' : 'other'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {msg.sender !== sender && <div className="sender-name">{msg.sender}</div>}
                    <div className="message-content">{msg.message}</div>
                    <div className="message-time">Just now</div>
                  </motion.div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={sendMessage} className="message-form">
              <div className="input-group">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={handleKeyPress}
                />
                <motion.button 
                  type="submit"
                  disabled={!message}
                  className={`send-button ${message ? 'active' : ''}`}
                  whileHover={{ scale: message ? 1.05 : 1 }}
                  whileTap={{ scale: message ? 0.95 : 1 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>
              </div>
            </form>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Chat;
