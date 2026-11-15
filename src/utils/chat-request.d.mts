export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  systemPrompt?: { value: string; enabled: boolean };
}

export const CHAT_LIMITS: Readonly<{
  maxMessages: number;
  maxMessageCharacters: number;
  maxTotalCharacters: number;
  maxSystemPromptCharacters: number;
}>;

export function buildConversationContext(
  existingMessages: readonly ChatMessage[],
  nextMessage: ChatMessage,
  isNewConversation: boolean,
): ChatMessage[];

export function validateChatPayload(
  value: unknown,
): { ok: true; data: ChatRequest } | { ok: false; error: string };
