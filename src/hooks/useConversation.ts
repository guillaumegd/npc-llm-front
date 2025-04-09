import { useState, useCallback, useEffect, useRef } from "react";
import { apiService } from "../services/api.service";

/**
 * Type pour représenter un message dans la conversation
 */
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  nodeId?: string | null;
}

/**
 * Hook personnalisé pour gérer l'état de la conversation avec l'API
 */
export const useConversation = (initialCharacterId: number = 1) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [availableIntents, setAvailableIntents] = useState<
    { content: string; targetNodeId: string }[]
  >([]);
  const [chatSummary, setChatSummary] = useState<string>("");
  const [characterId, setCharacterId] = useState<number>(initialCharacterId);
  
  // Utiliser une ref pour suivre si c'est le premier rendu
  const initialRenderRef = useRef(true);
  
  // Référence pour suivre si un appel de réinitialisation est en cours
  const isResettingRef = useRef(false);

  // Fonction pour initialiser/réinitialiser la conversation
  const initializeConversation = useCallback(async () => {
    // Éviter les appels multiples simultanés
    if (isResettingRef.current) return;
    isResettingRef.current = true;
    
    console.log(`Initializing conversation with character ID: ${characterId}`);
    
    setMessages([]);
    setCurrentNodeId(null);
    setChatSummary("");
    setAvailableIntents([]);
    setError(null);
    setIsLoading(true);
    
    try {
      // Envoyer une requête avec contenu vide et nodeId null pour obtenir le premier message
      const initialNode = await apiService.sendMessage(
        characterId,
        "",
        null,
        "",
        ""
      );

      // Ajouter le message initial du bot
      setMessages([
        {
          id: Date.now().toString(),
          content: initialNode.content,
          isUser: false,
          timestamp: new Date(),
          nodeId: initialNode.id,
        },
      ]);

      // Enregistrer les intentions disponibles
      setAvailableIntents(initialNode.intents);
      setCurrentNodeId(initialNode.id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement initial"
      );
      // Message de secours si le chargement initial échoue
      setMessages([
        {
          id: Date.now().toString(),
          content: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
          isUser: false,
          timestamp: new Date(),
          nodeId: null,
        },
      ]);
    } finally {
      setIsLoading(false);
      isResettingRef.current = false;
    }
  }, [characterId]);

  // Effet pour mettre à jour le characterId quand initialCharacterId change
  useEffect(() => {
    if (initialCharacterId !== characterId) {
      console.log(`Character ID changed from ${characterId} to ${initialCharacterId}`);
      setCharacterId(initialCharacterId);
    }
  }, [initialCharacterId, characterId]);

  // Charger le nœud initial au montage du composant
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      initializeConversation();
    }
  }, [initializeConversation]);

  // Réinitialiser la conversation lorsque characterId change
  useEffect(() => {
    if (!initialRenderRef.current) {
      console.log(`Character ID effect triggered with ID: ${characterId}`);
      initializeConversation();
    }
  }, [characterId, initializeConversation]);

  // Fonction pour changer le personnage et réinitialiser la conversation
  const changeCharacter = useCallback((newCharacterId: number) => {
    console.log(`Changing character ID to ${newCharacterId}`);
    setCharacterId(newCharacterId);
  }, []);

  // Fonction pour envoyer un message à l'API
  const sendMessage = useCallback(
    async (content: string) => {
      if (messages.length === 0) return;
      
      // Ajouter le message de l'utilisateur à la liste
      const userMessageId = Date.now().toString();
      const userMessage: Message = {
        id: userMessageId,
        content,
        isUser: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const lastBotMessage = [...messages].reverse().find(m => !m.isUser);
        // Envoyer le message à l'API
        console.log(`Sending message with character ID: ${characterId}`);
        const response = await apiService.sendMessage(
          characterId,
          content,
          currentNodeId,
          lastBotMessage?.content || "",
          chatSummary
        );
        setChatSummary(response.chatSummary);

        // Ajouter la réponse du bot à la liste des messages
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.content,
          isUser: false,
          timestamp: new Date(),
          nodeId: response.id,
        };

        setMessages((prev) => [...prev, botMessage]);

        // Mettre à jour le nœud courant et les intentions disponibles
        setCurrentNodeId(response.id);
        setAvailableIntents(response.intents);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors de l'envoi du message"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, currentNodeId, characterId, chatSummary]
  );

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    availableIntents,
    currentNodeId,
    characterId,
    changeCharacter,
    resetConversation: initializeConversation
  };
};

export default useConversation;
