import { useState, useEffect, useRef } from "react";

// ─── Design System ────────────────────────────────────────────
const C = {
  bg:          "#08080a",
  surface:     "#0f0f12",
  surfaceAlt:  "#16161a",
  surfaceLift: "#1c1c22",
  border:      "#25252e",
  borderLight: "#32323e",
  amber:       "#f0a500",
  amberLight:  "#ffc340",
  amberDim:    "#c47d0e",
  amberGlow:   "rgba(240,165,0,0.10)",
  amberGlowSm: "rgba(240,165,0,0.05)",
  white:       "#eeeae0",
  offwhite:    "#c8c4ba",
  muted:       "#6e6e7a",
  mutedLight:  "#9898a8",
  green:       "#3db870",
  greenGlow:   "rgba(61,184,112,0.12)",
  danger:      "#d95555",
  dangerGlow:  "rgba(217,85,85,0.12)",
};

const F = {
  display: "'Playfair Display', Georgia, serif",
  sans:    "'DM Sans', system-ui, sans-serif",
  label:   "'Bebas Neue', Impact, sans-serif",
  mono:    "'DM Mono', monospace",
};

// ─── Responsive Hook ─────────────────────────────────────────
function useBreakpoint() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

function useInView(threshold = 0.15) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ─── Data ─────────────────────────────────────────────────────
const COURSES = [
  { id:"general",   icon:"📋", title:"General Knowledge",     sub:"Required — All Classes",        q:50,  hrs:"8–12", price:79,  badge:"MOST POPULAR", desc:"Master traffic laws, vehicle systems, cargo rules, and safety procedures tested on every state CDL exam. The foundation of your license." },
  { id:"airbrakes", icon:"🔧", title:"Air Brakes",             sub:"Endorsement",                   q:25,  hrs:"3–5",  price:49,  badge:null,           desc:"Brake components, inspection procedures, and safe operation. Required if your vehicle is equipped with air brakes." },
  { id:"combo",     icon:"🚛", title:"Combination Vehicles",   sub:"Required — Class A",            q:20,  hrs:"3–4",  price:49,  badge:null,           desc:"Coupling, uncoupling, and safe handling of tractor-trailers and multi-trailer combinations." },
  { id:"hazmat",    icon:"⚠️", title:"HazMat",                 sub:"Endorsement",                   q:30,  hrs:"5–8",  price:69,  badge:"HIGH DEMAND",  desc:"Federal hazmat regulations, placarding, emergency response, and safe transport of hazardous materials." },
  { id:"pretrip",   icon:"🔍", title:"Pre-Trip Inspection",    sub:"All Classes",                   q:15,  hrs:"2–3",  price:39,  badge:null,           desc:"Step-by-step inspection walkthroughs with illustrated guides for every vehicle system." },
  { id:"bundle",    icon:"🏆", title:"Complete CDL Bundle",    sub:"Everything. All Endorsements.", q:140, hrs:"20+",  price:199, badge:"BEST VALUE",   desc:"All 5 courses. AI tutor. Unlimited retakes. Verified certificate. CDL job board. The complete path from zero to ready." },
];

const TESTIMONIALS = [
  { name:"Darnell W.", age:41, city:"Memphis, TN", from:"Warehouse associate", after:"OTR Driver", salary:"$78K/yr", quote:"I studied 20 minutes every night on my phone after my shift. Passed on my first try. My wife cried when I told her the salary. This changed our lives." },
  { name:"Carlos M.",  age:35, city:"Houston, TX",  from:"Construction laborer", after:"Regional Driver", salary:"$71K/yr", quote:"The AI tutor answered my questions at 2am with no judgment. Failed at two other prep sites. DrivePass explained the WHY. Passed on my next attempt." },
  { name:"Ray T.",     age:48, city:"Columbus, OH", from:"Factory floor worker", after:"Flatbed Driver", salary:"$68K/yr", quote:"The readiness score told me exactly when I was ready. Didn't waste a test fee. At 48 years old — best investment I've made in 20 years." },
];

const OBJECTIONS = [
  { q:"Does DrivePass get me my CDL license?",     a:"DrivePass prepares you for the written knowledge portions of the CDL exam — not the full license. Behind-the-wheel training and license issuance happen through your state's DMV and a licensed CDL school. We get you ready for step one, affordably and more effectively than anything else out there." },
  { q:"Am I too old to start over?",               a:"The average DrivePass student is 38 years old. Trucking companies actively prefer experienced adults — you show up, you're reliable, you have a reason to stay. Your age isn't a liability. It's proof you're serious." },
  { q:"What if I fail the test?",                  a:"That's exactly what the Readiness Score prevents. We track every session and flag when you're consistently hitting 85%+. We won't tell you to schedule until we're confident. You'll know before you walk in." },
  { q:"I don't have time to study.",               a:"DrivePass students average 20 minutes per night on their phones. That's one less TV show. In 3 weeks you're ready. You've been making time for jobs that underpay you for years — make 3 weeks for the one that won't." },
  { q:"Is a CDL actually worth the investment?",   a:"The average DrivePass graduate goes from $34K to $72K in year one. That's $38,000 more annually — for a $79 course. The question isn't whether it's worth it. The question is how much longer you can afford to wait." },
  { q:"How fast can I actually get hired?",        a:"The moment you pass, your verified DrivePass certificate is ready to share with employers. We include access to our CDL job board — 500,000+ open positions nationwide filtered by your state, class, and endorsements." },
];

const PRACTICE_QS = [
  { id:1, cat:"General Knowledge",    q:"What does it mean when a vehicle is placarded?", opts:["Oversized load requiring permits","Carrying hazardous materials requiring placards","Special brake system installed","Requires an escort vehicle"], correct:1, exp:"Placards identify vehicles carrying hazardous materials. The placard type indicates the specific hazard class — critical for first responders in an emergency." },
  { id:2, cat:"Air Brakes",           q:"With engine off and brakes released, max air loss per minute for a straight truck is:", opts:["1 psi","2 psi","3 psi","4 psi"], correct:2, exp:"Air loss exceeding 3 psi per minute indicates a leak that must be repaired. This is a federal safety threshold, not a suggestion." },
  { id:3, cat:"General Knowledge",    q:"Which situation calls for downshifting?", opts:["To accelerate quickly","Before starting down a steep grade","When merging into faster traffic","When road conditions improve"], correct:1, exp:"Downshifting before a descent uses engine braking to assist your service brakes — preventing dangerous brake fade on long grades." },
  { id:4, cat:"Combination Vehicles", q:"The tractor protection valve closes automatically when air pressure drops to:", opts:["20–45 psi","40–60 psi","60–80 psi","80–100 psi"], correct:0, exp:"Closes at 20–45 psi to protect the tractor's air supply if the trailer develops a serious leak, keeping the tractor controllable." },
  { id:5, cat:"Pre-Trip Inspection",  q:"Where is tire tread depth checked during pre-trip?", opts:["Engine compartment","Cab interior check","Exterior walkaround","Signal and light test"], correct:2, exp:"Tires are inspected during the exterior walkaround. Minimum 4/32\" front tires, 2/32\" all others — federal minimums." },
];

const OUTCOMES = [
  { val:"$72K",  label:"Avg. Year-One Salary",  sub:"Up from $34K median wage" },
  { val:"94%",   label:"First-Time Pass Rate",   sub:"vs. 49% national average" },
  { val:"500K+", label:"Open CDL Jobs Now",      sub:"Nationwide, right now" },
  { val:"$39",   label:"Start Today",            sub:"One-time, no subscription" },
];

const JOURNEY_STEPS = [
  { num:"01", icon:"📱", label:"DRIVEPASS",  title:"Pass the written exam",         body:"Study on your phone at your pace. AI tutor, readiness score, FMCSA-aligned questions. This is what DrivePass does — and we do it better than anyone.", highlight:true,  tag:"YOU ARE HERE" },
  { num:"02", icon:"🏫", label:"CDL SCHOOL", title:"Complete your driving hours",   body:"Enroll in a licensed CDL school for behind-the-wheel training. Having the written test done means you walk in already ahead of the curve.", highlight:false, tag:"NEXT STEP" },
  { num:"03", icon:"🏛️", label:"STATE DMV",  title:"Get your CDL license",          body:"Your state DMV issues the actual CDL after you complete written and driving requirements. Requirements vary slightly by state.", highlight:false, tag:"FINISH LINE" },
  { num:"04", icon:"🚛", label:"THE ROAD",   title:"Start your driving career",     body:"With your CDL in hand, access our job board — 500,000+ open positions nationwide filtered by your class, state, and endorsements.", highlight:false, tag:"THE PAYOFF" },
];

