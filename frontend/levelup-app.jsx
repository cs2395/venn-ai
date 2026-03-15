import { useState, useEffect } from "react";

const SAMPLE_WHATSAPP = `1/15/25, 9:03 AM - Sarah Chen: Hey! Great meeting you at the AI Summit yesterday
1/15/25, 9:04 AM - Sarah Chen: Your demo of the RAG pipeline was really impressive
1/15/25, 9:15 AM - You: Thanks Sarah! Your work on multi-agent systems at Anthropic is exactly what we're exploring
1/15/25, 9:16 AM - You: Would love to continue the conversation sometime
1/15/25, 9:20 AM - Sarah Chen: Absolutely! I'm free next week if you want to grab coffee
1/15/25, 10:45 AM - Marcus Johnson: Yo! Marcus from the networking mixer
1/15/25, 10:46 AM - Marcus Johnson: That startup idea you mentioned — the automated follow-up thing — I know some investors who'd be interested
1/15/25, 10:50 AM - You: Marcus! Great connecting. Yeah LevelUp.ai is what we're calling it
1/15/25, 10:51 AM - You: Would love an intro if you're open to it
1/15/25, 10:55 AM - Marcus Johnson: For sure. Let me set something up this week`;

const RESULTS = [
  {
    name: "Sarah Chen", role: "Senior ML Engineer", company: "Anthropic",
    sentiment: "Warm & Interested", priority: "HIGH",
    talkingPoints: [
      "Her multi-agent orchestration work — ask about coordination challenges at scale",
      "RAG pipeline improvements — share your latest context-window workaround",
      "Anthropic's approach to tool-use agents — potential collaboration angle",
    ],
    keyFacts: [
      "Works on agent coordination at Anthropic — deeply technical",
      "Initiated follow-up — suggested coffee next week (high intent)",
      "Shared interest: RAG architectures + LLM orchestration",
    ],
    actionItems: [
      "Book coffee meeting Tuesday or Wednesday afternoon",
      "Share your RAG pipeline demo repo before the meeting",
      "Explore: Could her multi-agent work integrate with LevelUp's pipeline?",
    ],
    draftMessage: `Hey Sarah — really enjoyed our conversation at the AI Summit yesterday. Your perspective on multi-agent orchestration was fascinating, especially the coordination challenges you mentioned.\n\nI've been thinking more about how RAG layers could solve some of those context-window limitations we discussed. Would love to continue that thread over coffee — are you free Tuesday or Wednesday afternoon?`,
    tone: "Professional-warm",
  },
  {
    name: "Marcus Johnson", role: "Partner", company: "Gradient Ventures",
    sentiment: "Enthusiastic", priority: "HIGH",
    talkingPoints: [
      "His portfolio's AI automation investments — what patterns is he seeing?",
      "LevelUp.ai's traction plan — he offered intros, come prepared with metrics",
      "Ask about Gradient's thesis on B2B AI tools — align your pitch",
    ],
    keyFacts: [
      "Partner at Gradient Ventures — active AI/automation investor",
      "He initiated the investor intro offer (unprompted = strong signal)",
      "Connected at networking mixer — casual rapport already built",
    ],
    actionItems: [
      "Send LevelUp.ai one-pager before his intro meeting",
      "Prepare 2-min pitch with early traction numbers",
      "Ask: Who specifically at Gradient should see this?",
    ],
    draftMessage: `Marcus! Great meeting you at the mixer. Really appreciate your enthusiasm about LevelUp.ai — means a lot coming from someone at Gradient.\n\nI'd love to take you up on that investor intro. Happy to send over a one-pager or jump on a quick call this week to give you the full picture first. Whatever's easiest for you.`,
    tone: "Casual-confident",
  },
];

const N8N_WEBHOOK_URL = null;

