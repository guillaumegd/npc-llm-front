/**
 * Types for NPC-LLM API based on OpenAPI specification
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
