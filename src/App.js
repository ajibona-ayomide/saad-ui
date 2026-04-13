import { useState, useEffect, useCallback, useRef } from "react";
// useRef already imported above
import axios from "axios";

// ─── API (unchanged — same backend) ──────────────────────────────────────────
const API = axios.create({ baseURL: "http://127.0.0.1:5000/api" });
API.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("saad_token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

// ─── Global styles ────────────────────────────────────────────────────────────
const G = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg:       #03060f;
  --surface:  #080e1c;
  --surface2: #0c1525;
  --border:   rgba(255,255,255,0.07);
  --border2:  rgba(255,255,255,0.12);
  --cyan:     #00e5ff;
  --cyan2:    #0099cc;
  --violet:   #7c5cff;
  --rose:     #ff4d6d;
  --amber:    #ffb627;
  --emerald:  #00d68f;
  --text:     #f0f4ff;
  --muted:    rgba(240,244,255,0.45);
  --subtle:   rgba(240,244,255,0.2);
  --mono:     'JetBrains Mono', monospace;
  --display:  'Syne', sans-serif;
  --body:     'DM Sans', sans-serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { height: 100%; background: var(--bg); color: var(--text); font-family: var(--body); -webkit-font-smoothing: antialiased; }
::-webkit-scrollbar { width: 3px; background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(0,229,255,0.2); border-radius: 2px; }

@keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn  { from{opacity:0} to{opacity:1} }
@keyframes spin    { to{transform:rotate(360deg)} }
@keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
@keyframes glow    { 0%,100%{box-shadow:0 0 20px rgba(0,229,255,0.15)} 50%{box-shadow:0 0 40px rgba(0,229,255,0.35)} }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
@keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }

.fade-up  { animation: fadeUp  0.45s cubic-bezier(.22,.68,0,1.2) both; }
.fade-in  { animation: fadeIn  0.3s ease both; }
.slide-in { animation: slideIn 0.3s ease both; }
.s1{animation-delay:.05s}.s2{animation-delay:.1s}.s3{animation-delay:.15s}
.s4{animation-delay:.2s} .s5{animation-delay:.25s}

input, select, textarea {
  background: rgba(255,255,255,0.04); border: 1px solid var(--border2);
  color: var(--text); font-family: var(--body); font-size: 14px;
  padding: 11px 16px; border-radius: 10px; outline: none; width: 100%;
  transition: border-color .2s, box-shadow .2s;
}
input:focus, select:focus { border-color: var(--cyan); box-shadow: 0 0 0 3px rgba(0,229,255,0.1); }
input::placeholder { color: var(--subtle); }

button { cursor: pointer; font-family: var(--body); transition: all .2s; border: none; }

.btn-primary {
  background: linear-gradient(135deg, var(--cyan) 0%, var(--cyan2) 100%);
  color: #03060f; font-weight: 600; font-size: 14px;
  padding: 11px 24px; border-radius: 10px; letter-spacing: .3px;
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(0,229,255,0.3); }
.btn-primary:active { transform: translateY(0); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.btn-ghost {
  background: rgba(255,255,255,0.05); color: var(--text); font-size: 13px;
  padding: 9px 18px; border-radius: 10px; border: 1px solid var(--border2);
}
.btn-ghost:hover { background: rgba(255,255,255,0.09); }

.btn-danger {
  background: rgba(255,77,109,0.1); color: var(--rose); font-size: 13px;
  padding: 7px 14px; border-radius: 8px; border: 1px solid rgba(255,77,109,0.2);
}
.btn-danger:hover { background: rgba(255,77,109,0.18); }

.card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 16px; padding: 24px; position: relative; overflow: hidden;
  transition: border-color .25s;
}
.card:hover { border-color: var(--border2); }

.glass {
  background: rgba(8,14,28,0.8); backdrop-filter: blur(20px);
  border: 1px solid var(--border2); border-radius: 16px;
}

.stat-pill {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 11px; border-radius: 100px;
  font-size: 11px; font-family: var(--mono); font-weight: 500; letter-spacing: .5px;
}
.pill-high   { background: rgba(255,77,109,0.12);  color: var(--rose);    border: 1px solid rgba(255,77,109,0.25); }
.pill-medium { background: rgba(255,182,39,0.12);  color: var(--amber);   border: 1px solid rgba(255,182,39,0.25); }
.pill-low    { background: rgba(0,214,143,0.1);    color: var(--emerald); border: 1px solid rgba(0,214,143,0.2); }
.pill-info   { background: rgba(0,229,255,0.1);    color: var(--cyan);    border: 1px solid rgba(0,229,255,0.2); }
.pill-open   { background: rgba(124,92,255,0.12);  color: var(--violet);  border: 1px solid rgba(124,92,255,0.25); }

table { width: 100%; border-collapse: collapse; }
thead th {
  padding: 10px 16px; font-size: 10px; font-weight: 600; letter-spacing: 1.5px;
  text-transform: uppercase; color: var(--muted); border-bottom: 1px solid var(--border);
  font-family: var(--mono); text-align: left;
}
tbody tr { border-bottom: 1px solid rgba(255,255,255,0.03); transition: background .15s; }
tbody tr:hover { background: rgba(0,229,255,0.02); }
tbody td { padding: 13px 16px; font-size: 13px; color: var(--muted); }

.nav-item {
  display: flex; align-items: center; gap: 11px; padding: 10px 14px;
  border-radius: 10px; cursor: pointer; font-size: 13.5px; color: var(--muted);
  transition: all .15s; position: relative; letter-spacing: .1px;
}
.nav-item:hover { background: rgba(255,255,255,0.05); color: var(--text); }
.nav-item.active { background: rgba(0,229,255,0.08); color: var(--cyan); }
.nav-item.active::before {
  content: ''; position: absolute; left: 0; top: 25%; bottom: 25%;
  width: 2px; background: var(--cyan); border-radius: 0 2px 2px 0;
  box-shadow: 0 0 8px var(--cyan);
}