// ─── Shared Components ────────────────────────────────────────
function Tag({ children, color = C.amber }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:`${color}12`, border:`1px solid ${color}40`, color, borderRadius:2, padding:"4px 14px", fontFamily:F.label, fontSize:11, letterSpacing:3 }}>
      {children}
    </span>
  );
}

function LogoMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30">
      <polygon points="15,1 29,8 29,22 15,29 1,22 1,8" fill="none" stroke={C.amber} strokeWidth="1.5"/>
      <polygon points="15,6 24,10.5 24,19.5 15,24 6,19.5 6,10.5" fill={C.amberGlow}/>
      <line x1="15" y1="8" x2="15" y2="22" stroke={C.amber} strokeWidth="1.5" strokeDasharray="3,2.5" opacity="0.7"/>
      <text x="15" y="20" textAnchor="middle" fontSize="10" fill={C.amber} fontFamily={F.label}>DP</text>
    </svg>
  );
}

// ─── Nav ──────────────────────────────────────────────────────
function Nav({ view, setView }) {
  const mobile = useBreakpoint();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:200,
        height: mobile ? 56 : 66,
        background: scrolled ? "rgba(8,8,10,0.96)" : "transparent",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        transition:"all 0.35s ease",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:`0 ${mobile ? "16px" : "clamp(20px,5vw,64px)"}`,
      }}>
        <div onClick={() => setView("home")} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
          <LogoMark size={mobile ? 26 : 30} />
          <span style={{ fontFamily:F.label, fontSize: mobile ? 18 : 20, letterSpacing:4, color:C.white }}>
            DRIVE<span style={{ color:C.amber }}>PASS</span>
          </span>
        </div>

        {mobile ? (
          <button onClick={() => setView("courses")} style={{
            background:C.amber, border:"none", color:C.bg,
            padding:"7px 16px", borderRadius:2, cursor:"pointer",
            fontFamily:F.label, fontSize:12, letterSpacing:2,
          }}>ENROLL</button>
        ) : (
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            {[["COURSES","courses"],["PRACTICE","exam"]].map(([l,v]) => (
              <button key={v} onClick={() => setView(v)} style={{
                background: view===v ? C.amberGlow : "transparent",
                border:`1px solid ${view===v ? C.amber+"60" : C.border}`,
                color: view===v ? C.amber : C.muted,
                padding:"7px 18px", borderRadius:2, cursor:"pointer",
                fontFamily:F.label, fontSize:13, letterSpacing:2, transition:"all 0.2s",
              }}>{l}</button>
            ))}
            <button onClick={() => setView("courses")} style={{
              background:C.amber, border:"none", color:C.bg,
              padding:"8px 24px", borderRadius:2, cursor:"pointer",
              fontFamily:F.label, fontSize:13, letterSpacing:2,
              fontWeight:700, marginLeft:4, boxShadow:`0 0 20px ${C.amber}30`,
            }}>ENROLL NOW</button>
          </div>
        )}
      </nav>

      {/* Mobile bottom tabs */}
      {mobile && (
        <div style={{
          position:"fixed", bottom:0, left:0, right:0, zIndex:200,
          height:58, background:"rgba(8,8,10,0.97)",
          borderTop:`1px solid ${C.border}`,
          display:"flex", backdropFilter:"blur(20px)",
        }}>
          {[["🏠","Home","home"],["📚","Courses","courses"],["✏️","Practice","exam"]].map(([icon,label,v]) => (
            <button key={v} onClick={() => setView(v)} style={{
              flex:1, background:"none", border:"none",
              display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", gap:3,
              cursor:"pointer",
              borderTop: view===v ? `2px solid ${C.amber}` : "2px solid transparent",
            }}>
              <span style={{ fontSize:17 }}>{icon}</span>
              <span style={{ fontFamily:F.label, fontSize:10, letterSpacing:2, color: view===v ? C.amber : C.muted }}>{label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────
function Hero({ setView }) {
  const mobile = useBreakpoint();
  const phrases = ["YOUR FAMILY.", "YOUR FUTURE.", "YOUR FREEDOM.", "EVERYTHING."];
  const [pIdx, setPIdx] = useState(0);
  const [vis, setVis] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setVis(false);
      setTimeout(() => { setPIdx(i => (i+1) % phrases.length); setVis(true); }, 380);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{
      minHeight:"100svh",
      display:"flex", flexDirection:"column", justifyContent:"center",
      padding:`${mobile ? "80px 20px 90px" : "130px clamp(20px,5vw,64px) 80px"}`,
      position:"relative", overflow:"hidden",
    }}>
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:`radial-gradient(ellipse 80% 60% at 70% 40%, ${C.amber}07 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 20% 80%, ${C.amber}04 0%, transparent 50%)`,
      }}/>
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:`linear-gradient(${C.border}40 1px, transparent 1px), linear-gradient(90deg, ${C.border}40 1px, transparent 1px)`,
        backgroundSize:"80px 80px",
        maskImage:"radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%)",
      }}/>

      <div style={{ position:"relative", maxWidth: mobile ? "100%" : 900 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom: mobile ? 28 : 40 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:C.green, boxShadow:`0 0 10px ${C.green}`, animation:"livepulse 2s ease-in-out infinite" }}/>
          <span style={{ fontFamily:F.label, fontSize:11, letterSpacing:3, color:C.mutedLight }}>500K+ CDL POSITIONS OPEN NOW — NATIONWIDE</span>
        </div>

        <h1 style={{
          fontFamily:F.display, fontWeight:900,
          fontSize:`clamp(${mobile ? "46px" : "56px"}, 10vw, 108px)`,
          lineHeight:1.0, margin:"0 0 20px", color:C.white, letterSpacing:"-1px",
        }}>
          Do It For<br/>
          <span style={{ color:C.amber, fontStyle:"italic", display:"inline-block", opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(12px)", transition:"opacity 0.38s ease, transform 0.38s ease" }}>
            {phrases[pIdx]}
          </span>
        </h1>

        <div style={{ borderLeft:`3px solid ${C.amber}`, paddingLeft: mobile ? 16 : 24, marginBottom: mobile ? 20 : 28, maxWidth:620 }}>
          <p style={{ fontFamily:F.display, fontStyle:"italic", fontSize:`clamp(16px, 2.2vw, 22px)`, color:C.offwhite, lineHeight:1.6, margin:0 }}>
            "What would an extra $35,000 a year change for your family?"
          </p>
        </div>

        <p style={{ fontFamily:F.sans, fontSize:`clamp(15px, 1.8vw, 18px)`, color:C.muted, lineHeight:1.8, maxWidth:560, marginBottom: mobile ? 16 : 20 }}>
          You've been showing up for years. The paycheck just hasn't been showing up for you. DrivePass is the career school that changes that — on your phone, on your schedule, built for people who can't afford to fail.
        </p>

        <div style={{
          display:"inline-flex", alignItems:"flex-start", gap:10,
          background:C.amberGlowSm, border:`1px solid ${C.amber}30`,
          borderRadius:2, padding:"10px 16px", marginBottom: mobile ? 32 : 44, maxWidth:580,
        }}>
          <span style={{ fontSize:14, flexShrink:0, marginTop:1 }}>📋</span>
          <p style={{ fontFamily:F.sans, fontSize:13, color:C.mutedLight, lineHeight:1.6, margin:0 }}>
            <span style={{ color:C.amber, fontWeight:600 }}>What DrivePass is:</span> Online prep for the CDL written knowledge exam. Behind-the-wheel training and license issuance happen through your state DMV and a licensed CDL school. We get you ready for step one — affordably and effectively.
          </p>
        </div>

        <div style={{ display:"flex", gap:12, flexDirection: mobile ? "column" : "row", marginBottom: mobile ? 28 : 48, maxWidth: mobile ? "100%" : 560 }}>
          <button onClick={() => setView("courses")} style={{
            background:C.amber, border:"none", color:C.bg,
            padding: mobile ? "17px" : "18px 48px",
            borderRadius:2, cursor:"pointer",
            fontFamily:F.label, fontSize: mobile ? 18 : 19, letterSpacing:3,
            boxShadow:`0 0 50px ${C.amber}35`, transition:"all 0.25s",
            flex: mobile ? 1 : "none",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=`0 10px 50px ${C.amber}55`; }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=`0 0 50px ${C.amber}35`; }}
          >START FOR $39 →</button>
          <button onClick={() => setView("exam")} style={{
            background:"transparent", border:`1px solid ${C.borderLight}`,
            color:C.white, padding: mobile ? "16px" : "18px 40px",
            borderRadius:2, cursor:"pointer",
            fontFamily:F.label, fontSize: mobile ? 18 : 19, letterSpacing:3,
            transition:"border-color 0.2s", flex: mobile ? 1 : "none",
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor=C.amber}
            onMouseLeave={e => e.currentTarget.style.borderColor=C.borderLight}
          >FREE PRACTICE TEST</button>
        </div>

        <div style={{ display:"flex", flexWrap:"wrap", gap:"10px 24px" }}>
          {["No classroom required","Study on your phone","FMCSA-aligned","7-day guarantee","CDL job board included"].map(t => (
            <span key={t} style={{ fontFamily:F.label, fontSize:11, letterSpacing:2, color:C.muted }}>
              <span style={{ color:C.amber, marginRight:5 }}>✓</span>{t}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes livepulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
        *{-webkit-tap-highlight-color:transparent}
      `}</style>
    </section>
  );
}

// ─── Outcomes Bar ─────────────────────────────────────────────
function OutcomesBar() {
  const mobile = useBreakpoint();
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ background:C.surface, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4,1fr)" }}>
        {OUTCOMES.map((o,i) => (
          <div key={o.val} style={{
            padding: mobile ? "28px 16px" : "48px 32px", textAlign:"center",
            borderRight: mobile ? (i%2===0 ? `1px solid ${C.border}` : "none") : (i<3 ? `1px solid ${C.border}` : "none"),
            borderBottom: mobile && i<2 ? `1px solid ${C.border}` : "none",
            opacity:inView?1:0, transform:inView?"translateY(0)":"translateY(20px)",
            transition:`all 0.6s ease ${i*0.12}s`,
          }}>
            <div style={{ fontFamily:F.display, fontWeight:900, fontSize:`clamp(${mobile?"32px":"40px"},4vw,56px)`, color:C.amber, lineHeight:1, marginBottom:8 }}>{o.val}</div>
            <div style={{ fontFamily:F.label, fontSize: mobile ? 11 : 13, letterSpacing:2, color:C.white, marginBottom:4 }}>{o.label.toUpperCase()}</div>
            <div style={{ fontFamily:F.sans, fontSize:12, color:C.muted }}>{o.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Feature Cards ────────────────────────────────────────────
function FeatureSection() {
  const mobile = useBreakpoint();
  const [ref, inView] = useInView();
  const cards = [
    { icon:"📱", title:"Study when the kids are asleep",     body:"20 minutes a night on your phone. No classroom. No commute. No quitting your job while you prep. DrivePass fits around your life, not the other way around." },
    { icon:"🎯", title:"Know you're ready before you pay",    body:"Your Readiness Score tracks every session. When you're hitting 85% consistently, we tell you it's time. No wasted test fees. No surprises on test day." },
    { icon:"🤖", title:"Ask anything. No judgment.",         body:"Our AI tutor explains every wrong answer in plain language at any hour. Ask the same question 10 times. It never gets frustrated. It never makes you feel stupid." },
    { icon:"🚛", title:"500K+ jobs waiting for your license", body:"Pass, get your certificate, and access our CDL job board — filtered by your state, class, and endorsements. The demand is real and it's not going anywhere." },
  ];
  return (
    <section style={{ padding:`${mobile?"60px 20px":"100px clamp(20px,5vw,64px)"}`, maxWidth:1200, margin:"0 auto" }}>
      <div style={{ marginBottom: mobile ? 40 : 72 }}>
        <Tag>BUILT FOR REAL LIFE</Tag>
        <h2 style={{ fontFamily:F.display, fontWeight:900, fontSize:`clamp(${mobile?"32px":"38px"},6vw,72px)`, color:C.white, margin:"20px 0 16px", lineHeight:1.0 }}>
          You've been working hard.<br/>
          <span style={{ color:C.amber, fontStyle:"italic" }}>Time to work smart.</span>
        </h2>
        <p style={{ fontFamily:F.sans, fontSize: mobile ? 15 : 18, color:C.muted, maxWidth:560, lineHeight:1.8, margin:0 }}>
          DrivePass isn't built for college kids with free time. It's built for people with jobs, kids, and bills — who need to pass on their first try.
        </p>
      </div>
      <div ref={ref} style={{ display:"grid", gridTemplateColumns: mobile ? "1fr" : "repeat(2,1fr)", gap:2 }}>
        {cards.map((c,i) => (
          <div key={c.title} style={{
            background: i%2===0 ? C.surface : C.surfaceAlt,
            padding: mobile ? "28px 22px" : "44px 38px",
            borderBottom:`3px solid transparent`, transition:"all 0.3s ease",
            opacity:inView?1:0, transform:inView?"translateY(0)":"translateY(24px)",
            transitionDelay:`${i*0.1}s`,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderBottomColor=C.amber; e.currentTarget.style.transform="translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderBottomColor="transparent"; e.currentTarget.style.transform="translateY(0)"; }}
          >
            <div style={{ fontSize: mobile ? 36 : 42, marginBottom: mobile ? 16 : 20 }}>{c.icon}</div>
            <h3 style={{ fontFamily:F.display, fontWeight:700, fontSize: mobile ? 19 : 22, color:C.white, margin:`0 0 ${mobile?"10px":"14px"}`, lineHeight:1.3 }}>{c.title}</h3>
            <p style={{ fontFamily:F.sans, fontSize: mobile ? 14 : 15, color:C.muted, lineHeight:1.8, margin:0 }}>{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────
function Testimonials() {
  const mobile = useBreakpoint();
  const [idx, setIdx] = useState(0);
  const [anim, setAnim] = useState(false);
  const go = (n) => {
    if (anim) return;
    setAnim(true);
    setTimeout(() => { setIdx((idx+n+TESTIMONIALS.length)%TESTIMONIALS.length); setAnim(false); }, 300);
  };
  useEffect(() => { const t = setInterval(() => go(1), 6000); return () => clearInterval(t); }, [idx]);
  const t = TESTIMONIALS[idx];
  return (
    <section style={{ background:C.surface, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:`${mobile?"60px 20px":"100px clamp(20px,5vw,64px)"}` }}>
      <div style={{ maxWidth:860, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom: mobile ? 36 : 64 }}>
          <Tag>REAL DRIVERS. REAL RESULTS.</Tag>
          <h2 style={{ fontFamily:F.display, fontWeight:900, fontSize:`clamp(${mobile?"28px":"36px"},5vw,60px)`, color:C.white, margin:"16px 0 0", lineHeight:1 }}>People who bet on themselves.</h2>
        </div>
        <div style={{ opacity:anim?0:1, transform:anim?"translateY(10px)":"translateY(0)", transition:"all 0.3s ease", marginBottom:28 }}>
          <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderTop:`3px solid ${C.amber}`, padding: mobile ? "28px 24px" : "52px 52px 44px", position:"relative" }}>
            <div style={{ position:"absolute", top:16, left: mobile ? 20 : 40, fontFamily:F.display, fontSize: mobile ? 80 : 120, color:C.amber, opacity:0.08, lineHeight:1, userSelect:"none" }}>"</div>
            <p style={{ fontFamily:F.display, fontStyle:"italic", fontSize:`clamp(${mobile?"16px":"18px"},2.2vw,22px)`, color:C.white, lineHeight:1.7, margin:`0 0 ${mobile?"28px":"40px"}`, position:"relative" }}>"{t.quote}"</p>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:12 }}>
              <div>
                <div style={{ fontFamily:F.label, fontSize: mobile ? 16 : 18, color:C.white, letterSpacing:1 }}>{t.name}, {t.age}</div>
                <div style={{ fontFamily:F.label, fontSize:11, color:C.amber, letterSpacing:2, margin:"5px 0 3px" }}>{t.from.toUpperCase()} → {t.after.toUpperCase()}</div>
                <div style={{ fontFamily:F.label, fontSize:12, color:C.green, letterSpacing:1 }}>{t.salary}</div>
                <div style={{ fontFamily:F.sans, fontSize:13, color:C.muted, marginTop:2 }}>{t.city}</div>
              </div>
              <div style={{ display:"flex", gap:3 }}>{"★★★★★".split("").map((s,i) => <span key={i} style={{ color:C.amber, fontSize: mobile ? 18 : 22 }}>{s}</span>)}</div>
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:10, justifyContent:"center", alignItems:"center" }}>
          <button onClick={() => go(-1)} style={{ background:"none", border:`1px solid ${C.border}`, color:C.muted, width:38, height:38, borderRadius:"50%", cursor:"pointer", fontSize:14 }}>←</button>
          {TESTIMONIALS.map((_,i) => <div key={i} onClick={() => setIdx(i)} style={{ width:i===idx?28:8, height:8, borderRadius:4, background:i===idx?C.amber:C.border, cursor:"pointer", transition:"all 0.3s" }}/>)}
          <button onClick={() => go(1)} style={{ background:"none", border:`1px solid ${C.border}`, color:C.muted, width:38, height:38, borderRadius:"50%", cursor:"pointer", fontSize:14 }}>→</button>
        </div>
      </div>
    </section>
  );
}

// ─── Journey Section ──────────────────────────────────────────
function JourneySection() {
  const mobile = useBreakpoint();
  const [ref, inView] = useInView();
  return (
    <section style={{ padding:`${mobile?"60px 20px":"100px clamp(20px,5vw,64px)"}`, maxWidth:1200, margin:"0 auto" }}>
      <div style={{ marginBottom: mobile ? 40 : 64 }}>
        <Tag>THE FULL PICTURE</Tag>
        <h2 style={{ fontFamily:F.display, fontWeight:900, fontSize:`clamp(${mobile?"30px":"36px"},5vw,64px)`, color:C.white, margin:"20px 0 16px", lineHeight:1.05 }}>
          How the CDL journey<br/><span style={{ color:C.amber, fontStyle:"italic" }}>actually works.</span>
        </h2>
        <p style={{ fontFamily:F.sans, fontSize: mobile ? 15 : 17, color:C.muted, maxWidth:600, lineHeight:1.8, margin:0 }}>
          DrivePass handles step one — the written knowledge exam — affordably and effectively. Here's the full path so you know exactly what you're signing up for.
        </p>
      </div>
      <div ref={ref} style={{ display:"grid", gridTemplateColumns: mobile ? "1fr" : "repeat(4,1fr)", gap:2 }}>
        {JOURNEY_STEPS.map((s,i) => (
          <div key={s.num} style={{
            background: s.highlight ? C.bg : C.surfaceAlt,
            border:`1px solid ${s.highlight ? C.amber : C.border}`,
            borderTop:`3px solid ${s.highlight ? C.amber : "transparent"}`,
            padding: mobile ? "24px 20px" : "36px 28px", position:"relative",
            opacity:inView?1:0, transform:inView?"translateY(0)":"translateY(24px)",
            transition:`all 0.5s ease ${i*0.1}s`,
          }}>
            {s.highlight && <div style={{ position:"absolute", top:-12, left:16, background:C.amber, color:C.bg, fontFamily:F.label, fontSize:9, letterSpacing:3, padding:"4px 10px", borderRadius:2 }}>{s.tag}</div>}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom: mobile ? 14 : 18 }}>
              <span style={{ fontSize: mobile ? 28 : 32 }}>{s.icon}</span>
              <span style={{ fontFamily:F.label, fontSize:9, letterSpacing:2, color:s.highlight?C.amber:C.muted, background:s.highlight?C.amberGlow:C.surface, border:`1px solid ${s.highlight?C.amber+"40":C.border}`, padding:"3px 8px", borderRadius:2 }}>{s.label}</span>
            </div>
            <div style={{ fontFamily:F.label, fontSize:10, color:C.muted, letterSpacing:3, marginBottom:8 }}>STEP {s.num}</div>
            <h3 style={{ fontFamily:F.display, fontWeight:700, fontSize: mobile ? 17 : 20, color:C.white, margin:`0 0 ${mobile?"10px":"12px"}`, lineHeight:1.3 }}>{s.title}</h3>
            <p style={{ fontFamily:F.sans, fontSize: mobile ? 13 : 14, color:C.muted, lineHeight:1.8, margin:0 }}>{s.body}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop:16, padding: mobile ? "18px 20px" : "24px 32px", background:C.amberGlow, border:`1px solid ${C.amber}40`, borderRadius:2, display:"flex", gap:14, alignItems:"flex-start", flexWrap:"wrap" }}>
        <span style={{ fontSize:24, flexShrink:0 }}>💡</span>
        <p style={{ fontFamily:F.sans, fontSize: mobile ? 14 : 15, color:C.offwhite, lineHeight:1.7, margin:0, flex:1 }}>
          <span style={{ color:C.amber, fontWeight:600 }}>The smart move:</span> Pass your written test with DrivePass first, then enroll in CDL school for the driving hours. You'll walk in already knowing the theory cold — finish faster and spend thousands less overall.
        </p>
      </div>
    </section>
  );
}

// ─── Credibility ──────────────────────────────────────────────
function CredibilitySection() {
  const mobile = useBreakpoint();
  const [ref, inView] = useInView();
  const signals = [
    { icon:"📜", title:"FMCSA-Aligned Curriculum",   body:"Every question tagged to a specific FMCSA CDL Manual section. Not guesswork — regulatory precision." },
    { icon:"🔐", title:"Verified Digital Certificate", body:"Certificates carry a unique ID and verification URL. Employers confirm authenticity in seconds." },
    { icon:"📊", title:"Outcome-Tracked Platform",     body:"We track what happens after students pass. Our data holds us accountable to real results." },
    { icon:"🚛", title:"CDL Job Board Included",       body:"500,000+ open positions filtered by state, class, and endorsement. Included with every course." },
    { icon:"🤖", title:"AI-Powered Instruction",       body:"Not just questions. An AI tutor trained on CDL curriculum that explains, teaches, and adapts." },
    { icon:"📞", title:"Real Student Support",          body:"Our team responds within 2 business hours. Real answers from people who know this curriculum." },
  ];
  return (
    <section style={{ padding:`${mobile?"60px 20px":"100px clamp(20px,5vw,64px)"}`, maxWidth:1200, margin:"0 auto" }}>
      <div style={{ marginBottom: mobile ? 40 : 64 }}>
        <Tag>WHY DRIVEPASS IS DIFFERENT</Tag>
        <h2 style={{ fontFamily:F.display, fontWeight:900, fontSize:`clamp(${mobile?"30px":"36px"},5vw,64px)`, color:C.white, margin:"20px 0 16px", lineHeight:1.05 }}>
          This is a career school.<br/><span style={{ color:C.amber, fontStyle:"italic" }}>Not another website.</span>
        </h2>
      </div>
      <div ref={ref} style={{ display:"grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3,1fr)", gap:2 }}>
        {signals.map((s,i) => (
          <div key={s.title} style={{
            background:C.surfaceAlt, borderLeft:`3px solid ${i%2===0?C.amber:C.border}`,
            padding: mobile ? "24px 20px" : "36px 28px",
            opacity:inView?1:0, transform:inView?"translateY(0)":"translateY(20px)",
            transition:`all 0.5s ease ${i*0.08}s`,
          }}>
            <div style={{ fontSize: mobile ? 28 : 32, marginBottom: mobile ? 12 : 16 }}>{s.icon}</div>
            <div style={{ fontFamily:F.label, fontSize:12, color:C.amber, letterSpacing:3, marginBottom:8 }}>{s.title}</div>
            <p style={{ fontFamily:F.sans, fontSize: mobile ? 14 : 15, color:C.muted, lineHeight:1.75, margin:0 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Price Comparison ─────────────────────────────────────────
function PriceComparison({ setView }) {
  const mobile = useBreakpoint();
  const [ref, inView] = useInView();
  const cols = [
    { label:"Traditional CDL School", price:"$3,000–$10,000", note:"Plus lost income while in class", highlight:false, items:[[true,"Hands-on driving instruction"],[false,"Requires weeks off work"],[false,"Rigid class schedules"],[false,"Expensive upfront cost"],[false,"No AI tutoring"],[false,"No readiness score"],[true,"Job help (sometimes)"],[false,"Written test prep included"]] },
    { label:"DrivePass",               price:"$39–$199",       note:"One-time. 7-day guarantee.",      highlight:true,  items:[[false,"Hands-on driving (need a school for that)"],[true,"Study without quitting your job"],[true,"100% self-paced"],[true,"Start for as little as $39"],[true,"AI tutor 24/7"],[true,"Readiness Score tracking"],[true,"CDL job board — 500K+ positions"],[true,"Written test prep — FMCSA-aligned"]] },
    { label:"Free Practice Sites",     price:"$0",             note:"You get what you pay for",        highlight:false, items:[[false,"No driving instruction"],[true,"No cost"],[true,"Available online"],[false,"Generic, not state-specific"],[false,"No AI tutoring"],[false,"No readiness tracking"],[false,"No job board"],[false,"No certificate"]] },
  ];
  return (
    <section style={{ background:C.surface, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:`${mobile?"60px 20px":"100px clamp(20px,5vw,64px)"}` }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom: mobile ? 40 : 64 }}>
          <Tag>THE HONEST COMPARISON</Tag>
          <h2 style={{ fontFamily:F.display, fontWeight:900, fontSize:`clamp(${mobile?"28px":"36px"},5vw,64px)`, color:C.white, margin:"20px 0 16px", lineHeight:1.05 }}>
            Why spend $7,000<br/><span style={{ color:C.amber, fontStyle:"italic" }}>when $79 works?</span>
          </h2>
          <p style={{ fontFamily:F.sans, fontSize: mobile ? 14 : 17, color:C.muted, maxWidth:540, margin:"0 auto", lineHeight:1.8 }}>
            CDL schools are for driving hours. DrivePass is for the written test — a fraction of the cost.
          </p>
        </div>
        <div ref={ref} style={{ display:"grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3,1fr)", gap:2, alignItems:"stretch" }}>
          {cols.map((col,i) => (
            <div key={col.label} style={{
              background:col.highlight?C.bg:C.surfaceAlt,
              border:`1px solid ${col.highlight?C.amber:C.border}`,
              borderTop:`3px solid ${col.highlight?C.amber:"transparent"}`,
              padding: mobile ? "28px 22px" : "40px 28px", position:"relative",
              display:"flex", flexDirection:"column",
              opacity:inView?1:0, transform:inView?"translateY(0)":"translateY(24px)",
              transition:`all 0.5s ease ${i*0.12}s`,
            }}>
              {col.highlight && <div style={{ position:"absolute", top:-13, left:"50%", transform:"translateX(-50%)", background:C.amber, color:C.bg, fontFamily:F.label, fontSize:10, letterSpacing:3, padding:"4px 14px", borderRadius:2, whiteSpace:"nowrap" }}>RECOMMENDED PATH</div>}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontFamily:F.label, fontSize:11, letterSpacing:3, color:col.highlight?C.amber:C.muted, marginBottom:12 }}>{col.label.toUpperCase()}</div>
                <div style={{ fontFamily:F.display, fontWeight:900, fontSize:col.highlight?44:34, color:col.highlight?C.amber:C.mutedLight, lineHeight:1, marginBottom:6 }}>{col.price}</div>
                <div style={{ fontFamily:F.sans, fontSize:13, color:C.muted }}>{col.note}</div>
              </div>
              <div style={{ height:1, background:C.border, marginBottom:20 }}/>
              <div style={{ flex:1 }}>
                {col.items.map(([has,text]) => (
                  <div key={text} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:12 }}>
                    <div style={{ width:18, height:18, borderRadius:"50%", flexShrink:0, marginTop:1, background:has?(col.highlight?C.amberGlow:C.greenGlow):C.dangerGlow, border:`1px solid ${has?(col.highlight?C.amber+"50":C.green+"50"):C.danger+"50"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontSize:9, color:has?(col.highlight?C.amber:C.green):C.danger }}>{has?"✓":"✗"}</span>
                    </div>
                    <span style={{ fontFamily:F.sans, fontSize:13, lineHeight:1.5, color:has?C.offwhite:C.muted }}>{text}</span>
                  </div>
                ))}
              </div>
              {col.highlight && (
                <button onClick={() => setView("courses")} style={{ width:"100%", background:C.amber, border:"none", color:C.bg, padding:"14px", textAlign:"center", borderRadius:2, cursor:"pointer", fontFamily:F.label, fontSize:16, letterSpacing:2, marginTop:24 }}>START FOR $39 →</button>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop:16, padding: mobile ? "18px 20px" : "24px 32px", background:C.amberGlow, border:`1px solid ${C.amber}40`, borderRadius:2, display:"flex", gap:14, alignItems:"flex-start", flexWrap:"wrap" }}>
          <span style={{ fontSize:24, flexShrink:0 }}>💡</span>
          <p style={{ fontFamily:F.sans, fontSize: mobile ? 14 : 15, color:C.offwhite, lineHeight:1.7, margin:0, flex:1 }}>
            <span style={{ color:C.amber, fontWeight:600 }}>The smart move:</span> Use DrivePass to ace the written test first — then enroll in a CDL school for driving hours. Walk in knowing the theory cold, finish faster, spend thousands less.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────
function FAQ() {
  const mobile = useBreakpoint();
  const [open, setOpen] = useState(null);
  return (
    <section style={{ padding:`${mobile?"60px 20px":"100px clamp(20px,5vw,64px)"}`, maxWidth:860, margin:"0 auto" }}>
      <div style={{ textAlign:"center", marginBottom: mobile ? 36 : 56 }}>
        <Tag>WE HEAR YOU</Tag>
        <h2 style={{ fontFamily:F.display, fontWeight:900, fontSize:`clamp(${mobile?"28px":"36px"},5vw,64px)`, color:C.white, margin:"16px 0 0", lineHeight:1.05 }}>
          The questions in your head<br/><span style={{ color:C.amber, fontStyle:"italic" }}>answered honestly.</span>
        </h2>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
        {OBJECTIONS.map((obj,i) => (
          <div key={i} style={{ background:open===i?C.surface:C.surfaceAlt, border:`1px solid ${open===i?C.amber+"50":C.border}`, borderRadius:2, overflow:"hidden", transition:"all 0.25s" }}>
            <div onClick={() => setOpen(open===i?null:i)} style={{ padding: mobile ? "18px 20px" : "24px 28px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", gap:16 }}>
              <span style={{ fontFamily:F.display, fontSize:`clamp(${mobile?"15px":"16px"},1.8vw,19px)`, color:C.white, fontWeight:600, lineHeight:1.4, flex:1 }}>{obj.q}</span>
              <span style={{ color:C.amber, fontSize:22, flexShrink:0, transform:open===i?"rotate(45deg)":"rotate(0)", transition:"transform 0.25s", fontFamily:F.label }}>+</span>
            </div>
            {open===i && (
              <div style={{ padding:`0 ${mobile?"20px":"28px"} ${mobile?"18px":"24px"}`, borderTop:`1px solid ${C.border}`, paddingTop:16 }}>
                <p style={{ fontFamily:F.sans, fontSize: mobile ? 14 : 16, color:C.mutedLight, lineHeight:1.85, margin:0 }}>{obj.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Certificate Preview ──────────────────────────────────────
function CertPreview() {
  const mobile = useBreakpoint();
  return (
    <section style={{ background:C.surface, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:`${mobile?"60px 20px":"100px clamp(20px,5vw,64px)"}` }}>
      <div style={{ maxWidth:1000, margin:"0 auto", display:"grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 40 : 80, alignItems:"center" }}>
        <div>
          <Tag>PROOF EMPLOYERS TRUST</Tag>
          <h2 style={{ fontFamily:F.display, fontWeight:900, fontSize:`clamp(${mobile?"28px":"32px"},4vw,52px)`, color:C.white, margin:"20px 0 16px", lineHeight:1.05 }}>
            A certificate that<br/><span style={{ color:C.amber, fontStyle:"italic" }}>actually means something.</span>
          </h2>
          <p style={{ fontFamily:F.sans, fontSize: mobile ? 14 : 16, color:C.muted, lineHeight:1.85, marginBottom:24 }}>
            Every DrivePass certificate carries a unique verification ID. Employers confirm your completion instantly at our verification portal — no phone calls, no waiting.
          </p>
          {["Unique certificate ID per student","Employer verification portal","DrivePass institutional seal","FMCSA curriculum alignment noted","Same-day delivery on completion"].map(t => (
            <div key={t} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <div style={{ width:18, height:18, borderRadius:"50%", background:C.amberGlow, border:`1px solid ${C.amber}50`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ color:C.amber, fontSize:10 }}>✓</span>
              </div>
              <span style={{ fontFamily:F.sans, fontSize: mobile ? 13 : 15, color:C.offwhite }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ background:`linear-gradient(135deg,${C.surfaceAlt},${C.surfaceLift})`, border:`1px solid ${C.borderLight}`, borderTop:`4px solid ${C.amber}`, padding: mobile ? "32px 24px" : "48px 40px", position:"relative", overflow:"hidden", boxShadow:`0 40px 80px rgba(0,0,0,0.5)` }}>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", opacity:0.04, fontSize:80, fontFamily:F.label, letterSpacing:4, color:C.white, transform:"rotate(-30deg)", userSelect:"none" }}>DRIVEPASS</div>
          <div style={{ textAlign:"center", marginBottom:28, position:"relative" }}>
            <div style={{ fontFamily:F.label, fontSize:10, color:C.amber, letterSpacing:4, marginBottom:6 }}>DRIVEPASS ACADEMY</div>
            <div style={{ width:40, height:2, background:C.amber, margin:"0 auto 12px" }}/>
            <div style={{ fontFamily:F.display, fontStyle:"italic", fontSize:13, color:C.muted }}>Certificate of Completion</div>
          </div>
          <div style={{ textAlign:"center", marginBottom:28, position:"relative" }}>
            <div style={{ fontFamily:F.sans, fontSize:12, color:C.muted, marginBottom:6 }}>This certifies that</div>
            <div style={{ fontFamily:F.display, fontWeight:900, fontSize: mobile ? 22 : 26, color:C.white, borderBottom:`1px solid ${C.border}`, paddingBottom:10, marginBottom:10 }}>Your Name Here</div>
            <div style={{ fontFamily:F.sans, fontSize:13, color:C.muted, lineHeight:1.7 }}>
              has successfully completed<br/>
              <span style={{ color:C.amber, fontWeight:600 }}>CDL General Knowledge Course</span><br/>
              with a final score of <span style={{ color:C.green, fontWeight:600 }}>92%</span>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", position:"relative" }}>
            <div>
              <div style={{ fontFamily:F.mono, fontSize:9, color:C.muted, marginBottom:3 }}>CERTIFICATE ID</div>
              <div style={{ fontFamily:F.mono, fontSize:11, color:C.amber }}>DP-2026-GK-00491</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:F.mono, fontSize:9, color:C.muted, marginBottom:3 }}>ISSUED</div>
              <div style={{ fontFamily:F.mono, fontSize:11, color:C.offwhite }}>May 15, 2026</div>
            </div>
          </div>
          <div style={{ marginTop:20, padding:"8px 14px", background:C.amberGlowSm, border:`1px solid ${C.amber}30`, borderRadius:2, textAlign:"center" }}>
            <div style={{ fontFamily:F.mono, fontSize:9, color:C.muted }}>VERIFY AT trydrivepass.com/verify/DP-2026-GK-00491</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────
function FinalCTA({ setView }) {
  const mobile = useBreakpoint();
  return (
    <section style={{ padding:`${mobile?"60px 20px 100px":"120px clamp(20px,5vw,64px)"}`, textAlign:"center", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 60% 60% at 50% 50%, ${C.amber}09 0%, transparent 70%)`, pointerEvents:"none" }}/>
      <div style={{ position:"relative", maxWidth:720, margin:"0 auto" }}>
        <Tag>ONE DECISION CHANGES EVERYTHING</Tag>
        <h2 style={{ fontFamily:F.display, fontWeight:900, fontSize:`clamp(${mobile?"40px":"44px"},7vw,88px)`, color:C.white, margin:"24px 0 14px", lineHeight:0.95 }}>
          Your family is<br/><span style={{ color:C.amber, fontStyle:"italic" }}>counting on you.</span>
        </h2>
        <p style={{ fontFamily:F.sans, fontSize: mobile ? 15 : 18, color:C.muted, lineHeight:1.85, marginBottom: mobile ? 36 : 48 }}>
          The only thing between where you are and where you need to be is a CDL license. The jobs are there. The pay is real. DrivePass gets you ready for step one.
        </p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:32, flexDirection: mobile ? "column" : "row", alignItems:"center" }}>
          <button onClick={() => setView("courses")} style={{
            background:C.amber, border:"none", color:C.bg,
            padding: mobile ? "18px 40px" : "20px 56px",
            borderRadius:2, cursor:"pointer",
            fontFamily:F.label, fontSize: mobile ? 19 : 22, letterSpacing:3,
            boxShadow:`0 0 60px ${C.amber}40`, transition:"all 0.25s",
            width: mobile ? "100%" : "auto",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=`0 12px 60px ${C.amber}60`; }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=`0 0 60px ${C.amber}40`; }}
          >I'M READY — START FOR $39</button>
          <button onClick={() => setView("exam")} style={{
            background:"transparent", border:`1px solid ${C.borderLight}`,
            color:C.white, padding: mobile ? "17px 40px" : "20px 40px",
            borderRadius:2, cursor:"pointer",
            fontFamily:F.label, fontSize: mobile ? 18 : 22, letterSpacing:3,
            width: mobile ? "100%" : "auto",
          }}>TRY IT FREE FIRST</button>
        </div>
        <div style={{ display:"flex", gap:20, justifyContent:"center", flexWrap:"wrap" }}>
          {["7-day money-back guarantee","One-time payment","CDL job board included"].map(t => (
            <span key={t} style={{ fontFamily:F.label, fontSize:11, letterSpacing:2, color:C.muted }}>
              <span style={{ color:C.amber }}>✓ </span>{t.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Courses View ─────────────────────────────────────────────
function CoursesView({ setView, setCourse }) {
  const mobile = useBreakpoint();
  const [ref, inView] = useInView();
  return (
    <div style={{ padding:`${mobile?"70px 16px 80px":"100px clamp(20px,5vw,64px) 80px"}`, maxWidth:1200, margin:"0 auto" }}>
      <div style={{ marginBottom: mobile ? 32 : 56 }}>
        <Tag>CDL TEST PREP</Tag>
        <h1 style={{ fontFamily:F.display, fontWeight:900, fontSize:`clamp(${mobile?"36px":"44px"},7vw,80px)`, color:C.white, margin:"20px 0 12px", lineHeight:1 }}>Choose Your Path.</h1>
        <p style={{ fontFamily:F.sans, fontSize: mobile ? 14 : 17, color:C.muted, margin:0 }}>FMCSA-aligned, self-paced, unlimited retakes, verified certificate on completion.</p>
      </div>
      <div ref={ref} style={{ display:"grid", gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fill,minmax(320px,1fr))", gap:2 }}>
        {COURSES.map((course,i) => (
          <div key={course.id} style={{
            background:C.surface, border:`1px solid ${C.border}`,
            padding: mobile ? "22px 18px" : "36px 28px", cursor:"pointer",
            borderLeft:`3px solid ${course.badge==="BEST VALUE"||course.badge==="MOST POPULAR"?C.amber:"transparent"}`,
            opacity:inView?1:0, transform:inView?"translateY(0)":"translateY(16px)",
            transition:`all 0.4s ease ${i*0.07}s`,
          }}
            onMouseEnter={e => { if(!mobile){e.currentTarget.style.borderColor=C.amber; e.currentTarget.style.transform="translateY(-4px)";} }}
            onMouseLeave={e => { if(!mobile){e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform="translateY(0)";} }}
            onClick={() => { setCourse(course); setView("enroll"); }}
          >
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize: mobile ? 26 : 32 }}>{course.icon}</span>
                <div>
                  <h3 style={{ fontFamily:F.display, fontWeight:700, fontSize: mobile ? 18 : 22, color:C.white, margin:0, lineHeight:1.2 }}>{course.title}</h3>
                  <div style={{ fontFamily:F.label, fontSize:10, color:C.muted, letterSpacing:2, marginTop:3 }}>{course.sub.toUpperCase()}</div>
                </div>
              </div>
              {course.badge && <span style={{ background:C.amberGlow, border:`1px solid ${C.amber}`, color:C.amber, fontFamily:F.label, fontSize:9, letterSpacing:1.5, padding:"3px 8px", borderRadius:2, flexShrink:0 }}>{course.badge}</span>}
            </div>
            <p style={{ fontFamily:F.sans, fontSize: mobile ? 13 : 14, color:C.muted, lineHeight:1.75, margin:"0 0 16px" }}>{course.desc}</p>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {[`${course.q}Q`,`${course.hrs}hr`,"Cert","FMCSA"].map(t => (
                  <span key={t} style={{ background:C.surfaceAlt, border:`1px solid ${C.border}`, fontFamily:F.label, fontSize:9, letterSpacing:1.5, color:C.muted, padding:"3px 7px", borderRadius:2 }}>{t}</span>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontFamily:F.display, fontWeight:900, fontSize: mobile ? 26 : 32, color:C.amber }}>${course.price}</span>
                <span style={{ fontFamily:F.label, fontSize:12, color:C.bg, background:C.amber, padding:"6px 12px", borderRadius:2 }}>→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Exam View ────────────────────────────────────────────────
function ExamView() {
  const mobile = useBreakpoint();
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  const q = PRACTICE_QS[cur];
  const total = PRACTICE_QS.length;

  const handleReveal = () => { if (sel===null) return; setRevealed(true); setAnswers([...answers,{correct:sel===q.correct}]); };
  const handleNext = () => { if (cur+1>=total) setDone(true); else { setCur(cur+1); setSel(null); setRevealed(false); setAiResponse(null); } };

  const askAI = async () => {
    setAiLoading(true); setAiResponse(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{ role:"user", content:`You are a friendly CDL instructor for a career changer in their 30s-40s. Warm, direct, plain language — not textbook.

Question: "${q.q}"
They chose: "${q.opts[sel]}"
Correct: "${q.opts[q.correct]}"
Result: ${sel===q.correct?"CORRECT":"WRONG"}

${sel!==q.correct?"Explain clearly why wrong and why correct.":"Reinforce why correct and give a memory tip."}

Under 4 sentences. Encouraging. End with one practical test-day tip.` }] }),
      });
      const data = await res.json();
      setAiResponse(data.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"Review the explanation above and keep going!");
    } catch { setAiResponse("Check the explanation above — you're building real knowledge. Keep going."); }
    finally { setAiLoading(false); }
  };

  if (done) {
    const score = answers.filter(a=>a.correct).length;
    const pct = Math.round((score/total)*100);
    const passed = pct>=80;
    return (
      <div style={{ minHeight:"100svh", display:"flex", alignItems:"center", justifyContent:"center", padding: mobile ? "80px 20px" : "100px 32px" }}>
        <div style={{ background:C.surface, border:`1px solid ${passed?C.amber:C.danger}`, borderTop:`4px solid ${passed?C.amber:C.danger}`, padding: mobile ? "40px 28px" : "64px 56px", maxWidth:520, width:"100%", textAlign:"center" }}>
          <div style={{ fontSize:64, marginBottom:20 }}>{passed?"🏆":"📚"}</div>
          <div style={{ fontFamily:F.display, fontWeight:900, fontSize: mobile ? 72 : 96, color:passed?C.amber:C.danger, lineHeight:1 }}>{pct}%</div>
          <h2 style={{ fontFamily:F.display, fontWeight:900, fontSize: mobile ? 28 : 36, color:C.white, margin:"12px 0 10px" }}>{passed?"You're ready.":"Keep studying."}</h2>
          <p style={{ fontFamily:F.sans, color:C.muted, lineHeight:1.8, marginBottom:36, fontSize:15 }}>
            {score} of {total} correct. {passed?"You're tracking above the 80% CDL pass threshold.":"The CDL pass threshold is 80%. Review explanations and try again — you're closer than you think."}
          </p>
          <button onClick={() => { setCur(0); setSel(null); setRevealed(false); setAnswers([]); setDone(false); setAiResponse(null); }} style={{ width:"100%", background:C.amber, border:"none", color:C.bg, padding:"16px", borderRadius:2, cursor:"pointer", fontFamily:F.label, fontSize:18, letterSpacing:2 }}>RETRY TEST</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100svh", padding: mobile ? "70px 16px 80px" : "100px clamp(20px,5vw,48px) 80px", maxWidth:760, margin:"0 auto" }}>
      <div style={{ marginBottom: mobile ? 32 : 44 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <Tag>FREE PRACTICE EXAM</Tag>
          <span style={{ fontFamily:F.label, fontSize:18, color:C.muted }}>{cur+1}/{total}</span>
        </div>
        <div style={{ height:4, background:C.border, borderRadius:2, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${((cur+1)/total)*100}%`, background:C.amber, transition:"width 0.4s ease" }}/>
        </div>
      </div>

      <span style={{ background:C.amberGlow, border:`1px solid ${C.amber}40`, color:C.amber, fontFamily:F.label, fontSize:10, letterSpacing:3, padding:"4px 12px", borderRadius:2 }}>{q.cat.toUpperCase()}</span>

      <h2 style={{ fontFamily:F.display, fontWeight:400, fontSize:`clamp(${mobile?"17px":"19px"},2.5vw,24px)`, color:C.white, lineHeight:1.55, margin: mobile ? "18px 0 24px" : "22px 0 32px" }}>{q.q}</h2>

      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
        {q.opts.map((opt,i) => {
          let border=C.border, bg=C.surface, color=C.white;
          if(revealed){ if(i===q.correct){border=C.green;bg=C.greenGlow;color=C.green;} else if(i===sel&&i!==q.correct){border=C.danger;bg=C.dangerGlow;color=C.danger;} else{color=C.muted;} }
          else if(i===sel){border=C.amber;bg=C.amberGlow;}
          return (
            <div key={i} onClick={() => { if(!revealed) setSel(i); }} style={{ border:`1px solid ${border}`, background:bg, padding: mobile ? "14px 14px" : "18px 20px", borderRadius:2, cursor:revealed?"default":"pointer", display:"flex", alignItems:"center", gap:14, transition:"all 0.2s" }}>
              <div style={{ width:28, height:28, borderRadius:"50%", border:`1px solid ${border}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F.label, fontSize:13, color, flexShrink:0 }}>{["A","B","C","D"][i]}</div>
              <span style={{ fontFamily:F.sans, fontSize: mobile ? 14 : 16, color, lineHeight:1.5, flex:1 }}>{opt}</span>
              {revealed&&i===q.correct&&<span style={{color:C.green,fontSize:18}}>✓</span>}
              {revealed&&i===sel&&i!==q.correct&&<span style={{color:C.danger,fontSize:18}}>✗</span>}
            </div>
          );
        })}
      </div>

      {revealed && (
        <div style={{ background:C.surfaceAlt, border:`1px solid ${C.border}`, borderLeft:`3px solid ${C.amber}`, padding: mobile ? "16px" : "20px 24px", borderRadius:2, marginBottom:20 }}>
          <div style={{ fontFamily:F.label, fontSize:10, color:C.amber, letterSpacing:3, marginBottom:8 }}>EXPLANATION — FMCSA REFERENCE</div>
          <p style={{ fontFamily:F.sans, color:C.mutedLight, lineHeight:1.8, margin:"0 0 14px", fontSize: mobile ? 13 : 15 }}>{q.exp}</p>
          {!aiResponse && (
            <button onClick={askAI} disabled={aiLoading} style={{ background:C.amberGlow, border:`1px solid ${C.amber}50`, color:C.amber, padding:"10px 18px", borderRadius:2, cursor:aiLoading?"wait":"pointer", fontFamily:F.label, fontSize:12, letterSpacing:2, display:"flex", alignItems:"center", gap:8, width: mobile ? "100%" : "auto", justifyContent:"center" }}>
              <span>🤖</span>{aiLoading?"AI TUTOR THINKING...":"ASK AI TUTOR TO EXPLAIN"}
            </button>
          )}
          {aiResponse && (
            <div style={{ marginTop:12, padding:"14px 16px", background:C.amberGlowSm, border:`1px solid ${C.amber}30`, borderRadius:2 }}>
              <div style={{ fontFamily:F.label, fontSize:10, color:C.amber, letterSpacing:3, marginBottom:6 }}>🤖 AI TUTOR</div>
              <p style={{ fontFamily:F.sans, color:C.offwhite, lineHeight:1.8, margin:0, fontSize: mobile ? 13 : 15 }}>{aiResponse}</p>
            </div>
          )}
        </div>
      )}

      <div style={ mobile ? { position:"fixed", bottom:58, left:0, right:0, padding:"10px 16px", background:"rgba(8,8,10,0.97)", borderTop:`1px solid ${C.border}`, backdropFilter:"blur(12px)", zIndex:100 } : {}}>
        {!revealed ? (
          <button onClick={handleReveal} disabled={sel===null} style={{ width: mobile ? "100%" : "auto", background:sel!==null?C.amber:C.border, border:"none", color:sel!==null?C.bg:C.muted, padding: mobile ? "15px" : "16px 40px", borderRadius:2, cursor:sel!==null?"pointer":"not-allowed", fontFamily:F.label, fontSize:18, letterSpacing:2 }}>CHECK ANSWER</button>
        ) : (
          <button onClick={handleNext} style={{ width: mobile ? "100%" : "auto", background:C.amber, border:"none", color:C.bg, padding: mobile ? "15px" : "16px 40px", borderRadius:2, cursor:"pointer", fontFamily:F.label, fontSize:18, letterSpacing:2 }}>{cur+1>=total?"SEE RESULTS →":"NEXT QUESTION →"}</button>
        )}
      </div>
    </div>
  );
}

// ─── Enroll View ──────────────────────────────────────────────
function EnrollView({ course, setView }) {
  const mobile = useBreakpoint();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:"", email:"", state:"", cdlClass:"A" });

  if (!course) return (
    <div style={{ padding:"140px 20px", textAlign:"center" }}>
      <button onClick={() => setView("courses")} style={{ background:"none", border:"none", color:C.amber, cursor:"pointer", fontFamily:F.label, fontSize:16, letterSpacing:2 }}>← BACK TO COURSES</button>
    </div>
  );

  const inputStyle = { width:"100%", background:C.surfaceAlt, border:`1px solid ${C.border}`, color:C.white, padding:"14px 16px", borderRadius:2, fontFamily:F.sans, fontSize:16, outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" };
  const maxW = mobile ? "100%" : 560;

  return (
    <div style={{ minHeight:"100svh", padding: mobile ? "70px 16px 90px" : "100px clamp(20px,5vw,48px) 80px", maxWidth:maxW, margin:"0 auto" }}>
      <button onClick={() => setView("courses")} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontFamily:F.label, fontSize:13, letterSpacing:2, marginBottom:32, padding:0 }}>← BACK TO COURSES</button>

      <div style={{ background:C.surface, border:`1px solid ${C.amber}50`, borderTop:`3px solid ${C.amber}`, padding: mobile ? "18px 16px" : "24px 24px", marginBottom:28, borderRadius:2 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:26 }}>{course.icon}</span>
            <div>
              <h3 style={{ fontFamily:F.display, fontWeight:700, fontSize: mobile ? 17 : 22, color:C.white, margin:0, lineHeight:1.2 }}>{course.title}</h3>
              <p style={{ fontFamily:F.label, fontSize:10, color:C.muted, letterSpacing:2, margin:"3px 0 0" }}>{course.sub.toUpperCase()}</p>
            </div>
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <div style={{ fontFamily:F.display, fontWeight:900, fontSize: mobile ? 32 : 40, color:C.amber, lineHeight:1 }}>${course.price}</div>
            <div style={{ fontFamily:F.sans, fontSize:12, color:C.muted }}>one-time</div>
          </div>
        </div>
      </div>

      <div style={{ display:"flex", gap:4, marginBottom:32 }}>
        {[1,2,3].map(s => <div key={s} style={{ flex:1, height:3, borderRadius:2, background:s<=step?C.amber:C.border, transition:"background 0.3s" }}/>)}
      </div>

      {step===1 && (
        <div>
          <h2 style={{ fontFamily:F.display, fontWeight:900, fontSize: mobile ? 28 : 34, color:C.white, marginBottom:28 }}>Tell us about yourself.</h2>
          {[["name","Full Name","text","John Smith"],["email","Email Address","email","you@email.com"],["state","Your State","text","Texas"]].map(([k,l,t,p]) => (
            <div key={k} style={{ marginBottom:18 }}>
              <label style={{ fontFamily:F.label, fontSize:11, color:C.amber, letterSpacing:3, display:"block", marginBottom:7 }}>{l.toUpperCase()}</label>
              <input type={t} placeholder={p} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} style={inputStyle}
                onFocus={e=>e.target.style.borderColor=C.amber} onBlur={e=>e.target.style.borderColor=C.border}/>
            </div>
          ))}
          <div style={{ marginBottom:28 }}>
            <label style={{ fontFamily:F.label, fontSize:11, color:C.amber, letterSpacing:3, display:"block", marginBottom:10 }}>CDL CLASS</label>
            <div style={{ display:"flex", gap:8 }}>
              {["A","B","C"].map(cls => (
                <button key={cls} onClick={()=>setForm({...form,cdlClass:cls})} style={{ flex:1, background:form.cdlClass===cls?C.amber:C.surfaceAlt, border:`1px solid ${form.cdlClass===cls?C.amber:C.border}`, color:form.cdlClass===cls?C.bg:C.muted, padding:14, borderRadius:2, cursor:"pointer", fontFamily:F.label, fontSize:20, letterSpacing:2, transition:"all 0.2s" }}>CLASS {cls}</button>
              ))}
            </div>
          </div>
          <button onClick={()=>setStep(2)} style={{ width:"100%", background:C.amber, border:"none", color:C.bg, padding:18, borderRadius:2, cursor:"pointer", fontFamily:F.label, fontSize:19, letterSpacing:3 }}>CONTINUE TO PAYMENT →</button>
        </div>
      )}

      {step===2 && (
        <div>
          <h2 style={{ fontFamily:F.display, fontWeight:900, fontSize: mobile ? 28 : 34, color:C.white, marginBottom:28 }}>Complete your enrollment.</h2>
          <div style={{ background:C.surfaceAlt, border:`1px solid ${C.border}`, padding:20, borderRadius:2, marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontFamily:F.sans, color:C.muted, fontSize:14 }}>{course.title}</span>
              <span style={{ fontFamily:F.display, fontWeight:700, fontSize:18, color:C.white }}>${course.price}</span>
            </div>
            <div style={{ height:1, background:C.border, margin:"12px 0" }}/>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontFamily:F.label, fontSize:13, color:C.white }}>TOTAL DUE</span>
              <span style={{ fontFamily:F.display, fontWeight:900, fontSize:24, color:C.amber }}>${course.price}</span>
            </div>
          </div>
          <div style={{ background:C.surfaceAlt, border:`2px dashed ${C.border}`, borderRadius:2, padding:32, textAlign:"center", marginBottom:20, color:C.muted, fontFamily:F.sans, fontSize:14, lineHeight:1.7 }}>
            🔒 Stripe Checkout Integration<br/><span style={{fontSize:12}}>Connect your Stripe account to accept payments</span>
          </div>
          <button onClick={()=>setStep(3)} style={{ width:"100%", background:C.amber, border:"none", color:C.bg, padding:18, borderRadius:2, cursor:"pointer", fontFamily:F.label, fontSize:19, letterSpacing:3 }}>COMPLETE ENROLLMENT →</button>
        </div>
      )}

      {step===3 && (
        <div style={{ textAlign:"center", paddingTop:20 }}>
          <div style={{ fontSize:72, marginBottom:20 }}>🚛</div>
          <h2 style={{ fontFamily:F.display, fontWeight:900, fontSize: mobile ? 40 : 52, color:C.amber, margin:"0 0 12px", fontStyle:"italic" }}>You're in.</h2>
          <p style={{ fontFamily:F.sans, color:C.muted, lineHeight:1.85, fontSize:15, marginBottom:32 }}>
            Welcome to {course.title}. Your course is live right now. Certificate issued automatically on completion.
          </p>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderLeft:`3px solid ${C.green}`, padding:20, borderRadius:2, textAlign:"left", marginBottom:32 }}>
            {["Instant course access","Unlimited retakes","AI tutor 24/7","Verified certificate on completion","CDL job board access","7-day money-back guarantee"].map(t => (
              <div key={t} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <span style={{ color:C.green }}>✓</span>
                <span style={{ fontFamily:F.sans, fontSize:14, color:C.offwhite }}>{t}</span>
              </div>
            ))}
          </div>
          <button onClick={()=>setView("exam")} style={{ width:"100%", background:C.amber, border:"none", color:C.bg, padding:18, borderRadius:2, cursor:"pointer", fontFamily:F.label, fontSize:18, letterSpacing:3 }}>START STUDYING →</button>
        </div>
      )}
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────
function Footer({ setView }) {
  const mobile = useBreakpoint();
  return (
    <footer style={{ background:C.bg, borderTop:`1px solid ${C.border}`, padding: mobile ? "40px 20px 80px" : "48px clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        {!mobile && (
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48, marginBottom:48 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <LogoMark size={24}/>
                <span style={{ fontFamily:F.label, fontSize:17, letterSpacing:4, color:C.white }}>DRIVE<span style={{color:C.amber}}>PASS</span></span>
              </div>
              <p style={{ fontFamily:F.sans, fontSize:14, color:C.muted, lineHeight:1.8, maxWidth:280 }}>The career school for people who can't afford to fail. FMCSA-aligned CDL written exam prep, AI instruction, and job board — built for real drivers.</p>
            </div>
            {[
              { title:"PLATFORM", links:["Courses","Practice Exam","AI Tutor","CDL Job Board"] },
              { title:"COMPANY",  links:["About","Our Story","Support","Partnerships"] },
              { title:"LEGAL",    links:["Privacy Policy","Terms of Use","Refund Policy","Verify Certificate"] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontFamily:F.label, fontSize:11, color:C.amber, letterSpacing:3, marginBottom:14 }}>{col.title}</div>
                {col.links.map(l => (
                  <div key={l} style={{ fontFamily:F.sans, fontSize:14, color:C.muted, marginBottom:10, cursor:"pointer", transition:"color 0.2s" }}
                    onMouseEnter={e=>e.currentTarget.style.color=C.white}
                    onMouseLeave={e=>e.currentTarget.style.color=C.muted}
                  >{l}</div>
                ))}
              </div>
            ))}
          </div>
        )}
        <div style={{ height:1, background:`linear-gradient(90deg, transparent, ${C.border}, transparent)`, marginBottom:20 }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <LogoMark size={18}/>
            <span style={{ fontFamily:F.label, fontSize:14, letterSpacing:3, color:C.muted }}>DRIVE<span style={{color:C.amber}}>PASS</span> © 2026</span>
          </div>
          <span style={{ fontFamily:F.label, fontSize:11, color:C.border, letterSpacing:3 }}>PASS ON YOUR FIRST TRY.</span>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("home");
  const [course, setCourse] = useState(null);

  useEffect(() => { window.scrollTo({ top:0, behavior:"smooth" }); }, [view]);

  return (
    <div style={{ background:C.bg, minHeight:"100vh", color:C.white, fontFamily:F.sans }}>
      <Nav view={view} setView={setView} />

      {view==="home" && (
        <>
          <Hero setView={setView} />
          <OutcomesBar />
          <FeatureSection />
          <Testimonials />
          <JourneySection />
          <CredibilitySection />
          <PriceComparison setView={setView} />
          <CertPreview />
          <FAQ />
          <FinalCTA setView={setView} />
          <Footer setView={setView} />
        </>
      )}
      {view==="courses" && <CoursesView setView={setView} setCourse={setCourse} />}
      {view==="exam"    && <ExamView />}
      {view==="enroll"  && <EnrollView course={course} setView={setView} />}
    </div>
  );
}
