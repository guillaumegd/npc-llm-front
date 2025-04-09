import React, { useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import { useConversation } from "../hooks/useConversation";
import { useTheme } from "../context/ThemeContext";

// Import des différents avatars
import avatar1 from "../assets/avatar1.png"; // Avatar pour le thème médiéval
import avatar2 from "../assets/avatar2.png"; // Avatar pour le thème futuriste

const ChatContainer: React.FC = () => {
  const { currentTheme, getCharacterId } = useTheme();
  
  // Obtenir le characterId en fonction du thème actuel
  const characterId = getCharacterId();
  
  // Utiliser le hook useConversation avec le characterId actuel
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    error, 
    availableIntents
  } = useConversation(characterId);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sélection de l'avatar et du nom en fonction du thème
  const avatarImage = currentTheme === 'medieval' ? avatar1 : avatar2;
  const characterName = currentTheme === 'medieval' ? 'Alaric' : 'Nexus';

  // Scroll automatique vers le bas quand de nouveaux messages sont ajoutés
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // On récupère le dernier message non utilisateur (message du personnage)
  const lastBotMessage = [...messages]
    .reverse()
    .find((message) => !message.isUser);

  return (
    <div className="rpg-chat-container">
      {/* Zone de messages scrollable (historique) */}
      <div className="chat-history">
        <h3>Historique</h3>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`history-message ${
              message.isUser ? "user-message" : "bot-message"
            }`}
          >
            <strong>{message.isUser ? "Vous" : characterName}: </strong>
            {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Personnage */}
      <div className="character">
        <img src={avatarImage} alt={characterName} />
      </div>

      {/* Bulle de dialogue */}
      {lastBotMessage && (
        <div className="dialog-bubble">
          {isLoading ? (
            <div className="loading-indicator">
              <div className="loading-dots">...</div>
              <div className="loading-text">{characterName} réfléchit...</div>
            </div>
          ) : (
            <div>
              <p>{lastBotMessage.content}</p>
              <div className="dialog-bubble-arrow"></div>
            </div>
          )}
        </div>
      )}

      {/* Affichage des erreurs */}
      {error && <div className="error-message">Erreur: {error}</div>}

      {/* Zone de suggestions */}
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