.page-title { font-family: var(--display); font-size: 28px; font-weight: 700; letter-spacing: -.5px; color: var(--text); line-height: 1.1; }
.label { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--subtle); font-family: var(--mono); }
.scroll { overflow-y: auto; height: 100%; }
.scroll::-webkit-scrollbar { width: 2px; }
`;

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ic = ({ n, s = 16, c = "currentColor" }) => {
  const p = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    alerts:    <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    logs:      <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    anomaly:   <><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></>,
    reports:   <><path d="M21.21 15.89A10 10 0 118 2.83"/><path d="M22 12A10 10 0 0012 2v10z"/></>,
    users:     <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
    profile:   <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    collection:<><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
    shield:    <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    search:    <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    logout:    <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    chevron:   <><polyline points="9 18 15 12 9 6"/></>,
    plus:      <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    trash:     <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></>,
    zap:       <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
         stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
         style={{ flexShrink: 0 }}>
      {p[n]}
    </svg>
  );
};

const Spinner = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="var(--cyan)" strokeWidth="2.5"
       style={{ animation:"spin 0.8s linear infinite", flexShrink:0 }}>
    <path d="M21 12a9 9 0 11-4.219-7.66"/>
  </svg>
);

const Center = ({ children }) => (
  <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:200,gap:12,color:"var(--muted)" }}>
    {children}
  </div>
);

const Empty = ({ msg }) => (
  <div style={{ padding:"48px 0",textAlign:"center",color:"var(--subtle)",fontSize:13,fontFamily:"var(--mono)" }}>
    {msg}
  </div>
);

// ─── Mesh background ──────────────────────────────────────────────────────────
const MeshBg = () => (
  <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden" }}>
    <div style={{ position:"absolute",width:700,height:700,borderRadius:"50%",top:-250,left:-150,
                  background:"radial-gradient(circle,rgba(0,229,255,0.06) 0%,transparent 70%)" }}/>
    <div style={{ position:"absolute",width:500,height:500,borderRadius:"50%",top:150,right:-150,
                  background:"radial-gradient(circle,rgba(124,92,255,0.05) 0%,transparent 70%)" }}/>
    <div style={{ position:"absolute",width:400,height:400,borderRadius:"50%",bottom:-100,left:"40%",
                  background:"radial-gradient(circle,rgba(0,229,255,0.03) 0%,transparent 70%)" }}/>
    <div style={{ position:"absolute",inset:0,opacity:.02,
                  backgroundImage:"linear-gradient(rgba(0,229,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,1) 1px,transparent 1px)",
                  backgroundSize:"60px 60px" }}/>
  </div>
);

// ─── Metric card ──────────────────────────────────────────────────────────────
const MetricCard = ({ label, value, sub, color, icon, delay=0 }) => {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    const mv = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", ((e.clientX-r.left)/r.width*100)+"%");
      el.style.setProperty("--my", ((e.clientY-r.top)/r.height*100)+"%");
    };
    el.addEventListener("mousemove", mv);
    return () => el.removeEventListener("mousemove", mv);
  }, []);
  return (
    <div ref={ref} className="card fade-up" style={{ animationDelay:delay+"s", position:"relative" }}
         onMouseEnter={e => e.currentTarget.style.transform="translateY(-3px)"}
         onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}>
      <div style={{ position:"absolute",inset:0,borderRadius:16,
                    background:"radial-gradient(300px circle at var(--mx,50%) var(--my,50%),rgba(0,229,255,0.05),transparent 60%)",
                    pointerEvents:"none" }}/>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16 }}>
        <div style={{ width:40,height:40,borderRadius:10,background:`${color}18`,
                      border:`1px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <Ic n={icon} s={18} c={color}/>
        </div>
        <span className="label" style={{ color:color,opacity:.7 }}>{sub}</span>
      </div>
      <div style={{ fontFamily:"var(--display)",fontSize:36,fontWeight:700,
                    color:value==="—"?"var(--subtle)":"var(--text)",lineHeight:1 }}>{value}</div>
      <div style={{ marginTop:8,fontSize:12,color:"var(--muted)",letterSpacing:".3px" }}>{label}</div>
    </div>
  );
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [tab,       setTab]   = useState("login");

  // login state
  const [email,     setEmail] = useState("");
  const [pass,      setPass]  = useState("");
  const [loginErr,  setLoginErr] = useState("");
  const [loginLoad, setLoginLoad] = useState(false);

  // register state
  const [regName,   setRegName]  = useState("");
  const [regEmail,  setRegEmail] = useState("");
  const [regPass,   setRegPass]  = useState("");
  const [regPass2,  setRegPass2] = useState("");
  const [regErr,    setRegErr]   = useState("");
  const [regMsg,    setRegMsg]   = useState("");
  const [regLoad,   setRegLoad]  = useState(false);

  const doLogin = async () => {
    setLoginLoad(true); setLoginErr("");
    try {
      const r = await API.post("/auth/login", { email, password: pass });
      localStorage.setItem("saad_token", r.data.token);
      localStorage.setItem("saad_user",  JSON.stringify(r.data.user));
      onLogin(r.data.user);
    } catch(e) { setLoginErr(e.response?.data?.error || "Invalid email or password"); }
    finally { setLoginLoad(false); }
  };

  const doRegister = async () => {
    setRegErr(""); setRegMsg("");
    if (!regName || !regEmail || !regPass || !regPass2) {
      setRegErr("All fields are required"); return;
    }
    if (regPass !== regPass2) {
      setRegErr("Passwords do not match"); return;
    }
    if (regPass.length < 6) {
      setRegErr("Password must be at least 6 characters"); return;
    }
    setRegLoad(true);
    try {
      await API.post("/auth/register-public", {
        full_name: regName,
        email:     regEmail,
        password:  regPass,
      });
      setRegMsg("Account created! You can now sign in.");
      setRegName(""); setRegEmail(""); setRegPass(""); setRegPass2("");
      setTimeout(() => setTab("login"), 2000);
    } catch(e) { setRegErr(e.response?.data?.error || "Registration failed"); }
    finally { setRegLoad(false); }
  };

  return (
    <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center" }}>
      <MeshBg/>
      <div className="fade-up" style={{ width:420,position:"relative",zIndex:1 }}>

        {/* Logo */}
        <div style={{ textAlign:"center",marginBottom:36 }}>
          <div style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",
                        width:56,height:56,borderRadius:16,marginBottom:18,
                        background:"linear-gradient(135deg,rgba(0,229,255,0.15),rgba(124,92,255,0.15))",
                        border:"1px solid rgba(0,229,255,0.3)",animation:"glow 3s ease-in-out infinite" }}>
            <Ic n="shield" s={24} c="var(--cyan)"/>
          </div>
          <div style={{ fontFamily:"var(--display)",fontSize:32,fontWeight:800,
                        letterSpacing:-1,color:"var(--text)" }}>SAAD</div>
          <div style={{ fontSize:11,color:"var(--muted)",letterSpacing:3,
                        fontFamily:"var(--mono)",marginTop:6 }}>
            AUTHENTICATION ANOMALY DETECTOR
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display:"flex",background:"rgba(255,255,255,0.04)",
                      borderRadius:12,padding:4,marginBottom:24,
                      border:"1px solid var(--border2)" }}>
          {["login","register"].map(t => (
            <button key={t} onClick={() => setTab(t)}
                    style={{ flex:1,padding:"10px",borderRadius:9,fontSize:13,
                              fontWeight:600,fontFamily:"var(--body)",cursor:"pointer",
                              transition:"all .2s",
                              background: tab===t ? "var(--cyan)" : "transparent",
                              color:       tab===t ? "#03060f"    : "var(--muted)",
                              border:      "none" }}>
              {t === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        {/* Sign In form */}
        {tab === "login" && (
          <div className="glass fade-in" style={{ padding:36 }}>
            <div style={{ marginBottom:20 }}>
              <div className="label" style={{ marginBottom:8 }}>Email address</div>
              <input value={email} onChange={e=>setEmail(e.target.value)}
                     type="email" placeholder="you@example.com"
                     onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
            </div>
            <div style={{ marginBottom:28 }}>
              <div className="label" style={{ marginBottom:8 }}>Password</div>
              <input value={pass} onChange={e=>setPass(e.target.value)}
                     type="password" placeholder="••••••••"
                     onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
            </div>
            {loginErr && (
              <div style={{ marginBottom:16,padding:"10px 14px",borderRadius:8,fontSize:13,
                            background:"rgba(255,77,109,0.1)",color:"var(--rose)",
                            border:"1px solid rgba(255,77,109,0.2)" }}>{loginErr}</div>
            )}
            <button className="btn-primary" style={{ width:"100%",padding:"14px",fontSize:15 }}
                    onClick={doLogin} disabled={loginLoad}>
              {loginLoad
                ? <span style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:10 }}>
                    <Spinner size={18}/>Authenticating...
                  </span>
                : "Sign in to SAAD"}
            </button>
          </div>
        )}

        {/* Register form */}
        {tab === "register" && (
          <div className="glass fade-in" style={{ padding:36 }}>
            <div style={{ marginBottom:16 }}>
              <div className="label" style={{ marginBottom:8 }}>Full name</div>
              <input value={regName} onChange={e=>setRegName(e.target.value)}
                     type="text" placeholder="Your full name"/>
            </div>
            <div style={{ marginBottom:16 }}>
              <div className="label" style={{ marginBottom:8 }}>Email address</div>
              <input value={regEmail} onChange={e=>setRegEmail(e.target.value)}
                     type="email" placeholder="you@example.com"/>
            </div>
            <div style={{ marginBottom:16 }}>
              <div className="label" style={{ marginBottom:8 }}>Password</div>
              <input value={regPass} onChange={e=>setRegPass(e.target.value)}
                     type="password" placeholder="At least 6 characters"/>
            </div>
            <div style={{ marginBottom:24 }}>
              <div className="label" style={{ marginBottom:8 }}>Confirm password</div>
              <input value={regPass2} onChange={e=>setRegPass2(e.target.value)}
                     type="password" placeholder="Repeat password"
                     onKeyDown={e=>e.key==="Enter"&&doRegister()}/>
            </div>
            {regErr && (
              <div style={{ marginBottom:16,padding:"10px 14px",borderRadius:8,fontSize:13,
                            background:"rgba(255,77,109,0.1)",color:"var(--rose)",
                            border:"1px solid rgba(255,77,109,0.2)" }}>{regErr}</div>
            )}
            {regMsg && (
              <div style={{ marginBottom:16,padding:"10px 14px",borderRadius:8,fontSize:13,
                            background:"rgba(0,214,143,0.1)",color:"var(--emerald)",
                            border:"1px solid rgba(0,214,143,0.2)" }}>{regMsg}</div>
            )}
            <button className="btn-primary" style={{ width:"100%",padding:"14px",fontSize:15 }}
                    onClick={doRegister} disabled={regLoad}>
              {regLoad
                ? <span style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:10 }}>
                    <Spinner size={18}/>Creating account...
                  </span>
                : "Create Account"}
            </button>
            <div style={{ marginTop:16,fontSize:12,color:"var(--muted)",textAlign:"center",lineHeight:1.6 }}>
              New accounts are assigned <span style={{ color:"var(--cyan)" }}>Viewer</span> role by default.
              An administrator can upgrade your role after sign-up.
            </div>
          </div>
        )}

        <div style={{ textAlign:"center",marginTop:24,fontSize:11,
                      color:"var(--subtle)",fontFamily:"var(--mono)",letterSpacing:1 }}>
          SECURED · ENCRYPTED · MONITORED
        </div>
      </div>
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
const NAV = [
  { id:"dashboard",  label:"Dashboard",  icon:"dashboard"   },
  { id:"alerts",     label:"Alerts",     icon:"alerts"      },
  { id:"logs",       label:"Log Viewer", icon:"logs"        },
  { id:"anomalies",  label:"Anomalies",  icon:"anomaly"     },
  { id:"collection", label:"Pipeline",   icon:"collection"  },
  { id:"reports",    label:"Reports",    icon:"reports"     },
  { id:"users",      label:"Users",      icon:"users"       },
  { id:"profile",    label:"Profile",    icon:"profile"     },
];

