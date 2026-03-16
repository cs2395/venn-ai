# LevelUp.ai — What Shipped Today (Mar 15-16, 2026)

## Phase 3: n8n on Railway

| Phase | Step | Task | Status |
|---|---|---|---|
| **3** | | **n8n on Railway** | ✅ |
| | *TLDR* | *n8n workflow orchestration engine deployed to Railway cloud, connected to Postgres DB, login fixed via bcrypt hash in psql, LevelUp.ai Agent workflow published and active* | |
| | 3.1 | n8n deployed to Railway via Dockerfile | ✅ |
| | 3.2 | Postgres DB connected to n8n | ✅ |
| | 3.3 | n8n login fixed via bcrypt hash + direct psql | ✅ |
| | 3.4 | LevelUp.ai Agent workflow published + active | ✅ |

---

## Phase 4: Supabase

| Phase | Step | Task | Status |
|---|---|---|---|
| **4** | | **Supabase** | ✅ |
| | *TLDR* | *Supabase DB wired to n8n via credential store. analyses table schema fixed for demo: FK constraint on user_id removed + NOT NULL dropped so any UUID works without auth.users dependency* | |
| | 4.1 | Supabase credential created + wired to n8n Supabase Insert node | ✅ |
| | 4.2 | `analyses` table FK constraint (`analyses_user_id_fkey`) dropped via SQL editor | ✅ |
| | 4.3 | `user_id` NOT NULL constraint dropped | ✅ |

---

## Phase 5: Wire Frontend → n8n (Full Pipeline)

| Phase | Step | Task | Status |
|---|---|---|---|
| **5** | | **Wire Frontend → n8n → Claude AI → Supabase** | ✅ |
| | *TLDR* | *Complete end-to-end pipeline wired and tested. Proxycurl removed (out of business), replaced with Claude API + web_search for LinkedIn lookup. All n8n nodes fully configured with credentials, correct field references, and proper response format. Frontend parses real AI output. Confirmed real results for Andrew Ng + Marcus Johnson.* | |
| | 5.1 | Proxycurl node removed — replaced with Claude AI + web_search tool | ✅ |
| | 5.2 | Wait node removed (was Proxycurl delay, now dead weight) | ✅ |
| | 5.3 | Anthropic API key set via n8n Credential store (not $env — blocked by n8n v1+) | ✅ |
| | 5.4 | Claude AI node: headers, body, web_search tool (`web_search_20250305`) enabled | ✅ |
| | 5.5 | Supabase Insert: all 4 fields mapped with `$('Webhook').item.json.body.*` references | ✅ |
| | 5.6 | Respond node: fixed to return Claude's parsed JSON output (not Supabase row) | ✅ |
| | 5.7 | Frontend webhook URL fixed: `webhook-test` → `webhook` (production URL) | ✅ |
| | 5.8 | Frontend n8n response parser fixed: unwrap `data.analysis` wrapper | ✅ |
| | 5.9 | Frontend `user_id` fixed to valid UUID format | ✅ |
| | 5.10 | **E2E confirmed: Andrew Ng + Marcus Johnson real AI outputs in frontend** | ✅ |

---

## TLDR SUMMARY

- **Phase 3 — n8n on Railway:** Deployed n8n workflow engine to Railway cloud. Connected internal Postgres DB. Fixed broken login (Railway redeploys clear sessions + n8n uses bcrypt hashing — had to update hash directly via psql). Published LevelUp.ai Agent workflow with full pipeline active.

- **Phase 4 — Supabase:** Created Supabase credential in n8n's credential store (correct approach vs `$env` which n8n v1+ blocks). Dropped FK constraint and NOT NULL on `user_id` in `analyses` table so demo works without real Supabase auth users — any UUID passes.

- **Phase 5 — Full Pipeline Wired:** Removed dead Proxycurl node (out of business). Rebuilt Claude AI node from scratch: Anthropic credential via n8n store, `web_search_20250305` tool enabled for LinkedIn lookup, body expression with `JSON.stringify`. Fixed Supabase Insert field references to use `$('Webhook').item.json.body.*` (not `$json.*` which only reads the prior node's output). Fixed Respond node to return Claude's actual analysis JSON, not the empty Supabase row. Fixed frontend webhook URL and response parser. **Confirmed working: real AI-generated talking points, key facts, action items, and draft messages for Andrew Ng + Marcus Johnson from live WhatsApp chat data + LinkedIn web search.**

- **Key architectural decision confirmed:** LinkedIn data for demo = Claude web_search (free, legal, works for public profiles). V2 = Chrome extension (user's own session, 99% accuracy). V3 = Bright Data (only if monetization justifies $500/mo).
