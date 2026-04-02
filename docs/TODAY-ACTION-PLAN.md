# Venn.ai — TODAY'S ACTION PLAN

---

## Master Table

| Phase | Step | Task | Time | Link | Outcome / Value |
|---|---|---|---|---|---|
| **1** | | **CREATE GITHUB REPO** | **15 min** | | **Single source of truth — all 5 agents unified** |
| | 1.1 | Create folder structure | 3 min | — | Clean architecture: `frontend/`, `backend/`, `database/`, `workflows/` |
| | 1.2 | Add config files (CLAUDE.md, .env.example, .gitignore, README, package.json) | 5 min | Download from this chat's outputs | CLAUDE.md = shared brain for all future Claude Code sessions |
| | 1.3 | Create `.env` from template + add your real API keys | 5 min | — | All services authenticated: Claude, Proxycurl, Supabase, PostHog |
| | 1.4 | `git init` + first commit | 2 min | — | Version control active from day 1 |
| **2** | | **COLLECT ALL 5 AGENT OUTPUTS** | **15 min** | | **Every piece of built code in one repo** |
| | 2.1 | Download Agent 1 output → `frontend/levelup-app.jsx` | 2 min | This chat (outputs) | Main demo UI with real LinkedIn lookup + AI pipeline |
| | 2.2 | Download Agent 2 output → `frontend/VennAI.jsx` | 2 min | [Agent 2 chat](https://claude.ai/chat/ffe0ae9d-e768-4866-bf91-4e0713152f1e) | Alternate 8-screen onboarding UI (design reference) |
| | 2.3 | Download Agent 3 outputs → `database/levelup_schema.sql` + `database/supabase.js` | 3 min | [Agent 3 chat](https://claude.ai/chat/11b69b01-09f4-43ce-89c3-3cb4ea82dcc2) | DB schema with RLS + auth hooks + JS client helpers |
| | 2.4 | Download Agent 4 output → `workflows/levelup-ai-workflow.json` | 2 min | [Agent 4 chat](https://claude.ai/chat/b025ab65-aac2-4cfd-9f26-fd51ecfd8998) | n8n workflow ready to import (7 nodes, error handling) |
| | 2.5 | Download Agent 5 output → `backend/integrations.ts` | 2 min | [Agent 5 chat](https://claude.ai/chat/253b43d0-6f80-43a2-ac78-04f968b63f95) | TypeScript API functions: Proxycurl, WA parser, Cal, PostHog, Stripe |
| | 2.6 | Verify: `find . -type f` shows all 12+ files | 2 min | — | Confirm nothing missing before proceeding |
| | 2.7 | Push to GitHub | 2 min | [github.com/new](https://github.com/new) | Remote repo live — deployable from anywhere |
| — | | **⚠️ CHECKPOINT: 5 agent chats are now FROZEN. All edits via Claude Code CLI or this chat only.** | | | |
| **3** | | **DEPLOY n8n + IMPORT WORKFLOW** | **30 min** | | **Backend orchestration live — visual, debuggable, maintainable** |
| | 3.1 | Sign up for n8n Cloud (free trial) | 5 min | [app.n8n.cloud](https://app.n8n.cloud) | n8n instance running at your own URL |
| | 3.2 | Import Agent 4's workflow JSON | 5 min | n8n → Workflows → Import from File | 7-node pipeline visible: Webhook → Proxycurl → Wait → IF → Claude → Supabase → Respond |
| | 3.3 | Set env vars: `ANTHROPIC_API_KEY`, `PROXYCURL_API_KEY` | 5 min | n8n → Settings → Environment Variables | n8n can call Claude + Proxycurl APIs |
| | 3.4 | Add Supabase credential (after Phase 4) | 5 min | n8n → Credentials → Add → Supabase | n8n can write analysis results to DB |
| | 3.5 | Activate workflow (toggle on) | 1 min | n8n → workflow → top-right toggle | Webhook is live and accepting requests |
| | 3.6 | Copy webhook URL → save to `.env` as `N8N_WEBHOOK_URL` | 2 min | — | Frontend will call this URL |
| | 3.7 | Test with cURL request | 7 min | See test command below | Confirms full pipeline: Proxycurl → Claude → response JSON |
| **4** | | **DEPLOY SUPABASE + RUN SCHEMA** | **20 min** | | **Persistent storage — user data, analyses survive refresh** |
| | 4.1 | Create Supabase project | 5 min | [supabase.com/dashboard](https://supabase.com/dashboard) | Postgres DB + Auth + API layer running |
| | 4.2 | Paste + run Agent 3's SQL schema | 5 min | Supabase → SQL Editor → paste `levelup_schema.sql` → Run | 4 tables created: users, contacts, analyses, scheduling_preferences |
| | 4.3 | Verify tables in Table Editor | 2 min | Supabase → Table Editor | Confirm tables + RLS policies active |
| | 4.4 | Copy API keys to `.env` | 3 min | Supabase → Settings → API | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| | 4.5 | Add Supabase credential to n8n (back to step 3.4) | 5 min | n8n → Credentials → Supabase → paste URL + service key | n8n → Supabase pipeline connected |
| **5** | | **WIRE REACT FRONTEND → n8n WEBHOOK** | **45 min** | | **The integration — frontend calls n8n instead of Claude directly** |
| | 5.1 | Add `N8N_WEBHOOK_URL` config constant at top of `levelup-app.jsx` | 5 min | — | One toggle switches between demo mode (null) and production (URL) |
| | 5.2 | Add `runN8nPipeline()` function | 15 min | See code in detail section below | Calls n8n webhook, with graceful fallback to direct Claude API if n8n fails |
| | 5.3 | Replace `runAIPipeline()` call with `runN8nPipeline()` in `startPipeline` | 5 min | — | One line change — pipeline now routes through n8n |
| | 5.4 | Test: set `N8N_WEBHOOK_URL = null` → confirm demo still works | 5 min | — | Zero breaking changes — artifact demo unaffected |
| | 5.5 | Test: set `N8N_WEBHOOK_URL = "your-url"` → confirm n8n receives call | 10 min | Check n8n → Executions | Full flow: React → n8n → Proxycurl → Claude → Supabase → Response |
| | 5.6 | Commit + push | 5 min | — | Integration code in GitHub |
| **6** | | **ADD POSTHOG ANALYTICS** | **20 min** | | **Know exactly where users drop off — data-driven iteration** |
| | 6.1 | Create PostHog account + project | 5 min | [app.posthog.com/signup](https://app.posthog.com/signup) | Free tier, no CC needed |
| | 6.2 | Copy JS snippet → add to app | 5 min | PostHog → Settings → Project → Snippet | PostHog tracking active on every page load |
| | 6.3 | Add 6 custom events at key moments | 8 min | See events list below | Funnel: upload → lookup → pipeline → copy → feedback |
| | 6.4 | Enable session replay | 2 min | PostHog → Settings → Session Replay → toggle on | Watch exactly what users do — where they hesitate, click, leave |
| **7** | | **DEPLOY LIVE URL** | **15 min** | | **Shareable mobile link — anyone can test** |
| | 7.1 | Drag `frontend/` folder to Netlify Drop | 5 min | [app.netlify.com/drop](https://app.netlify.com/drop) | Live URL generated in 10 seconds |
| | 7.2 | Set custom subdomain | 3 min | Netlify → Site Settings → Change site name | `levelup-ai.netlify.app` |
| | 7.3 | Test on mobile (iPhone + Android) | 7 min | Text yourself the link | Confirm: loads fast, readable, buttons tappable, full flow works |
| **8** | | **END-TO-END TEST** | **20 min** | | **Confidence the whole system works before sharing** |
| | 8.1 | Test: Load sample chat + run pipeline on mobile | 3 min | Your live URL on phone | Pipeline completes, results render correctly |
| | 8.2 | Test: Real LinkedIn lookup (paste your own URL) | 3 min | — | Your real profile data appears |
| | 8.3 | Test: Real contact lookup (enter a real person) | 3 min | — | Contact profile found + relevant talking points |
| | 8.4 | Test: Copy message button | 1 min | — | Text actually in clipboard, pasteable into WhatsApp |
| | 8.5 | Test: Submit feedback form | 1 min | — | Thank you screen + PostHog event fires |
| | 8.6 | Verify: PostHog shows events | 3 min | [app.posthog.com](https://app.posthog.com) → Activity | Events + session replay appearing |
| | 8.7 | Verify: n8n shows successful executions | 3 min | n8n → Executions | Green checkmarks, input/output visible per node |
| | 8.8 | Verify: Supabase has rows in `analyses` | 3 min | Supabase → Table Editor → analyses | Rows with analysis JSON populated |
| | | **TOTAL** | **~3 hrs** | | **Live demo: React → n8n → Proxycurl → Claude → Supabase, with analytics + shareable URL** |

---

## ⚠️ CRITICAL: Workflow After Phase 2

After Phase 2 (all files in repo), **STOP using the 5 agent chats for code changes.** From Phase 3 onward:

```bash
cd ~/Documents/levelup-ai   # go to your project
claude                       # start Claude Code — reads CLAUDE.md automatically
# Then just talk: "update the UI", "fix the n8n workflow", "add a Supabase column"
# Changes happen directly in your repo files. Just git push.
```

---

## Phase 1 Commands — Create GitHub Repo

```bash
cd ~/Documents                                                # navigate to projects folder

mkdir -p levelup-ai/{frontend,backend,database,workflows}     # create folder structure

cd levelup-ai                                                 # enter project root

git init                                                      # initialize git repo
```

Download these 6 files from this chat's outputs and move them:

```bash
mv ~/Downloads/CLAUDE.md .                   # shared brain for Claude Code sessions
mv ~/Downloads/.env.example .                # API key template
mv ~/Downloads/.gitignore .                  # prevents committing secrets
mv ~/Downloads/package.json .                # project manifest
mv ~/Downloads/README.md .                   # project docs

cp .env.example .env                         # create your real env file
open .env                                    # open in editor — fill in your API keys
```

---

## Phase 2 Commands — Collect All Agent Files

```bash
# Agent 1 (this chat) — download levelup-app.jsx from outputs above
mv ~/Downloads/levelup-app.jsx frontend/levelup-app.jsx

# Agent 2 — go to chat, download JSX artifact
# https://claude.ai/chat/ffe0ae9d-e768-4866-bf91-4e0713152f1e
mv ~/Downloads/VennAI.jsx frontend/VennAI.jsx

# Agent 3 — go to chat, download both files
# https://claude.ai/chat/11b69b01-09f4-43ce-89c3-3cb4ea82dcc2
mv ~/Downloads/levelup_schema.sql database/levelup_schema.sql
mv ~/Downloads/supabase.js database/supabase.js

# Agent 4 — go to chat, download workflow JSON
# https://claude.ai/chat/b025ab65-aac2-4cfd-9f26-fd51ecfd8998
mv ~/Downloads/levelup-ai-workflow.json workflows/levelup-ai-workflow.json

# Agent 5 — go to chat, download TypeScript file
# https://claude.ai/chat/253b43d0-6f80-43a2-ac78-04f968b63f95
mv ~/Downloads/integrations.ts backend/integrations.ts
```

Verify + push:

```bash
find . -type f -not -path './.git/*' | sort  # confirm all 12+ files present

git add -A                                    # stage everything
git commit -m "Initial: all 5 agents unified" # commit
gh repo create levelup-ai --public --push     # create GitHub repo + push
```

---

## Phase 3 Detail — n8n Test Command

After step 3.6, test with:

```bash
curl -X POST "YOUR_N8N_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Contact",
    "linkedin_url": "https://linkedin.com/in/satyanadella",
    "whatsapp_text": "Hey! Great meeting you at the conference",
    "user_id": "test-123",
    "scheduling_pref": "google"
  }'
# Expected: JSON with {success: true, analysis: {talking_points, key_facts, action_items, follow_up_message}}
```

---

## Phase 5 Detail — Code Changes

### Change 1: Add config (top of `frontend/levelup-app.jsx`)

Find `/* ─── API HELPER ─── */` and add ABOVE it:

```javascript
/* ─── CONFIG ─── */
// null = demo mode (direct Claude API from browser)
// URL = production mode (n8n handles Proxycurl + Claude + Supabase)
const N8N_WEBHOOK_URL = null;
```

### Change 2: Add n8n pipeline function (after `runAIPipeline`)

```javascript
async function runN8nPipeline(chatText, userProfile, contactProfiles) {
  if (!N8N_WEBHOOK_URL) {
    return runAIPipeline(chatText, userProfile, contactProfiles);  // demo fallback
  }
  const contacts = contactProfiles.filter(Boolean);
  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: contacts[0]?.name || "Unknown",
        linkedin_url: contacts[0]?.linkedin || "",
        whatsapp_text: chatText,
        user_id: "user-" + Date.now(),
        scheduling_pref: "google",
        all_contacts: contacts.map(c => ({ name: c.name, role: c.role, company: c.company })),
        user_profile: userProfile,
      }),
    });
    if (!res.ok) throw new Error(`n8n returned ${res.status}`);
    const data = await res.json();
    if (data.success && data.analysis) {
      const analysis = typeof data.analysis === "string" ? JSON.parse(data.analysis) : data.analysis;
      return Array.isArray(analysis) ? analysis : [analysis];
    }
    throw new Error(data.error || "No analysis returned");
  } catch (err) {
    console.error("n8n error, falling back to direct:", err);
    return runAIPipeline(chatText, userProfile, contactProfiles);  // graceful fallback
  }
}
```

### Change 3: One line swap in `startPipeline`

```javascript
// FIND this line:
const data = await runAIPipeline(chatText, myProfile, validProfiles);

// REPLACE with:
const data = await runN8nPipeline(chatText, myProfile, validProfiles);
```

---

## Phase 6 Detail — PostHog Events

Add these `posthog.capture()` calls at each key moment in the React app:

```javascript
// After WhatsApp chat loaded:
if (window.posthog) posthog.capture('chat_uploaded', { method: 'paste', lines: chatText.split('\n').length });

// After LinkedIn lookup:
if (window.posthog) posthog.capture('linkedin_lookup', { success: true });

// Pipeline started:
if (window.posthog) posthog.capture('pipeline_started', { has_whatsapp: !!chatText });

// Pipeline complete:
if (window.posthog) posthog.capture('pipeline_complete', { results_count: results.length });

// Message copied:
if (window.posthog) posthog.capture('message_copied', { contact: c.name });

// Feedback submitted:
if (window.posthog) posthog.capture('feedback_submitted', { rating: fbR, price: fbP });
```

---

## TOMORROW: CrewAI Backend + Playwright Browser Automation

| Step | Time | What | Deploy Where | Outcome |
|---|---|---|---|---|
| 9.1 | 30 min | Set up FastAPI + CrewAI Python project | Local → Railway | Python backend scaffold with API endpoint |
| 9.2 | 2 hrs | Create 3 CrewAI agents (Extractor, Writer, Synthesizer) with tools + memory | Railway | Agents that remember past sessions, use tools, critique each other |
| 9.3 | 1 hr | Add Chroma RAG for voice matching | Railway | Agents retrieve user's past messages to match writing style |
| 9.4 | 45 min | **Add Playwright as CrewAI tool** — agents can browse LinkedIn, scrape profiles, verify data | Railway | Agents have "hands" on the browser — fallback when Proxycurl fails |
| 9.5 | 30 min | **Build HIL approval layer** — agent proposes browser action → user approves in UI before execution | Railway + Frontend | User sees "Agent wants to visit linkedin.com/in/sarah — Allow?" before Playwright runs |
| 9.6 | 30 min | Deploy to Railway | [railway.app](https://railway.app) | Python backend live at a URL |
| 9.7 | 30 min | Update n8n: replace Claude HTTP node → CrewAI endpoint | n8n | n8n routes to CrewAI instead of calling Claude directly |
| 9.8 | 15 min | Move React frontend to Vercel | [vercel.com](https://vercel.com) | Frontend on Vercel, backend on Railway |
| 9.9 | 30 min | Test end-to-end | — | React → n8n → CrewAI (with Playwright) → Supabase → Response |

### How Playwright Fits the Architecture

```
React Frontend
    ↓ POST to n8n webhook
n8n orchestration
    ↓ calls CrewAI backend on Railway
CrewAI Agent 1 (Extractor)
    ├→ Proxycurl API (primary LinkedIn lookup)
    ├→ Playwright browser (fallback — scrapes LinkedIn directly if Proxycurl fails)
    ├→ HIL check: "Visit linkedin.com/in/sarah? [Allow/Deny]" → waits for user approval
    └→ Returns contact profile
CrewAI Agent 2 (Writer)
    ├→ Chroma RAG (retrieves user's past messages for voice matching)
    └→ Drafts follow-up message
CrewAI Agent 3 (Synthesizer)
    └→ Talking points, key facts, action items, scheduling suggestions
```

### Playwright CrewAI Tool (preview)

```python
from crewai.tools import tool
from playwright.sync_api import sync_playwright

@tool("browser_scrape")
def scrape_linkedin(url: str) -> str:
    """Scrape a LinkedIn profile page for name, role, company, headline.
    Use only as fallback when Proxycurl API fails or rate-limits."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url)
        # Extract visible profile data
        content = page.content()
        browser.close()
        return content  # CrewAI agent parses the HTML
```

**Deploy split: Railway = Python/CrewAI + Playwright backend. Vercel = React frontend. n8n = orchestration between them.**
