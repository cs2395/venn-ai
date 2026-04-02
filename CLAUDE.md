# CLAUDE.md — Venn.ai Project Context

## What This Is
Venn.ai — AI-powered networking automation. Analyzes WhatsApp chats + LinkedIn profiles to generate personalized talking points, key facts, action items, and follow-up messages in the user's voice. Handles scheduling. 10x networking by automating the boring parts.

## Architecture (Current)

```
React Frontend (levelup-app.jsx)
    ↓ POST /webhook/levelup-agent
n8n Workflow (venn-ai-workflow.json)
    ├→ Proxycurl: LinkedIn profile lookup
    ├→ Claude API: AI analysis (talking points, facts, actions, message drafting)
    ├→ Supabase: store results in 'analyses' table
    ├→ PostHog: track events
    ↓ Returns JSON
React Frontend renders results
```

## Architecture (Tomorrow — CrewAI Backend)

```
React Frontend → n8n Webhook → CrewAI Python Backend (Railway)
    Agent 1 (Extractor): parse contacts, roles, context, sentiment
    Agent 2 (Voice Writer): draft messages matching user's tone
    Agent 3 (Synthesizer): talking points, key facts, action items, scheduling
    → Chroma RAG for voice matching + conversation memory
    → Supabase for persistence
    → PostHog for analytics
```

## Data Flow
1. User pastes WhatsApp chat + enters LinkedIn URL/name
2. Frontend POSTs to n8n webhook: `{name, linkedin_url, whatsapp_text, user_id, scheduling_pref}`
3. n8n calls Proxycurl for LinkedIn data
4. n8n calls Claude API with chat + LinkedIn context
5. Claude returns: `{talking_points[], key_facts[], action_items[], draftMessage, tone, sentiment, priority}`
6. n8n stores in Supabase `analyses` table
7. n8n returns JSON to frontend
8. Frontend renders contact cards + results

## Supabase Tables
- `users`: id, email, tier (free/pro), created_at
- `contacts`: id, user_id, name, linkedin_url, company, role
- `analyses`: id, user_id, name, linkedin_url, linkedin_data (jsonb), analysis (jsonb), has_whatsapp, scheduling_pref, created_at
- `scheduling_preferences`: id, user_id, provider (google/outlook/cal.com), calendar_url

All tables have RLS policies scoped to `auth.uid()`.

## Key Files
- `frontend/levelup-app.jsx` — React UI (main demo, all screens)
- `frontend/VennAI.jsx` — Alternate UI (8-screen onboarding flow)
- `backend/integrations.ts` — TypeScript API functions (Proxycurl, WhatsApp parser, 360dialog, Google Cal, PostHog, Stripe)
- `database/levelup_schema.sql` — Supabase SQL schema with RLS + auth hooks
- `database/supabase.js` — Supabase JS client + helper functions
- `workflows/venn-ai-workflow.json` — n8n workflow (Webhook → Proxycurl → Claude → Supabase → Response)
- `.env.example` — All required API keys

## API Keys Required
- `ANTHROPIC_API_KEY` — Claude API for AI analysis
- `PROXYCURL_API_KEY` — LinkedIn profile scraping
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_ANON_KEY` — Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase admin key (backend only)
- `POSTHOG_KEY` — Analytics tracking
- `N8N_WEBHOOK_URL` — n8n webhook endpoint for the pipeline
- `STRIPE_SECRET_KEY` — Payments (future)
- `DIALOG360_API_KEY` — WhatsApp Business API (future)

## Tech Stack
- **Frontend**: React JSX, Syne + Manrope + Space Mono fonts, mobile-first
- **Orchestration**: n8n (visual workflow automation)
- **AI**: Claude API (Sonnet 4) with web_search tool
- **Database**: Supabase (Postgres + Auth + RLS)
- **LinkedIn**: Proxycurl API
- **Analytics**: PostHog (funnel + session replay)
- **Deployment**: Netlify/Vercel (frontend), n8n Cloud or Railway (backend), Supabase Cloud (DB)
- **Future**: CrewAI (multi-agent orchestration), Chroma/Pinecone (RAG), Railway (Python backend)

## Coding Conventions
- All terminal commands include inline comments explaining what they do
- TypeScript for backend, JSX for frontend
- `{data, error}` response pattern on all API functions
- Mobile-first responsive design (768px + 480px breakpoints)
- Green color scheme: `#00E676` primary, `#00C853` secondary, `#0a0a0a` background

## Development Workflow
- **ALL code changes happen in this repo via Claude Code CLI or direct editing**
- The 5 original agent chats (Agent 1–5) are frozen reference material — do not edit code there
- Agent 1 (Planning + React UI): https://claude.ai/chat/ [this chat]
- Agent 2 (UI Design): https://claude.ai/chat/ffe0ae9d-e768-4866-bf91-4e0713152f1e
- Agent 3 (Supabase): https://claude.ai/chat/11b69b01-09f4-43ce-89c3-3cb4ea82dcc2
- Agent 4 (n8n Workflow): https://claude.ai/chat/b025ab65-aac2-4cfd-9f26-fd51ecfd8998
- Agent 5 (API Integrations): https://claude.ai/chat/253b43d0-6f80-43a2-ac78-04f968b63f95

## Project Plans & Roadmaps
ALWAYS put project plans in Tables broken up by numbered Phases and Steps (e.g. Phase 1, step 1.6 = step 6). ALWAYS include a Timeline column (Time Estimate) for each step and phase. # append project plan formatting rule to shared project brain
