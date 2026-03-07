import { useState, useEffect, useRef } from "react";

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

const SAMPLE_CONTACTS = [
  {
    name: "Sarah Chen",
    role: "Senior ML Engineer",
    company: "Anthropic",
    linkedin: "linkedin.com/in/sarahchen",
    context: "Met at AI Summit — discussed RAG pipelines, multi-agent architectures",
    sharedInterests: ["Multi-agent systems", "RAG", "LLM orchestration"],
    sentiment: "warm",
    priority: "high",
  },
  {
    name: "Marcus Johnson",
    role: "Partner",
    company: "Gradient Ventures",
    linkedin: "linkedin.com/in/marcusjvc",
    context: "Networking mixer — interested in LevelUp.ai, offered investor intros",
    sharedInterests: ["AI startups", "Venture capital", "Automation"],
    sentiment: "enthusiastic",
    priority: "high",
  },
];

const SAMPLE_MESSAGES = [
  {
    contact: "Sarah Chen",
    subject: "Great connecting at AI Summit",
    message: `Hey Sarah — really enjoyed our conversation at the AI Summit yesterday. Your perspective on multi-agent orchestration at Anthropic was fascinating, especially the challenges around agent coordination you mentioned.\n\nI've been thinking more about how RAG layers could solve some of those context-window limitations we discussed. Would love to continue that thread over coffee next week — are you free Tuesday or Wednesday afternoon?`,
    tone: "Professional-warm",
    channel: "WhatsApp",
  },
  {
    contact: "Marcus Johnson",
    subject: "LevelUp.ai — investor intro",
    message: `Marcus! Great meeting you at the mixer. Really appreciate your enthusiasm about LevelUp.ai — means a lot coming from someone at Gradient.\n\nI'd love to take you up on that investor intro when you have a moment. Happy to send over a one-pager or jump on a quick call this week to give you the full picture first. Whatever's easiest for you.`,
    tone: "Casual-confident",
    channel: "WhatsApp",
  },
];

const AGENT_STEPS = [
  {
    agent: "Agent 1 — Extractor",
    icon: "🔍",
    desc: "Parse contacts, roles, context from chat history",
    status: "complete",
    output: "Extracted 2 contacts with roles, companies, shared context",
  },
  {
    agent: "Agent 2 — Voice Writer",
    icon: "✍️",
    desc: "Draft personalized message matching your tone",
    status: "complete",
    output: "Generated 2 follow-ups in user's casual-professional voice",
  },
  {
    agent: "Agent 3 — Synthesizer",
    icon: "⚡",
    desc: "Action items, talking points, scheduling suggestions",
    status: "complete",
    output: "Created action items: 1 coffee meeting, 1 investor intro, 2 calendar links",
  },
];

const FEATURES_STATUS = [
  { name: "WhatsApp Chat Ingestion", status: "demo", icon: "💬" },
  { name: "LinkedIn Contact Context", status: "demo", icon: "🔗" },
  { name: "Multi-Agent Pipeline (CrewAI)", status: "demo", icon: "🤖" },
  { name: "RAG Layer (Chroma)", status: "planned", icon: "🧠" },
  { name: "Personalized Outreach Gen", status: "demo", icon: "📝" },
  { name: "1-Click Scheduling (Cal.com)", status: "planned", icon: "📅" },
  { name: "Slack Ingestion", status: "planned", icon: "💼" },
  { name: "PostHog Analytics", status: "planned", icon: "📊" },
  { name: "Tally.so Feedback", status: "planned", icon: "📋" },
];

function StatusBadge({ status }) {
  const colors = {
    demo: { bg: "rgba(0, 255, 136, 0.12)", text: "#00ff88", label: "DEMO READY" },
    planned: { bg: "rgba(255, 170, 0, 0.12)", text: "#ffaa00", label: "PLANNED" },
    live: { bg: "rgba(0, 200, 255, 0.12)", text: "#00c8ff", label: "LIVE" },
  };
  const c = colors[status] || colors.planned;
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        padding: "3px 10px",
        borderRadius: "4px",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {c.label}
    </span>
  );
}

