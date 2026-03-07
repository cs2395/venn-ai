# LevelUp.ai

**AI networking agent** — analyzes WhatsApp chats + LinkedIn profiles → generates talking points, key facts, action items, and follow-up messages in your voice.

## Quick Start (Demo)

The React app works standalone — open `frontend/levelup-app.jsx` as a Claude artifact or deploy the HTML version.

## Production Setup

### 1. Clone & configure

```bash
git clone https://github.com/YOUR_USERNAME/levelup-ai.git  # clone repo
cd levelup-ai                                                # enter project
cp .env.example .env                                         # create env file
# Edit .env with your real API keys
```

### 2. Deploy Supabase

```bash
# Go to supabase.com → New Project → SQL Editor → paste:
# database/levelup_schema.sql → Run
# Copy URL + keys to .env
```

### 3. Deploy n8n

```bash
# Option A: n8n Cloud (easiest)
# Sign up at app.n8n.cloud → Workflows → Import → workflows/levelup-ai-workflow.json
# Set env vars: ANTHROPIC_API_KEY, PROXYCURL_API_KEY in Settings → Environment Variables
# Add Supabase credential in Credentials

# Option B: Self-host on Railway
# railway.app → New Project → Deploy from template → search "n8n"
# Import workflow JSON after deploy
```

### 4. Wire frontend to n8n

Update `N8N_WEBHOOK_URL` in `.env` to your n8n webhook URL, then update the React app's API calls to point to it.

### 5. Deploy frontend

```bash
# Drag frontend/ folder to app.netlify.com/drop
# Or: vercel deploy frontend/
```

## Architecture

```
React Frontend → n8n Webhook → Proxycurl + Claude API → Supabase → Response
```

See `CLAUDE.md` for full architecture details.

## Files

| Path | From | Purpose |
|---|---|---|
| `frontend/levelup-app.jsx` | Agent 1 | Main demo UI with real AI pipeline |
| `frontend/LevelUpAI.jsx` | Agent 2 | Alternate UI (8-screen onboarding) |
| `database/levelup_schema.sql` | Agent 3 | Supabase SQL schema + RLS |
| `database/supabase.js` | Agent 3 | Supabase JS client |
| `workflows/levelup-ai-workflow.json` | Agent 4 | n8n workflow JSON |
| `backend/integrations.ts` | Agent 5 | API integration functions |
| `CLAUDE.md` | — | Shared project context for Claude Code |
