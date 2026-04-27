/* App component - sidebar nav, page routing, all pages */
import React, { useState, useEffect } from 'react';
import NeoVLabPipeline from './pipeline.jsx';
import {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRadio,
} from './tweaks-panel.jsx';

const NAV = [
  { id: 'home',     label: 'Home',     idx: '01' },
  { id: 'skills',   label: 'Skills',   idx: '02' },
  { id: 'projects', label: 'Projects', idx: '03' },
  { id: 'resume',   label: 'Resume',   idx: '04' },
  { id: 'contact',  label: 'Contact',  idx: '05' },
];

const SKILLS = [
  { cat: 'Languages',     items: ['C#', 'Go', 'Python', 'TypeScript', 'JavaScript', 'SQL'], primary: ['C#', 'Go', 'TypeScript'] },
  { cat: 'Frontend',      items: ['React', 'Angular', 'Tailwind CSS', 'SignalR', 'MUI', 'WebView2'], primary: ['React', 'TypeScript'] },
  { cat: 'Backend',       items: ['ASP.NET Core', '.NET Framework', 'Node.js', 'GraphQL', 'Hasura', 'FastAPI'], primary: ['ASP.NET Core', 'GraphQL'] },
  { cat: 'Data',          items: ['PostgreSQL', 'SQL Server', 'SQLite', 'pgvector', 'Azure SQL'], primary: ['PostgreSQL', 'pgvector'] },
  { cat: 'Infrastructure',items: ['Docker', 'Azure DevOps', 'Jenkins', 'Bamboo', 'Terraform', 'RunPod Serverless'], primary: ['Docker', 'Azure DevOps'] },
  { cat: 'ML / AI',       items: ['Whisper', 'ComfyUI', 'Stable Diffusion', 'pgvector embeddings'], accent: ['Whisper', 'ComfyUI'] },
];

