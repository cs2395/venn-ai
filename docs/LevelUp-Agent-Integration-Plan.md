# LevelUp.ai — Agent Integration Plan
## Connecting All 5 Agents via n8n

---

## Current State: What Exists

```
Agent 1 (this chat) ← WORKING DEMO, calls Claude API directly from browser
Agent 2 (UI design) ← Alternate React UI, not connected
Agent 3 (Supabase)  ← SQL schema + JS client, sitting in files
Agent 4 (n8n)       ← Complete workflow JSON, not deployed
Agent 5 (APIs)      ← TypeScript functions, not called by anything
```

## Target State: Everything Connected

```
React UI (Agent 1+2 merged)
    ↓ POST {name, linkedin_url, whatsapp_text}
n8n Webhook (Agent 4 deployed)
    ↓
    ├→ Proxycurl LinkedIn lookup (Agent 5 logic, now n8n node)
    ├→ Claude AI analysis (currently direct, now via n8n)
    ├→ Supabase INSERT (Agent 3 schema)
    ├→ PostHog event tracking (Agent 5 logic)
    ↓
React UI receives JSON → renders results
```

---

## Two-Phase Plan

### PHASE 1: Ship Demo NOW (0 additional hrs)

**Don't integrate anything yet.** The current artifact demo works:
- Real LinkedIn lookup via Claude API + web search
- Real AI pipeline generating talking points, facts, actions, messages
- Mobile-responsive
- Feedback form built in

**Action:** Share the Claude artifact link for immediate testing. No deployment needed.

**Limitation:** No data persistence (results disappear on refresh), no backend, API calls visible in browser.

---

### PHASE 2: n8n Integration (3-4 hrs, do after demo feedback)

This is the quickest path that's also production-grade architecture.

#### Step 1: Deploy n8n (30 min)

