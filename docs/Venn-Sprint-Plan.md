# Venn.ai — Updated 1-Day Sprint Plan
## Demo-Ready with Real Contact Import

---

## The Contact Import Problem

Neither WhatsApp nor LinkedIn offers a "browse your contacts" consumer API. WhatsApp requires Business API approval (days). LinkedIn requires OAuth app review (weeks). So for demo day, we need **3 easy paths** so every tester can get contacts in without friction.

### 3-Path Contact Import Strategy

| Path | User Action | What Venn Does | Friction |
|---|---|---|---|
| **A: WhatsApp Export** | User exports chat as .txt from WhatsApp (2 taps) → uploads or pastes | Parses contacts, messages, context automatically | Low — but needs in-app guide |
| **B: LinkedIn Lookup** | User types a name, URL, or "Name at Company" | Web search finds real profile data (role, company, headline, recent activity) | Very low — already working |
| **C: Manual Quick-Add** | User types contact name + any details they remember | Venn enriches via web search, generates talking points from whatever context is provided | Lowest — fallback for anyone |

**All 3 paths feed the same AI pipeline.** The more data the user provides, the better the output — but even Path C (just a name) produces useful results.

---

## What's Done vs Remaining

| # | Task | Status | Chat/Source | Output |
|---|---|---|---|---|
| 1 | App concept, pitch, pricing | ✅ Done | Prior chats | — |
| 2 | React UI v5 (hero flow + real AI) | ✅ Done | This chat | `levelup-app.jsx` |
| 3 | Real LinkedIn lookup (any input format) | ✅ Done | This chat | Claude API + web search |
| 4 | Real AI pipeline (talking pts, facts, actions, messages) | ✅ Done | This chat | Claude API |
| 5 | WhatsApp .txt paste + sample loader | ✅ Done | This chat | In-app text parsing |
| 6 | Mobile-responsive design | ✅ Done | This chat | CSS breakpoints |
| 7 | Feedback form (rating + price + text) | ✅ Done | This chat | Built into results screen |
| 8 | Copy-to-clipboard on messages | ✅ Done | This chat | `navigator.clipboard` |
| 9 | Supabase schema + auth | ✅ Done | [Agent 3 chat](https://claude.ai/chat/11b69b01-09f4-43ce-89c3-3cb4ea82dcc2) | `levelup_schema.sql` + `supabase.js` |
| 10 | n8n workflow JSON | ✅ Done | [Agent 4 chat](https://claude.ai/chat/b025ab65-aac2-4cfd-9f26-fd51ecfd8998) | `levelup-ai-workflow.json` |
| 11 | API integration functions (TS) | ✅ Done | [Agent 5 chat](https://claude.ai/chat/253b43d0-6f80-43a2-ac78-04f968b63f95) | `integrations.ts` |
| 12 | Alternate React UI (8-screen flow) | ✅ Done | [Agent 2 chat](https://claude.ai/chat/ffe0ae9d-e768-4866-bf91-4e0713152f1e) | `VennAI.jsx` |
| — | — | — | — | — |
| 13 | **WhatsApp file upload (.txt)** | ❌ Remaining | — | 20 min |
| 14 | **In-app "How to Export" guides** | ❌ Remaining | — | 30 min |
| 15 | **Manual Quick-Add contact path** | ❌ Remaining | — | 30 min |
| 16 | Deploy to live URL | ❌ Remaining | — | 30 min |
| 17 | PostHog analytics | ❌ Remaining | — | 30 min |
| 18 | Cal.com scheduling | ❌ Remaining | — | 45 min |
| 19 | Integration: wire all 5 agents together | ❌ Remaining | — | 45 min |
| 20 | Beta test with 20 users | ❌ Remaining | — | 1 hr |

**Done: 12/20 (60%). Remaining: ~5 hrs.**

---

## Remaining Sprint — Detailed Phases

### PHASE 1: 3-Path Contact Import (1.5 hrs)
> Goal: Every tester can get contacts into the app regardless of their comfort level

#### 1A. WhatsApp File Upload (20 min)

Add a file upload button alongside the existing paste box. User taps "Upload .txt" → file picker → auto-loads content.

```jsx
// Add to WhatsApp input section
<input type="file" accept=".txt" onChange={e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => setChatText(ev.target.result);
    reader.readAsText(file);  // reads .txt file and sets chat text
  }
}} />
```

#### 1B. In-App "How to Export" Guides (30 min)

Collapsible step-by-step instructions inside the WhatsApp input card. Reduces the #1 drop-off point ("what's a .txt export?").

**WhatsApp Export Guide (show in-app):**
1. Open the WhatsApp chat you want to analyze
2. Tap the contact name at top → scroll down → "Export Chat"
3. Choose "Without Media"
4. Save or share the .txt file
5. Upload it here or paste the contents

**LinkedIn Guide (show in-app):**
1. Go to the contact's LinkedIn profile
2. Copy the URL from your browser (or just remember their name)
3. Paste the URL or type their name below
4. We'll find them automatically

Include screenshots/illustrations for each step. Toggle open/closed so it doesn't clutter the UI for users who already know how.

#### 1C. Manual Quick-Add Path (30 min)

New section below LinkedIn: "Don't have a chat export? Add contacts manually."

| Field | Required? | Purpose |
|---|---|---|
| Contact name | ✅ Yes | Core identifier |
| How you met / context | Optional | "AI Summit Jan 2025, discussed RAG pipelines" |
| Their role | Optional | Enriches output |
| Their company | Optional | Enriches output |
| What you want from follow-up | Optional | "Get intro to investors" / "Schedule coffee" |

Even with just a name, Venn does a web search to find their LinkedIn and generates talking points. With context ("met at AI Summit, discussed RAG"), the output quality jumps significantly.

**Implementation:** Add a "Quick Add" tab/toggle in the input screen that shows a simple form instead of the WhatsApp paste box. Both paths feed the same pipeline.

#### 1D. "Select From Recent" Smart Suggestions (10 min)

After a user's first analysis, store contact names in browser state. On return visits, show: "Analyze again: Sarah Chen, Marcus Johnson" — one-tap re-analysis with updated context.

**Exit criteria:** User can get contacts into Venn via upload, paste, LinkedIn lookup, OR manual entry. Zero dead ends.

---

### PHASE 2: Wire 5 Agent Outputs Together (45 min)
> Goal: All separately-built pieces connect into one working app

| Task | Time | What connects |
|---|---|---|
| Create GitHub repo + folder structure | 10 min | All files in one place |
| Write `CLAUDE.md` project context | 10 min | Shared brain for future Claude Code sessions |
| Write `.env.example` | 5 min | All API keys: `ANTHROPIC_API_KEY`, `PROXYCURL_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `POSTHOG_KEY` |
| Update React UI to call n8n webhook (when deployed) | 10 min | Frontend → Backend connection |
| Verify Supabase schema matches n8n workflow fields | 10 min | Backend → Database connection |

**For demo day:** The React app currently calls Claude's API directly from the browser (works without backend). The n8n + Supabase integration is wired up for production but not required for the demo link.

**Repo structure:**
```
levelup-ai/
├── frontend/
│   └── levelup-app.jsx           # This chat: main demo UI
├── backend/
│   └── integrations.ts            # Agent 5: API functions
├── database/
│   ├── levelup_schema.sql         # Agent 3: Supabase schema
│   └── supabase.js                # Agent 3: client
├── workflows/
│   └── levelup-ai-workflow.json   # Agent 4: n8n pipeline
├── .env.example
├── CLAUDE.md                      # Shared project context
├── package.json
└── README.md
```

---

### PHASE 3: Deploy Live URL (30 min)
> Goal: Shareable link anyone can open on mobile

| Task | Time | How | Link |
|---|---|---|---|
| Build HTML version with all 3 contact paths | 15 min | Export from artifact or create standalone | — |
| Deploy to Netlify Drop | 5 min | Drag-and-drop, no account needed | [app.netlify.com/drop](https://app.netlify.com/drop) |
| Test on mobile (iPhone + Android) | 5 min | Full flow: upload/paste/manual → pipeline → results | — |
| Custom subdomain | 5 min | `levelup-ai.netlify.app` | — |

**Exit: Live URL works, all 3 contact paths tested on mobile.**

---

### PHASE 4: PostHog Analytics (30 min)
> Goal: Track every step of the funnel, especially which contact import path users prefer

| Task | Time | Link |
|---|---|---|
| Create PostHog project | 5 min | [app.posthog.com/signup](https://app.posthog.com/signup) |
| Add JS snippet to `<head>` | 5 min | — |
| Add custom events | 15 min | See event list below |
| Enable session replay | 5 min | Toggle in dashboard |

**Events to track:**

```
page_view
contact_path_whatsapp_paste      # which import path do users choose?
contact_path_whatsapp_upload
contact_path_linkedin_lookup
contact_path_manual_add
export_guide_opened              # did the guide help?
linkedin_lookup_success
linkedin_lookup_fail
pipeline_started
pipeline_complete
pipeline_error
message_copied                   # key conversion event
schedule_clicked
feedback_submitted
feedback_rating                  # property: 1-5
feedback_price                   # property: $6/$29/$49/not yet
```

**Key question to answer from PostHog data:** Which contact import path has the highest completion rate? That's the one to optimize first.

---

### PHASE 5: Cal.com Scheduling (45 min)
> Goal: "Schedule Follow-Up" button books a real meeting

| Task | Time | Link |
|---|---|---|
| Create Cal.com account + event type | 10 min | [cal.com](https://cal.com) |
| Set up "Quick Follow-Up Call" (15 min meeting) | 5 min | — |
| Wire button to open Cal.com link in new tab | 15 min | Pre-fill contact name in booking notes |
| Test booking flow | 10 min | — |
| Optional: embed Cal.com inline | 10 min | Cal.com embed script |

**Exit: "Schedule Follow-Up" opens real booking page with contact name pre-filled.**

---

### PHASE 6: Beta Test with 20 Users (1 hr)
> Goal: Real users test all 3 contact paths, submit feedback

| Task | Time |
|---|---|
| Write share message (see template below) | 10 min |
| Send to 20 contacts via WhatsApp | 10 min |
| Monitor PostHog live (watch which paths people choose) | 20 min |
| Note drop-offs and confusion points | 10 min |
| Quick-fix if critical bug found | 10 min |

**Share message:**

> Hey! Built an AI networking agent — would love 2 min of your time testing it:
>
> **[YOUR_URL]**
>
> 3 ways to try it:
> 📱 Export any WhatsApp chat (.txt) and upload it
> 🔗 Just type someone's name or LinkedIn URL
> ✏️ Or manually add a contact you met recently
>
> It gives you talking points, key facts, action items, and drafts your follow-up message in your voice.
>
> Takes 30 seconds — feedback form at the end. Thanks! 🙏

---

## Updated Sprint Timeline

| Phase | Time | What | Key Output |
|---|---|---|---|
| 1: 3-Path Contact Import | 1.5 hrs | File upload + guides + manual add | Zero friction for any user |
| 2: Wire 5 Agents | 45 min | GitHub repo + CLAUDE.md + connections | Unified codebase |
| 3: Deploy Live | 30 min | Netlify/Vercel URL | Shareable mobile link |
| 4: PostHog | 30 min | Funnel tracking + session replay | Data on user behavior |
| 5: Cal.com | 45 min | Real scheduling | Working "Schedule" button |
| 6: Beta Test | 1 hr | 20 users | Feedback + analytics |
| **TOTAL** | **~5 hrs** | | **Testable demo, 3 contact paths, real analytics** |

---

## Post-Demo: Full API Integrations (Day 2+)

| Priority | Feature | Time | Unlocks |
|---|---|---|---|
| P1 | 360dialog WhatsApp Business API | 3 hrs + approval wait | Send drafted messages directly from app |
| P1 | LinkedIn OAuth | 3 hrs + approval wait | Auto-pull profile without web search |
| P1 | n8n deployment (Railway) | 1 hr | Backend pipeline running live |
| P1 | Supabase wired to frontend | 1 hr | Persistent user data, analysis history |
| P2 | WhatsApp contact list via Business API | 2 hrs | "Select contacts" from WA (requires Business verification) |
| P2 | Google Contacts API | 2 hrs | Import contacts from Google account |
| P3 | Slack integration | 2 hrs | Ingest Slack conversations same as WhatsApp |
| P3 | Stripe payments | 2 hrs | Paid tiers live |

---

## Demo Day Checklist

- [x] Interactive UI with full flow (Landing → Input → Pipeline → Results)
- [x] Real LinkedIn lookup (any input format)
- [x] Real AI pipeline (talking points, facts, actions, messages)
- [x] WhatsApp .txt paste + sample data
- [x] Mobile-responsive design
- [x] Green/black color scheme finalized
- [x] Feedback form with pricing question
- [x] Copy-to-clipboard on messages
- [x] Supabase schema ready (Agent 3)
- [x] n8n workflow ready (Agent 4)
- [x] API integrations coded (Agent 5)
- [ ] **WhatsApp .txt file upload button**
- [ ] **In-app "How to Export" guides (WhatsApp + LinkedIn)**
- [ ] **Manual Quick-Add contact path**
- [ ] GitHub repo with all 5 agent outputs
- [ ] CLAUDE.md shared project context
- [ ] Live URL deployed and tested on mobile
- [ ] PostHog tracking all funnel events (especially contact path choice)
- [ ] Cal.com booking link wired
- [ ] Share message sent to 20 beta testers
- [ ] PostHog reviewed within 24 hours
