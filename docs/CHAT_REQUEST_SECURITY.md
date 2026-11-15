# Chat request isolation and limits

This document records the request boundary added to the chat application.

## Conversation isolation

The UI now builds model context from the selected conversation at submission time. A newly created conversation starts with only its first message; it must not inherit messages from whichever conversation was selected before it.

## Request limits

The server validates incoming data before calling Anthropic:

- Up to 40 messages per request.
- Up to 12,000 characters per message.
- Up to 40,000 characters across the message history.
- Up to 8,000 characters in a custom system prompt.
- Only `user` and `assistant` roles are accepted.
- Empty or malformed messages are rejected.

These are application-level limits, not a substitute for provider billing controls or abuse-rate limiting.

## Transport and logging

The server function uses POST for conversation payloads. Custom system-prompt text is no longer written to server logs. AI responses and validation errors use `Cache-Control: no-store`.

## Outstanding production security blocker: Convex ownership

The current Convex `conversations.list` query returns every conversation in its deployment and the schema has no owner field or authenticated-user check. Do not enable Convex persistence for real or sensitive users until authentication and per-user ownership checks are implemented and tested. The existing UI is not an account-isolated multi-user chat yet.

## Verification

Run:

```bash
npm test
```

The tests cover new-chat isolation, existing-chat history, non-mutating context construction, and request validation boundaries.