// ─── SHELL ────────────────────────────────────────────────────────────────────
function Shell({ page, setPage, user, onLogout, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const initials = user?.full_name?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()||"AD";

  return (
    <div style={{ display:"flex",height:"100vh",position:"relative",zIndex:1 }}>
      <MeshBg/>
      <aside style={{ width:collapsed?60:220,flexShrink:0,
                      background:"rgba(8,14,28,0.92)",backdropFilter:"blur(20px)",
                      borderRight:"1px solid var(--border)",
                      display:"flex",flexDirection:"column",
                      transition:"width 0.3s cubic-bezier(.4,0,.2,1)",zIndex:10 }}>
        <div style={{ padding:collapsed?"20px 0":"20px 16px 16px",borderBottom:"1px solid var(--border)",
                      display:"flex",alignItems:"center",justifyContent:collapsed?"center":"flex-start",gap:10 }}>
          <div style={{ width:34,height:34,borderRadius:10,flexShrink:0,
                        background:"linear-gradient(135deg,var(--cyan),var(--violet))",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        boxShadow:"0 0 16px rgba(0,229,255,0.3)" }}>
            <Ic n="shield" s={16} c="#03060f"/>
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontFamily:"var(--display)",fontSize:17,fontWeight:700,color:"var(--text)",lineHeight:1 }}>SAAD</div>
              <div style={{ fontSize:9,color:"var(--subtle)",letterSpacing:2,fontFamily:"var(--mono)",marginTop:2 }}>SECURITY</div>
            </div>
          )}
        </div>
        <nav style={{ flex:1,padding:"12px 8px",overflowY:"auto" }}>
          {!collapsed && <div className="label" style={{ padding:"0 6px",marginBottom:10 }}>Navigation</div>}
          {NAV.map(n => (
            <div key={n.id} className={`nav-item ${page===n.id?"active":""}`}
                 onClick={()=>setPage(n.id)}
                 style={{ justifyContent:collapsed?"center":"flex-start",marginBottom:2,padding:collapsed?"10px 0":undefined }}>
              <Ic n={n.icon} s={17}/>
              {!collapsed && <span>{n.label}</span>}
            </div>
          ))}
        </nav>
        <div style={{ padding:"10px 8px",borderTop:"1px solid var(--border)" }}>
          <div className="nav-item" onClick={onLogout}
               style={{ justifyContent:collapsed?"center":"flex-start",color:"var(--rose)",marginBottom:4 }}>
            <Ic n="logout" s={16} c="var(--rose)"/>
            {!collapsed && <span style={{ fontSize:13 }}>Sign out</span>}
          </div>
          <div className="nav-item" onClick={()=>setCollapsed(!collapsed)}
               style={{ justifyContent:collapsed?"center":"flex-start" }}>
            <div style={{ transform:collapsed?"rotate(180deg)":"none",transition:"transform .3s" }}>
              <Ic n="chevron" s={15}/>
            </div>
          </div>
        </div>
      </aside>

      <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
        <header style={{ height:58,flexShrink:0,
                         background:"rgba(8,14,28,0.85)",backdropFilter:"blur(20px)",
                         borderBottom:"1px solid var(--border)",
                         display:"flex",alignItems:"center",padding:"0 24px",gap:16 }}>
          <div style={{ flex:1,maxWidth:340 }}>
            <div style={{ display:"flex",alignItems:"center",gap:10,
                          background:"rgba(255,255,255,0.04)",border:"1px solid var(--border)",
                          borderRadius:10,padding:"8px 14px" }}>
              <Ic n="search" s={13} c="var(--subtle)"/>
              <span style={{ fontSize:13,color:"var(--subtle)" }}>Search logs, IPs, users...</span>
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:7,fontSize:11,
                        color:"var(--emerald)",fontFamily:"var(--mono)",letterSpacing:1 }}>
            <div style={{ width:7,height:7,borderRadius:"50%",background:"var(--emerald)",animation:"pulse 2s ease-in-out infinite" }}/>
            LIVE
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer",
                        padding:"6px 10px",borderRadius:10,transition:"background .15s" }}
               onClick={()=>setPage("profile")}
               onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}
               onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{ width:32,height:32,borderRadius:"50%",
                          background:"linear-gradient(135deg,var(--cyan),var(--violet))",
                          display:"flex",alignItems:"center",justifyContent:"center",
                          fontSize:12,fontWeight:700,color:"#03060f" }}>{initials}</div>
            <div>
              <div style={{ fontSize:13,fontWeight:500,color:"var(--text)",lineHeight:1.2 }}>{user?.full_name}</div>
              <div style={{ fontSize:10,color:"var(--muted)",fontFamily:"var(--mono)",letterSpacing:.5 }}>{user?.role?.toUpperCase()}</div>
            </div>
          </div>
        </header>
        <div style={{ flex:1,overflow:"hidden",position:"relative",zIndex:1 }}>{children}</div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ setPage }) {
  const [data, setData]   = useState(null);
  const [load, setLoad]   = useState(true);
  const [err,  setErr]    = useState("");

  useEffect(()=>{
    API.get("/dashboard/").then(r=>setData(r.data)).catch(()=>setErr("Failed to load")).finally(()=>setLoad(false));
  },[]);

  if (load) return <Center><Spinner size={32}/></Center>;
  if (err)  return <Center><span style={{ color:"var(--rose)" }}>{err}</span></Center>;
  const run = data?.latest_run;

  return (
    <div className="scroll" style={{ padding:"28px 32px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32 }}>
        <div>
          <div className="label fade-up" style={{ marginBottom:6 }}>Overview</div>
          <h1 className="page-title fade-up s1">Security Dashboard</h1>
          <div style={{ fontSize:13,color:"var(--muted)",marginTop:6,fontFamily:"var(--mono)" }}>
            {run ? `Last run ${new Date(run.completed_at).toLocaleString()} · ${run.total_records?.toLocaleString()} records` : "No pipeline runs yet"}
          </div>
        </div>
        <div style={{ display:"flex",gap:10 }}>
          <button className="btn-ghost fade-up s2" onClick={()=>window.location.reload()}
                  style={{ display:"flex",alignItems:"center",gap:8 }}>Refresh</button>
          <button className="btn-primary fade-up s3" onClick={()=>setPage("collection")}
                  style={{ display:"flex",alignItems:"center",gap:8 }}>
            <Ic n="zap" s={14} c="#03060f"/> Run Pipeline
          </button>
        </div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28 }}>
        <MetricCard label="Total Records" value={run?.total_records?.toLocaleString()||"—"} sub="Latest run"      color="var(--cyan)"    icon="logs"      delay={0}/>
        <MetricCard label="HIGH Alerts"   value={run?.high_count?.toLocaleString()||"—"}    sub="Confirmed"       color="var(--rose)"    icon="alerts"    delay={.05}/>
        <MetricCard label="MEDIUM Alerts" value={run?.medium_count?.toLocaleString()||"—"}  sub="Suspicious"      color="var(--amber)"   icon="anomaly"   delay={.1}/>
        <MetricCard label="Open Alerts"   value={data?.open_alerts?.toString()||"0"}        sub="Awaiting review" color="var(--emerald)" icon="shield"    delay={.15}/>
      </div>
      <div className="card fade-up s4">
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
          <div>
            <div className="label" style={{ marginBottom:4 }}>Recent activity</div>
            <div style={{ fontSize:17,fontWeight:600,color:"var(--text)" }}>Latest Alerts</div>
          </div>
          <button className="btn-ghost" style={{ fontSize:12 }} onClick={()=>setPage("alerts")}>View all</button>
        </div>
        {data?.recent_alerts?.length > 0 ? (
          <table>
            <thead><tr><th>Severity</th><th>Source IP</th><th>Username</th><th>Attack Type</th><th>Risk Score</th><th>Time</th></tr></thead>
            <tbody>
              {data.recent_alerts.map((a,i)=>(
                <tr key={i} className="slide-in" style={{ animationDelay:(i*.03)+"s" }}>
                  <td><span className={`stat-pill pill-${a.severity?.toLowerCase()}`}>{a.severity}</span></td>
                  <td style={{ fontFamily:"var(--mono)",fontSize:12 }}>{a.source_ip||"—"}</td>
                  <td style={{ fontFamily:"var(--mono)",fontSize:12,color:"var(--cyan)" }}>{a.username||"—"}</td>
                  <td style={{ color:"var(--text)",fontSize:13 }}>{a.attack_type||"Unknown"}</td>
                  <td style={{ fontFamily:"var(--mono)",fontSize:12,color:"var(--violet)" }}>{a.risk_score}</td>
                  <td style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--muted)" }}>{new Date(a.created_at).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <Empty msg="No alerts yet. Run the pipeline to generate data."/>}
      </div>
    </div>
  );
}

// ─── ALERTS ───────────────────────────────────────────────────────────────────
function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [total,  setTotal]  = useState(0);
  const [filter, setFilter] = useState("ALL");
  const [load,   setLoad]   = useState(true);
  const [runs,   setRuns]   = useState([]);
  const [runId,  setRunId]  = useState("all");

  // Load pipeline run history for the selector
  useEffect(() => {
    API.get("/pipeline/history")
      .then(r => {
        setRuns(r.data);
        if (r.data.length > 0) setRunId(String(r.data[0].id));
      })
      .catch(console.error);
  }, []);

  const fetchAlerts = useCallback((sev, rid) => {
    setLoad(true);
    const params = {};
    if (sev !== "ALL") params.severity = sev;
    if (rid && rid !== "all") params.run_id = rid;
    API.get("/alerts/", { params })
      .then(r => { setAlerts(r.data.alerts); setTotal(r.data.total); })
      .catch(console.error)
      .finally(() => setLoad(false));
  }, []);

  useEffect(() => {
    fetchAlerts(filter, runId);
  }, [filter, runId, fetchAlerts]);

  return (
    <div className="scroll" style={{ padding:"28px 32px" }}>
      <div style={{ marginBottom:28 }}>
        <div className="label fade-up" style={{ marginBottom:6 }}>Security events</div>
        <h1 className="page-title fade-up s1">Alerts</h1>
        <div style={{ fontSize:13,color:"var(--muted)",marginTop:6,fontFamily:"var(--mono)" }}>{total} alerts found</div>
      </div>

      {/* Pipeline run selector */}
      <div style={{ marginBottom:20 }}>
        <div className="label" style={{ marginBottom:8 }}>Pipeline Run</div>
        <select value={runId} onChange={e => setRunId(e.target.value)}
                style={{ maxWidth:500,background:"#080e1c",color:"var(--cyan)",
                         border:"1px solid rgba(0,229,255,0.3)",borderRadius:10,
                         padding:"11px 16px",fontSize:13,fontFamily:"var(--mono)" }}>
          <option value="all">All runs combined</option>
          {runs.map(r => (
            <option key={r.id} value={String(r.id)}>
              Run #{r.id} — {new Date(r.started_at).toLocaleString()} — {r.total_records?.toLocaleString() || 0} records ({r.status})
            </option>
          ))}
        </select>
      </div>

      {/* Severity filter chips */}
      <div style={{ display:"flex",gap:8,marginBottom:24 }}>
        {["ALL","HIGH","MEDIUM","LOW"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
                  style={{ padding:"7px 18px",borderRadius:100,fontSize:12,fontWeight:600,
                            fontFamily:"var(--mono)",letterSpacing:.5,cursor:"pointer",transition:"all .2s",
                            background:filter===f?(f==="HIGH"?"var(--rose)":f==="MEDIUM"?"var(--amber)":f==="LOW"?"var(--emerald)":"var(--cyan)"):"rgba(255,255,255,0.05)",
                            color:filter===f?"#03060f":"var(--muted)",
                            border:filter===f?"none":"1px solid var(--border2)" }}>{f}</button>
        ))}
      </div>

      <div className="card">
        {load ? <Center><Spinner/></Center> : alerts.length > 0 ? (
          <table>
            <thead>
              <tr><th>Severity</th><th>Source IP</th><th>Username</th><th>Attack Type</th><th>Risk</th><th>Rule</th><th>Status</th></tr>
            </thead>
            <tbody>
              {alerts.map((a,i) => (
                <tr key={i}>
                  <td><span className={`stat-pill pill-${a.severity?.toLowerCase()}`}>{a.severity}</span></td>
                  <td style={{ fontFamily:"var(--mono)",fontSize:12 }}>{a.source_ip||"—"}</td>
                  <td style={{ fontFamily:"var(--mono)",fontSize:12,color:"var(--cyan)" }}>{a.username||"—"}</td>
                  <td style={{ color:"var(--text)" }}>{a.attack_type||"Unknown"}</td>
                  <td style={{ fontFamily:"var(--mono)",fontSize:12,color:"var(--violet)" }}>{a.risk_score}</td>
                  <td><span className="stat-pill pill-info">{a.rule_confidence}</span></td>
                  <td><span className={`stat-pill ${a.status==="open"?"pill-open":a.status==="reviewed"?"pill-low":"pill-medium"}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <Empty msg="No alerts found for this run and filter combination."/>}
      </div>
    </div>
  );
}

// ─── LOGS ─────────────────────────────────────────────────────────────────────
function LogViewerPage() {
  const [logs,   setLogs]   = useState([]);
  const [total,  setTotal]  = useState(0);
  const [search, setSrch]   = useState("");
  const [load,   setLoad]   = useState(true);
  const [runs,   setRuns]   = useState([]);
  const [runId,  setRunId]  = useState("all");
  const [sev,    setSev]    = useState("ALL");

  useEffect(() => {
    API.get("/pipeline/history")
      .then(r => {
        setRuns(r.data);
        if (r.data.length > 0) setRunId(String(r.data[0].id));
      })
      .catch(console.error);
  }, []);

  const fetchLogs = useCallback((q, rid, severity) => {
    setLoad(true);
    const params = { per_page: 100 };
    if (q)                         params.search   = q;
    if (rid && rid !== "all")      params.run_id   = rid;
    if (severity && severity !== "ALL") params.severity = severity;
    API.get("/logs/", { params })
      .then(r => { setLogs(r.data.logs); setTotal(r.data.total); })
      .catch(console.error)
      .finally(() => setLoad(false));
  }, []);

  useEffect(() => { fetchLogs(search, runId, sev); }, [runId, sev, fetchLogs]);

  return (
    <div className="scroll" style={{ padding:"28px 32px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28 }}>
        <div>
          <div className="label fade-up" style={{ marginBottom:6 }}>Pipeline output</div>
          <h1 className="page-title fade-up s1">Log Viewer</h1>
          <div style={{ fontSize:13,color:"var(--muted)",marginTop:6,fontFamily:"var(--mono)" }}>{total?.toLocaleString()} records</div>
        </div>
      </div>

      {/* Run selector + severity filter row */}
      <div style={{ display:"flex",gap:16,marginBottom:20,flexWrap:"wrap",alignItems:"flex-end" }}>
        <div style={{ flex:1,minWidth:300 }}>
          <div className="label" style={{ marginBottom:8 }}>Pipeline Run</div>
          <select value={runId} onChange={e => setRunId(e.target.value)}
                  style={{ background:"#080e1c",color:"var(--cyan)",
                           border:"1px solid rgba(0,229,255,0.3)",borderRadius:10,
                           padding:"11px 16px",fontSize:13,fontFamily:"var(--mono)" }}>
            <option value="all">All runs combined</option>
            {runs.map(r => (
              <option key={r.id} value={String(r.id)}>
                Run #{r.id} — {new Date(r.started_at).toLocaleString()} — {r.total_records?.toLocaleString()||0} records
              </option>
            ))}
          </select>
        </div>
        <div style={{ display:"flex",gap:8 }}>
          {["ALL","HIGH","MEDIUM","LOW"].map(f => (
            <button key={f} onClick={() => setSev(f)}
                    style={{ padding:"7px 16px",borderRadius:100,fontSize:12,fontWeight:600,
                              fontFamily:"var(--mono)",cursor:"pointer",transition:"all .2s",
                              background:sev===f?(f==="HIGH"?"var(--rose)":f==="MEDIUM"?"var(--amber)":f==="LOW"?"var(--emerald)":"var(--cyan)"):"rgba(255,255,255,0.05)",
                              color:sev===f?"#03060f":"var(--muted)",
                              border:sev===f?"none":"1px solid var(--border2)" }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ position:"relative",marginBottom:24,maxWidth:480 }}>
        <div style={{ position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}>
          <Ic n="search" s={14} c="var(--subtle)"/>
        </div>
        <input value={search} onChange={e=>setSrch(e.target.value)}
               onKeyDown={e=>e.key==="Enter"&&fetchLogs(search,runId,sev)}
               placeholder="Search IPs, usernames, messages… press Enter"
               style={{ paddingLeft:40 }}/>
      </div>

      <div className="card" style={{ padding:0,overflow:"hidden" }}>
        <div style={{ padding:"12px 20px",borderBottom:"1px solid var(--border)",
                      display:"flex",alignItems:"center",gap:8,background:"rgba(0,0,0,0.2)" }}>
          {["var(--rose)","var(--amber)","var(--emerald)"].map((c,i)=>(
            <div key={i} style={{ width:10,height:10,borderRadius:"50%",background:c,opacity:.8 }}/>
          ))}
          <span style={{ marginLeft:8,fontFamily:"var(--mono)",fontSize:11,color:"var(--subtle)" }}>
            processed_logs — SAAD pipeline output
          </span>
        </div>
        {load ? <Center><Spinner/></Center> : logs.length>0 ? (
          <table>
            <thead><tr><th>Time</th><th>Source IP</th><th>User</th><th>Message</th><th>Severity</th><th>Risk</th></tr></thead>
            <tbody>
              {logs.map((l,i)=>(
                <tr key={i}>
                  <td style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--cyan)",whiteSpace:"nowrap" }}>
                    {l.timestamp?new Date(l.timestamp).toLocaleTimeString():"—"}
                  </td>
                  <td style={{ fontFamily:"var(--mono)",fontSize:11 }}>{l.source_ip||"—"}</td>
                  <td style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--violet)" }}>{l.username||"—"}</td>
                  <td style={{ fontSize:12,maxWidth:340,
                               color:l.severity==="HIGH"?"var(--rose)":l.severity==="MEDIUM"?"var(--amber)":"var(--muted)" }}>
                    {l.message?.slice(0,80)||"—"}
                  </td>
                  <td><span className={`stat-pill pill-${l.severity?.toLowerCase()}`}>{l.severity}</span></td>
                  <td style={{ fontFamily:"var(--mono)",fontSize:12 }}>{l.risk_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <Empty msg="No logs found for this run and filter."/>}
      </div>
    </div>
  );
}

// ─── PIPELINE ─────────────────────────────────────────────────────────────────
function CollectionPage() {
  const [running,  setRunning]  = useState(false);
  const [runId,    setRunId]    = useState(null);
  const [status,   setStatus]   = useState("");
  const [message,  setMsg]      = useState("");
  const [history,  setHistory]  = useState([]);
  const [mode,     setMode]     = useState("default");
  const [dragOver, setDragOver] = useState(false);
  const [file,     setFile]     = useState(null);
  const [csvText,  setCsvText]  = useState("");
  const [uploadMsg,setUploadMsg]= useState("");
  const fileRef = useRef(null);


  useEffect(()=>{
    API.get("/pipeline/history").then(r=>setHistory(r.data)).catch(console.error);
  },[]);

  useEffect(()=>{
    if(!runId||!running) return;
    const iv = setInterval(()=>{
      API.get(`/pipeline/status/${runId}`).then(r=>{
        setStatus(r.data.status);
        if(r.data.status!=="running"){
          setRunning(false); clearInterval(iv);
          setMsg(r.data.status==="completed"
            ? `✓ Complete — ${r.data.total_records?.toLocaleString()} records processed`
            : `✗ Failed: ${r.data.error_message}`);
          API.get("/pipeline/history").then(r2=>setHistory(r2.data)).catch(console.error);
        }
      }).catch(console.error);
    },3000);
    return ()=>clearInterval(iv);
  },[runId,running]);

  const startPolling = (id) => { setRunId(id); setRunning(true); setStatus("running"); setMsg(""); setUploadMsg(""); };

  // Handle file from drop or input
  const handleFile = (f) => {
    if (!f) return;
    if (!f.name.endsWith(".csv")) { setUploadMsg("Only CSV files are supported."); return; }
    setFile(f); setCsvText(""); setUploadMsg(`📄 ${f.name} selected (${(f.size/1024).toFixed(1)} KB)`);
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // Run default pipeline (configured CSV)
  const runDefault = async () => {
    setMsg(""); setUploadMsg("");
    try {
      const r = await API.post("/pipeline/run");
      startPolling(r.data.pipeline_run_id);
    } catch(e) { setRunning(false); setMsg(e.response?.data?.error||"Failed to start"); }
  };

  // Run with file or pasted text
  const runCustom = async () => {
    if (!file && !csvText.trim()) {
      setUploadMsg("Please upload a CSV file or paste CSV data first."); return;
    }
    setMsg(""); setUploadMsg("");

    if (file) {
      // File upload
      const form = new FormData();
      form.append("file", file);
      try {
        const r = await API.post("/pipeline/run-upload", form, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        startPolling(r.data.pipeline_run_id);
        setUploadMsg(`✓ Running pipeline on ${file.name}`);
      } catch(e) { setRunning(false); setUploadMsg(e.response?.data?.error||"Upload failed"); }
    } else {
      // Pasted text
      try {
        const r = await API.post("/pipeline/run-paste", { csv_content: csvText });
        startPolling(r.data.pipeline_run_id);
        setUploadMsg("✓ Pasted data submitted to pipeline");
      } catch(e) { setRunning(false); setUploadMsg(e.response?.data?.error||"Failed"); }
    }
  };

  const rowCount = csvText.trim() ? csvText.trim().split("\n").length - 1 : 0;

  return (
    <div className="scroll" style={{ padding:"28px 32px" }}>
      <div style={{ marginBottom:28 }}>
        <div className="label fade-up" style={{ marginBottom:6 }}>Execution</div>
        <h1 className="page-title fade-up s1">Pipeline Control</h1>
        <div style={{ fontSize:13,color:"var(--muted)",marginTop:6 }}>
          Run SAAD on your own authentication logs or the configured dataset
        </div>
      </div>

      {/* Mode tabs */}
      <div style={{ display:"flex",gap:8,marginBottom:20 }}>
        {["default","custom"].map(m => (
          <button key={m} onClick={()=>{ setMode(m); setFile(null); setCsvText(""); setUploadMsg(""); setMsg(""); }}
                  style={{ padding:"8px 22px",borderRadius:100,fontSize:12,fontWeight:600,
                           fontFamily:"var(--mono)",cursor:"pointer",transition:"all .2s",
                           background:mode===m?"var(--cyan)":"rgba(255,255,255,0.05)",
                           color:mode===m?"#03060f":"var(--muted)",
                           border:mode===m?"none":"1px solid var(--border2)" }}>
            {m === "default" ? "Default Dataset" : "Upload / Paste Logs"}
          </button>
        ))}
      </div>

      <div className="card fade-up s2" style={{ marginBottom:20 }}>

        {/* DEFAULT */}
        {mode === "default" && (
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16 }}>
            <div>
              <div style={{ fontSize:16,fontWeight:600,color:"var(--text)",marginBottom:6 }}>
                Run on Configured Dataset
              </div>
              <div style={{ fontSize:13,color:"var(--muted)",lineHeight:1.6 }}>
                Processes the CSV file configured in{" "}
                <span style={{ fontFamily:"var(--mono)",color:"var(--cyan)",fontSize:12 }}>
                  saad/config/log_sources.yaml
                </span>
              </div>
            </div>
            <button className="btn-primary" onClick={runDefault} disabled={running}
                    style={{ display:"flex",alignItems:"center",gap:10,minWidth:170,justifyContent:"center" }}>
              {running ? <><Spinner size={16}/>Running...</> : <><Ic n="zap" s={15} c="#03060f"/>Run Pipeline</>}
            </button>
          </div>
        )}

        {/* CUSTOM — unified drag/drop/paste/click */}
        {mode === "custom" && (
          <div>
            <div style={{ fontSize:16,fontWeight:600,color:"var(--text)",marginBottom:6 }}>
              Scan Your Own Logs
            </div>
            <div style={{ fontSize:13,color:"var(--muted)",marginBottom:16,lineHeight:1.6 }}>
              Upload or paste a CSV authentication log file. Required columns:{" "}
              <span style={{ fontFamily:"var(--mono)",color:"var(--cyan)",fontSize:11 }}>
                timestamp, source_ip, hostname, username, auth_method, attempts, auth_result, port, protocol, message
              </span>
            </div>

            {/* Drag & drop zone */}
            <input type="file" accept=".csv" ref={fileRef} style={{ display:"none" }}
                   onChange={e => handleFile(e.target.files[0])}/>
            <div
              onClick={()=>fileRef.current?.click()}
              onDragOver={e=>{ e.preventDefault(); setDragOver(true); }}
              onDragLeave={()=>setDragOver(false)}
              onDrop={onDrop}
              style={{ border:`2px dashed ${dragOver?"var(--cyan)":"rgba(0,229,255,0.25)"}`,
                       borderRadius:12,padding:"28px 20px",textAlign:"center",cursor:"pointer",
                       background:dragOver?"rgba(0,229,255,0.06)":"rgba(0,229,255,0.02)",
                       transition:"all .2s",marginBottom:16 }}>
              <div style={{ fontSize:32,marginBottom:8 }}>📂</div>
              <div style={{ fontSize:14,fontWeight:600,color:file?"var(--cyan)":"var(--text)",marginBottom:4 }}>
                {file ? file.name : "Drag & drop a CSV file here"}
              </div>
              <div style={{ fontSize:12,color:"var(--muted)" }}>
                {file
                  ? `${(file.size/1024).toFixed(1)} KB — click to choose a different file`
                  : "or click to browse · only .csv files accepted"}
              </div>
            </div>

            {/* Divider */}
            <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
              <div style={{ flex:1,height:1,background:"var(--border)" }}/>
              <span style={{ fontSize:11,color:"var(--subtle)",fontFamily:"var(--mono)" }}>OR PASTE CSV DATA BELOW</span>
              <div style={{ flex:1,height:1,background:"var(--border)" }}/>
            </div>

            {/* Paste area */}
            <textarea
              value={csvText}
              onChange={e=>{ setCsvText(e.target.value); if(e.target.value.trim()) setFile(null); }}
              placeholder={`timestamp,source_ip,hostname,username,auth_method,attempts,auth_result,port,protocol,message\n2024-01-15T08:23:11,192.168.1.42,host-01,alice,ssh,1,success,22,TCP,User alice logged in via ssh`}
              style={{ width:"100%",minHeight:160,padding:"12px 16px",
                       background:"rgba(0,0,0,0.25)",border:"1px solid var(--border2)",
                       borderRadius:10,color:"var(--text)",fontFamily:"var(--mono)",
                       fontSize:12,resize:"vertical",outline:"none",lineHeight:1.7,
                       transition:"border-color .2s" }}
              onFocus={e=>e.target.style.borderColor="var(--cyan)"}
              onBlur={e=>e.target.style.borderColor="var(--border2)"}
            />
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
                          marginTop:10,flexWrap:"wrap",gap:10 }}>
              <div style={{ fontSize:12,fontFamily:"var(--mono)",color:"var(--muted)" }}>
                {file ? `File selected: ${file.name}` : rowCount > 0 ? `${rowCount} data rows detected` : "No data yet"}
              </div>
              <div style={{ display:"flex",gap:10 }}>
                <button className="btn-ghost"
                        onClick={()=>{ setFile(null); setCsvText(""); setUploadMsg(""); }}
                        style={{ fontSize:12,padding:"8px 16px" }}>Clear</button>
                <button className="btn-primary" onClick={runCustom}
                        disabled={running || (!file && !csvText.trim())}
                        style={{ display:"flex",alignItems:"center",gap:10,justifyContent:"center",minWidth:160 }}>
                  {running ? <><Spinner size={16}/>Running...</> : <><Ic n="zap" s={15} c="#03060f"/>Run Pipeline</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Progress bar */}
        {running && (
          <div style={{ marginTop:20 }}>
            <div style={{ height:3,background:"rgba(255,255,255,0.06)",borderRadius:2,overflow:"hidden" }}>
              <div style={{ height:"100%",borderRadius:2,width:"100%",
                            background:"linear-gradient(90deg,var(--cyan),var(--violet),var(--cyan))",
                            backgroundSize:"200% 100%",animation:"shimmer 1.5s linear infinite" }}/>
            </div>
            <div style={{ marginTop:8,fontSize:12,fontFamily:"var(--mono)",color:"var(--cyan)" }}>
              ▶ Pipeline running... status: {status}
            </div>
          </div>
        )}

        {/* Status messages */}
        {uploadMsg && (
          <div style={{ marginTop:14,padding:"10px 14px",borderRadius:8,fontSize:13,fontFamily:"var(--mono)",
                        background:uploadMsg.startsWith("✓")?"rgba(0,214,143,0.08)":uploadMsg.startsWith("📄")?"rgba(0,229,255,0.06)":"rgba(255,77,109,0.08)",
                        color:uploadMsg.startsWith("✓")?"var(--emerald)":uploadMsg.startsWith("📄")?"var(--cyan)":"var(--rose)",
                        border:`1px solid ${uploadMsg.startsWith("✓")?"rgba(0,214,143,0.2)":uploadMsg.startsWith("📄")?"rgba(0,229,255,0.2)":"rgba(255,77,109,0.2)"}` }}>
            {uploadMsg}
          </div>
        )}
        {message && (
          <div style={{ marginTop:14,padding:"12px 16px",borderRadius:10,fontSize:13,fontFamily:"var(--mono)",
                        background:message.startsWith("✓")?"rgba(0,214,143,0.08)":"rgba(255,77,109,0.08)",
                        color:message.startsWith("✓")?"var(--emerald)":"var(--rose)",
                        border:`1px solid ${message.startsWith("✓")?"rgba(0,214,143,0.2)":"rgba(255,77,109,0.2)"}` }}>
            {message}
          </div>
        )}
      </div>

      {/* History table — unchanged */}
      <div className="card fade-up s3">
        <div className="label" style={{ marginBottom:16 }}>Pipeline history</div>
        {history.length>0 ? (
          <table>
            <thead><tr><th>#</th><th>Status</th><th>Total</th><th>HIGH</th><th>MED</th><th>LOW</th><th>Started</th><th>By</th></tr></thead>
            <tbody>
              {history.map((r,i)=>(
                <tr key={i}>
                  <td style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--subtle)" }}>#{r.id}</td>
                  <td><span className={`stat-pill ${r.status==="completed"?"pill-low":r.status==="running"?"pill-info":"pill-high"}`}>{r.status}</span></td>
                  <td style={{ fontFamily:"var(--mono)" }}>{r.total_records?.toLocaleString()||"—"}</td>
                  <td style={{ fontFamily:"var(--mono)",color:"var(--rose)" }}>{r.high_count||0}</td>
                  <td style={{ fontFamily:"var(--mono)",color:"var(--amber)" }}>{r.medium_count||0}</td>
                  <td style={{ fontFamily:"var(--mono)",color:"var(--emerald)" }}>{r.low_count||0}</td>
                  <td style={{ fontSize:11,fontFamily:"var(--mono)",color:"var(--muted)" }}>{new Date(r.started_at).toLocaleString()}</td>
                  <td style={{ fontSize:12 }}>{r.triggered_by_name||"—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <Empty msg="No pipeline runs yet."/>}
      </div>
    </div>
  );
}


// ─── ANOMALIES ────────────────────────────────────────────────────────────────
function AnomalyPage() {
  const [logs,  setLogs]  = useState([]);
  const [load,  setLoad]  = useState(true);
  const [runs,  setRuns]  = useState([]);
  const [runId, setRunId] = useState("all");

  useEffect(() => {
    API.get("/pipeline/history")
      .then(r => {
        setRuns(r.data);
        if (r.data.length > 0) setRunId(String(r.data[0].id));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoad(true);
    const params = { severity:"HIGH", per_page:100 };
    if (runId && runId !== "all") params.run_id = runId;
    API.get("/logs/", { params })
      .then(r => setLogs(r.data.logs))
      .catch(console.error)
      .finally(() => setLoad(false));
  }, [runId]);

  return (
    <div className="scroll" style={{ padding:"28px 32px" }}>
      <div style={{ marginBottom:28 }}>
        <div className="label fade-up" style={{ marginBottom:6 }}>ML output</div>
        <h1 className="page-title fade-up s1">Anomaly Detection</h1>
        <div style={{ fontSize:13,color:"var(--muted)",marginTop:6 }}>Isolation Forest — HIGH severity records</div>
      </div>

      {/* Run selector */}
      <div style={{ marginBottom:24 }}>
        <div className="label" style={{ marginBottom:8 }}>Pipeline Run</div>
        <select value={runId} onChange={e => setRunId(e.target.value)}
                style={{ maxWidth:500,background:"#080e1c",color:"var(--cyan)",
                         border:"1px solid rgba(0,229,255,0.3)",borderRadius:10,
                         padding:"11px 16px",fontSize:13,fontFamily:"var(--mono)" }}>
          <option value="all">All runs combined</option>
          {runs.map(r => (
            <option key={r.id} value={String(r.id)}>
              Run #{r.id} — {new Date(r.started_at).toLocaleString()} — {r.total_records?.toLocaleString()||0} records
            </option>
          ))}
        </select>
      </div>

      <div className="card">
        {load ? <Center><Spinner/></Center> : logs.length>0 ? (
          <table>
            <thead><tr><th>Source IP</th><th>Username</th><th>Anomaly Score</th><th>Risk</th><th>Rule</th><th>Off-Hours</th><th>Time</th></tr></thead>
            <tbody>
              {logs.map((l,i)=>(
                <tr key={i}>
                  <td style={{ fontFamily:"var(--mono)",fontSize:12 }}>{l.source_ip||"—"}</td>
                  <td style={{ fontFamily:"var(--mono)",fontSize:12,color:"var(--cyan)" }}>{l.username||"—"}</td>
                  <td>
                    <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                      <div style={{ width:64,height:4,background:"rgba(255,255,255,0.06)",borderRadius:2 }}>
                        <div style={{ width:`${(l.anomaly_score||0)*100}%`,height:"100%",borderRadius:2,
                                      background:(l.anomaly_score||0)>.8?"var(--rose)":(l.anomaly_score||0)>.6?"var(--amber)":"var(--emerald)" }}/>
                      </div>
                      <span style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--muted)" }}>{l.anomaly_score?.toFixed(3)||"—"}</span>
                    </div>
                  </td>
                  <td style={{ fontFamily:"var(--mono)",fontSize:12,color:"var(--violet)" }}>{l.risk_score}</td>
                  <td><span className={`stat-pill ${l.rule_confidence==="high"?"pill-high":"pill-low"}`}>{l.rule_confidence}</span></td>
                  <td><span className={`stat-pill ${l.is_off_hours?"pill-medium":"pill-low"}`}>{l.is_off_hours?"Yes":"No"}</span></td>
                  <td style={{ fontFamily:"var(--mono)",fontSize:11,color:"var(--muted)" }}>{l.timestamp?new Date(l.timestamp).toLocaleString():"—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <Empty msg="No anomalies found for this run."/>}
      </div>
    </div>
  );
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────
function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);
  const [load,    setLoad]    = useState(true);
  const [runs,    setRuns]    = useState([]);
  const [runId,   setRunId]   = useState("all");

  useEffect(() => {
    API.get("/pipeline/history")
      .then(r => {
        setRuns(r.data);
        if (r.data.length > 0) setRunId(String(r.data[0].id));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoad(true);
    API.get("/reports/")
      .then(r => {
        const all = r.data;
        setReports(all);
        if (runId === "all") {
          setSelected(null);
        } else {
          setSelected(all.find(rep => String(rep.pipeline_run_id) === runId) || null);
        }
      })
      .catch(console.error)
      .finally(() => setLoad(false));
  }, [runId]);

  const display = runId === "all" ? reports : (selected ? [selected] : []);

  return (
    <div className="scroll" style={{ padding:"28px 32px" }}>
      <div style={{ marginBottom:28 }}>
        <div className="label fade-up" style={{ marginBottom:6 }}>Analytics</div>
        <h1 className="page-title fade-up s1">Reports</h1>
      </div>

      {/* Run selector */}
      <div style={{ marginBottom:24 }}>
        <div className="label" style={{ marginBottom:8 }}>Pipeline Run</div>
        <select value={runId} onChange={e => setRunId(e.target.value)}
                style={{ maxWidth:500,background:"#080e1c",color:"var(--cyan)",
                         border:"1px solid rgba(0,229,255,0.3)",borderRadius:10,
                         padding:"11px 16px",fontSize:13,fontFamily:"var(--mono)" }}>
          <option value="all">All runs</option>
          {runs.map(r => (
            <option key={r.id} value={String(r.id)}>
              Run #{r.id} — {new Date(r.started_at).toLocaleString()} — {r.total_records?.toLocaleString()||0} records
            </option>
          ))}
        </select>
      </div>

      {/* Summary cards for selected run */}
      {selected && (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24 }}>
          {[
            { label:"Total Records", value:selected.total_records?.toLocaleString(), color:"var(--cyan)"    },
            { label:"HIGH Alerts",   value:selected.high_count,                      color:"var(--rose)"    },
            { label:"MEDIUM Alerts", value:selected.medium_count,                    color:"var(--amber)"   },
            { label:"LOW (Normal)",  value:selected.low_count?.toLocaleString(),      color:"var(--emerald)" },
          ].map((s,i) => (
            <div key={i} className="card fade-up" style={{ animationDelay:(i*.05)+"s" }}>
              <div style={{ fontSize:11,color:s.color,fontFamily:"var(--mono)",
                            letterSpacing:1,textTransform:"uppercase",marginBottom:8 }}>{s.label}</div>
              <div style={{ fontFamily:"var(--display)",fontSize:32,fontWeight:700,color:s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Attack breakdown for selected run */}
      {selected && (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24 }}>
          {[
            { label:"Brute Force",          value:selected.brute_force_count, color:"var(--rose)"   },
            { label:"Port Scan",            value:selected.port_scan_count,   color:"var(--amber)"  },
            { label:"Geo Anomaly",          value:selected.geo_anomaly_count, color:"var(--cyan)"   },
            { label:"Privilege Escalation", value:selected.priv_esc_count,    color:"var(--violet)" },
          ].map((s,i) => (
            <div key={i} className="card fade-up" style={{ animationDelay:(i*.05)+"s" }}>
              <div style={{ fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)",
                            letterSpacing:1,textTransform:"uppercase",marginBottom:8 }}>{s.label}</div>
              <div style={{ fontFamily:"var(--display)",fontSize:28,fontWeight:700,color:s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Full table */}
      <div className="card">
        <div className="label" style={{ marginBottom:16 }}>
          {runId === "all" ? "All pipeline runs" : `Run #${runId} details`}
        </div>
        {load ? <Center><Spinner/></Center> : display.length>0 ? (
          <table>
            <thead><tr><th>Run</th><th>Total</th><th>HIGH</th><th>MED</th><th>LOW</th><th>Brute</th><th>Port Scan</th><th>Geo</th><th>Priv Esc</th><th>Generated</th></tr></thead>
            <tbody>
              {display.map((r,i)=>(
                <tr key={i}>
                  <td style={{ fontFamily:"var(--mono)",fontSize:11 }}>#{r.pipeline_run_id}</td>
                  <td style={{ fontFamily:"var(--mono)" }}>{r.total_records?.toLocaleString()}</td>
                  <td style={{ fontFamily:"var(--mono)",color:"var(--rose)" }}>{r.high_count}</td>
                  <td style={{ fontFamily:"var(--mono)",color:"var(--amber)" }}>{r.medium_count}</td>
                  <td style={{ fontFamily:"var(--mono)",color:"var(--emerald)" }}>{r.low_count}</td>
                  <td style={{ fontFamily:"var(--mono)",fontSize:12 }}>{r.brute_force_count}</td>
                  <td style={{ fontFamily:"var(--mono)",fontSize:12 }}>{r.port_scan_count}</td>
                  <td style={{ fontFamily:"var(--mono)",fontSize:12 }}>{r.geo_anomaly_count}</td>
                  <td style={{ fontFamily:"var(--mono)",fontSize:12 }}>{r.priv_esc_count}</td>
                  <td style={{ fontSize:11,color:"var(--muted)" }}>{new Date(r.generated_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <Empty msg="No report found for this run yet."/>}
      </div>
    </div>
  );
}

// ─── USERS ────────────────────────────────────────────────────────────────────
function UsersPage() {
  const [users,   setUsers]   = useState([]);
  const [load,    setLoad]    = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form,    setForm]    = useState({full_name:"",email:"",password:"",role:"analyst"});
  const [msg,     setMsg]     = useState("");

  const loadUsers = () => API.get("/users/").then(r=>setUsers(r.data)).catch(console.error).finally(()=>setLoad(false));
  useEffect(()=>{loadUsers();},[]);

  const create = async ()=>{
    try {
      await API.post("/auth/register",form);
      setMsg("User created"); setShowAdd(false);
      setForm({full_name:"",email:"",password:"",role:"analyst"}); loadUsers();
    } catch(e){ setMsg(e.response?.data?.error||"Failed"); }
  };

  const del = async (id)=>{
    if(!window.confirm("Delete this user?")) return;
    try { await API.delete(`/users/${id}`); loadUsers(); } catch(e){ alert(e.response?.data?.error||"Failed"); }
  };

  return (
    <div className="scroll" style={{ padding:"28px 32px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28 }}>
        <div>
          <div className="label fade-up" style={{ marginBottom:6 }}>Access control</div>
          <h1 className="page-title fade-up s1">User Management</h1>
          <div style={{ fontSize:13,color:"var(--muted)",marginTop:6 }}>{users.length} users</div>
        </div>
        <button className="btn-primary fade-up s2" onClick={()=>setShowAdd(!showAdd)}
                style={{ display:"flex",alignItems:"center",gap:8 }}>
          <Ic n="plus" s={14} c="#03060f"/> Add user
        </button>
      </div>
      {msg && <div style={{ marginBottom:16,padding:"10px 16px",borderRadius:10,fontSize:13,
                             background:msg.includes("created")?"rgba(0,214,143,0.08)":"rgba(255,77,109,0.08)",
                             color:msg.includes("created")?"var(--emerald)":"var(--rose)",
                             border:`1px solid ${msg.includes("created")?"rgba(0,214,143,0.2)":"rgba(255,77,109,0.2)"}` }}>{msg}</div>}
      {showAdd && (
        <div className="card fade-up" style={{ marginBottom:20 }}>
          <div className="label" style={{ marginBottom:16 }}>New user</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr auto",gap:12,alignItems:"flex-end" }}>
            {[["Full name","full_name","text"],["Email","email","email"],["Password","password","password"]].map(([l,k,t])=>(
              <div key={k}>
                <div className="label" style={{ marginBottom:6 }}>{l}</div>
                <input type={t} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={l}/>
              </div>
            ))}
            <div>
              <div className="label" style={{ marginBottom:6 }}>Role</div>
              <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                <option value="analyst">Analyst</option>
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="btn-primary" style={{ height:44 }} onClick={create}>Create</button>
          </div>
        </div>
      )}
      <div className="card">
        {load ? <Center><Spinner/></Center> : (
          <table>
            <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Last active</th><th></th></tr></thead>
            <tbody>
              {users.map((u,i)=>(
                <tr key={i}>
                  <td>
                    <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                      <div style={{ width:34,height:34,borderRadius:"50%",flexShrink:0,
                                    background:"linear-gradient(135deg,var(--cyan),var(--violet))",
                                    display:"flex",alignItems:"center",justifyContent:"center",
                                    fontSize:12,fontWeight:700,color:"#03060f" }}>
                        {u.full_name?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                      </div>
                      <span style={{ color:"var(--text)",fontWeight:500 }}>{u.full_name}</span>
                    </div>
                  </td>
                  <td style={{ fontFamily:"var(--mono)",fontSize:12 }}>{u.email}</td>
                  <td><span className={`stat-pill ${u.role==="admin"?"pill-high":u.role==="analyst"?"pill-info":"pill-low"}`}>{u.role}</span></td>
                  <td>
                    <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                      <div style={{ width:7,height:7,borderRadius:"50%",background:u.status==="active"?"var(--emerald)":"var(--subtle)" }}/>
                      <span style={{ fontSize:12,color:u.status==="active"?"var(--emerald)":"var(--muted)" }}>{u.status}</span>
                    </div>
                  </td>
                  <td style={{ fontSize:12,color:"var(--muted)" }}>{u.last_login?new Date(u.last_login).toLocaleString():"Never"}</td>
                  <td><button className="btn-danger" onClick={()=>del(u.id)} style={{ padding:"6px 12px" }}><Ic n="trash" s={13}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfilePage({ user, setUser }) {
  const [form, setForm] = useState({full_name:user?.full_name||"",email:user?.email||""});
  const [pass, setPass] = useState({newPass:"",confirm:""});
  const [msg,  setMsg]  = useState({p:"",pw:""});

  const saveProfile = async ()=>{
    try {
      await API.put(`/users/${user.id}`,{full_name:form.full_name,email:form.email});
      const u={...user,...form}; localStorage.setItem("saad_user",JSON.stringify(u)); setUser(u);
      setMsg({...msg,p:"Profile updated"});
    } catch(e){ setMsg({...msg,p:e.response?.data?.error||"Failed"}); }
  };

  const savePass = async ()=>{
    if(pass.newPass!==pass.confirm){setMsg({...msg,pw:"Passwords don't match"});return;}
    try {
      await API.put(`/users/${user.id}`,{password:pass.newPass});
      setMsg({...msg,pw:"Password updated"}); setPass({newPass:"",confirm:""});
    } catch(e){ setMsg({...msg,pw:e.response?.data?.error||"Failed"}); }
  };

  const initials = user?.full_name?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();

  return (
    <div className="scroll" style={{ padding:"28px 32px" }}>
      <div style={{ marginBottom:28 }}>
        <div className="label fade-up" style={{ marginBottom:6 }}>Account</div>
        <h1 className="page-title fade-up s1">Profile Settings</h1>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"280px 1fr",gap:24 }}>
        <div className="card fade-up s1" style={{ textAlign:"center",padding:36 }}>
          <div style={{ width:80,height:80,borderRadius:"50%",margin:"0 auto 20px",
                        background:"linear-gradient(135deg,var(--cyan),var(--violet))",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:28,fontWeight:700,color:"#03060f",
                        boxShadow:"0 0 40px rgba(0,229,255,0.2)" }}>{initials}</div>
          <div style={{ fontFamily:"var(--display)",fontSize:20,fontWeight:700,color:"var(--text)" }}>{user?.full_name}</div>
          <div style={{ fontSize:12,color:"var(--muted)",marginTop:4,fontFamily:"var(--mono)" }}>{user?.email}</div>
          <div style={{ marginTop:14 }}>
            <span className={`stat-pill ${user?.role==="admin"?"pill-high":user?.role==="analyst"?"pill-info":"pill-low"}`}>
              {user?.role?.toUpperCase()}
            </span>
          </div>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
          <div className="card fade-up s2">
            <div className="label" style={{ marginBottom:16 }}>Personal information</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
              {[["Full name","full_name"],["Email","email"]].map(([l,k])=>(
                <div key={k}>
                  <div className="label" style={{ marginBottom:8 }}>{l}</div>
                  <input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/>
                </div>
              ))}
            </div>
            {msg.p && <div style={{ marginTop:12,fontSize:12,color:msg.p.includes("updated")?"var(--emerald)":"var(--rose)" }}>{msg.p}</div>}
            <button className="btn-primary" style={{ marginTop:16 }} onClick={saveProfile}>Save changes</button>
          </div>
          <div className="card fade-up s3">
            <div className="label" style={{ marginBottom:16 }}>Change password</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }}>
              {[["New password","newPass"],["Confirm","confirm"]].map(([l,k])=>(
                <div key={k}>
                  <div className="label" style={{ marginBottom:8 }}>{l}</div>
                  <input type="password" value={pass[k]} onChange={e=>setPass({...pass,[k]:e.target.value})} placeholder="••••••••"/>
                </div>
              ))}
            </div>
            {msg.pw && <div style={{ marginBottom:12,fontSize:12,color:msg.pw.includes("updated")?"var(--emerald)":"var(--rose)" }}>{msg.pw}</div>}
            <button className="btn-primary" onClick={savePass}>Update password</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(()=>{
    const s = localStorage.getItem("saad_user");
    return s ? JSON.parse(s) : null;
  });
  const [page, setPage] = useState("dashboard");

  const logout = async ()=>{
    try { await API.post("/auth/logout"); } catch {}
    localStorage.removeItem("saad_token");
    localStorage.removeItem("saad_user");
    setUser(null);
  };

  const pages = {
    dashboard:  <Dashboard setPage={setPage}/>,
    alerts:     <AlertsPage/>,
    logs:       <LogViewerPage/>,
    anomalies:  <AnomalyPage/>,
    collection: <CollectionPage/>,
    reports:    <ReportsPage/>,
    users:      <UsersPage/>,
    profile:    <ProfilePage user={user} setUser={setUser}/>,
  };

  if (!user) return (
    <>
      <style>{G}</style>
      <LoginPage onLogin={setUser}/>
    </>
  );

  return (
    <>
      <style>{G}</style>
      <Shell page={page} setPage={setPage} user={user} onLogout={logout}>
        {pages[page] || pages.dashboard}
      </Shell>
    </>
  );
}
