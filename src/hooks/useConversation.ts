import { useState, useCallback, useEffect, useRef } from "react";
import { apiService } from "../services/api.service";

/**
 * Type representing a message in the conversation
 */
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  nodeId?: string | null;
}

/**
 * Custom hook to manage conversation state with the API
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
  
  // Use a ref to track if this is the first render
  const initialRenderRef = useRef(true);
  
  // Reference to track if a reset call is in progress
  const isResettingRef = useRef(false);
  
  // Function to initialize/reset the conversation
  const initializeConversation = useCallback(async (forceId?: number) => {
    // Avoid multiple simultaneous calls
    if (isResettingRef.current) return;
    isResettingRef.current = true;
    
    // Use the provided ID if available, otherwise use the current characterId
    const idToUse = forceId !== undefined ? forceId : characterId;
    console.log(`Initializing conversation with character ID: ${idToUse}`);
    
    setMessages([]);
    setCurrentNodeId(null);
    setChatSummary("");
    setAvailableIntents([]);
    setError(null);
    setIsLoading(true);
    
    try {
      // Send a request with empty content and null nodeId to get the first message
      const initialNode = await apiService.sendMessage(
        idToUse,
        "",
        null,
        "",
        ""
      );

      // Add the bot's initial message
      setMessages([
        {
          id: Date.now().toString(),
          content: initialNode.content,
          isUser: false,
          timestamp: new Date(),
          nodeId: initialNode.id,
        },
      ]);

      // Register available intents
      setAvailableIntents(initialNode.intents);
      setCurrentNodeId(initialNode.id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error during initial loading"
      );
      // Fallback message if initial loading fails
      setMessages([
        {
          id: Date.now().toString(),
          content: "Hello! How can I help you today?",
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

  // Effect to update characterId when initialCharacterId changes
  useEffect(() => {
    if (initialCharacterId !== characterId) {
      console.log(`Character ID changed from ${characterId} to ${initialCharacterId}`);
      // Just update the ID, don't reset automatically
      setCharacterId(initialCharacterId);
    }
  }, [initialCharacterId, characterId]);

  // Load the initial node when component mounts
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      initializeConversation();
    }
  }, [initializeConversation]);

  // Disabled: Reset the conversation when characterId changes
  // We'll let the parent component handle this to avoid conflicts
  // useEffect(() => {
  //   if (!initialRenderRef.current) {
  //     console.log(`Character ID effect triggered with ID: ${characterId}`);
  //     initializeConversation();
  //   }
  // }, [characterId, initializeConversation]);

  // Function to change the character and reset the conversation
  const changeCharacter = useCallback((newCharacterId: number) => {
    console.log(`Changing character ID to ${newCharacterId}`);
    setCharacterId(newCharacterId);
  }, []);

  // Function to send a message to the API
  const sendMessage = useCallback(
    async (content: string) => {
      if (messages.length === 0) return;
      
      // Add the user's message to the list
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
        // Send the message to the API
        console.log(`Sending message with character ID: ${characterId}`);
        const response = await apiService.sendMessage(
          characterId,
          content,
          currentNodeId,
          lastBotMessage?.content || "",
          chatSummary
        );
        setChatSummary(response.chatSummary);

        // Add the bot's response to the message list
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.content,
          isUser: false,
          timestamp: new Date(),
          nodeId: response.id,
        };

        setMessages((prev) => [...prev, botMessage]);

        // Update current node and available intents
        setCurrentNodeId(response.id);
        setAvailableIntents(response.intents);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error sending message"
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
