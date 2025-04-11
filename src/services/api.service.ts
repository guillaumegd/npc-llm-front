import { config } from '../config/env.config';
import { ChatRequest, ConversationNode, ErrorResponse } from '../types/api.types';

/**
 * Service to manage NPC-LLM API calls
 */
export class ApiService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = config.API_URL;
  }

  /**
   * Sends a message to the API and retrieves the NPC response
   * 
   * @param characterId - The character ID
   * @param message - The user's message
   * @param nodeId - The ID of the current conversation node (null for the first message)
   * @param previousMessage - The previous user message
   * @param chatSummary - The conversation summary
   * @returns The NPC response as a conversation node
   * @throws {Error} If the request fails
   */
  async sendMessage(characterId:number, message: string, nodeId: string | null, previousMessage: string, chatSummary: string): Promise<ConversationNode & { chatSummary: string }> {
    try {
      const request: ChatRequest = {
        characterId,
        message,
        node_id: nodeId,
        previousMessage,
        chatSummary,
      };

      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.error || `Error ${response.status}`);
      }

      return await response.json() as ConversationNode & { chatSummary: string };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}

// Export a single instance of the service
export const apiService = new ApiService();

export default apiService;