const ROLES = [
  {
    title: 'Full Stack Development Lead',
    org: 'Eliason/FM',
    where: 'Remote',
    when: 'Sep 2024 — Present',
    lead: 'Contributed across four projects on the Polaris platform (Documents, Legacy Assignments, Workload Manager, Plan Review), each integrating with platform areas built in parallel by separate teams.',
    bullets: [
      <>Led technical design and implementation of the <strong>workload manager</strong> — a unified interface for field engineers to manage assignments and for managers to monitor work across multiple locations and regions, replacing a system that had no effective visibility at scale.</>,
      <>Owned the <strong>document services API</strong>, a cross-cutting service for upload/download/generate, orchestrating OneDrive, Documentum, and internal Auditing/Export APIs via GraphQL.</>,
      <>Hardened the document services API: improved exception handling, updated logging, upgraded auth library to auto-resolve STS token configuration from Azure, reduced abstraction layers while preserving a clean repository pattern, and added unit test coverage.</>,
      <>Reduced critical GraphQL query times from <strong>30+ seconds to under 1 second</strong> through query analysis and database optimization.</>,
    ],
    stack: ['C#', '.NET 8', 'Hasura', 'GraphQL', 'TypeScript', 'React', 'PostgreSQL', 'Azure', 'Documentum', 'Terraform'],
  },
  {
    title: 'Senior Software Engineer',
    org: 'Umbrava',
    where: 'Hauppauge, NY',
    when: 'Jun 2023 — Jun 2024',
    lead: 'Microservices-based cloud platform for facilities maintenance management.',
    bullets: [
      <>Full stack development on a <strong>microservices architecture</strong> with services communicating via gRPC.</>,
      <>Reoriented frontend toward a modular, reusable component model, reducing duplication and improving maintainability.</>,
      <>Replaced legacy graphing libraries with a modern data viz stack, resolving long-standing rendering and compatibility issues.</>,
      <>Built interactive dashboard components — charts and graphs for facilities data.</>,
    ],
    stack: ['C#', '.NET 6', 'Node.js', 'React', 'TypeScript', 'MUI', 'gRPC'],
  },
  {
    title: 'Senior Software Engineer',
    org: 'Sandata Technologies',
    where: 'Port Washington, NY',
    when: 'Jul 2019 — Jun 2023',
    lead: 'SAM Platform — home healthcare scheduling and in-visit verification.',
    bullets: [
      <>Full stack development on the <strong>SAM Platform</strong>, enabling home healthcare agencies to schedule and process in-visit verification.</>,
      <>Participated in architectural planning with the CTO to modernize SAM from .NET Framework to modern .NET, including a frontend migration to Angular/TypeScript.</>,
      <>Migrated CI/CD from Jenkins to Bamboo, improving build reliability and deployment workflow.</>,
    ],
    stack: ['C#', '.NET Framework', '.NET 5', 'SQL Server', 'Angular', 'TypeScript', 'Jenkins', 'Bamboo'],
  },
  {
    title: 'Software Engineer',
    org: 'Applied Visions',
    where: 'Northport, NY',
    when: 'Oct 2016 — Jul 2019',
    lead: 'Design and delivery of C#/.NET applications across multiple cloud environments and front-end stacks.',
    bullets: [
      <>Designed and shipped applications in <strong>C# / .NET</strong>, working extensively with multiple SQL implementations.</>,
      <>Facilitated application development on both <strong>Azure and AWS</strong>; ranged across the front end from plain HTML/CSS/JS to React + Redux.</>,
      <>Led the upgrade of a <strong>business-critical legacy app</strong> to modern .NET and jQuery, and introduced D3.js for new data-viz experiences. The app couldn't be easily replaced — the modernization was done in place.</>,
      <>Authored architectural plans for clients to evolve toward a <strong>microservices model</strong> aligned with future business needs.</>,
      <>Organized and implemented <strong>GDPR compliance</strong> for a client app: researched cross-department business impact, briefed stakeholders, and wrote the data-anonymization code that met European requirements.</>,
    ],
    stack: ['C#', '.NET', 'SQL', 'Azure', 'AWS', 'React', 'Redux', 'D3.js', 'jQuery'],
  },
  {
    title: 'Front-end Developer',
    org: 'Digital Associates',
    where: 'Smithtown, NY',
    when: 'Jun 2015 — Aug 2016',
    lead: "Built and maintained the company's website and online storefront, plus the Java microservices behind it.",
    bullets: [
      <>Built, maintained, and tested the company's <strong>website and online storefront</strong>.</>,
      <>Created RESTful microservices using the Java micro-container framework <strong>Dropwizard</strong>.</>,
      <>Developed <strong>AngularJS</strong> apps to consume those services.</>,
    ],
    stack: ['Java', 'PHP', 'JavaScript', 'CSS', 'LESS', 'Sass', 'LDAP', 'MySQL', 'AngularJS', 'Dropwizard'],
  },
  {
    title: 'CA Technologies',
    org: 'Senior Research Aide · CEWIT',
    where: 'Stony Brook, NY',
    when: 'Jan 2014 — Jun 2015',
    lead: 'Research engineering at the Center of Excellence in Wireless and Information Technology.',
    bullets: [
      <>Developed reusable <strong>metrics graphs</strong> using ExtJS coupled with D3.js for the project's analytics surface.</>,
      <>Created maintenance services using the <strong>Mule ESB</strong>.</>,
      <>Coordinated with QA on a robust testing suite built around <strong>Selenium and TestNG</strong>.</>,
    ],
    stack: ['Java', 'JavaScript', 'ExtJS', 'D3.js', 'Sass', 'HTML', 'Selenium', 'TestNG', 'Mule ESB'],
  },
];