| Task | Time | How | Link |
|---|---|---|---|
| Sign up for n8n Cloud | 5 min | Free trial, no CC | [app.n8n.cloud](https://app.n8n.cloud) |
| OR self-host on Railway | 15 min | `docker pull n8nio/n8n` | [Railway template](https://railway.app/template/n8n) |
| Import Agent 4's workflow JSON | 5 min | Workflows → Import → select file | Already built |
| Set environment variables | 5 min | `ANTHROPIC_API_KEY`, `PROXYCURL_API_KEY` | n8n Settings → Environment Variables |

**Exit:** n8n running at a URL like `https://your-n8n.app.n8n.cloud`

#### Step 2: Deploy Supabase (20 min)

| Task | Time | How | Link |
|---|---|---|---|
| Create Supabase project | 5 min | Free tier | [supabase.com](https://supabase.com) |
| Run Agent 3's SQL schema | 5 min | SQL Editor → paste `levelup_schema.sql` → Run | Already built |
| Get API keys | 2 min | Settings → API → copy URL + anon key | — |
| Add Supabase credential to n8n | 5 min | n8n Credentials → Supabase → paste URL + service key | — |
| Test: verify n8n can INSERT | 3 min | Run workflow manually | — |

**Exit:** Supabase tables exist, n8n can write to them.

#### Step 3: Wire React Frontend to n8n (45 min)

Replace the direct Claude API calls in the React app with a single call to n8n's webhook.

**Current flow (Agent 1 only):**
```javascript
// React calls Claude directly — works but not production-grade
const response = await fetch("https://api.anthropic.com/v1/messages", { ... });
```

**New flow (all agents connected):**
```javascript
// React calls n8n webhook — n8n handles everything
const response = await fetch("https://your-n8n.app.n8n.cloud/webhook/levelup-agent", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: contactName,
    linkedin_url: linkedinInput,
    whatsapp_text: chatText,
    user_id: visitorId,        // from PostHog or UUID
    scheduling_pref: "google"  // from user settings
  })
});
const data = await response.json();
// data.analysis = { talking_points, key_facts, action_items, follow_up_message }
```

**What changes in the React code:**
- Replace `lookupLinkedIn()` function → n8n does this via Proxycurl node
- Replace `runAIPipeline()` function → n8n does this via Claude node
- Replace `callClaude()` function → not needed, n8n handles all API calls
- Add `user_id` tracking → UUID or PostHog distinct_id

**What stays the same:**
- All UI/UX screens
- WhatsApp .txt parsing (stays client-side, it's instant)
- LinkedIn input normalization (stays client-side)
- Feedback form (stays client-side, add Supabase write later)

#### Step 4: Add PostHog (20 min)

From Agent 5's integration code, add the PostHog snippet:

```html
<!-- In <head> of HTML version -->
<script>
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){...})}(document,window.posthog||[]);
  posthog.init('YOUR_KEY', {api_host: 'https://app.posthog.com'});
</script>
```

Then fire events at key moments:
```javascript
posthog.capture('contact_path_whatsapp');    // user pasted WhatsApp chat
posthog.capture('contact_path_linkedin');    // user did LinkedIn lookup
posthog.capture('contact_path_manual');      // user used manual add
posthog.capture('pipeline_complete');         // AI results returned
posthog.capture('message_copied');            // user copied a drafted message
posthog.capture('feedback_submitted', { rating: 4, price: '$29/3mo' });
```

#### Step 5: Test End-to-End (30 min)

| Test | Expected Result |
|---|---|
| Paste WhatsApp chat + run pipeline | n8n receives data, calls Proxycurl + Claude, stores in Supabase, returns results |
| LinkedIn lookup only (no WA chat) | n8n handles missing WhatsApp gracefully (IF node routes correctly) |
| Manual contact add (name only) | Pipeline works with minimal data |
| Check Supabase | Rows appear in `analyses` table |
| Check PostHog | Events + session replay appear |
| Mobile browser test | Full flow works on phone |

---

## Architecture Summary

```
┌─────────────────────────────┐
│     React Frontend          │  Agent 1 (this chat) + Agent 2 design elements
│  (Netlify / Vercel / artifact) │
│                             │
│  WhatsApp paste/upload      │
│  LinkedIn lookup input      │
│  Manual contact add         │
│  Results display            │
│  Feedback form              │
└──────────┬──────────────────┘
           │ POST /webhook/levelup-agent
           ▼
┌─────────────────────────────┐
│     n8n Workflow             │  Agent 4 (n8n JSON)
│  (n8n Cloud or Railway)     │
│                             │
│  1. Receive webhook         │
│  2. Proxycurl LinkedIn →    │  Agent 5 (Proxycurl function → now n8n node)
│  3. Claude AI analysis →    │  Agent 5 (Claude function → now n8n node)
│  4. Supabase INSERT →       │  Agent 3 (schema)
│  5. Return JSON             │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│     Supabase                │  Agent 3 (SQL schema + auth)
│  (supabase.com)             │
│                             │
│  users                      │
│  contacts                   │
│  analyses ← results stored  │
│  scheduling_preferences     │
└─────────────────────────────┘
```

---

## Why n8n Over CrewAI For This

| Factor | n8n | CrewAI |
|---|---|---|
| Time to deploy | 30 min (cloud) | 4+ hrs (Python backend + Railway) |
| Agent 4 already built it | ✅ JSON ready to import | ❌ Would need to rebuild |
| Visual debugging | ✅ See each node's input/output | ❌ Console logs only |
| Adding new integrations | Drag-and-drop nodes | Write Python code |
| Webhook → frontend | Built-in | Need Flask/FastAPI wrapper |
| When to add CrewAI | When you need agent memory, retries, multi-step reasoning | — |

**TLDR: n8n for orchestration now. CrewAI when you need smarter agents later (v2+).**

---

## Decision: What To Do Right Now

| If you want... | Do this | Time |
|---|---|---|
| **Share demo link TODAY** | Click 🔗 on the artifact in this chat → share the Claude public link | 2 min |
| **Deploy to your own URL** | Download HTML → Netlify Drop | 15 min |
| **Connect all agents (production)** | Follow Phase 2 above (n8n + Supabase + PostHog) | 3-4 hrs |
