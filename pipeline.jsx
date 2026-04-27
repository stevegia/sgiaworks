/* Pipeline diagram component for NeoVLab */
const { useEffect, useRef, useState } = React;

const PIPELINE_NODES = [
  { id: 'ingest',  x: 40,  y: 160, w: 120, h: 56, label: 'INGEST',         sub: 'media files',     color: 'cyan' },
  { id: 'transcribe', x: 200, y: 60,  w: 140, h: 56, label: 'TRANSCRIBE',  sub: 'Whisper',         color: 'cyan' },
  { id: 'diarize', x: 200, y: 160, w: 140, h: 56, label: 'DIARIZE',        sub: 'speaker split',   color: 'cyan' },
  { id: 'faces',   x: 200, y: 260, w: 140, h: 56, label: 'FACES',          sub: 'extract + crop',  color: 'cyan' },
  { id: 'cluster', x: 380, y: 210, w: 140, h: 56, label: 'CLUSTER',        sub: 'pgvector cosine', color: 'magenta' },
  { id: 'identify',x: 560, y: 160, w: 140, h: 56, label: 'IDENTIFY',       sub: 'person match',    color: 'magenta' },
  { id: 'tag',     x: 560, y: 260, w: 140, h: 56, label: 'TAG',            sub: 'visual labels',   color: 'magenta' },
  { id: 'sink',    x: 740, y: 210, w: 120, h: 56, label: 'CATALOG',        sub: 'SQLite + PG',     color: 'cyan' },
];

const PIPELINE_EDGES = [
  ['ingest', 'transcribe'],
  ['ingest', 'diarize'],
  ['ingest', 'faces'],
  ['transcribe', 'identify'],
  ['diarize', 'identify'],
  ['faces', 'cluster'],
  ['cluster', 'identify'],
  ['cluster', 'tag'],
  ['identify', 'sink'],
  ['tag', 'sink'],
];

const PHASE_ORDER = [
  ['ingest'],
  ['transcribe', 'diarize', 'faces'],
  ['cluster'],
  ['identify', 'tag'],
  ['sink'],
];

