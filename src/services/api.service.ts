import { config } from '../config/env.config';
import { ChatRequest, ConversationNode, ErrorResponse } from '../types/api.types';

/**
 * Service pour gérer les appels à l'API NPC-LLM
 */
export class ApiService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = config.API_URL;
  }

  /**
   * Envoie un message à l'API et récupère la réponse du NPC
   * 
   * @param characterId - L'ID du personnage
   * @param message - Le message de l'utilisateur
   * @param nodeId - L'ID du nœud de conversation actuel (null pour le premier message)
   * @param previousMessage - Le message précédent de l'utilisateur
   * @param chatSummary - Le résumé de la conversation
   * @returns La réponse du NPC sous forme d'un nœud de conversation
   * @throws {Error} Si la requête échoue
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
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }

      return await response.json() as ConversationNode & { chatSummary: string };
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  }
}

// Exporter une instance unique du service
export const apiService = new ApiService();

export default apiService;