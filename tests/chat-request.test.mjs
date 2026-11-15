import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CHAT_LIMITS,
  buildConversationContext,
  validateChatPayload,
} from '../src/utils/chat-request.mjs';

const prior = [
  { id: 'old-1', role: 'user', content: 'A private question from another chat' },
  { id: 'old-2', role: 'assistant', content: 'A private answer from another chat' },
];
const next = { id: 'new-1', role: 'user', content: 'Start a fresh topic' };

test('new conversation starts with only its first message', () => {
  assert.deepEqual(buildConversationContext(prior, next, true), [next]);
});

test('existing conversation retains its own history in order', () => {
  assert.deepEqual(buildConversationContext(prior, next, false), [...prior, next]);
});

test('context builder does not mutate the original history', () => {
  const before = structuredClone(prior);
  buildConversationContext(prior, next, false);
  assert.deepEqual(prior, before);
});

test('accepts and trims a valid request', () => {
  const result = validateChatPayload({ messages: [{ role: 'user', content: '  Hello  ' }] });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.data.messages[0].content, 'Hello');
});

test('rejects a non-object request', () => {
  assert.equal(validateChatPayload(null).ok, false);
});

test('rejects an empty message list', () => {
  assert.equal(validateChatPayload({ messages: [] }).ok, false);
});

test('rejects an unsupported role', () => {
  const result = validateChatPayload({ messages: [{ role: 'system', content: 'No' }] });
  assert.equal(result.ok, false);
});

test('rejects a message above the per-message limit', () => {
  const result = validateChatPayload({ messages: [{ role: 'user', content: 'x'.repeat(CHAT_LIMITS.maxMessageCharacters + 1) }] });
  assert.equal(result.ok, false);
});

test('rejects a request above the total context limit', () => {
  const content = 'x'.repeat(10_000);
  const result = validateChatPayload({ messages: Array.from({ length: 5 }, (_, i) => ({ id: String(i), role: 'user', content })) });
  assert.equal(result.ok, false);
});

test('rejects an oversized custom system prompt', () => {
  const result = validateChatPayload({
    messages: [{ role: 'user', content: 'Hello' }],
    systemPrompt: { enabled: true, value: 'x'.repeat(CHAT_LIMITS.maxSystemPromptCharacters + 1) },
  });
  assert.equal(result.ok, false);
});

test('rejects empty or malformed message content', () => {
  assert.equal(validateChatPayload({ messages: [{ role: 'user', content: '   ' }] }).ok, false);
  assert.equal(validateChatPayload({ messages: [{ role: 'assistant', content: 4 }] }).ok, false);
});
