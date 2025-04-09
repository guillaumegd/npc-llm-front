import React from 'react';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, isUser, timestamp }) => {
  return (
    <div 
      className={`message-container ${isUser ? 'user-message' : 'bot-message'}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
        width: '100%'
      }}
    >
      <div 
        style={{
          maxWidth: '75%',
          padding: '10px 14px',
          borderRadius: '4px',
          backgroundColor: isUser ? '#e9f3ff' : '#f3f3f3',
          color: '#333',
          border: isUser ? '1px solid #d0e3ff' : '1px solid #e0e0e0',
        }}
      >
        <p style={{ margin: 0, lineHeight: '1.5' }}>{content}</p>
      </div>
      <div 
        style={{ 
          fontSize: '12px', 
          color: '#999', 
          marginTop: '4px',
          marginLeft: isUser ? '0' : '4px',
          marginRight: isUser ? '4px' : '0'
        }}
      >
        {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default ChatMessage;