export default function LevelUpApp() {
  const [screen, setScreen] = useState("landing");
  const [chatText, setChatText] = useState("");
  const [liRows, setLiRows] = useState([{ name: "", role: "", company: "", url: "" }]);
  const [agentStep, setAgentStep] = useState(-1);
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(-1);
  const [fbR, setFbR] = useState(0);
  const [fbP, setFbP] = useState("");
  const [fbT, setFbT] = useState("");
  const [fbDone, setFbDone] = useState(false);

  const runAIPipeline = () => {
    setAgentStep(0);
    setTimeout(() => setAgentStep(1), 2000);
    setTimeout(() => setAgentStep(2), 4000);
    setTimeout(() => { setAgentStep(3); setTimeout(() => setScreen("results"), 700); }, 5800);
  };

  const runN8nPipeline = async () => {
    if (!N8N_WEBHOOK_URL) {
      runAIPipeline();
      return;
    }
    try {
      setAgentStep(0);
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: liRows[0]?.name || "",
          linkedin_url: liRows[0]?.url || "",
          whatsapp_text: chatText,
          user_id: "demo-user",
          scheduling_pref: "google",
        }),
      });
      if (!res.ok) throw new Error(`n8n returned ${res.status}`);
      setAgentStep(3);
      setTimeout(() => setScreen("results"), 700);
    } catch {
      runAIPipeline();
    }
  };

  const uLi = (i, f, v) => { const c = [...liRows]; c[i][f] = v; setLiRows(c); };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f5f5f5", fontFamily: "'Syne',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&family=Manrope:wght@300;400;500;600;700;800&display=swap');
        :root {
          --g: #00E676; --gl: #66FFA6; --gd: rgba(0,230,118,0.10); --gg: rgba(0,230,118,0.22);
          --g2: #00C853; --g2d: rgba(0,200,83,0.10);
          --bg: #0a0a0a; --card: rgba(255,255,255,0.035); --bdr: rgba(255,255,255,0.07);
        }
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes glow{0%,100%{box-shadow:0 0 16px rgba(0,230,118,0.1)}50%{box-shadow:0 0 32px rgba(0,230,118,0.28)}}
        @keyframes scan{0%{transform:translateX(-100%)}100%{transform:translateX(250%)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes countUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(0,230,118,0.16);border-radius:8px}
        textarea:focus,input:focus{outline:none;border-color:var(--g)!important}

        .cta{background:var(--g);color:#0a0a0a;border:none;padding:18px 44px;border-radius:4px;font-size:17px;font-weight:800;font-family:'Syne',sans-serif;cursor:pointer;letter-spacing:0.05em;text-transform:uppercase;transition:all .2s;white-space:nowrap}
        .cta:hover{box-shadow:0 6px 32px rgba(0,230,118,0.35);transform:translateY(-2px)}
        .cta2{background:var(--g2);color:#0a0a0a;border:none;padding:14px 32px;border-radius:4px;font-size:15px;font-weight:800;font-family:'Syne',sans-serif;cursor:pointer;letter-spacing:0.04em;text-transform:uppercase;transition:all .2s;white-space:nowrap}
        .cta2:hover{box-shadow:0 5px 28px rgba(0,200,83,0.3);transform:translateY(-1px)}
        .cta-o{background:transparent;color:#f5f5f5;border:2px solid rgba(255,255,255,0.2);padding:16px 36px;border-radius:4px;font-size:15px;font-weight:700;font-family:'Syne',sans-serif;cursor:pointer;letter-spacing:0.04em;transition:all .2s;white-space:nowrap}
        .cta-o:hover{border-color:var(--g);color:var(--g)}
        .inp{width:100%;background:rgba(255,255,255,0.04);border:1.5px solid var(--bdr);border-radius:6px;padding:14px 16px;color:#e0e0e0;font-size:15px;font-family:'Manrope',sans-serif;transition:border .2s}

        /* ─── RESPONSIVE ─── */
        .hero-title { font-size: 72px; }
        .hero-sub { font-size: 20px; max-width: 720px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); }
        .stats-num { font-size: 40px; }
        .features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .feat-title { font-size: 21px; }
        .input-section { padding: 36px 32px; }
        .input-h { font-size: 30px; }
        .steps-row { display: flex; }
        .li-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1.3fr; gap: 10px; }
        .results-3col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
        .contact-tabs { display: flex; gap: 12px; }
        .msg-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .process-title { font-size: 40px; }
        .section-title { font-size: 38px; }
        .page-pad { padding-left: 36px; padding-right: 36px; }
        .nav-pad { padding: 14px 32px; }
        .cta-row { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .fb-grid { max-width: 520px; }

        @media (max-width: 768px) {
          .hero-title { font-size: 40px !important; }
          .hero-sub { font-size: 16px !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; gap: 0; }
          .stats-num { font-size: 30px !important; }
          .features-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .feat-title { font-size: 18px !important; }
          .input-section { padding: 24px 18px !important; }
          .input-h { font-size: 22px !important; }
          .steps-row { flex-wrap: wrap !important; gap: 6px !important; }
          .li-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
          .results-3col { grid-template-columns: 1fr !important; gap: 10px !important; }
          .contact-tabs { flex-direction: column !important; gap: 8px !important; }
          .msg-btns { flex-direction: column !important; gap: 8px !important; }
          .msg-btns .cta, .msg-btns .cta2, .msg-btns .cta-o { width: 100% !important; text-align: center !important; }
          .process-title { font-size: 28px !important; }
          .section-title { font-size: 26px !important; }
          .page-pad { padding-left: 16px !important; padding-right: 16px !important; }
          .nav-pad { padding: 12px 16px !important; }
          .cta { padding: 16px 28px !important; font-size: 15px !important; }
          .cta2 { padding: 14px 24px !important; font-size: 14px !important; }
          .cta-o { padding: 14px 24px !important; font-size: 14px !important; }
          .cta-row { flex-direction: column !important; align-items: stretch !important; }
          .cta-row .cta, .cta-row .cta-o { width: 100% !important; text-align: center !important; }
          .fb-grid { max-width: 100% !important; }
        }

        @media (max-width: 480px) {
          .hero-title { font-size: 32px !important; line-height: 1.1 !important; }
          .hero-sub { font-size: 15px !important; }
          .stats-num { font-size: 26px !important; }
          .input-h { font-size: 20px !important; }
          .process-title { font-size: 24px !important; }
          .section-title { font-size: 22px !important; }
        }
      `}</style>

      {/* BG */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-18%", left: "8%", width: 550, height: 550, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,230,118,0.05) 0%,transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-12%", right: "4%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,200,83,0.04) 0%,transparent 70%)" }} />
      </div>

      {/* NAV */}
      <nav className="nav-pad" style={{
        position: "sticky", top: 0, zIndex: 100,
        borderBottom: "1px solid var(--bdr)",
        backdropFilter: "blur(20px)", background: "rgba(10,10,10,0.88)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 3, cursor: "pointer" }} onClick={() => setScreen("landing")}>
          <span style={{ color: "var(--g)", fontSize: 20, fontWeight: 800 }}>⚡</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>LEVEL</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: "var(--g)", letterSpacing: "-0.02em" }}>UP</span>
          <span style={{ fontSize: 18, fontWeight: 500, color: "#555" }}>.AI</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {screen !== "landing" && (
            <button onClick={() => setScreen("landing")} style={{ background: "none", border: "none", color: "#888", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Manrope',sans-serif" }}>HOME</button>
          )}
          <button onClick={() => setScreen("input")} style={{
            background: "none", border: "2px solid var(--g)", color: "var(--g)",
            padding: "7px 18px", fontSize: 12, fontWeight: 800,
            fontFamily: "'Syne',sans-serif", cursor: "pointer", letterSpacing: "0.05em",
          }}>TRY DEMO</button>
        </div>
      </nav>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ════════ LANDING ════════ */}
        {screen === "landing" && (
          <div style={{ animation: "fadeUp 0.5s ease" }}>
            <section className="page-pad" style={{ paddingTop: 60, paddingBottom: 40, maxWidth: 960, margin: "0 auto", textAlign: "center" }}>

              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                border: "1.5px solid rgba(0,230,118,0.28)", borderRadius: 30,
                padding: "9px 22px", marginBottom: 32, background: "var(--gd)",
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--g)", display: "inline-block" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--g)", fontFamily: "'Syne',sans-serif", letterSpacing: "0.04em" }}>
                  Free Beta — Try It Now
                </span>
              </div>

              <h1 className="hero-title" style={{
                fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.04em",
                fontFamily: "'Syne',sans-serif", marginBottom: 26,
              }}>
                <span style={{ color: "#fff" }}>Your AI</span><br />
                <span style={{ color: "var(--g)" }}>Networking Agent</span>
              </h1>

              <p className="hero-sub" style={{
                color: "#aaa", lineHeight: 1.65, margin: "0 auto 40px",
                fontFamily: "'Manrope',sans-serif", fontWeight: 400,
              }}>
                Integrates with <strong style={{ color: "var(--g)" }}>WhatsApp</strong> &{" "}
                <strong style={{ color: "var(--g)" }}>LinkedIn</strong> to give you customized talking points,
                draft follow-ups in <em>your voice</em>, and schedule meetings — all automatically.
              </p>

              <div className="cta-row" style={{ marginBottom: 50 }}>
                <button className="cta" onClick={() => setScreen("input")}>TRY LEVELUP FREE →</button>
                <button className="cta-o" onClick={() => document.getElementById("feat")?.scrollIntoView({ behavior: "smooth" })}>See How It Works ↓</button>
              </div>

              {/* STATS */}
              <div className="stats-grid" style={{
                borderTop: "1px solid var(--bdr)", borderBottom: "1px solid var(--bdr)", padding: "24px 0",
              }}>
                {[
                  { num: "3", label: "TALKING POINTS" },
                  { num: "3", label: "KEY FACTS" },
                  { num: "∞", label: "ACTION ITEMS" },
                  { num: "1-CLICK", label: "SCHEDULING" },
                ].map((s, i) => (
                  <div key={i} style={{
                    textAlign: "center", padding: "10px 0",
                    borderRight: i < 3 ? "1px solid var(--bdr)" : "none",
                    animation: `countUp 0.5s ease ${0.1 + i * 0.1}s both`,
                  }}>
                    <div className="stats-num" style={{ fontWeight: 800, color: "var(--g)", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em", marginBottom: 3 }}>{s.num}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#666", fontFamily: "'Space Mono',monospace", letterSpacing: "0.1em" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* FEATURES */}
            <section id="feat" className="page-pad" style={{ paddingTop: 44, paddingBottom: 60, maxWidth: 960, margin: "0 auto" }}>
              <h2 className="section-title" style={{
                fontWeight: 800, color: "#fff", textAlign: "center",
                fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em", marginBottom: 36,
              }}>
                What You <span style={{ color: "var(--g)" }}>Get</span>
              </h2>

              <div className="features-grid">
                {[
                  { icon: "🎯", title: "Top 3 Talking Points & Key Facts", desc: "Custom talking points and 3 key facts per contact — walk into every follow-up prepared.", clr: "var(--g)" },
                  { icon: "🔍", title: "Win-Win Action Items", desc: "Analyzes WhatsApp chats + LinkedIn to surface what they care about & collab opportunities.", clr: "var(--g2)" },
                  { icon: "✍️", title: "Follow-Ups In Your Voice", desc: "Drafts personalized messages that sound like you — built from your own messaging patterns.", clr: "var(--g)" },
                  { icon: "📅", title: "1-Click Scheduling", desc: "Auto-schedules follow-up meetings. Save hours/week by automating the boring parts.", clr: "var(--g2)" },
                ].map((f, i) => (
                  <div key={i} style={{
                    background: "var(--card)", border: "1px solid var(--bdr)",
                    borderRadius: 10, padding: "28px 24px",
                    animation: `fadeUp 0.5s ease ${i * 0.07}s both`,
                    transition: "border-color .3s, transform .2s", cursor: "default",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = f.clr; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--bdr)"; e.currentTarget.style.transform = "none"; }}>
                    <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                    <h3 className="feat-title" style={{ fontWeight: 800, color: "#fff", marginBottom: 10, fontFamily: "'Syne',sans-serif", letterSpacing: "-0.02em" }}>{f.title}</h3>
                    <p style={{ fontSize: 15, color: "#888", lineHeight: 1.7, fontFamily: "'Manrope',sans-serif" }}>{f.desc}</p>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: "center", marginTop: 50 }}>
                <p style={{ fontSize: 24, fontWeight: 800, color: "#fff", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.02em", marginBottom: 8 }}>
                  Make more connections that matter.
                </p>
                <p style={{ fontSize: 16, color: "var(--g)", fontWeight: 600, marginBottom: 28, fontFamily: "'Manrope',sans-serif" }}>
                  Voice-to-output for busy people · 100% Free to Start
                </p>
                <button className="cta" onClick={() => setScreen("input")}>GET STARTED FREE →</button>
              </div>
            </section>
          </div>
        )}

        {/* ════════ INPUT ════════ */}
        {screen === "input" && (
          <div className="page-pad" style={{ maxWidth: 800, margin: "0 auto", paddingTop: 40, paddingBottom: 70, animation: "fadeUp 0.5s ease" }}>

            <div className="steps-row" style={{ alignItems: "center", gap: 6, marginBottom: 36 }}>
              {["Upload Chat", "Add LinkedIn", "Get Results"].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                    background: i === 0 ? "var(--g)" : i === 1 ? "var(--gd)" : "rgba(255,255,255,0.04)",
                    color: i === 0 ? "#0a0a0a" : i === 1 ? "var(--g)" : "#555",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 800, fontFamily: "'Syne',sans-serif",
                    border: i === 1 ? "1.5px solid rgba(0,230,118,0.3)" : "none",
                  }}>{i + 1}</div>
                  <span style={{ fontSize: 14, fontWeight: i <= 1 ? 700 : 400, color: i <= 1 ? "#fff" : "#555", fontFamily: "'Manrope',sans-serif", whiteSpace: "nowrap" }}>{s}</span>
                  {i < 2 && <div style={{ width: 28, height: 1.5, background: i === 0 ? "var(--g)" : "var(--bdr)", margin: "0 2px", flexShrink: 0 }} />}
                </div>
              ))}
            </div>

            {/* WhatsApp */}
            <div className="input-section" style={{ background: "var(--card)", border: "1px solid var(--bdr)", borderRadius: 12, marginBottom: 20 }}>
              <h2 className="input-h" style={{ fontWeight: 800, color: "#fff", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.02em", marginBottom: 8 }}>
                💬 Paste Your WhatsApp Chat
              </h2>
              <p style={{ fontSize: 15, color: "#777", fontFamily: "'Manrope',sans-serif", lineHeight: 1.55, marginBottom: 18 }}>
                Export any WhatsApp conversation as .txt and paste below. We extract contacts + context automatically.
              </p>
              <button onClick={() => setChatText(SAMPLE_WHATSAPP)} style={{
                background: "var(--gd)", border: "1px solid rgba(0,230,118,0.22)",
                color: "var(--g)", borderRadius: 6, padding: "10px 20px",
                fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 14,
                fontFamily: "'Manrope',sans-serif",
              }}>▸ Load Sample Chat (AI Summit Demo)</button>
              <textarea className="inp" value={chatText} onChange={e => setChatText(e.target.value)}
                placeholder="Paste your WhatsApp .txt export here..."
                style={{ height: 180, resize: "vertical", fontFamily: "'Space Mono',monospace", fontSize: 12, lineHeight: 1.85, borderRadius: 8 }} />
              {chatText && <div style={{ marginTop: 10, fontSize: 13, color: "var(--g)", fontFamily: "'Space Mono',monospace" }}>✓ {chatText.split("\n").filter(l => l.trim()).length} messages loaded</div>}
            </div>

            {/* LinkedIn */}
            <div className="input-section" style={{ background: "var(--card)", border: "1px solid var(--bdr)", borderRadius: 12, marginBottom: 28 }}>
              <h2 className="input-h" style={{ fontWeight: 800, color: "#fff", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.02em", marginBottom: 8 }}>
                🔗 Add LinkedIn Context
              </h2>
              <p style={{ fontSize: 15, color: "#777", fontFamily: "'Manrope',sans-serif", marginBottom: 18 }}>
                Optional — enrich contacts with LinkedIn data for better results.
              </p>
              {liRows.map((r, i) => (
                <div key={i} className="li-grid" style={{ marginBottom: 10 }}>
                  {[["name","Name"],["role","Role"],["company","Company"],["url","LinkedIn URL"]].map(([f,ph]) => (
                    <input key={f} className="inp" placeholder={ph} value={r[f]} onChange={e => uLi(i,f,e.target.value)} style={{ padding: "12px 14px", fontSize: 14 }} />
                  ))}
                </div>
              ))}
              <button onClick={() => setLiRows([...liRows, { name:"", role:"", company:"", url:"" }])} style={{
                background: "none", border: "1.5px dashed rgba(255,255,255,0.1)",
                color: "#555", borderRadius: 8, padding: "10px 18px",
                fontSize: 14, cursor: "pointer", fontFamily: "'Manrope',sans-serif",
                width: "100%", marginTop: 6, transition: "all .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--g)"; e.currentTarget.style.color = "var(--g)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#555"; }}>
                + Add Another Contact
              </button>
            </div>

            <div style={{ textAlign: "center" }}>
              <button className="cta" onClick={() => { if (chatText) { setScreen("processing"); setTimeout(runN8nPipeline, 400); }}}
                style={{ opacity: chatText ? 1 : 0.35, cursor: chatText ? "pointer" : "default" }}>
                🚀 RUN LEVELUP PIPELINE
              </button>
              {!chatText && <p style={{ marginTop: 12, fontSize: 14, color: "#555", fontFamily: "'Manrope',sans-serif" }}>Paste or load a chat to get started</p>}
            </div>
          </div>
        )}

        {/* ════════ PROCESSING ════════ */}
        {screen === "processing" && (
          <div className="page-pad" style={{ maxWidth: 720, margin: "0 auto", paddingTop: 70, paddingBottom: 70, textAlign: "center", animation: "fadeIn 0.4s ease" }}>
            <h2 className="process-title" style={{ fontWeight: 800, color: "#fff", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em", marginBottom: 10 }}>
              Agents <span style={{ color: "var(--g)" }}>Working</span>...
            </h2>
            <p style={{ fontSize: 16, color: "#777", marginBottom: 44, fontFamily: "'Manrope',sans-serif" }}>
              3-agent pipeline analyzing your conversations
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "left" }}>
              {[
                { label: "AGENT 1 — EXTRACTOR", desc: "Parsing contacts, roles, context, and sentiment", icon: "🔍" },
                { label: "AGENT 2 — VOICE WRITER", desc: "Drafting personalized messages in your voice", icon: "✍️" },
                { label: "AGENT 3 — SYNTHESIZER", desc: "Generating talking points, action items & scheduling", icon: "⚡" },
              ].map((a, i) => {
                const on = agentStep === i, done = agentStep > i;
                return (
                  <div key={i} style={{
                    background: done ? "rgba(0,230,118,0.04)" : on ? "rgba(0,230,118,0.025)" : "var(--card)",
                    border: `1.5px solid ${done ? "rgba(0,230,118,0.22)" : on ? "rgba(0,230,118,0.14)" : "var(--bdr)"}`,
                    borderRadius: 10, padding: "22px 22px", transition: "all .5s",
                    opacity: agentStep >= i ? 1 : 0.25, animation: on ? "glow 2s ease infinite" : "none",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ fontSize: 28 }}>{a.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Syne',sans-serif", color: done ? "var(--g)" : on ? "#fff" : "#666", letterSpacing: "0.02em", marginBottom: 2 }}>{a.label}</div>
                        <div style={{ fontSize: 13, color: done ? "rgba(0,230,118,0.6)" : "#777", fontFamily: "'Manrope',sans-serif" }}>{a.desc}</div>
                      </div>
                      <div style={{ fontSize: 20, flexShrink: 0 }}>
                        {done ? "✅" : on ? <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2.5px solid var(--g)", borderTopColor: "transparent", animation: "spin .7s linear infinite" }} /> : "○"}
                      </div>
                    </div>
                    {on && (
                      <div style={{ marginTop: 12, height: 3, borderRadius: 3, background: "rgba(0,230,118,0.08)", overflow: "hidden", position: "relative" }}>
                        <div style={{ position: "absolute", inset: 0, width: "35%", background: "linear-gradient(90deg,transparent,var(--g),transparent)", animation: "scan 1.4s ease infinite" }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════ RESULTS ════════ */}
        {screen === "results" && (
          <div className="page-pad" style={{ maxWidth: 900, margin: "0 auto", paddingTop: 36, paddingBottom: 70, animation: "fadeUp 0.5s ease" }}>

            <div style={{
              background: "linear-gradient(135deg,rgba(0,230,118,0.06),rgba(0,200,83,0.04))",
              border: "1px solid rgba(0,230,118,0.18)", borderRadius: 10,
              padding: "18px 22px", marginBottom: 26,
            }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "var(--g)", fontFamily: "'Syne',sans-serif" }}>✓ PIPELINE COMPLETE </span>
              <span style={{ fontSize: 13, color: "#888", fontFamily: "'Manrope',sans-serif" }}>— 2 contacts · 6 talking points · 6 key facts · 6 action items · 2 messages</span>
            </div>

            {/* Contact tabs */}
            <div className="contact-tabs" style={{ marginBottom: 24 }}>
              {RESULTS.map((c, i) => (
                <button key={i} onClick={() => setActive(i)} style={{
                  flex: 1, padding: "16px 18px", textAlign: "left",
                  background: active === i ? "var(--gd)" : "var(--card)",
                  border: `2px solid ${active === i ? "var(--g)" : "var(--bdr)"}`,
                  borderRadius: 10, cursor: "pointer", transition: "all .2s",
                }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: active === i ? "var(--g)" : "#fff", fontFamily: "'Syne',sans-serif" }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: active === i ? "rgba(0,230,118,0.6)" : "#777", fontFamily: "'Manrope',sans-serif", marginTop: 2 }}>{c.role} @ {c.company}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 4, background: "var(--gd)", color: "var(--g)", fontWeight: 700, fontFamily: "'Space Mono',monospace" }}>{c.priority}</span>
                    <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 4, background: "var(--g2d)", color: "var(--g2)", fontWeight: 700, fontFamily: "'Space Mono',monospace" }}>{c.sentiment}</span>
                  </div>
                </button>
              ))}
            </div>

            {(() => {
              const c = RESULTS[active];
              return (
                <div key={active} style={{ animation: "fadeIn 0.3s ease" }}>
                  <div className="results-3col" style={{ marginBottom: 22 }}>
                    {[
                      { title: "🎯 TOP 3 TALKING POINTS", items: c.talkingPoints, clr: "var(--g)", blr: "rgba(0,230,118,0.16)" },
                      { title: "💡 3 KEY FACTS", items: c.keyFacts, clr: "var(--g2)", blr: "rgba(0,200,83,0.16)" },
                      { title: "⚡ ACTION ITEMS", items: c.actionItems, clr: "var(--g)", blr: "rgba(0,230,118,0.16)" },
                    ].map((sec, si) => (
                      <div key={si} style={{
                        background: "var(--card)", border: "1px solid var(--bdr)",
                        borderRadius: 10, padding: "22px 18px",
                        borderTop: `3px solid ${sec.clr}`,
                      }}>
                        <h3 style={{ fontSize: 12, fontWeight: 800, color: sec.clr, fontFamily: "'Syne',sans-serif", letterSpacing: "0.04em", marginBottom: 16 }}>{sec.title}</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          {sec.items.map((item, ii) => (
                            <div key={ii} style={{
                              fontSize: 14, color: "#ccc", lineHeight: 1.6,
                              fontFamily: "'Manrope',sans-serif", paddingLeft: 14,
                              borderLeft: `2px solid ${sec.blr}`,
                            }}>{item}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message */}
                  <div style={{ background: "var(--card)", border: "1px solid var(--bdr)", borderRadius: 10, padding: "24px 22px", marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                      <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.02em" }}>✍️ DRAFTED FOLLOW-UP</h3>
                      <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 4, background: "rgba(255,255,255,0.05)", color: "#888", fontFamily: "'Space Mono',monospace" }}>Tone: {c.tone}</span>
                    </div>
                    <div style={{
                      background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,230,118,0.08)",
                      borderRadius: 8, padding: "20px 20px",
                      fontSize: 15, color: "#ddd", lineHeight: 1.8,
                      fontFamily: "'Manrope',sans-serif", whiteSpace: "pre-line", marginBottom: 18,
                    }}>{c.draftMessage}</div>
                    <div className="msg-btns">
                      <button className="cta" style={{ padding: "14px 26px", fontSize: 14 }}
                        onClick={() => { setCopied(active); setTimeout(() => setCopied(-1), 2500); }}>
                        {copied === active ? "✓ COPIED!" : "📋 COPY MESSAGE"}
                      </button>
                      <button className="cta2" style={{ padding: "14px 26px", fontSize: 14 }}>📅 SCHEDULE FOLLOW-UP</button>
                      <button className="cta-o" style={{ padding: "12px 22px", fontSize: 13 }}>✏️ EDIT & REGENERATE</button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* FEEDBACK */}
            <div style={{
              marginTop: 40, textAlign: "center", padding: "36px 24px",
              background: "linear-gradient(135deg,rgba(0,200,83,0.035),rgba(0,230,118,0.03))",
              border: "1px solid rgba(0,230,118,0.12)", borderRadius: 12,
            }}>
              {fbDone ? (
                <div>
                  <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, color: "var(--g)", fontFamily: "'Syne',sans-serif", marginBottom: 6 }}>Thanks for your feedback!</h3>
                  <p style={{ fontSize: 15, color: "#888", fontFamily: "'Manrope',sans-serif" }}>Your input directly shapes what we build next.</p>
                </div>
              ) : (
                <div>
                  <h3 style={{ fontSize: 26, fontWeight: 800, color: "#fff", fontFamily: "'Syne',sans-serif", letterSpacing: "-0.02em", marginBottom: 8 }}>How'd It Go?</h3>
                  <p style={{ fontSize: 15, color: "#888", marginBottom: 28, fontFamily: "'Manrope',sans-serif" }}>30 seconds — help us build what you need.</p>
                  <div className="fb-grid" style={{ display: "flex", flexDirection: "column", gap: 24, margin: "0 auto", textAlign: "left" }}>
                    <div>
                      <label style={{ display: "block", fontSize: 15, fontWeight: 700, color: "#ddd", marginBottom: 10, fontFamily: "'Manrope',sans-serif" }}>How useful is this?</label>
                      <div style={{ display: "flex", gap: 8 }}>
                        {[1,2,3,4,5].map(n => (
                          <button key={n} onClick={() => setFbR(n)} style={{
                            width: 50, height: 50, borderRadius: 6,
                            border: `2px solid ${fbR >= n ? "var(--g)" : "var(--bdr)"}`,
                            background: fbR >= n ? "var(--gd)" : "var(--card)",
                            color: fbR >= n ? "var(--g)" : "#555",
                            fontSize: 20, fontWeight: 800, cursor: "pointer",
                            fontFamily: "'Syne',sans-serif", transition: "all .15s",
                          }}>{n}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 15, fontWeight: 700, color: "#ddd", marginBottom: 10, fontFamily: "'Manrope',sans-serif" }}>What would you pay?</label>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {["$6/mo","$29/3mo","$49/3mo","Not yet"].map(p => (
                          <button key={p} onClick={() => setFbP(p)} style={{
                            padding: "10px 20px", borderRadius: 6,
                            border: `2px solid ${fbP === p ? "var(--g2)" : "var(--bdr)"}`,
                            background: fbP === p ? "var(--g2d)" : "var(--card)",
                            color: fbP === p ? "var(--g2)" : "#888",
                            fontSize: 14, fontWeight: 700, cursor: "pointer",
                            fontFamily: "'Manrope',sans-serif", transition: "all .15s",
                          }}>{p}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 15, fontWeight: 700, color: "#ddd", marginBottom: 10, fontFamily: "'Manrope',sans-serif" }}>What would make this indispensable?</label>
                      <textarea className="inp" value={fbT} onChange={e => setFbT(e.target.value)}
                        placeholder="What would you keep using it for? What's missing?"
                        style={{ height: 85, resize: "vertical", fontFamily: "'Manrope',sans-serif", fontSize: 14, borderRadius: 8 }} />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <button className="cta" onClick={() => setFbDone(true)} style={{ fontSize: 15 }}>SUBMIT FEEDBACK</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
