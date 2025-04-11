import React, { useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import { useConversation } from "../hooks/useConversation";
import { useTheme } from "../context/ThemeContext";

// Import different avatars
import avatar1 from "../assets/avatar1.png"; // Avatar for medieval theme
import avatar2 from "../assets/avatar2.png"; // Avatar for futuristic theme

const ChatContainer: React.FC = () => {
  const { currentTheme, getCharacterId } = useTheme();
  
  // Get characterId based on current theme
  const characterId = getCharacterId();
  
  // Use the useConversation hook with the current characterId
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    error, 
    availableIntents
  } = useConversation(characterId);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Select avatar and name based on theme
  const avatarImage = currentTheme === 'medieval' ? avatar1 : avatar2;
  const characterName = currentTheme === 'medieval' ? 'Alaric' : 'Nexus';

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Get the last non-user message (character message)
  const lastBotMessage = [...messages]
    .reverse()
    .find((message) => !message.isUser);

  return (
    <div className="rpg-chat-container">
      {/* Scrollable message area (history) */}
      <div className="chat-history">
        <h3>History</h3>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`history-message ${
              message.isUser ? "user-message" : "bot-message"
            }`}
          >
            <strong>{message.isUser ? "You" : characterName}: </strong>
            {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Character */}
      <div className="character">
        <img src={avatarImage} alt={characterName} />
      </div>

      {/* Dialog bubble */}
      {lastBotMessage && (
        <div className="dialog-bubble">
          {isLoading ? (
            <div className="loading-indicator">
              <div className="loading-dots">...</div>
              <div className="loading-text">{characterName} is thinking...</div>
            </div>
          ) : (
            <div>
              <p>{lastBotMessage.content}</p>
              <div className="dialog-bubble-arrow"></div>
            </div>
          )}
        </div>
      )}

      {/* Error display */}
      {error && <div className="error-message">Error: {error}</div>}

      {/* Suggestions area */}
      {availableIntents.length > 0 && (
        <div className="suggestions">
          {availableIntents.map((intent, index) => (
            <button
              key={index}
              onClick={() => sendMessage(intent.content)}
              className="suggestion-button"
            >
              {intent.content}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="input-container">
        <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default ChatContainer;
