# TanStack Chat Template

A modern chat template built with TanStack Router and Claude AI integration features a clean, responsive interface.

**Demo:** https://tanstack-starter.netlify.app/

## Project notes

This repository is the Kastine Augak `call-ai` project. It is a starting point for a privacy-conscious, mobile-first AI chat experience. Keep provider credentials server-side and validate the production deployment before enabling persistence, analytics, or uploads.

## Accessibility and privacy

See [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md) for the Android/TalkBack release checklist, focus requirements, responsive checks, and privacy safeguards.

## Features

### AI capabilities

- Claude integration
- Markdown formatting with syntax highlighting
- Customizable system prompts
- Streaming responses

### User experience

- Responsive interface
- Conversation management
- API key configuration
- Markdown rendering with code highlighting

## Architecture

- Frontend: React with TanStack Start
- Routing: TanStack Router
- State: TanStack Store
- Optional database: Convex
- Styling: Tailwind CSS
- AI integration: Anthropic Claude
- Build tool: Vite/Vinxi

## Prerequisites

- Node.js 20.9 or newer
- Anthropic API access
- Optional Convex account for persistence
- Optional Netlify CLI for local function testing

## Getting started

1. Clone this repository:

   ```bash
   git clone https://github.com/Augak/call-ai.git
   cd call-ai
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the environment template:

   ```bash
   cp .env.example .env
   ```

4. Add the server-side provider configuration to `.env`. Never commit `.env`.

5. Start development:

   ```bash
   npm run dev
   ```

6. Build for production:

   ```bash
   npm run build
   ```

7. Preview the production build:

   ```bash
   npm run serve
   ```

## Netlify

For local Netlify function testing:

```bash
npm install -g netlify-cli
netlify dev
```

For deployment, connect the repository in Netlify, configure environment variables in the site dashboard, and run the project's documented build command. Do not expose provider secrets in client-side variables.

## Production checklist

- Confirm the build command and output directory in the deployment dashboard.
- Configure HTTPS and server-side API secrets.
- Review model-provider retention and logging policies.
- Test TalkBack, narrow Android widths, reduced motion, streaming states, errors, and retry/stop controls.
- Record test evidence and outstanding limitations before release.