function AgentPipeline({ running, onComplete }) {
  const [activeStep, setActiveStep] = useState(-1);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!running) return;
    setActiveStep(0);
    setLogs([]);
    const timers = [];
    AGENT_STEPS.forEach((step, i) => {
      timers.push(
        setTimeout(() => {
          setActiveStep(i);
          setLogs((prev) => [...prev, `▸ ${step.agent}: ${step.output}`]);
          if (i === AGENT_STEPS.length - 1) {
            setTimeout(() => onComplete?.(), 800);
          }
        }, (i + 1) * 1400)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [running]);

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        {AGENT_STEPS.map((step, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background:
                activeStep >= i
                  ? "linear-gradient(135deg, rgba(0,255,136,0.08), rgba(0,200,255,0.06))"
                  : "rgba(255,255,255,0.02)",
              border: `1px solid ${activeStep >= i ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 10,
              padding: "14px 16px",
              transition: "all 0.5s ease",
              opacity: activeStep >= i ? 1 : 0.35,
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>{step.icon}</div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: activeStep >= i ? "#00ff88" : "#666",
                fontFamily: "'JetBrains Mono', monospace",
                marginBottom: 4,
              }}
            >
              {step.agent}
            </div>
            <div style={{ fontSize: 11, color: "#888", lineHeight: 1.4 }}>{step.desc}</div>
            {activeStep === i && running && (
              <div
                style={{
                  marginTop: 8,
                  height: 2,
                  background: "linear-gradient(90deg, #00ff88, transparent)",
                  borderRadius: 1,
                  animation: "pulse 1s ease infinite",
                }}
              />
            )}
          </div>
        ))}
      </div>
      {logs.length > 0 && (
        <div
          style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(0,255,136,0.15)",
            borderRadius: 8,
            padding: 14,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#00ff88",
            maxHeight: 120,
            overflow: "auto",
          }}
        >
          {logs.map((log, i) => (
            <div key={i} style={{ marginBottom: 4, opacity: 0.9 }}>
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MessageCard({ msg, index }) {
  const [copied, setCopied] = useState(false);
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        padding: 20,
        marginBottom: 14,
        animation: `fadeSlideIn 0.5s ease ${index * 0.15}s both`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <span style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>{msg.contact}</span>
          <span
            style={{
              marginLeft: 10,
              fontSize: 10,
              padding: "3px 8px",
              background: "rgba(0,200,255,0.1)",
              color: "#00c8ff",
              borderRadius: 4,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
            }}
          >
            {msg.channel}
          </span>
        </div>
        <span style={{ fontSize: 10, color: "#666", fontFamily: "'JetBrains Mono', monospace" }}>{msg.tone}</span>
      </div>
      <div
        style={{
          fontSize: 13,
          color: "#ccc",
          lineHeight: 1.7,
          whiteSpace: "pre-line",
          marginBottom: 14,
        }}
      >
        {msg.message}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          style={{
            background: copied ? "rgba(0,255,136,0.15)" : "rgba(255,255,255,0.06)",
            border: `1px solid ${copied ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.1)"}`,
            color: copied ? "#00ff88" : "#aaa",
            padding: "7px 16px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {copied ? "✓ Copied" : "Copy Message"}
        </button>
        <button
          style={{
            background: "rgba(0,200,255,0.08)",
            border: "1px solid rgba(0,200,255,0.2)",
            color: "#00c8ff",
            padding: "7px 16px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          📅 Schedule Follow-up
        </button>
        <button
          style={{
            background: "rgba(255,170,0,0.08)",
            border: "1px solid rgba(255,170,0,0.2)",
            color: "#ffaa00",
            padding: "7px 16px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ✏️ Edit & Regenerate
        </button>
      </div>
    </div>
  );
}

export default function LevelUpApp() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [chatText, setChatText] = useState("");
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineComplete, setPipelineComplete] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [priceChoice, setPriceChoice] = useState("");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "◈" },
    { id: "upload", label: "Ingest Chat", icon: "↑" },
    { id: "contacts", label: "Contacts", icon: "◎" },
    { id: "pipeline", label: "Agent Pipeline", icon: "⬡" },
    { id: "messages", label: "Outreach", icon: "▹" },
    { id: "feedback", label: "Feedback", icon: "✦" },
  ];

  const loadSample = () => {
    setChatText(SAMPLE_WHATSAPP);
  };

  const runPipeline = () => {
    setPipelineRunning(true);
    setPipelineComplete(false);
    setShowMessages(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#e0e0e0",
        fontFamily: "'Outfit', 'Satoshi', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,255,136,0.2); border-radius: 4px; }
        textarea:focus, input:focus { outline: none; }
      `}</style>

      {/* Ambient background */}
      <div
        style={{
          position: "fixed",
          top: "-40%",
          right: "-20%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-30%",
          left: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,200,255,0.03) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <header
        style={{
          padding: "18px 28px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backdropFilter: "blur(20px)",
          background: "rgba(10,10,15,0.8)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "linear-gradient(135deg, #00ff88, #00c8ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 900,
              color: "#0a0a0f",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            L
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" }}>
              <span style={{ color: "#fff" }}>Level</span>
              <span style={{ color: "#00ff88" }}>Up</span>
              <span style={{ color: "#555", fontWeight: 400 }}>.ai</span>
            </div>
            <div
              style={{
                fontSize: 9,
                color: "#555",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              10x your networking
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              fontSize: 9,
              color: "#00ff88",
              fontFamily: "'JetBrains Mono', monospace",
              background: "rgba(0,255,136,0.08)",
              padding: "4px 10px",
              borderRadius: 4,
              border: "1px solid rgba(0,255,136,0.15)",
              letterSpacing: "0.05em",
            }}
          >
            BETA v0.1
          </span>
        </div>
      </header>

      <div style={{ display: "flex", minHeight: "calc(100vh - 73px)" }}>
        {/* Sidebar */}
        <nav
          style={{
            width: 200,
            borderRight: "1px solid rgba(255,255,255,0.05)",
            padding: "20px 10px",
            background: "rgba(255,255,255,0.01)",
            flexShrink: 0,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 14px",
                marginBottom: 3,
                border: "none",
                borderRadius: 8,
                background: activeTab === tab.id ? "rgba(0,255,136,0.08)" : "transparent",
                color: activeTab === tab.id ? "#00ff88" : "#666",
                fontSize: 13,
                fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.2s",
                textAlign: "left",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main style={{ flex: 1, padding: "28px 36px", maxWidth: 900, overflow: "auto" }}>
          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div style={{ animation: "fadeSlideIn 0.4s ease" }}>
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  marginBottom: 6,
                  letterSpacing: "-0.03em",
                  background: "linear-gradient(135deg, #fff 40%, #00ff88)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                LevelUp.ai Dashboard
              </h1>
              <p style={{ color: "#666", fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
                Multi-agent networking automation — auto-follow-up from WhatsApp & LinkedIn in your voice.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 14,
                  marginBottom: 32,
                }}
              >
                {[
                  { label: "Contacts Extracted", value: "2", color: "#00ff88" },
                  { label: "Messages Drafted", value: "2", color: "#00c8ff" },
                  { label: "Follow-ups Pending", value: "2", color: "#ffaa00" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 12,
                      padding: "18px 20px",
                    }}
                  >
                    <div style={{ fontSize: 32, fontWeight: 800, color: stat.color, marginBottom: 4 }}>
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#666",
                        fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#888",
                  marginBottom: 14,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Feature Status
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {FEATURES_STATUS.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "11px 16px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.04)",
                      borderRadius: 8,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 16 }}>{f.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{f.name}</span>
                    </div>
                    <StatusBadge status={f.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UPLOAD / INGEST */}
          {activeTab === "upload" && (
            <div style={{ animation: "fadeSlideIn 0.4s ease" }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.02em" }}>
                💬 Ingest Chat History
              </h1>
              <p style={{ color: "#666", fontSize: 13, marginBottom: 20 }}>
                Paste a WhatsApp .txt export below. LevelUp extracts contacts, context, and conversation signals.
              </p>

              <button
                onClick={loadSample}
                style={{
                  background: "rgba(0,255,136,0.08)",
                  border: "1px solid rgba(0,255,136,0.2)",
                  color: "#00ff88",
                  padding: "8px 18px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  marginBottom: 14,
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                ▸ Load Sample Chat (AI Summit)
              </button>

              <textarea
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                placeholder="Paste WhatsApp .txt export here..."
                style={{
                  width: "100%",
                  height: 240,
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  padding: 16,
                  color: "#ccc",
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                  lineHeight: 1.7,
                  resize: "vertical",
                }}
              />

              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button
                  onClick={() => {
                    if (chatText) {
                      setActiveTab("pipeline");
                      setTimeout(() => runPipeline(), 400);
                    }
                  }}
                  disabled={!chatText}
                  style={{
                    background: chatText
                      ? "linear-gradient(135deg, #00ff88, #00c8ff)"
                      : "rgba(255,255,255,0.05)",
                    border: "none",
                    color: chatText ? "#0a0a0f" : "#444",
                    padding: "11px 28px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: chatText ? "pointer" : "default",
                    fontFamily: "'Outfit', sans-serif",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Run Agent Pipeline →
                </button>
                <span style={{ fontSize: 11, color: "#555", alignSelf: "center" }}>
                  {chatText ? `${chatText.split("\n").length} lines loaded` : "No chat loaded"}
                </span>
              </div>
            </div>
          )}

          {/* CONTACTS */}
          {activeTab === "contacts" && (
            <div style={{ animation: "fadeSlideIn 0.4s ease" }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.02em" }}>
                ◎ Extracted Contacts
              </h1>
              <p style={{ color: "#666", fontSize: 13, marginBottom: 20 }}>
                Contacts parsed from chat + LinkedIn context enrichment.
              </p>

              {SAMPLE_CONTACTS.map((c, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 12,
                    padding: 22,
                    marginBottom: 14,
                    animation: `fadeSlideIn 0.4s ease ${i * 0.1}s both`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 3 }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: 13, color: "#00c8ff", fontWeight: 500 }}>
                        {c.role} @ {c.company}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span
                        style={{
                          fontSize: 9,
                          padding: "3px 8px",
                          background:
                            c.priority === "high"
                              ? "rgba(0,255,136,0.1)"
                              : "rgba(255,255,255,0.05)",
                          color: c.priority === "high" ? "#00ff88" : "#888",
                          borderRadius: 4,
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }}
                      >
                        {c.priority} priority
                      </span>
                      <span
                        style={{
                          fontSize: 9,
                          padding: "3px 8px",
                          background: "rgba(0,200,255,0.08)",
                          color: "#00c8ff",
                          borderRadius: 4,
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: 600,
                        }}
                      >
                        {c.sentiment}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#999",
                      marginBottom: 10,
                      padding: "8px 12px",
                      background: "rgba(0,0,0,0.2)",
                      borderRadius: 6,
                      borderLeft: "2px solid rgba(0,255,136,0.3)",
                    }}
                  >
                    {c.context}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {c.sharedInterests.map((interest, j) => (
                      <span
                        key={j}
                        style={{
                          fontSize: 10,
                          padding: "3px 10px",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: 20,
                          color: "#aaa",
                        }}
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 11,
                      color: "#555",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    🔗 {c.linkedin}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PIPELINE */}
          {activeTab === "pipeline" && (
            <div style={{ animation: "fadeSlideIn 0.4s ease" }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.02em" }}>
                ⬡ Multi-Agent Pipeline
              </h1>
              <p style={{ color: "#666", fontSize: 13, marginBottom: 16 }}>
                CrewAI 3-agent system: Extract → Draft → Synthesize
              </p>

              {!pipelineRunning && !pipelineComplete && (
                <button
                  onClick={runPipeline}
                  style={{
                    background: "linear-gradient(135deg, #00ff88, #00c8ff)",
                    border: "none",
                    color: "#0a0a0f",
                    padding: "11px 28px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "'Outfit', sans-serif",
                    marginBottom: 14,
                  }}
                >
                  ▸ Run Pipeline{chatText ? "" : " (load chat first)"}
                </button>
              )}

              <AgentPipeline
                running={pipelineRunning}
                onComplete={() => {
                  setPipelineRunning(false);
                  setPipelineComplete(true);
                  setShowMessages(true);
                }}
              />

              {pipelineComplete && (
                <div
                  style={{
                    marginTop: 20,
                    padding: "14px 20px",
                    background: "rgba(0,255,136,0.06)",
                    border: "1px solid rgba(0,255,136,0.2)",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ color: "#00ff88", fontSize: 13, fontWeight: 600 }}>
                    ✓ Pipeline complete — 2 contacts, 2 messages, 3 action items generated
                  </span>
                  <button
                    onClick={() => setActiveTab("messages")}
                    style={{
                      background: "rgba(0,255,136,0.15)",
                      border: "1px solid rgba(0,255,136,0.3)",
                      color: "#00ff88",
                      padding: "7px 16px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    View Messages →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MESSAGES */}
          {activeTab === "messages" && (
            <div style={{ animation: "fadeSlideIn 0.4s ease" }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.02em" }}>
                ▹ Generated Outreach
              </h1>
              <p style={{ color: "#666", fontSize: 13, marginBottom: 20 }}>
                Personalized follow-ups drafted in your voice. Copy, edit, or schedule.
              </p>

              {SAMPLE_MESSAGES.map((msg, i) => (
                <MessageCard key={i} msg={msg} index={i} />
              ))}
            </div>
          )}

          {/* FEEDBACK */}
          {activeTab === "feedback" && (
            <div style={{ animation: "fadeSlideIn 0.4s ease" }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.02em" }}>
                ✦ Beta Feedback
              </h1>
              <p style={{ color: "#666", fontSize: 13, marginBottom: 24 }}>
                Help us build what you actually need. Takes 30 seconds.
              </p>

              {feedbackSent ? (
                <div
                  style={{
                    padding: 40,
                    textAlign: "center",
                    background: "rgba(0,255,136,0.04)",
                    border: "1px solid rgba(0,255,136,0.15)",
                    borderRadius: 14,
                  }}
                >
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#00ff88", marginBottom: 6 }}>
                    Thanks for your feedback!
                  </div>
                  <div style={{ fontSize: 13, color: "#888" }}>
                    Your input directly shapes what we build next.
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14,
                    padding: 28,
                  }}
                >
                  <div style={{ marginBottom: 22 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#ccc",
                        marginBottom: 8,
                      }}
                    >
                      How useful is this for your networking workflow?
                    </label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => setFeedbackRating(n)}
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 8,
                            border: `1px solid ${feedbackRating >= n ? "rgba(0,255,136,0.4)" : "rgba(255,255,255,0.08)"}`,
                            background:
                              feedbackRating >= n
                                ? "rgba(0,255,136,0.12)"
                                : "rgba(255,255,255,0.03)",
                            color: feedbackRating >= n ? "#00ff88" : "#666",
                            fontSize: 16,
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 22 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#ccc",
                        marginBottom: 8,
                      }}
                    >
                      What would you pay monthly?
                    </label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {["$6/mo", "$29/3mo", "$49/3mo", "Not yet"].map((p) => (
                        <button
                          key={p}
                          onClick={() => setPriceChoice(p)}
                          style={{
                            padding: "8px 16px",
                            borderRadius: 6,
                            border: `1px solid ${priceChoice === p ? "rgba(0,200,255,0.4)" : "rgba(255,255,255,0.08)"}`,
                            background:
                              priceChoice === p
                                ? "rgba(0,200,255,0.12)"
                                : "rgba(255,255,255,0.03)",
                            color: priceChoice === p ? "#00c8ff" : "#888",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s",
                            fontFamily: "'Outfit', sans-serif",
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 22 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#ccc",
                        marginBottom: 8,
                      }}
                    >
                      What would you keep using it for? What's missing?
                    </label>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Tell us what would make this indispensable..."
                      style={{
                        width: "100%",
                        height: 100,
                        background: "rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 8,
                        padding: 14,
                        color: "#ccc",
                        fontSize: 13,
                        fontFamily: "'Outfit', sans-serif",
                        lineHeight: 1.6,
                        resize: "vertical",
                      }}
                    />
                  </div>

                  <button
                    onClick={() => setFeedbackSent(true)}
                    style={{
                      background: "linear-gradient(135deg, #00ff88, #00c8ff)",
                      border: "none",
                      color: "#0a0a0f",
                      padding: "11px 32px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    Submit Feedback
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
