/**
 * Pure chat-request helpers shared by the UI and server boundary.
 * Keeping these functions dependency-free makes the limits easy to test.
 */
export const CHAT_LIMITS = Object.freeze({
  maxMessages: 40,
  maxMessageCharacters: 12_000,
  maxTotalCharacters: 40_000,
  maxSystemPromptCharacters: 8_000,
});

/**
 * A new conversation must never inherit the previously selected chat's history.
 * @param {readonly {id:string, role:'user'|'assistant', content:string}[]} existingMessages
 * @param {{id:string, role:'user'|'assistant', content:string}} nextMessage
 * @param {boolean} isNewConversation
 */
export function buildConversationContext(existingMessages, nextMessage, isNewConversation) {
  return [...(isNewConversation ? [] : existingMessages), nextMessage].map((message) => ({
    id: message.id,
    role: message.role,
    content: message.content,
  }));
}

/**
 * Validate and normalize untrusted chat data before sending it to a model provider.
 * @param {unknown} value
 * @returns {{ok:true, data:{messages:Array<{id:string,role:'user'|'assistant',content:string}>, systemPrompt?:{value:string,enabled:boolean}}} | {ok:false,error:string}}
 */
export function validateChatPayload(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ok: false, error: 'Request body must be an object.' };
  }

  const candidate = /** @type {Record<string, unknown>} */ (value);
  if (!Array.isArray(candidate.messages) || candidate.messages.length === 0) {
    return { ok: false, error: 'At least one message is required.' };
  }
  if (candidate.messages.length > CHAT_LIMITS.maxMessages) {
    return { ok: false, error: `A conversation can contain at most ${CHAT_LIMITS.maxMessages} messages per request.` };
  }

  let totalCharacters = 0;
  const messages = [];
  for (const rawMessage of candidate.messages) {
    if (!rawMessage || typeof rawMessage !== 'object' || Array.isArray(rawMessage)) {
      return { ok: false, error: 'Each message must be an object.' };
    }
    const message = /** @type {Record<string, unknown>} */ (rawMessage);
    if (message.role !== 'user' && message.role !== 'assistant') {
      return { ok: false, error: 'Message role must be user or assistant.' };
    }
    if (typeof message.content !== 'string' || !message.content.trim()) {
      return { ok: false, error: 'Message content cannot be empty.' };
    }
    const content = message.content.trim();
    if (content.length > CHAT_LIMITS.maxMessageCharacters) {
      return { ok: false, error: `Each message must be ${CHAT_LIMITS.maxMessageCharacters} characters or fewer.` };
    }
    totalCharacters += content.length;
    if (totalCharacters > CHAT_LIMITS.maxTotalCharacters) {
      return { ok: false, error: `Conversation context must be ${CHAT_LIMITS.maxTotalCharacters} characters or fewer.` };
    }
    messages.push({
      id: typeof message.id === 'string' && message.id.trim() ? message.id.trim() : `message-${messages.length + 1}`,
      role: message.role,
      content,
    });
  }

  let systemPrompt;
  if (candidate.systemPrompt !== undefined) {
    if (!candidate.systemPrompt || typeof candidate.systemPrompt !== 'object' || Array.isArray(candidate.systemPrompt)) {
      return { ok: false, error: 'System prompt must be an object.' };
    }
    const prompt = /** @type {Record<string, unknown>} */ (candidate.systemPrompt);
    if (typeof prompt.enabled !== 'boolean' || typeof prompt.value !== 'string') {
      return { ok: false, error: 'System prompt requires a text value and enabled flag.' };
    }
    const promptValue = prompt.value.trim();
    if (promptValue.length > CHAT_LIMITS.maxSystemPromptCharacters) {
      return { ok: false, error: `System prompt must be ${CHAT_LIMITS.maxSystemPromptCharacters} characters or fewer.` };
    }
    systemPrompt = { value: promptValue, enabled: prompt.enabled };
  }

  return {
    ok: true,
    data: systemPrompt ? { messages, systemPrompt } : { messages },
  };
}
