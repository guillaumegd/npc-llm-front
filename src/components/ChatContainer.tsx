import React, { useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import { useConversation } from "../hooks/useConversation";
import { useTheme, LanguageType } from "../context/ThemeContext";
import "../styles/ChatContainer.css";

// Import different avatars
import avatar1 from "../assets/avatar1.png"; // Avatar for medieval theme
import avatar2 from "../assets/avatar2.png"; // Avatar for futuristic theme

const ChatContainer: React.FC = () => {
  const { currentTheme, currentLanguage, setLanguage, getCharacterId, toggleTheme } = useTheme();
  
  // Use refs to track previous values
  const previousCharacterId = useRef<number | null>(null);
  
  // Get characterId based on current theme and language
  const characterId = getCharacterId();
  
  // Use the useConversation hook
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    error, 
    availableIntents,
    resetConversation
  } = useConversation(characterId);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Select avatar and name based on theme
  const avatarImage = currentTheme === 'medieval' ? avatar1 : avatar2;
  const characterName = currentTheme === 'medieval' ? 'Alaric' : 'Nexus';

  // Effect to force reset conversation when theme or language changes
  useEffect(() => {
    const newCharacterId = getCharacterId();
    
    // Only reset if the character ID actually changed
    if (previousCharacterId.current !== newCharacterId) {
      console.log(`Character ID changed: ${previousCharacterId.current} -> ${newCharacterId}`);
      
      // Update the ref before resetting
      previousCharacterId.current = newCharacterId;
      
      // Force the initialization with the current ID to prevent race conditions
      resetConversation(newCharacterId);
    }
  }, [currentTheme, currentLanguage, getCharacterId, resetConversation]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle language change
  const handleLanguageChange = (lang: LanguageType) => {
    // Do nothing if user clicks on the current language
    if (lang === currentLanguage) return;
    
    // Set the new language - the effect above will handle the conversation reset
    setLanguage(lang);
  };

  // Get the last non-user message (character message)
  const lastBotMessage = [...messages]
    .reverse()
    .find((message) => !message.isUser);

  return (
    <div className="rpg-chat-container">
      {/* Theme and Language Selection */}
      <div className="settings-bar">
        <div className="theme-toggle">
          <button onClick={toggleTheme} className="theme-button">
            {currentTheme === 'medieval' ? 'Switch to Futuristic' : 'Switch to Medieval'}
          </button>
        </div>
        <div className="language-selector">
          <button 
            onClick={() => handleLanguageChange('en')}
            className={`lang-button ${currentLanguage === 'en' ? 'active' : ''}`}
          >
            EN
          </button>
          <button 
            onClick={() => handleLanguageChange('fr')}
            className={`lang-button ${currentLanguage === 'fr' ? 'active' : ''}`}
          >
            FR
          </button>
          <button 
            onClick={() => handleLanguageChange('pt')}
            className={`lang-button ${currentLanguage === 'pt' ? 'active' : ''}`}
          >
            PT
          </button>
        </div>
      </div>

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