/* ===== Theme Switch (inline, reusable) ===== */
function ThemeSwitch({ mode, onChange }) {
  const opts = [
    { id: 'dark',    label: 'Dark',  glyph: <span className="glyph"></span> },
    { id: 'light',   label: 'Light', glyph: <span className="glyph"></span> },
    { id: 'reading', label: 'Read',  glyph: <span className="glyph">Aa</span> },
  ];
  return (
    <div className="theme-switch" role="group" aria-label="Theme mode">
      {opts.map((o) => (
        <button key={o.id}
                data-mode={o.id}
                className={mode === o.id ? 'active' : ''}
                onClick={() => onChange(o.id)}>
          {o.glyph}<span>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ===== Sidebar ===== */
function Sidebar({ active, onNav, mode, onModeChange }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">// SG.SYS</div>
        <div className="brand-name">Steven Gia</div>
        <div className="brand-role">systems · go · .net · ml</div>
      </div>

      <nav className="nav">
        <div className="nav-section">Sections</div>
        {NAV.map((n) => (
          <button key={n.id}
                  className={`nav-item ${active === n.id ? 'active' : ''}`}
                  onClick={() => onNav(n.id)}>
            <span className="nav-idx">{n.idx}</span>
            <span>{n.label}</span>
          </button>
        ))}
        <div className="nav-section" style={{ marginTop: 16 }}>Display</div>
        <ThemeSwitch mode={mode} onChange={onModeChange} />
      </nav>

      <div className="sidebar-foot">
        <div className="status-row"><span className="status-dot"></span><span>OPEN TO ROLES</span></div>
        <div>v2026.04 · build 0xA1</div>
      </div>
    </aside>
  );
}

/* ===== Home ===== */
function HomePage({ onNav }) {
  return (
    <div className="page-enter">
      <section className="hero">
        <div className="hero-left">
          <div className="page-eyebrow">Software Engineer · Northport NY</div>
          <h1>
            Systems builder.<br />
            <span className="accent">Go</span>, <span className="accent">.NET</span>,<br />
            <span className="accent-mag">ML pipelines.</span>
          </h1>
          <p className="hero-tag">
            Full stack development lead with twelve years shipping production systems —
            from healthcare scheduling at scale to a local-first ML media platform with
            a Go GPU supervisor and a six-phase analysis pipeline.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => onNav('projects')}>
              ▸ View NeoVLab
            </button>
            <button className="btn" onClick={() => onNav('resume')}>
              · Read resume
            </button>
            <button className="btn" onClick={() => onNav('contact')}>
              · Get in touch
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-num">12+</div>
              <div className="stat-label">years shipping</div>
            </div>
            <div className="stat">
              <div className="stat-num">5</div>
              <div className="stat-label">languages in prod<br/>c# · go · py · ts · sql</div>
            </div>
            <div className="stat">
              <div className="stat-num">FS</div>
              <div className="stat-label">full stack<br/>infra → ui</div>
            </div>
          </div>
        </div>

        <div className="hero-term">
          <div className="hero-term-bar">
            <span className="term-id">◉ NODE://SG.SYS</span>
            <span className="term-mid">SECURE_LINK · ENC:AES-256</span>
            <span className="term-stat">●&nbsp;TX</span>
          </div>
          <div className="hero-term-body">
            <span className="ln"><span className="prompt">root@sg.sys ~&gt;</span> ./identify</span>
            <span className="ln"><span className="com">[ok] handshake · 200ms · trace=0xA1F2</span></span>
            <span className="ln">{'>'} target: <span className="str">steven.gia</span> · full_stack_lead</span>
            <span className="ln">{'>'} since: <span className="str">2014</span> · uptime: <span className="str">12y</span></span>
            <span className="ln"> </span>
            <span className="ln"><span className="prompt">root@sg.sys ~&gt;</span> dump --profile</span>
            <span className="ln"><span className="key">[role]</span>     <span className="str">systems · full-stack</span></span>
            <span className="ln"><span className="key">[stack]</span>    <span className="str">go · .net · py · ts · sql</span></span>
            <span className="ln"><span className="key">[focus]</span>    <span className="str">ml-infra · perf · arch</span></span>
            <span className="ln"><span className="key">[active]</span>   <span className="str">NeoVLab // Polaris</span></span>
            <span className="ln"><span className="key">[seeking]</span>  <span className="str">senior // lead</span></span>
            <span className="ln"><span className="key">[loc]</span>      <span className="str">ny · remote</span></span>
            <span className="ln"> </span>
            <span className="ln"><span className="com">[end of stream]</span></span>
            <span className="ln"><span className="prompt">root@sg.sys ~&gt;</span> _<span className="cursor"></span></span>
          </div>
        </div>
      </section>

      <section className="now-block">
        <h3>Now / Recent</h3>
        <div className="now-list">
          <div className="now-row">
            <span className="when">2024 — NOW</span>
            <span className="what"><strong>Polaris platform · Eliason/FM</strong><br /><span>Owning document services API + workload manager across four cross-team projects.</span></span>
            <span className="where">remote</span>
          </div>
          <div className="now-row">
            <span className="when">2024 — NOW</span>
            <span className="what"><strong>NeoVLab</strong><br /><span>Local-first AI media platform — Go GPU supervisor, 6-phase pipeline, WPF + WebView2 shell.</span></span>
            <span className="where">side project</span>
          </div>
          <div className="now-row">
            <span className="when">PRIOR</span>
            <span className="what"><strong>Umbrava · Sandata Technologies</strong><br /><span>Microservices facilities platform · home healthcare verification at scale.</span></span>
            <span className="where">2019 — 2024</span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ===== Skills ===== */
function SkillsPage() {
  return (
    <div className="page-enter">
      <div className="page-head">
        <div className="page-eyebrow">02 · Capabilities</div>
        <h1 className="page-title">Skills & stack</h1>
        <p className="page-sub">
          Where I spend my time. <span style={{ color: 'var(--cyan)' }}>Cyan</span> = primary daily use,
          {' '}<span style={{ color: 'var(--magenta)' }}>magenta</span> = applied in production ML.
        </p>
      </div>

      <div className="skills-grid">
        {SKILLS.map((cat, i) => (
          <div key={cat.cat} className="skill-cat">
            <div className="panel-corner tl"></div>
            <div className="panel-corner tr"></div>
            <div className="panel-corner bl"></div>
            <div className="panel-corner br"></div>
            <div className="skill-cat-head">
              <span className="skill-cat-name">› {cat.cat}</span>
              <span className="skill-cat-num">{String(i+1).padStart(2,'0')} / {String(SKILLS.length).padStart(2,'0')}</span>
            </div>
            <div className="chip-row">
              {cat.items.map((it) => {
                const isPrimary = (cat.primary || []).includes(it);
                const isAccent = (cat.accent || []).includes(it);
                const cls = isAccent ? 'chip accent' : (isPrimary ? 'chip primary' : 'chip');
                return <span key={it} className={cls}>{it}</span>;
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 36, padding: '20px 24px', border: '1px solid var(--panel-line)', background: 'var(--panel)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
        <div>
          <div className="mono-eyebrow" style={{ marginBottom: 8 }}>Operating range</div>
          <div style={{ fontSize: 14, color: 'var(--fg)' }}>Architecture, full-stack feature work, performance tuning, infra, ML integration.</div>
        </div>
        <div>
          <div className="mono-eyebrow" style={{ marginBottom: 8 }}>Pattern</div>
          <div style={{ fontSize: 14, color: 'var(--fg)' }}>Lead technical design, ship the hard parts, harden + measure, hand off cleanly.</div>
        </div>
        <div>
          <div className="mono-eyebrow" style={{ marginBottom: 8 }}>Currently exploring</div>
          <div style={{ fontSize: 14, color: 'var(--fg)' }}>GPU supervision, vector search at scale, generative video orchestration via RunPod.</div>
        </div>
      </div>
    </div>
  );
}

/* ===== Projects ===== */
function ProjectsPage() {
  return (
    <div className="page-enter">
      <div className="page-head">
        <div className="page-eyebrow">03 · Featured project</div>
        <h1 className="page-title">NeoVLab</h1>
        <p className="page-sub">Local-first AI media analysis — automated processing and cataloging of personal media libraries.</p>
      </div>

      <div className="proj-hero">
        <div>
          <div className="mono-eyebrow" style={{ color: 'var(--cyan)' }}>// the problem</div>
          <h2 className="proj-title">A GPU-aware media analyzer that runs entirely on your machine.</h2>
          <p className="proj-tag">
            Cloud media analyzers want your library in their bucket. NeoVLab inverts that —
            a local-first desktop app that orchestrates Whisper, face clustering, and
            generative workflows directly on local GPUs, falling out to RunPod only when
            the job calls for it.
          </p>
          <div className="proj-meta">
            <div className="meta-item"><span className="lbl">Status</span><span className="val">Active · 2024 — Now</span></div>
            <div className="meta-item"><span className="lbl">Role</span><span className="val">Sole architect &amp; engineer</span></div>
            <div className="meta-item"><span className="lbl">Surface</span><span className="val">Desktop · WPF + WebView2</span></div>
            <div className="meta-item"><span className="lbl">Distribution</span><span className="val">Docker Compose · local</span></div>
          </div>
        </div>
        <div className="proj-stats">
          <div className="proj-stat"><span className="v">6</span><span className="l">phase pipeline</span></div>
          <div className="proj-stat"><span className="v">2</span><span className="l">db architecture<br/>sqlite + pg</span></div>
          <div className="proj-stat"><span className="v">5</span><span className="l">languages<br/>c# · go · py · ts · sql</span></div>
          <div className="proj-stat"><span className="v">E2E</span><span className="l">job lifecycle<br/>tests</span></div>
        </div>
      </div>

      <NeoVLabPipeline />

      <div className="stack-diagram">
        <div className="stack-col">
          <h4>// Supervisor</h4>
          <ul>
            <li>Go GPU supervisor</li>
            <li>Per-handler venv isolation</li>
            <li>Crash / OOM recovery</li>
            <li>HTTP artifact transfer</li>
            <li>Push-dispatch via SSE</li>
          </ul>
        </div>
        <div className="stack-col">
          <h4>// Service</h4>
          <ul>
            <li>ASP.NET Core · .NET 10</li>
            <li>Dual-DB: SQLite + PG</li>
            <li>pgvector cosine</li>
            <li>SignalR progress</li>
            <li>Job-lifecycle E2E tests</li>
          </ul>
        </div>
        <div className="stack-col">
          <h4>// Surface</h4>
          <ul>
            <li>React 19 + TS SPA</li>
            <li>Tailwind CSS v4</li>
            <li>WPF shell · WebView2</li>
            <li>ComfyUI on RunPod</li>
            <li>SDXL · WAN 2.1/2.2</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: 32, padding: '24px 28px', border: '1px solid var(--panel-line)', background: 'var(--panel)' }}>
        <div className="mono-eyebrow" style={{ marginBottom: 14, color: 'var(--magenta)' }}>// why it's interesting</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--cyan)', marginBottom: 6 }}>01 · GPU as a managed resource</div>
            <div style={{ color: 'var(--fg)', fontSize: 14, lineHeight: 1.55 }}>
              The Go supervisor treats Python ML handlers like long-running daemons —
              isolated venvs, structured crash recovery, and HTTP artifact transfer keep
              the .NET service decoupled from CUDA reality.
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--cyan)', marginBottom: 6 }}>02 · Vector search where it lives</div>
            <div style={{ color: 'var(--fg)', fontSize: 14, lineHeight: 1.55 }}>
              Face embeddings cluster in pgvector with cosine similarity, not in a separate
              service. SQLite holds the catalog; Postgres holds the math.
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--cyan)', marginBottom: 6 }}>03 · Hybrid local/cloud GPU</div>
            <div style={{ color: 'var(--fg)', fontSize: 14, lineHeight: 1.55 }}>
              ComfyUI workflows run locally for cheap jobs, on RunPod Serverless for
              SDXL/WAN — the supervisor abstracts which GPU answered.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Resume ===== */
function RoleCard({ role, isOpen, onToggle }) {
  return (
    <div className={`role ${isOpen ? 'open' : ''}`}>
      <div className="role-head" onClick={onToggle}>
        <div>
          <div className="role-title">{role.title}</div>
          <div className="role-org">
            {role.org}<span className="sep">·</span>{role.where}
          </div>
        </div>
        <div className="role-when">{role.when}</div>
        <div className="role-toggle">{isOpen ? '−' : '+'}</div>
      </div>
      {isOpen && (
        <div className="role-body">
          <div>
            <p className="lead">{role.lead}</p>
            <ul>
              {role.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
          <div className="role-side">
            <h5>// stack</h5>
            <div className="stack-list">
              {role.stack.map((s) => <span key={s}>{s}</span>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResumePage({ mode, onModeChange }) {
  const [openIdx, setOpenIdx] = useState(0); // first role open by default

  return (
    <div className="page-enter">
      <div className="page-head">
        <div className="page-head-row">
          <div>
            <div className="page-eyebrow">04 · Detailed history</div>
            <h1 className="page-title">Resume</h1>
            <p className="page-sub">Click a role to expand. Most recent first.</p>
          </div>
          <div>
            <div className="mono-eyebrow" style={{ marginBottom: 6, fontSize: 10 }}>// reading mode</div>
            <ThemeSwitch mode={mode} onChange={onModeChange} />
          </div>
        </div>
      </div>

      <div className="resume-list">
        {ROLES.map((role, i) => (
          <RoleCard key={i} role={role}
                    isOpen={openIdx === i}
                    onToggle={() => setOpenIdx(openIdx === i ? -1 : i)} />
        ))}
      </div>

      <div className="edu-block">
        <div>
          <div className="school">SUNY Stony Brook University</div>
          <div className="deg">Bachelor of Science · Computer Science</div>
        </div>
        <div className="when">Fall 2015</div>
      </div>
    </div>
  );
}

/* ===== Contact ===== */
function ContactPage() {
  return (
    <div className="page-enter">
      <div className="page-head">
        <div className="page-eyebrow">05 · Establish connection</div>
        <h1 className="page-title">Get in touch</h1>
        <p className="page-sub">Open to senior and lead roles. Remote-first; New York-based.</p>
      </div>

      <div className="contact-grid">
        <a className="contact-card" href="mailto:steven.gia@outlook.com">
          <span className="lbl">// email</span>
          <span className="val">steven.gia@outlook.com</span>
          <span className="arrow">▸ compose →</span>
        </a>
        <div className="contact-card" style={{ cursor: 'default' }}>
          <span className="lbl">// availability</span>
          <span className="val">Open to roles</span>
          <span className="arrow" style={{ color: '#4ade80' }}>● ACTIVELY LISTENING</span>
        </div>
        <div className="contact-card" style={{ cursor: 'default' }}>
          <span className="lbl">// location</span>
          <span className="val">New York · Remote</span>
          <span className="arrow" style={{ color: 'var(--fg-mute)' }}>EST · GMT-5</span>
        </div>
        <div className="contact-card" style={{ cursor: 'default' }}>
          <span className="lbl">// response window</span>
          <span className="val">24 — 48h</span>
          <span className="arrow" style={{ color: 'var(--fg-mute)' }}>weekdays</span>
        </div>
      </div>

      <div style={{ marginTop: 48, fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--fg-dim)', maxWidth: 600 }}>
        <div>{'>'} prefer a written intro w/ what you're building, the role's scope, and whether it's senior or lead track.</div>
        <div>{'>'} reply window: 24–48h on weekdays.</div>
      </div>
    </div>
  );
}

/* ===== Reactive grid ===== */
function GridBg() {
  useEffect(() => {
    const onMove = (e) => {
      document.documentElement.style.setProperty('--mx', e.clientX + 'px');
      document.documentElement.style.setProperty('--my', e.clientY + 'px');
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  return (
    <div className="grid-bg">
      <div className="vignette"></div>
    </div>
  );
}

/* ===== App ===== */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "dark",
  "intensity": "balanced"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [page, setPage] = useState('home');
  const [pageKey, setPageKey] = useState(0);

  const handleNav = (id) => {
    if (id === page) return;
    setPage(id);
    setPageKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const setMode = (m) => setTweak('mode', m);

  const themeClass = `theme-${t.mode} intensity-${t.intensity}`;

  useEffect(() => {
    document.body.className = themeClass;
  }, [themeClass]);

  let CurrentPage;
  switch (page) {
    case 'skills':   CurrentPage = <SkillsPage />; break;
    case 'projects': CurrentPage = <ProjectsPage />; break;
    case 'resume':   CurrentPage = <ResumePage mode={t.mode} onModeChange={setMode} />; break;
    case 'contact':  CurrentPage = <ContactPage />; break;
    default:         CurrentPage = <HomePage onNav={handleNav} />;
  }

  return (
    <>
      <GridBg />
      <div className="app">
        <Sidebar active={page} onNav={handleNav} mode={t.mode} onModeChange={setMode} />
        <main className="main" data-screen-label={NAV.find(n => n.id === page)?.label}>
          <div key={pageKey}>{CurrentPage}</div>
        </main>
      </div>

      <TweaksPanel>
        <TweakSection label="Theme" />
        <TweakRadio label="Mode" value={t.mode}
                    options={['dark', 'light', 'reading']}
                    onChange={(v) => setTweak('mode', v)} />
        <TweakRadio label="Intensity" value={t.intensity}
                    options={['restrained', 'balanced']}
                    onChange={(v) => setTweak('intensity', v)} />
      </TweaksPanel>
    </>
  );
}

export default App;
