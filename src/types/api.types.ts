/**
 * Types pour l'API NPC-LLM basés sur la spécification OpenAPI
 */

export interface ConversationIntent {
  content: string;
  targetNodeId: string;
}

export interface ConversationNode {
  id: string;
  content: string;
  intents: ConversationIntent[];
}

export interface ChatRequest {
  characterId: number;
  message: string;
  node_id: string | null;
  previousMessage: string;
  chatSummary: string;
}

export interface ErrorResponse {
  error: string;
}