function NeoVLabPipeline() {
  const [phase, setPhase] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setPhase((p) => (p + 1) % (PHASE_ORDER.length + 1));
    }, 1400);
    return () => clearInterval(t);
  }, [running]);

  const activeIds = new Set();
  for (let i = 0; i < phase; i++) PHASE_ORDER[i].forEach((id) => activeIds.add(id));
  const currentIds = new Set(PHASE_ORDER[phase] || []);

  const nodeMap = Object.fromEntries(PIPELINE_NODES.map(n => [n.id, n]));

  const W = 880;
  const H = 360;

  return (
    <div className="pipeline-wrap">
      <div className="pipeline-head">
        <div>
          <h3>6-phase ML pipeline</h3>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-mute)', marginTop: 4, letterSpacing: '0.04em' }}>
            ingest → transcribe / diarize / faces → cluster → identify / tag → catalog
          </div>
        </div>
        <div className="pipeline-controls">
          <button className={`pl-btn ${running ? 'active' : ''}`} onClick={() => setRunning(!running)}>
            {running ? '■ pause' : '▶ run'}
          </button>
          <button className="pl-btn" onClick={() => { setPhase(0); }}>
            ↺ reset
          </button>
        </div>
      </div>

      <div className="pipeline">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ display: 'block' }}>
          <defs>
            <marker id="arr" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill="var(--cyan)" />
            </marker>
            <marker id="arr-mag" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill="var(--magenta)" />
            </marker>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* edges */}
          {PIPELINE_EDGES.map(([a, b], i) => {
            const A = nodeMap[a], B = nodeMap[b];
            const x1 = A.x + A.w, y1 = A.y + A.h / 2;
            const x2 = B.x,        y2 = B.y + B.h / 2;
            const mx = (x1 + x2) / 2;
            const path = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
            const isActive = activeIds.has(a) && (activeIds.has(b) || currentIds.has(b));
            const isFlow = activeIds.has(a) && currentIds.has(b);
            const useMag = B.color === 'magenta' || A.color === 'magenta';
            const stroke = isActive ? (useMag ? 'var(--magenta)' : 'var(--cyan)') : 'var(--panel-line-strong)';
            return (
              <g key={i}>
                <path d={path} fill="none" stroke={stroke}
                      strokeWidth={isActive ? 1.5 : 1}
                      opacity={isActive ? 1 : 0.5}
                      markerEnd={isActive ? (useMag ? 'url(#arr-mag)' : 'url(#arr)') : ''}
                      style={{ transition: 'all 280ms' }} />
                {isFlow && (
                  <circle r="3" fill={useMag ? 'var(--magenta)' : 'var(--cyan)'} filter="url(#glow)">
                    <animateMotion dur="1.2s" repeatCount="indefinite" path={path} />
                  </circle>
                )}
              </g>
            );
          })}

          {/* nodes */}
          {PIPELINE_NODES.map((n) => {
            const isCur = currentIds.has(n.id);
            const isDone = activeIds.has(n.id);
            const isMag = n.color === 'magenta';
            const accent = isMag ? 'var(--magenta)' : 'var(--cyan)';
            const stroke = isCur || isDone ? accent : 'var(--panel-line-strong)';
            return (
              <g key={n.id} style={{ transition: 'all 280ms' }}>
                <rect x={n.x} y={n.y} width={n.w} height={n.h}
                      fill={isCur ? (isMag ? 'var(--magenta-soft)' : 'var(--cyan-soft)') : 'var(--bg-2)'}
                      stroke={stroke}
                      strokeWidth={isCur ? 1.5 : 1}
                      filter={isCur ? 'url(#glow)' : ''}
                      style={{ transition: 'all 280ms' }} />
                {/* tick marks at corners */}
                <path d={`M ${n.x} ${n.y+6} L ${n.x} ${n.y} L ${n.x+6} ${n.y}`}
                      fill="none" stroke={accent} strokeWidth="1" opacity={isDone || isCur ? 1 : 0.4} />
                <path d={`M ${n.x+n.w-6} ${n.y} L ${n.x+n.w} ${n.y} L ${n.x+n.w} ${n.y+6}`}
                      fill="none" stroke={accent} strokeWidth="1" opacity={isDone || isCur ? 1 : 0.4} />
                <path d={`M ${n.x} ${n.y+n.h-6} L ${n.x} ${n.y+n.h} L ${n.x+6} ${n.y+n.h}`}
                      fill="none" stroke={accent} strokeWidth="1" opacity={isDone || isCur ? 1 : 0.4} />
                <path d={`M ${n.x+n.w-6} ${n.y+n.h} L ${n.x+n.w} ${n.y+n.h} L ${n.x+n.w} ${n.y+n.h-6}`}
                      fill="none" stroke={accent} strokeWidth="1" opacity={isDone || isCur ? 1 : 0.4} />

                <text x={n.x + n.w/2} y={n.y + n.h/2 - 3}
                      textAnchor="middle"
                      fontFamily="var(--mono)" fontSize="11"
                      fontWeight="600"
                      letterSpacing="1.5"
                      fill={isCur || isDone ? accent : 'var(--fg)'}>
                  {n.label}
                </text>
                <text x={n.x + n.w/2} y={n.y + n.h/2 + 12}
                      textAnchor="middle"
                      fontFamily="var(--mono)" fontSize="9.5"
                      fill="var(--fg-mute)">
                  {n.sub}
                </text>
              </g>
            );
          })}

          {/* phase indicator */}
          <g>
            <text x={W - 10} y={20} textAnchor="end"
                  fontFamily="var(--mono)" fontSize="10"
                  fill="var(--fg-dim)" letterSpacing="1.5">
              PHASE {String(Math.min(phase, PHASE_ORDER.length)).padStart(2, '0')} / {String(PHASE_ORDER.length).padStart(2, '0')}
            </text>
            <text x={10} y={20}
                  fontFamily="var(--mono)" fontSize="10"
                  fill="var(--cyan)" letterSpacing="1.5">
              ◉ NEOVLAB.PIPELINE
            </text>
          </g>
        </svg>
      </div>

      {/* phase ticker */}
      <div style={{ display: 'flex', gap: 4, marginTop: 16, fontFamily: 'var(--mono)', fontSize: 11 }}>
        {['ingest', 'extract', 'cluster', 'identify+tag', 'catalog'].map((label, i) => (
          <div key={i} style={{
            flex: 1,
            padding: '8px 10px',
            border: '1px solid var(--panel-line)',
            background: i < phase ? 'var(--cyan-soft)' : (i === phase ? 'var(--magenta-soft)' : 'transparent'),
            color: i < phase ? 'var(--cyan)' : (i === phase ? 'var(--magenta)' : 'var(--fg-mute)'),
            borderColor: i <= phase ? (i === phase ? 'var(--magenta)' : 'var(--cyan)') : 'var(--panel-line)',
            transition: 'all 280ms',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            {String(i+1).padStart(2,'0')} · {label}
          </div>
        ))}
      </div>
    </div>
  );
}

window.NeoVLabPipeline = NeoVLabPipeline;
