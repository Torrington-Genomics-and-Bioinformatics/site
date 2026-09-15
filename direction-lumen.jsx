// Direction D — "Lumen"  (v2 — real content from company profile + business plan)
// Premium luminous white. Brand cyan→teal from the logo. Helix's structure + Codex's ATGC streams.

const LUM_PAPER = '#ffffff';
const LUM_PAPER2 = '#f6f9fb';
const LUM_PAPER3 = '#eef3f6';
const LUM_INK = '#0f1a24';
const LUM_INK2 = '#2a3a4a';
const LUM_DIM = '#6b7c8c';
const LUM_LINE = 'rgba(15,26,36,0.08)';
const LUM_LINE2 = 'rgba(15,26,36,0.04)';

const LUM_BLUE = '#3DA8C8';
const LUM_TEAL = '#5BAE9D';
const LUM_GRAD = `linear-gradient(135deg, ${LUM_BLUE} 0%, ${LUM_TEAL} 100%)`;
const LUM_GRAD_SOFT = `linear-gradient(135deg, rgba(61,168,200,0.10) 0%, rgba(91,174,157,0.10) 100%)`;

// Contact form endpoint — sign up at https://formspree.io, create a form, and
// replace YOUR_FORM_ID below with the ID it gives you (from the form's endpoint
// URL, e.g. https://formspree.io/f/abcdwxyz).
const CONTACT_FORM_ENDPOINT = 'https://formspree.io/f/xbgraaqy';

// ---- Streaming ATGC backdrop ----
function LumenStream({ density = 1 }) {
  const letters = 'ACGT';
  const rowCount = Math.max(8, Math.round(12 * density));
  const rows = Array.from({ length: rowCount }).map((_, r) =>
  Array.from({ length: 80 }).map((_, c) => letters[(c * 7 + r * 3) % 4]).join('')
  );
  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: '100%', pointerEvents: 'none' }}>
      <style>{`
        @keyframes lum-stream { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .lum-row { white-space:nowrap; font-family: 'JetBrains Mono', monospace; font-size: 13px; letter-spacing: 7px;
                   animation: lum-stream 60s linear infinite; will-change: transform; }
      `}</style>
      {rows.map((row, i) =>
      <div key={i} className="lum-row" style={{
        color: i % 5 === 0 ? LUM_BLUE : i % 5 === 2 ? LUM_TEAL : LUM_INK,
        opacity: i % 5 === 0 ? 0.55 : i % 5 === 2 ? 0.35 : 0.07,
        animationDuration: `${44 + i * 5 % 36}s`,
        marginBottom: 14,
        fontWeight: i % 5 === 0 ? 500 : 400
      }}>
          {row + row}
        </div>
      )}
    </div>);

}

// ---- Animated DNA helix on the right side ----
function LumenHelix() {
  const rungs = 16, sub = 10, H = 760;
  const steps = (rungs - 1) * sub + 1;
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const BLUE = [61, 168, 200], TEAL = [91, 174, 157];
  const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;
  return (
    <div style={{ position: 'absolute', right: -40, top: '50%', transform: 'translateY(-50%)', width: 520, height: H, perspective: 1400, pointerEvents: 'none' }}>
      <style>{`
        @keyframes lum-spin { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        @keyframes lum-float { 0%,100% { transform: translateY(-8px); } 50% { transform: translateY(8px); } }
        .lum-float { position:absolute; inset:0; animation: lum-float 11s ease-in-out infinite; }
        .lum-strand { position:absolute; inset:0; left:-6px; top:-69px; transform-style: preserve-3d; animation: lum-spin 34s linear infinite; }
        .lum-rung { position:absolute; left:50%; transform-style: preserve-3d; }
      `}</style>
      <div style={{
        position: 'absolute', left: '50%', top: '50%', width: 420, height: 420, transform: 'translate(-50%,-50%)',
        background: 'radial-gradient(circle, rgba(61,168,200,0.13), transparent 65%)', pointerEvents: 'none'
      }} />
      <div className="lum-float">
        <div className="lum-strand">
          {Array.from({ length: steps }).map((_, i) => {
            const t = i / (steps - 1);
            const top = t * H;
            const rot = i / sub * (360 / 12);
            const isRung = i % sub === 0;
            const taper = Math.min(1, Math.sin(Math.PI * t) * 1.9);
            const w = 210 * (0.72 + 0.28 * taper);
            const c1 = mix(BLUE, TEAL, t), c2 = mix(TEAL, BLUE, t);
            const d = 8 * (0.7 + 0.3 * taper);
            const bd = 4.6 * (0.7 + 0.3 * taper);
            return (
              <div key={i} className="lum-rung" style={{ top, transform: `rotateY(${rot}deg)` }}>
                {isRung && <div style={{
                  position: 'absolute', left: -w / 2, top: -0.5, width: w, height: 1, borderRadius: 1,
                  background: `linear-gradient(90deg, ${rgb(c1)}, ${rgb(c2)})`,
                  opacity: 0.22 * (0.4 + 0.6 * taper)
                }} />}
                {!isRung && [[-w / 2, c1], [w / 2, c2]].map(([x, c], k) => (
                  <div key={`b${k}`} style={{
                    position: 'absolute', left: x - bd / 2, top: -bd / 2, width: bd, height: bd, borderRadius: '50%',
                    background: rgb(c), opacity: 0.9 * (0.3 + 0.7 * taper)
                  }} />
                ))}
                {isRung && [[-w / 2, c1], [w / 2, c2]].map(([x, c], k) => (
                  <div key={k} style={{
                    position: 'absolute', left: x - d / 2, top: -d / 2, width: d, height: d, borderRadius: '50%',
                    background: rgb(c), boxShadow: `0 0 ${8 + 8 * taper}px ${rgb(c)}`,
                    opacity: 0.35 + 0.65 * taper
                  }} />
                ))}
              </div>);

          })}
        </div>
      </div>
    </div>);

}

function LumenLockup({ size = 36 }) {
  return (
    <img src="assets/TGB-logo-trimmed.png" alt="Torrington Genomics &amp; Bioinformatics"
    style={{ height: size, width: 'auto', display: 'block' }} />);

}

// ---- Nav ----
function LumenNav() {
  const items = [
    ['Services', 'services'],
    ['Partners', 'partners'],
    ['Clients', 'clients'],
    ['Get in touch', 'contact'],
  ];
  const [open, setOpen] = React.useState(false);
  const goTo = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const goToContact = (subject) => {
    window.dispatchEvent(new CustomEvent('lum:prefill-subject', { detail: subject }));
    goTo('contact');
  };
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      borderBottom: `1px solid ${LUM_LINE}`
    }}>
      <style>{`
        .lum-nav-links, .lum-nav-actions { display: flex; align-items: center; }
        .lum-nav-toggle { display: none; }
        @media (max-width: 900px) {
          .lum-nav-links, .lum-nav-actions { display: none !important; }
          .lum-nav-toggle { display: flex !important; }
        }
      `}</style>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px clamp(20px, 5vw, 56px)'
      }}>
        <LumenLockup size={34} />
        <div className="lum-nav-links" style={{ gap: 36 }}>
          {items.map(([label, id]) =>
          <span key={id} onClick={() => goTo(id)} style={{ fontSize: 13.5, color: LUM_INK, fontWeight: 500, cursor: 'pointer', letterSpacing: 0.1 }}>{label}</span>
          )}
          <a href="bio-coder/" style={{ fontSize: 13.5, color: LUM_INK, fontWeight: 500, letterSpacing: 0.1, textDecoration: 'none' }}>Bio-Coder</a>
        </div>
        <div className="lum-nav-actions" style={{ gap: 10 }}>
          <button onClick={() => goToContact('Training request')} style={{
            background: 'transparent', border: `1px solid ${LUM_LINE}`, color: LUM_INK,
            padding: '10px 18px', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer'
          }}>Request Training</button>
          <button onClick={() => goToContact('Quote request')} style={{
            background: LUM_GRAD, border: 'none', color: '#fff',
            padding: '10px 20px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 6px 24px -8px rgba(61,168,200,0.45)'
          }}>Request a quote →</button>
        </div>
        <button
          className="lum-nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{
            alignItems: 'center', justifyContent: 'center', width: 38, height: 38,
            border: `1px solid ${LUM_LINE}`, borderRadius: 10, background: 'rgba(255,255,255,0.7)',
            cursor: 'pointer', flexDirection: 'column', gap: 4
          }}>
          <span style={{ width: 18, height: 1.5, background: LUM_INK, transition: 'transform 0.15s ease', transform: open ? 'translateY(5.5px) rotate(45deg)' : 'none' }} />
          <span style={{ width: 18, height: 1.5, background: LUM_INK, opacity: open ? 0 : 1, transition: 'opacity 0.15s ease' }} />
          <span style={{ width: 18, height: 1.5, background: LUM_INK, transition: 'transform 0.15s ease', transform: open ? 'translateY(-5.5px) rotate(-45deg)' : 'none' }} />
        </button>
      </div>
      {open &&
      <div style={{
        borderTop: `1px solid ${LUM_LINE}`, padding: '10px clamp(20px, 5vw, 56px) 22px',
        display: 'flex', flexDirection: 'column', gap: 2, background: LUM_PAPER
      }}>
        {items.map(([label, id]) =>
        <span key={id} onClick={() => goTo(id)} style={{
          padding: '13px 4px', borderBottom: `1px solid ${LUM_LINE}`,
          fontSize: 15, color: LUM_INK, fontWeight: 500, cursor: 'pointer'
        }}>{label}</span>
        )}
        <a href="bio-coder/" style={{
          padding: '13px 4px', borderBottom: `1px solid ${LUM_LINE}`,
          fontSize: 15, color: LUM_INK, fontWeight: 500, textDecoration: 'none'
        }}>Bio-Coder</a>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          <button onClick={() => goToContact('Training request')} style={{
            background: 'transparent', border: `1px solid ${LUM_LINE}`, color: LUM_INK,
            padding: '12px 18px', borderRadius: 999, fontSize: 14, fontWeight: 500, cursor: 'pointer'
          }}>Request Training</button>
          <button onClick={() => goToContact('Quote request')} style={{
            background: LUM_GRAD, border: 'none', color: '#fff',
            padding: '12px 20px', borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: 'pointer'
          }}>Request a quote →</button>
        </div>
      </div>}
    </div>);

}

// ---- Hero ----
function LumenHero() {
  return (
    <div style={{ position: 'relative', padding: 'clamp(40px, 8vw, 64px) clamp(20px, 5vw, 56px) clamp(48px, 8vw, 72px)', overflow: 'hidden', background: LUM_PAPER }}>
      <div style={{
        position: 'absolute', inset: 0,
        maskImage: 'linear-gradient(to right, transparent 0%, transparent 40%, black 75%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 40%, black 75%, transparent 100%)'
      }}>
        <LumenStream density={1.1} />
      </div>
      <div className="lum-hero-helix" style={{ position: 'absolute', inset: 0, opacity: 0.85 }}>
        <LumenHelix />
      </div>
      <div style={{
        position: 'absolute', right: -200, bottom: -200, width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(91,174,157,0.18), transparent 60%)', pointerEvents: 'none'
      }} />
      <style>{`
        @media (max-width: 640px) { .lum-hero-helix { display: none; } }
      `}</style>

      <style>{`
        .lum-hero-badge { border-radius: 999px; }
        @media (max-width: 640px) { .lum-hero-badge { border-radius: 20px; } }
      `}</style>
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 780 }}>
        <div className="lum-hero-badge" style={{
          display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: 10,
          padding: '7px 14px 7px 7px', border: `1px solid ${LUM_LINE}`,
          fontSize: 12.5, color: LUM_INK2, letterSpacing: 0.2, marginBottom: 36,
          background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', maxWidth: '100%'
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: LUM_GRAD, color: '#fff', padding: '3px 10px', borderRadius: 999,
            fontSize: 10.5, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />
            Colombo · est. 2018
          </span>
          The only dedicated genomics and bioinformatics company in Sri Lanka
        </div>{/* PREVIOUS BADGE (partner credentials) — replaced with the exome count.
             To restore: "Distributor — Celemics & Gen2Me · Authorized partner — Centogene" */}

        <h1 style={{
          fontFamily: 'Newsreader, serif', fontWeight: 300,
          lineHeight: 0.95, color: LUM_INK, margin: '0 0 12px',
          letterSpacing: -3.5, fontSize: "clamp(52px, 11vw, 104px)"
        }}>
          Torrington<span style={{ color: LUM_BLUE }}>.</span>
        </h1>

        <div style={{
          fontFamily: 'Newsreader, serif',
          fontStyle: 'italic',
          fontWeight: 400,

          lineHeight: 1.05,
          letterSpacing: -1.8,
          marginBottom: 40,
          background: LUM_GRAD,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: "clamp(32px, 7vw, 65px)", padding: "6px"
        }}>
          Where Sri Lankan<br />genomics begins
        </div>

        {/* PARAGRAPH-EMPHASIS: clean version (current). To revert to italic-emphasis version,
                  ask Claude to "restore paragraph emphasis" — wraps "sole integrated genomics and bioinformatics
                  enterprise" and "experimental design to execution" in italic <em>. */}
        <p style={{
          lineHeight: 1.6, color: LUM_INK2, margin: '0 0 24px', maxWidth: 600,
          letterSpacing: -0.2, fontWeight: 400, fontFamily: "Inter", fontSize: 17
        }}>As Sri Lanka's sole integrated genomics and bioinformatics enterprise, we take the work from experimental design to execution by supplying the reagents, sequencing the samples, interpreting the data, and training the next generation.



        </p>

        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 18, margin: '0 0 44px', maxWidth: 620
        }}>
          <span style={{ width: 3, alignSelf: 'stretch', background: LUM_GRAD, borderRadius: 2, flexShrink: 0 }} />
          <p style={{
            fontFamily: 'Newsreader, serif', fontStyle: 'italic',
            fontSize: 'clamp(19px, 3.5vw, 26px)', lineHeight: 1.3, letterSpacing: -0.5,
            margin: 0, color: LUM_INK, fontWeight: 400
          }}>
            Samples, sovereignty, and expertise <span style={{
              background: LUM_GRAD,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              fontWeight: 500
            }}>all stay in the country</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <button style={{
            background: LUM_GRAD, color: '#fff', border: 'none',
            padding: '16px 28px', borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            boxShadow: '0 12px 36px -10px rgba(61,168,200,0.55)'
          }}>Consult an Expert <span>→</span></button>
          <button style={{
            background: 'rgba(255,255,255,0.7)', color: LUM_INK, border: `1px solid ${LUM_LINE}`, backdropFilter: 'blur(8px)',
            padding: '16px 28px', borderRadius: 999, fontSize: 14, fontWeight: 500, cursor: 'pointer'
          }}>Our Services   </button>
        </div>
      </div>

      {/* Stats strip — real numbers */}
      <div style={{
        position: 'relative', zIndex: 2, marginTop: 96,
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 32,
        paddingTop: 36, borderTop: `1px solid ${LUM_LINE}`
      }}>
        {[
        ['2018', 'Founded with a defining mission to accelerate advanced genomic capabilities across Sri Lanka.'],
        ['1000+', 'NGS samples analyzed end-to-end using custom in-house bioinformatics pipelines. Raw reads to clinical interpretation, no outsourcing.'],
        ['5+', 'Authorized global diagnostic and manufacturing partnerships, bridging elite international networks with local genomics.'],
        ['1500+', 'Samples sequenced at our partnering NGS laboratories both locally and globally']].
        map(([n, l]) =>
        <div key={l}>
            <div style={{
            fontFamily: 'Newsreader, serif', fontSize: 'clamp(34px, 5vw, 48px)', color: LUM_INK, lineHeight: 1,
            letterSpacing: -1.5, marginBottom: 10, fontWeight: 300
          }}>{n}</div>
            <div style={{ fontSize: 13, color: LUM_DIM, lineHeight: 1.5 }}>{l}</div>
          </div>
        )}
      </div>
    </div>);

}

// ---- Mission strip ----
function LumenMission() {
  return (
    <div style={{ background: LUM_PAPER2, padding: 'clamp(48px, 8vw, 80px) clamp(20px, 5vw, 56px)', borderTop: `1px solid ${LUM_LINE}`, borderBottom: `1px solid ${LUM_LINE}` }}>
      <style>{`
        .lum-mission-grid { display: grid; grid-template-columns: minmax(160px, 220px) 1fr; gap: clamp(24px, 5vw, 64px); align-items: start; }
        @media (max-width: 640px) { .lum-mission-grid { grid-template-columns: 1fr; gap: 20px; } }
      `}</style>
      <div className="lum-mission-grid">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: LUM_DIM, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 18, fontWeight: 600 }}>
            <span style={{ width: 24, height: 1, background: LUM_GRAD }} />
            Mission
          </div>
          <div style={{ fontFamily: 'Newsreader, serif', fontSize: 18, color: LUM_INK2, lineHeight: 1.4, fontStyle: 'italic' }}>
            Why a genomics company in Sri&nbsp;Lanka.
          </div>
        </div>
        <div style={{
          fontFamily: 'Newsreader, serif', fontWeight: 300,
          fontSize: 'clamp(19px, 3vw, 28px)', lineHeight: 1.35, letterSpacing: -0.5, color: LUM_INK
        }}>
          The practical case is straightforward. A sample sent abroad takes weeks. The interpretation arrives without the clinician in the room, and any follow-up question has a time-zone in the way. TGB removes that delay: samples are sequenced, annotated, and reported{' '}
          <span style={{
            fontStyle: 'italic',
            background: LUM_GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>by scientists who know the patient population.</span> Same reference databases. Same ACMG standards. Faster answers, with a scientist who picks up the phone.
        </div>
      </div>
    </div>);

}

// ---- Service card mini-diagrams ----
// Unified system — every mini-diagram shares one viewBox (260x120), one
// visual band centred on y=48, and one caption baseline (y=104) so all six
// scale identically inside the 140px card header and align row-to-row.
const GX_VB = "0 0 260 120";
const GX_W = "100%";
const GX_H = 140;
const GX_STYLE = { pointerEvents: 'none', display: 'block' };
const GX_BG = LUM_PAPER2;
const CAP_Y = 104;
const gxCap = { fontSize: 7, fill: 'rgba(107,124,140,0.85)', letterSpacing: 1.6, fontFamily: 'JetBrains Mono, monospace' };

function SvcReagentsGraphic() {
  const cy = 48;
  const cols = [50, 130, 210];
  const hi = new Set(['0-3','1-2','3-0']);
  return (
    <svg viewBox={GX_VB} width={GX_W} height={GX_H} style={GX_STYLE}>
      {/* EXTRACT — tube */}
      <g transform={`translate(${cols[0]},0)`}>
        <rect x="-11" y={cy-30} width="22" height="8" rx="3" fill="rgba(61,168,200,0.4)" />
        <rect x="-9" y={cy-24} width="18" height="50" rx="9" fill="rgba(61,168,200,0.06)" stroke="rgba(61,168,200,0.5)" strokeWidth="1.2" />
        <rect x="-8" y={cy+8} width="16" height="18" rx="8" fill="rgba(61,168,200,0.28)" />
        <text y={CAP_Y} textAnchor="middle" {...gxCap}>EXTRACT</text>
      </g>
      {/* arrow 1 */}
      <line x1="72" y1={cy} x2="92" y2={cy} stroke="rgba(61,168,200,0.35)" strokeWidth="1.5" strokeDasharray="3 3" />
      <polygon points={`92,${cy-4} 99,${cy} 92,${cy+4}`} fill="rgba(61,168,200,0.45)" />
      {/* LIBRARY — adapter-ligated strands */}
      <g transform={`translate(${cols[1]},0)`}>
        {[-18,-9,0,9,18].map((dy,i) => (
          <line key={i} x1="-18" y1={cy+dy} x2="18" y2={cy+dy}
            stroke={i%2===0?'rgba(91,174,157,0.6)':'rgba(61,168,200,0.4)'} strokeWidth="2.6" strokeLinecap="round" />
        ))}
        <text y={CAP_Y} textAnchor="middle" {...gxCap}>LIBRARY</text>
      </g>
      {/* arrow 2 */}
      <line x1="168" y1={cy} x2="188" y2={cy} stroke="rgba(91,174,157,0.35)" strokeWidth="1.5" strokeDasharray="3 3" />
      <polygon points={`188,${cy-4} 195,${cy} 188,${cy+4}`} fill="rgba(91,174,157,0.45)" />
      {/* CAPTURE — 4x4 plate */}
      <g transform={`translate(${cols[2]},0)`}>
        {[0,1,2,3].map(row => [0,1,2,3].map(col => {
          const on = hi.has(`${row}-${col}`);
          return (
            <rect key={`${row}-${col}`} x={col*11-21} y={cy-20+row*11} width="9" height="8" rx="1.5"
              fill={on?'rgba(61,168,200,0.55)':'rgba(61,168,200,0.1)'}
              stroke={on?'rgba(61,168,200,0.7)':'none'} strokeWidth="0.5" />
          );
        }))}
        <text y={CAP_Y} textAnchor="middle" {...gxCap}>CAPTURE</text>
      </g>
    </svg>
  );
}

function SvcSequencingGraphic() {
  const cv = [6,10,15,21,30,40,52,47,57,68,64,75,70,78,66,60,50,43,35,27,19,13,8,4];
  const max = 80, pw = 216, ph = 46, ox = 22, oy = 12;
  const pts = cv.map((c,i) => ({ x: ox+(i/(cv.length-1))*pw, y: oy+ph-(c/max)*ph }));
  const linePath = pts.map((p,i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const baseY = oy+ph;
  const areaPath = `${linePath} L${(ox+pw).toFixed(1)},${baseY} L${ox},${baseY} Z`;
  const reads = [
    [22,66,24],[50,66,30],[84,66,18],[110,66,26],[140,66,22],[168,66,28],[198,66,18],[224,66,22],
    [30,73,28],[64,73,20],[96,73,24],[126,73,18],[156,73,26],[186,73,22],[214,73,20],
  ];
  return (
    <svg viewBox={GX_VB} width={GX_W} height={GX_H} style={GX_STYLE}>
      <defs>
        <linearGradient id="lumCovGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3DA8C8" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#5BAE9D" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#lumCovGrad)" />
      <path d={linePath} fill="none" stroke="#3DA8C8" strokeWidth="1.6" strokeLinejoin="round" />
      <rect x={ox} y={baseY+2} width={pw} height="2.5" rx="1.25" fill="rgba(61,168,200,0.16)" />
      {reads.map(([rx,ry,rw],i) => (
        <rect key={i} x={rx} y={ry} width={rw} height="4" rx="2"
          fill={`rgba(${i%4===0?'91,174,157':'61,168,200'},${0.2+(i%3)*0.07})`} />
      ))}
      <text x="130" y={CAP_Y} textAnchor="middle" {...gxCap}>30× COVERAGE</text>
    </svg>
  );
}

function SvcBioinformaticsGraphic() {
  const nodes = [{x:30,lbl:'FASTQ'},{x:80,lbl:'ALIGN'},{x:130,lbl:'CALL'},{x:180,lbl:'ANNOT'},{x:230,lbl:'REPORT'}];
  const cols = ['#3DA8C8','#5BAE9D','#3DA8C8','#5BAE9D','#3DA8C8'];
  return (
    <svg viewBox={GX_VB} width={GX_W} height={GX_H} style={GX_STYLE}>
      {nodes.slice(0,-1).map((n,i) => (
        <g key={i}>
          <line x1={n.x+15} y1="50" x2={nodes[i+1].x-22} y2="50" stroke="rgba(61,168,200,0.28)" strokeWidth="1.4" strokeDasharray="3 3" />
          <polygon points={`${nodes[i+1].x-22},46.5 ${nodes[i+1].x-15},50 ${nodes[i+1].x-22},53.5`} fill="rgba(61,168,200,0.45)" />
        </g>
      ))}
      {nodes.map((n,i) => (
        <g key={i} transform={`translate(${n.x},50)`}>
          <circle r="15" fill={`rgba(${i%2===0?'61,168,200':'91,174,157'},0.1)`} stroke={cols[i]} strokeWidth="1.3" />
          <text textAnchor="middle" dy="2.5" fontSize="6" fill={cols[i]} fontFamily="JetBrains Mono, monospace" fontWeight="600">{n.lbl}</text>
          <text textAnchor="middle" y={CAP_Y-50} fontSize="7" fill="rgba(15,26,36,0.3)" fontFamily="JetBrains Mono, monospace">{String(i+1).padStart(2,'0')}</text>
        </g>
      ))}
    </svg>
  );
}

function SvcDiagnosticsGraphic() {
  const rows = [
    {gene:'ATP7B',st:'NEG',hit:false},{gene:'GALT',st:'VUS',hit:true},
    {gene:'PCCA',st:'NEG',hit:false},{gene:'MMAA',st:'NEG',hit:false},
    {gene:'PAH',st:'PATH',hit:true},{gene:'NAGS',st:'NEG',hit:false},
  ];
  return (
    <svg viewBox={GX_VB} width={GX_W} height={GX_H} style={GX_STYLE}>
      <text x="16" y="16" fontSize="6.5" fill="rgba(107,124,140,0.7)" fontFamily="JetBrains Mono, monospace" letterSpacing="1">GENE</text>
      <text x="88" y="16" fontSize="6.5" fill="rgba(107,124,140,0.7)" fontFamily="JetBrains Mono, monospace" letterSpacing="1">PANEL COVERAGE</text>
      <text x="224" y="16" textAnchor="middle" fontSize="6.5" fill="rgba(107,124,140,0.7)" fontFamily="JetBrains Mono, monospace" letterSpacing="1">CALL</text>
      <line x1="16" y1="21" x2="248" y2="21" stroke="rgba(15,26,36,0.08)" strokeWidth="1" />
      {rows.map((r,i) => {
        const y = 33 + i * 12;
        return (
          <g key={i}>
            <text x="16" y={y} fontSize="8.5" fill={r.hit?'rgba(15,26,36,0.85)':'rgba(15,26,36,0.5)'} fontFamily="JetBrains Mono, monospace" fontWeight={r.hit?'600':'400'}>{r.gene}</text>
            {[0,1,2,3,4,5].map(b => (
              <rect key={b} x={88+b*18} y={y-7} width="15" height="6" rx="2" fill={`rgba(61,168,200,${b===2||b===4?0.5:0.12})`} />
            ))}
            <rect x="202" y={y-9} width="44" height="12" rx="6"
              fill={r.st==='PATH'?'rgba(91,174,157,0.32)':r.st==='VUS'?'rgba(61,168,200,0.2)':'rgba(15,26,36,0.05)'} />
            <text x="224" y={y} textAnchor="middle" fontSize="7" fontWeight="600"
              fill={r.st==='PATH'?'#5BAE9D':r.st==='VUS'?'#3DA8C8':'rgba(15,26,36,0.4)'}
              fontFamily="JetBrains Mono, monospace">{r.st}</text>
          </g>
        );
      })}
    </svg>
  );
}

function SvcAcademyGraphic() {
  const data = [{y:'2020',n:2},{y:'2021',n:3},{y:'2022',n:5},{y:'2023',n:8},{y:'2024',n:11},{y:'2025',n:14}];
  const maxN = 14, baseY = 88, H = 56, bw = 18, x0 = 30, pitch = 40;
  const cx = i => x0 + i*pitch;
  const topOf = n => baseY - (n/maxN)*H;
  const trend = data.map((d,i) => `${i?'L':'M'}${cx(i)},${(topOf(d.n)-1).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={GX_VB} width={GX_W} height={GX_H} style={GX_STYLE}>
      <defs>
        <linearGradient id="lumBarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3DA8C8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#5BAE9D" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      <line x1={x0-14} y1={baseY} x2={cx(5)+14} y2={baseY} stroke="rgba(15,26,36,0.08)" strokeWidth="1" />
      <path d={trend} fill="none" stroke="rgba(91,174,157,0.5)" strokeWidth="1.4" strokeDasharray="4 3" />
      {data.map((d,i) => {
        const ty = topOf(d.n);
        return (
          <g key={i}>
            <rect x={cx(i)-bw/2} y={ty} width={bw} height={baseY-ty} rx="3" fill="url(#lumBarGrad)" stroke="rgba(61,168,200,0.35)" strokeWidth="0.8" />
            <circle cx={cx(i)} cy={ty-1} r="2.4" fill="#5BAE9D" />
            <text x={cx(i)} y={ty-7} textAnchor="middle" fontSize="7.5" fill="rgba(61,168,200,0.95)" fontWeight="600" fontFamily="JetBrains Mono, monospace">{d.n}</text>
            <text x={cx(i)} y={CAP_Y} textAnchor="middle" {...gxCap} fontSize="7">{d.y}</text>
          </g>
        );
      })}
    </svg>
  );
}

function SvcCollaborationsGraphic() {
  const cx = 130, cy = 50, rx = 92, ry = 28, sr = 19;
  const sats = [
    {a:0,   lines:['HOSPITALS']},
    {a:60,  lines:['RESEARCH']},
    {a:120, lines:['INDUSTRY']},
    {a:180, lines:['AI','DATA']},
    {a:240, lines:['PUBLIC','HEALTH']},
    {a:300, lines:['AGRICULTURE']},
  ].map(s => ({ ...s, x: cx + rx*Math.cos(s.a*Math.PI/180), y: cy + ry*Math.sin(s.a*Math.PI/180) }));
  return (
    <svg viewBox={GX_VB} width={GX_W} height={GX_H} style={GX_STYLE}>
      {sats.map((s,i) => (
        <line key={i} x1={cx} y1={cy} x2={s.x} y2={s.y}
          stroke={i%2===0?'rgba(61,168,200,0.25)':'rgba(91,174,157,0.25)'}
          strokeWidth="1.2" strokeDasharray="3 3" />
      ))}
      {sats.map((s,i) => (
        <g key={i}>
          <circle cx={s.x} cy={s.y} r={sr} fill={GX_BG} />
          <circle cx={s.x} cy={s.y} r={sr}
            fill={i%2===0?'rgba(61,168,200,0.08)':'rgba(91,174,157,0.08)'}
            stroke={i%2===0?'rgba(61,168,200,0.35)':'rgba(91,174,157,0.35)'} strokeWidth="1" />
          {s.lines.map((ln,li) => {
            const off = (li - (s.lines.length - 1) / 2) * 7;
            return (
              <text key={li} x={s.x} y={s.y + off + 2} textAnchor="middle"
                fontSize="5.5" fill="rgba(15,26,36,0.6)"
                fontFamily="JetBrains Mono, monospace" fontWeight="500">{ln}</text>
            );
          })}
        </g>
      ))}
      <circle cx={cx} cy={cy} r="23" fill={GX_BG} />
      <circle cx={cx} cy={cy} r="23" fill="rgba(61,168,200,0.09)" stroke="#3DA8C8" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r="14" fill="rgba(61,168,200,0.12)" stroke="#3DA8C8" strokeWidth="0.8" />
      <text x={cx} y={cy-1} textAnchor="middle" fontSize="9" fill="#3DA8C8" fontFamily="JetBrains Mono, monospace" fontWeight="700" letterSpacing="1">TGB</text>
      <text x={cx} y={cy+8} textAnchor="middle" fontSize="5.2" fill="rgba(61,168,200,0.75)" fontFamily="JetBrains Mono, monospace">GENOMICS</text>
    </svg>
  );
}

// ---- Services (six arms, six cards) ----
function LumenServices() {
  const services = [
  { code: '01', tag: 'REAGENTS', title: 'Molecular Reagents & Kits',
    body: 'Authorized Sri Lankan distributor for Celemics and Gen2Me. We supply the complete molecular workflow from high-efficiency extraction kits and routine RT-PCR assays to specialized NGS target capture systems. Delivering both RUO and IVD certified kits for clinical diagnostics and academic research.',
    cta: 'Browse Catalog →', Graphic: SvcReagentsGraphic },
  { code: '02', tag: 'SEQUENCING', title: 'High-Throughput Sequencing',
    body: 'Comprehensive NGS capabilities including WGS, whole-exome, mitochondrial, transcriptomics (RNA-seq), and long-read assembly. Robust, customizable data generation across medicine, agriculture, and industrial biotechnology.',
    cta: 'Explore Sequencing Solutions →', Graphic: SvcSequencingGraphic },
  { code: '03', tag: 'ANALYTICS', title: 'Bioinformatics & Variant Analysis',
    body: 'Advanced, automated computational pipelines for precision variant calling, deep annotation, and strict quality control. End-to-end dry-lab infrastructure, clinical workflow validation, and diagnostic interpretation with sensitive data remaining entirely sovereign and secure.',
    cta: 'Consult a Bioinformatician →', Graphic: SvcBioinformaticsGraphic },
  { code: '04', tag: 'CLINICAL', title: 'Clinical Diagnostics',
    body: 'Authorized partner for international leaders including Centogene and MedGenome. Bridging Sri Lankan medicine with world-class diagnostic pipelines for rare diseases, oncology, inherited conditions, and complex clinical panels while all patient logistics handled in-country.',
    cta: 'View Test Menu →', Graphic: SvcDiagnosticsGraphic },
  { code: '05', tag: 'EDUCATION', title: 'The Torrington Scholars Institute',
    body: 'Nurturing the next generation of life-science leaders through the BioCoder Fellowship, our elite internship for bioinformatics and genomics. Offering intensive certificate modules, industry-aligned short courses, and funded wet-lab and computational training residencies.',
    cta: 'View Programs →', Graphic: SvcAcademyGraphic },
  { code: '06', tag: 'CONSORTIA', title: 'Bespoke Research & Project Engineering',
    body: 'Engineering end-to-end genomic and bioinformatic frameworks for large-scale institutional projects, from experimental design and localized analytics infrastructure to co-developed, AI-assisted genomic software for agriculture, public health, and industrial consortia.',
    cta: 'Scope a Project →', Graphic: SvcCollaborationsGraphic },
  ];

  return (
    <div id="services" style={{ background: LUM_PAPER, padding: 'clamp(64px, 12vw, 140px) clamp(20px, 5vw, 56px)', scrollMarginTop: 80 }}>
      <style>{`
        .lum-services-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 32px; margin-bottom: 72px; flex-wrap: wrap; }
        .lum-services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1px; }
        @media (max-width: 640px) { .lum-services-head { margin-bottom: 40px; } }
      `}</style>
      <div className="lum-services-head">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: LUM_DIM, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 24, fontWeight: 600 }}>
            <span style={{ width: 24, height: 1, background: LUM_GRAD }} />
            01 — What we do
          </div>
          <h2 style={{
            fontFamily: 'Newsreader, serif', fontWeight: 300, fontSize: 'clamp(38px, 6vw, 64px)', color: LUM_INK,
            margin: 0, letterSpacing: -1.8, lineHeight: 1.02, maxWidth: 820
          }}>
            Full spectrum genomics<br /><span style={{ fontStyle: 'italic' }}>built for Sri Lanka</span>
          </h2>
        </div>
        <div style={{ fontSize: 14, color: LUM_DIM, maxWidth: 260, lineHeight: 1.55 }}>
          Reagents on the bench, reports on the desk, scientists in training, and an integrated enterprise architecture behind it all, under one roof.
        </div>
      </div>

      <div className="lum-services-grid" style={{
        background: LUM_LINE,
        border: `1px solid ${LUM_LINE}`,
        borderRadius: 16, overflow: 'hidden'
      }}>
        {services.map((s, i) =>
          <div key={s.code} style={{ background: LUM_PAPER, display: 'flex', flexDirection: 'column' }}>
            <div style={{
              background: LUM_PAPER2, borderBottom: `1px solid ${LUM_LINE}`,
              height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', padding: '0 16px', boxSizing: 'border-box'
            }}>
              <s.Graphic />
            </div>
            <div style={{ padding: '22px 28px 30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: LUM_DIM, letterSpacing: 0.8 }}>{s.code}</span>
                <span style={{
                  fontSize: 10.5, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600,
                  padding: '4px 10px', borderRadius: 999,
                  background: LUM_GRAD_SOFT, color: LUM_BLUE,
                  border: `1px solid rgba(61,168,200,0.18)`
                }}>{s.tag}</span>
              </div>
              <h3 style={{
                fontFamily: 'Newsreader, serif', fontWeight: 400, fontSize: 22, color: LUM_INK,
                margin: '0 0 10px', letterSpacing: -0.4, lineHeight: 1.2
              }}>{s.title}</h3>
              <p style={{ fontSize: 14.5, color: LUM_DIM, lineHeight: 1.65, margin: 0, flex: 1 }}>{s.body}</p>
              {/* CTA links hidden until the detail pages exist
              <div style={{ fontSize: 13, fontWeight: 500, color: LUM_DIM, alignSelf: 'flex-start', marginTop: 22 }}>{s.cta}</div>
              */}
            </div>
          </div>
        )}
      </div>
    </div>);

}

// ---- Compliance / Regulatory Stripe ----
function LumenCompliance() {
  const items = [
    { code: '01', kicker: 'NMRA REGISTRATION', title: 'Authorized Medical Device Importer',
      body: 'Full compliance with the National Medicines Regulatory Authority for the legal importation, validation, and commercial distribution of In Vitro Diagnostics (IVD) and clinical sequencing kits.' },
    { code: '02', kicker: 'LOGISTICS STANDARD', title: 'GSDP Certified Cold-Chain',
      body: 'End-to-end enforcement of Good Storage and Distribution Practices (GSDP), ensuring the biological integrity of temperature-sensitive molecular reagents from global manufacturing to local bench.' },
    { code: '03', kicker: 'TARIFF & CUSTOMS', title: 'NITG Standardized Procurement',
      body: 'Strict adherence to the National Imports Tariff Guide HS classification systems, guaranteeing predictable custom clearances, legal import control licensing, and stable corporate pricing models.' },
    { code: '04', kicker: 'SECURE INFORMATICS', title: 'Sovereign Data Infrastructure',
      body: 'Computational dry-lab hosting executed entirely within highly secure, localized architecture, meeting strict national data privacy mandates for clinical and population datasets.' },
  ];

  return (
    <div style={{ background: LUM_PAPER2, padding: 'clamp(56px, 10vw, 100px) clamp(20px, 5vw, 56px)', borderTop: `1px solid ${LUM_LINE}` }}>
      <div style={{ marginBottom: 64 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: LUM_DIM, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 18, fontWeight: 600 }}>
          <span style={{ width: 24, height: 1, background: LUM_GRAD }} />
          05 — Compliance & Infrastructure
        </div>
        <h2 style={{
          fontFamily: 'Newsreader, serif', fontWeight: 300, fontSize: 'clamp(32px, 5.5vw, 52px)', color: LUM_INK,
          margin: 0, letterSpacing: -1.4, lineHeight: 1.08, maxWidth: 840
        }}>
          Enterprise-grade regulatory architecture. <span style={{ fontStyle: 'italic' }}>Built to national and clinical standards.</span>
        </h2>
      </div>

      <style>{`
        .lum-compliance-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; }
        .lum-compliance-grid > div:not(:last-child) { border-bottom: 1px solid ${LUM_LINE}; }
        @media (max-width: 700px) { .lum-compliance-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div className="lum-compliance-grid" style={{
        background: LUM_LINE, border: `1px solid ${LUM_LINE}`, borderRadius: 12, overflow: 'hidden'
      }}>
        {items.map((item, i) => (
          <div key={item.code} style={{
            background: LUM_PAPER, padding: 'clamp(24px, 4vw, 36px) clamp(20px, 4vw, 40px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: LUM_BLUE,
                letterSpacing: 1, fontWeight: 600
              }}>{item.code}</span>
              <span style={{
                fontSize: 9.5, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700,
                color: LUM_DIM, fontFamily: 'JetBrains Mono, monospace'
              }}>{item.kicker}</span>
            </div>
            <h3 style={{
              fontFamily: 'Newsreader, serif', fontWeight: 500, fontSize: 24, color: LUM_INK,
              margin: '0 0 12px', letterSpacing: -0.5, lineHeight: 1.2
            }}>{item.title}</h3>
            <p style={{ fontSize: 14, color: LUM_DIM, lineHeight: 1.65, margin: 0 }}>{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Platform / pipeline ----
function LumenPipeline() {
  const stages = [
  { k: '01', name: 'Sample intake', detail: 'Barcoded, chain-of-custody logged' },
  { k: '02', name: 'Library prep', detail: 'Celemics target capture' },
  { k: '03', name: 'Sequencing', detail: 'In-country, no samples shipped' },
  { k: '04', name: 'Variant calling', detail: 'GATK / DeepVariant ensemble' },
  { k: '05', name: 'Annotation', detail: 'VEP · ClinVar · gnomAD v4' },
  { k: '06', name: 'Curation', detail: 'ACMG · clinical sign-off' },
  { k: '07', name: 'Report', detail: 'Signed PDF + structured JSON' }];

  return (
    <div className="lum-pipeline" style={{ display: 'flex', alignItems: 'stretch', gap: 0, marginTop: 56, border: `1px solid ${LUM_LINE}`, borderRadius: 14, overflow: 'hidden', background: LUM_PAPER, overflowX: 'auto' }}>
      <style>{`
        @media (max-width: 900px) {
          .lum-pipeline { flex-wrap: wrap; overflow-x: visible; border-radius: 12px; }
          .lum-pipeline > div { flex: 1 1 50%; }
        }
        @media (max-width: 500px) {
          .lum-pipeline > div { flex: 1 1 100%; }
        }
      `}</style>
      {stages.map((s, i) =>
      <div key={s.k} style={{
        flex: 1, minWidth: 140, padding: '26px 20px',
        borderRight: i < stages.length - 1 ? `1px solid ${LUM_LINE}` : 'none',
        borderBottom: `1px solid ${LUM_LINE}`
      }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: LUM_BLUE, letterSpacing: 1, marginBottom: 14, fontWeight: 600 }}>{s.k}</div>
          <div style={{ fontFamily: 'Newsreader, serif', fontSize: 18, color: LUM_INK, marginBottom: 8, fontWeight: 500, letterSpacing: -0.3 }}>{s.name}</div>
          <div style={{ fontSize: 11.5, color: LUM_DIM, lineHeight: 1.5 }}>{s.detail}</div>
        </div>
      )}
    </div>);

}

function LumenPlatform() {
  return (
    <div style={{ background: LUM_PAPER2, padding: 'clamp(64px, 12vw, 140px) clamp(20px, 5vw, 56px)', borderTop: `1px solid ${LUM_LINE}` }}>
      <div style={{ maxWidth: 780 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: LUM_DIM, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 24, fontWeight: 600 }}>
          <span style={{ width: 24, height: 1, background: LUM_GRAD }} />
          02 — Platform
        </div>
        <h2 style={{
          fontFamily: 'Newsreader, serif', fontWeight: 300, fontSize: 'clamp(36px, 6vw, 60px)', color: LUM_INK,
          margin: 0, letterSpacing: -1.8, lineHeight: 1.04
        }}>
          One pipeline, <span style={{ fontStyle: 'italic' }}>seven moves.</span>
        </h2>
        <p style={{ fontSize: 16, color: LUM_DIM, lineHeight: 1.6, margin: '20px 0 0', maxWidth: 580 }}>
          Every sample we touch (exome, panel, mitochondrial, RNA-seq) runs the same instrumented path on Sri Lankan soil. Stage three is the only step that varies by chemistry.
        </p>
      </div>

      <LumenPipeline />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 32 }}>
        <div style={{ padding: '24px 24px 20px', border: `1px solid ${LUM_LINE}`, borderRadius: 12, background: LUM_PAPER }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: LUM_DIM, letterSpacing: 0.4 }}>per-base coverage · chr17:43,044,000</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: LUM_BLUE, fontWeight: 600 }}>mean = 42×</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 56 }}>
            {Array.from({ length: 48 }).map((_, i) => {
              const v = 24 + Math.abs(Math.sin(i * 0.6) * 32) + (i % 7 === 0 ? -10 : 0);
              const h = Math.max(6, Math.min(54, v));
              return <div key={i} style={{
                flex: 1, height: h,
                background: h > 38 ? LUM_GRAD : 'rgba(61,168,200,0.35)'
              }} />;
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: LUM_DIM }}>
            <span>BRCA1 exon 11</span><span>2.1 kb window</span>
          </div>
        </div>
        <div style={{ padding: '24px', border: `1px solid ${LUM_LINE}`, borderRadius: 12, background: LUM_PAPER }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: LUM_DIM, letterSpacing: 0.4, marginBottom: 14 }}>exomes processed</div>
          <div style={{ fontFamily: 'Newsreader, serif', fontSize: 42, color: LUM_INK, lineHeight: 1, letterSpacing: -1.2, fontWeight: 300 }}>500<span style={{ color: LUM_BLUE }}>+</span></div>
          <div style={{ fontSize: 11.5, color: LUM_TEAL, marginTop: 6, fontWeight: 600 }}>since 2020 · all locally</div>
        </div>
        <div style={{ padding: '24px', border: `1px solid ${LUM_LINE}`, borderRadius: 12, background: LUM_PAPER }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: LUM_DIM, letterSpacing: 0.4, marginBottom: 14 }}>NMRA</div>
          <div style={{ fontFamily: 'Newsreader, serif', fontSize: 30, color: LUM_INK, lineHeight: 1.05, letterSpacing: -0.8, fontWeight: 300 }}>Marketing<br />Authorization Holder</div>
          <div style={{ fontSize: 11.5, color: LUM_DIM, marginTop: 6 }}>NITG-compliant imports</div>
        </div>
      </div>
    </div>);

}

// ---- Partners (logo stripe) ----
function LumenPartners() {
  const partners = [
    { name: 'Celemics', logo: 'logos/celemics.png', role: 'Authorized Distributor', maxHeight: 62 },
    { name: 'Gen2Me', logo: 'logos/gen2me.png', role: 'Authorized Distributor', maxHeight: 52 },
    { name: 'Centogene', logo: 'logos/centogene-clean.png', role: 'Diagnostic Partner', maxHeight: 44 },
    { name: 'MedGenome', logo: 'logos/medgenome.png', role: 'Diagnostic Partner', maxHeight: 40 },
    { name: 'GentleGen', logo: 'logos/gentlegen.svg', role: 'Sequencing Partner', maxHeight: 58 },
  ];

  return (
    <div id="partners" style={{ background: LUM_PAPER, padding: 'clamp(56px, 10vw, 100px) clamp(20px, 5vw, 56px)', borderTop: `1px solid ${LUM_LINE}`, scrollMarginTop: 80 }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 11.5, color: LUM_DIM, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 18, fontWeight: 600 }}>
          02 — Partners
        </div>
        <h2 style={{
          fontFamily: 'Newsreader, serif', fontWeight: 300, fontSize: 'clamp(30px, 5vw, 44px)', color: LUM_INK,
          margin: 0, letterSpacing: -1.2, lineHeight: 1.1
        }}>
          Globally recognised, <span style={{ fontStyle: 'italic' }}>locally represented</span>
        </h2>
      </div>

      <style>{`
        .lum-partners-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; }
        @media (max-width: 900px) { .lum-partners-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 560px) { .lum-partners-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
      <div className="lum-partners-grid" style={{
        background: LUM_LINE, border: `1px solid ${LUM_LINE}`, borderRadius: 12, overflow: 'hidden'
      }}>
        {partners.map((p) => (
          <div key={p.name} style={{
            background: LUM_PAPER, padding: '30px 22px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18
          }}>
            <div style={{
              height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%'
            }}>
              {p.logo ? (
                <img src={p.logo} alt={p.name} style={{
                  maxWidth: '85%', height: p.maxHeight || 72, width: 'auto',
                  objectFit: 'contain'
                }} 
                />
              ) : (
                <div style={{
                  width: 120, height: 60, border: `1.5px dashed ${LUM_LINE}`, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: LUM_DIM, fontFamily: 'JetBrains Mono, monospace',
                  letterSpacing: 0.5
                }}>LOGO TBA</div>
              )}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 9.5, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700,
                color: LUM_DIM, fontFamily: 'JetBrains Mono, monospace'
              }}>{p.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Clients / Collaborators ----
function LumenClients() {
  // NOTE: engagement copy below is placeholder — confirm each before launch.
  const clients = [
  { short: 'University of\u00a0Colombo', name: 'University of Colombo', kind: 'Academic', r: 92, x: 120, y: 150,
    work: 'Sequencing projects delivered end-to-end, alongside research consultancy and supervision.',
    items: [
      ['WGS', 'Whole-genome sequencing (WGS) for plant genomes'],
      ['WES', 'Whole-exome sequencing (WES) for rare disease diagnostic research'],
      ['AMPLICON', 'NGS based amplicon sequencing as an alternative to Sanger'],
      ['ADVISORY', 'Research consultancy and research supervision']] },
  { short: 'IBMBB', name: 'Institute of Biochemistry, Molecular Biology and Biotechnology', kind: 'Research Institute', r: 78, x: 300, y: 90,
    work: 'Sequencing projects and bioinformatics support for molecular and population genetics research.',
    items: [
      ['WES', 'Whole-exome sequencing (WES) for rare disease diagnostic research'],
      ['AMPLICON', 'NGS based amplicon sequencing as an alternative to Sanger'],
      ['ADVISORY', 'Bioinformatics analysis consultancy']] },
  { short: 'Rajarata\nUniversity', name: 'Rajarata University of Sri Lanka', kind: 'Academic', r: 84, x: 480, y: 155,
    work: 'Sequencing projects supporting postgraduate and faculty-led research.',
    items: [
      ['AMPLICON', 'NGS based amplicon sequencing as an alternative to Sanger'],
      ['METAGENOMICS', 'Metagenomic sequencing for microbial community profiling']] },
  { short: 'University of\u00a0Jaffna', name: 'University of Jaffna', kind: 'Academic', r: 68, x: 630, y: 70,
    work: 'Experimental design, RNA extraction and transcriptomic sequencing, and bioinformatics analysis of Allium cepa (onion).',
    stages: ['Design', 'Wet lab', 'Sequencing', 'Analysis'] },
  { short: 'Apeksha\nHospital', name: 'Apeksha Hospital, Maharagama', kind: 'Clinical', r: 86, x: 175, y: 340,
    work: [
      'Molecular reagent supply for a comprehensive custom NGS cancer panel.',
      'Establishment of the complete bioinformatics pipeline, and analysis of the resulting cancer sequencing data.'],
    stages: ['Reagents', 'Custom panel', 'Pipeline build', 'Analysis'] },
  { short: 'Wish\nHospital', name: 'Wish Hospital', kind: 'Clinical', r: 70, x: 390, y: 350,
    work: 'Consultancy for laboratory setup and NGS platform selection, reviewing the specifications of available platforms for non-invasive prenatal testing (NIPT) and preimplantation genetic screening (PGS).',
    stages: ['Lab setup', 'Platform review', 'NIPT', 'PGS'] },
  { short: 'KIU', name: 'Kaatsu International University', kind: 'Academic', r: 78, x: 580, y: 320,
    work: [
      'Research supervision and collaboration with undergraduate students.',
      'Internship placements delivered through the Torrington Scholars Institute.'],
    stages: ['Supervision', 'Collaboration', 'Internships'] }];

  const [active, setActive] = React.useState(0);
  const a = clients[active];
  const isClinical = (k) => k === 'Clinical';

  return (
    <div id="clients" style={{ background: LUM_PAPER2, padding: '120px 56px', borderTop: `1px solid ${LUM_LINE}`, scrollMarginTop: 80 }}>
      <style>{`
        @keyframes lum-bob { 0%,100% { transform: translate(-50%, calc(-50% - 5px)); } 50% { transform: translate(-50%, calc(-50% + 5px)); } }
        @keyframes lum-detail-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .lum-bub { position:absolute; border-radius:50%; border:none; cursor:pointer; padding:0;
          display:flex; align-items:center; justify-content:center; text-align:center;
          font-family:'Newsreader', serif; letter-spacing:-0.2px; line-height:1.15; white-space:pre-line;
          transition: background .18s ease, box-shadow .18s ease, color .18s ease; }
        .lum-bub:focus-visible { outline:2px solid ${LUM_BLUE}; outline-offset:4px; }
        .lum-clients-grid { display:grid; grid-template-columns: minmax(0,720px) minmax(320px,1fr); gap:56px; align-items:center; justify-content:center; }
        @media (max-width: 1100px) { .lum-clients-grid { grid-template-columns: minmax(0,1fr); gap:40px; } }
        @media (prefers-reduced-motion: reduce) { .lum-bub { animation:none !important; } }
      `}</style>

      <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 20px' }}>
        <div style={{ fontSize: 11.5, color: LUM_DIM, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 18, fontWeight: 600 }}>
          03 &mdash; Clients &amp; Collaborators
        </div>
        <h2 style={{
          fontFamily: 'Newsreader, serif', fontWeight: 300, fontSize: 48, color: LUM_INK,
          margin: '0 0 18px', letterSpacing: -1.4, lineHeight: 1.1
        }}>
          The institutions <span style={{ fontStyle: 'italic' }}>we work with</span>
        </h2>
        <p style={{ fontSize: 15, color: LUM_DIM, lineHeight: 1.6, margin: 0 }}>
          Select any institution to see what the engagement involved
        </p>
      </div>

      <div className="lum-clients-grid" style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ position: 'relative', width: 'min(720px, 100%)', aspectRatio: '720 / 460', margin: '0 auto' }}>
          {clients.map((c, i) => {
            const on = i === active;
            const clinical = isClinical(c.kind);
            const tint = clinical ? '91,174,157' : '61,168,200';
            return (
              <button key={c.name} className="lum-bub" onClick={() => setActive(i)}
                aria-pressed={on} title={c.name}
                style={{
                  left: `${c.x / 720 * 100}%`, top: `${c.y / 460 * 100}%`,
                  width: `${c.r * 2 / 720 * 100}%`, aspectRatio: '1', height: 'auto',
                  fontSize: `clamp(12px, ${(c.r > 84 ? 18 : c.r > 74 ? 16.5 : 15) / 720 * 100}vw, ${c.r > 84 ? 18 : c.r > 74 ? 16.5 : 15}px)`,
                  transform: 'translate(-50%,-50%)',
                  animation: `lum-bob ${7 + i % 4}s ease-in-out ${i * 0.55}s infinite`,
                  background: on ? `rgba(${tint},0.16)` : `rgba(${tint},0.055)`,
                  color: on ? LUM_INK : LUM_INK2,
                  boxShadow: on
                    ? `inset 0 0 0 1.5px rgba(${tint},0.75), 0 14px 40px -14px rgba(${tint},0.6)`
                    : `inset 0 0 0 1px rgba(${tint},0.28)`
                }}>
                {c.short}
              </button>);

          })}
        </div>

        <div key={active} style={{
          background: LUM_PAPER, border: `1px solid ${LUM_LINE}`, borderRadius: 16,
          padding: '36px 36px 38px', minHeight: 268, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          animation: 'lum-detail-in .28s ease'
        }}>
          <div style={{
            display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 8,
            fontSize: 9.5, letterSpacing: 1.3, textTransform: 'uppercase', fontWeight: 700,
            fontFamily: 'JetBrains Mono, monospace', marginBottom: 16,
            color: isClinical(a.kind) ? LUM_TEAL : LUM_BLUE
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isClinical(a.kind) ? LUM_TEAL : LUM_BLUE }} />
            {a.kind}
          </div>
          <div style={{ fontFamily: 'Newsreader, serif', fontSize: 23, color: LUM_INK, letterSpacing: -0.4, lineHeight: 1.25, marginBottom: 14, textWrap: 'pretty' }}>
            {a.name}
          </div>
          {(Array.isArray(a.work) ? a.work : [a.work]).map((para, i) => (
            <p key={i} style={{ fontSize: 14.5, color: LUM_DIM, lineHeight: 1.65, margin: i ? '10px 0 0' : 0, textWrap: 'pretty' }}>{para}</p>
          ))}
          {a.stages &&
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20, paddingTop: 20, borderTop: `1px solid ${LUM_LINE}` }}>
            {a.stages.map((st) => (
              <span key={st} style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: 1, fontWeight: 700,
                textTransform: 'uppercase', padding: '6px 11px', borderRadius: 999,
                color: isClinical(a.kind) ? LUM_TEAL : LUM_BLUE,
                background: isClinical(a.kind) ? 'rgba(91,174,157,0.1)' : 'rgba(61,168,200,0.1)'
              }}>{st}</span>
            ))}
          </div>}
          {a.items &&
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20, paddingTop: 20, borderTop: `1px solid ${LUM_LINE}` }}>
            {a.items.map(([label, text]) => (
              <div key={label} style={{ display: 'grid', gridTemplateColumns: '84px 1fr', gap: 14, alignItems: 'baseline' }}>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: 1, fontWeight: 700,
                  textTransform: 'uppercase', color: isClinical(a.kind) ? LUM_TEAL : LUM_BLUE
                }}>{label}</span>
                <span style={{ fontSize: 13.5, color: LUM_DIM, lineHeight: 1.5, textWrap: 'pretty' }}>{text}</span>
              </div>
            ))}
          </div>}
        </div>
      </div>
    </div>);

}

// ---- News / milestones ----
function LumenNews() {
  const items = [
  { date: 'Aug 2024', tag: 'Partnership', title: 'TGB appointed authorized partner for Centogene', body: 'Internationally validated rare-disease genomic testing (6,500+ conditions) now accessible to Sri Lankan patients without overseas sample shipment.' },
  { date: 'Mar 2024', tag: 'Distribution', title: 'Gen2Me distributorship added to the portfolio', body: 'A second international reagents partnership, expanding the local catalog and reflecting TGB\'s growing regional relevance in South Asia.' },
  { date: 'Jun 2023', tag: 'Consultation', title: 'Full NGS infrastructure setup at Wish Fertility', body: 'TGB designed and commissioned the only in-house NGS platform at a private Sri Lankan hospital: from platform selection to workflow validation.' },
  { date: 'Jan 2022', tag: 'Distribution', title: 'Celemics official distributor for Sri Lanka', body: 'TGB becomes the in-country reagents partner for Celemics; reagents now supplied to Apeksha Hospital and the University of Colombo.' }];

  return (
    <div style={{ background: LUM_PAPER, padding: 'clamp(64px, 12vw, 140px) clamp(20px, 5vw, 56px)', borderTop: `1px solid ${LUM_LINE}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: LUM_DIM, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 24, fontWeight: 600 }}>
            <span style={{ width: 24, height: 1, background: LUM_GRAD }} />
            06 — News
          </div>
          <h2 style={{
            fontFamily: 'Newsreader, serif', fontWeight: 300, fontSize: 'clamp(32px, 5.5vw, 52px)', color: LUM_INK,
            margin: 0, letterSpacing: -1.5, lineHeight: 1.05
          }}>
            Latest <span style={{ fontStyle: 'italic' }}>updates.</span>
          </h2>
        </div>
        <div style={{
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          background: LUM_GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
        }}>Full timeline →</div>
      </div>
      <style>{`
        .lum-news-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; }
        @media (max-width: 900px) { .lum-news-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 520px) { .lum-news-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div className="lum-news-grid" style={{
        background: LUM_LINE, border: `1px solid ${LUM_LINE}`, borderRadius: 14, overflow: 'hidden'
      }}>
        {items.map((n, i) =>
        <div key={i} style={{ padding: '30px 24px 26px', background: LUM_PAPER }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: LUM_DIM, letterSpacing: 0.4 }}>
              <span>{n.date}</span>
              <span style={{ color: LUM_BLUE, fontWeight: 600 }}>{n.tag}</span>
            </div>
            <h3 style={{ fontFamily: 'Newsreader, serif', fontWeight: 500, fontSize: 20, color: LUM_INK, lineHeight: 1.25, margin: '0 0 14px', letterSpacing: -0.3 }}>{n.title}</h3>
            <p style={{ fontSize: 13, color: LUM_DIM, lineHeight: 1.6, margin: 0 }}>{n.body}</p>
          </div>
        )}
      </div>
    </div>);

}

// ---- Leadership ----
function LumenTeam() {
  const [active, setActive] = React.useState(0);
  const [hov, setHov] = React.useState(null);
  const team = [
    {
      initials: 'NN',
      name: 'Nilaksha Freeson Neththikumara',
      role: 'Co-Founder, CEO & Director',
      bio: 'MPhil in Bioinformatics, DBA. National Bioinformatics Consultant, Apeksha Hospital. Founder of BiGIN-SL. The operational and scientific backbone of TGB.'
    },
    {
      initials: 'VD',
      name: 'Prof. Vajira H.W. Dissanayake',
      role: 'Co-Founder & Senior Adviser',
      bio: 'Pioneer in clinical genomics in Sri Lanka. Longstanding head, Human Genetics Unit, University of Colombo. Provides strategic scientific direction and international credibility.'
    },
    {
      initials: 'DN',
      name: 'Dr. Dhanusha Nirmani',
      role: 'Head of Molecular Operations',
      bio: 'PhD in Molecular Genetics. Leads all wet-lab operations end-to-end. Published in population genetics and BMJ Global Health.'
    },
    {
      initials: '★',
      name: 'Scientific Advisory Board',
      role: 'Genomics · Molecular Biology · Clinical Genetics · Bioinformatics',
      bio: 'Senior academics and industry practitioners providing oversight, credibility, and collaborator access across all five service arms of TGB.'
    }
  ];

  const p = team[active];

  return (
    <div style={{ background: LUM_PAPER2, padding: 'clamp(64px, 12vw, 140px) clamp(20px, 5vw, 56px)', borderTop: `1px solid ${LUM_LINE}` }}>
      <style>{`
        @keyframes lumTeamFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .lum-team-grid { display: grid; grid-template-columns: 1fr 1.6fr; gap: 1px; }
        @media (max-width: 760px) { .lum-team-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div style={{ marginBottom: 56 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: LUM_DIM, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 24, fontWeight: 600 }}>
          <span style={{ width: 24, height: 1, background: LUM_GRAD }} />
          04 — Leadership
        </div>
        <h2 style={{ fontFamily: 'Newsreader, serif', fontWeight: 300, fontSize: 'clamp(32px, 5.5vw, 52px)', color: LUM_INK, margin: 0, letterSpacing: -1.5, lineHeight: 1.05 }}>
          Practising scientists, <span style={{ fontStyle: 'italic' }}>not career sales reps.</span>
        </h2>
      </div>

      <div className="lum-team-grid" style={{
        background: LUM_LINE, border: `1px solid ${LUM_LINE}`, borderRadius: 16, overflow: 'hidden'
      }}>
        {/* Left: selectable list */}
        <div>
          {team.map((t, i) => (
            <div key={i}
              onClick={() => setActive(i)}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                padding: 'clamp(18px, 4vw, 28px) clamp(20px, 4vw, 32px)', cursor: 'pointer',
                borderBottom: i < team.length - 1 ? `1px solid ${LUM_LINE}` : 'none',
                borderRight: `1px solid ${LUM_LINE}`,
                background: active === i ? LUM_PAPER : hov === i ? LUM_PAPER3 : LUM_PAPER2,
                transition: 'background 0.15s ease',
                display: 'flex', flexDirection: 'column', gap: 5
              }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: active === i ? LUM_BLUE : LUM_DIM, letterSpacing: 1, transition: 'color 0.15s ease' }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontFamily: 'Newsreader, serif', fontSize: 20, color: active === i ? LUM_INK : LUM_INK2, letterSpacing: -0.3, lineHeight: 1.2, fontWeight: active === i ? 400 : 300, transition: 'color 0.15s ease' }}>{t.name}</span>
              <span style={{ fontSize: 12, color: active === i ? LUM_BLUE : LUM_DIM, fontWeight: active === i ? 500 : 400, lineHeight: 1.35, transition: 'color 0.15s ease' }}>{t.role}</span>
            </div>
          ))}
        </div>
        {/* Right: detail panel */}
        <div style={{ background: LUM_PAPER, padding: 'clamp(32px, 6vw, 56px) clamp(24px, 6vw, 64px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 420 }}>
          <div key={active} style={{ animation: 'lumTeamFade 0.3s ease' }}>
            <div style={{
              fontFamily: 'Newsreader, serif', fontSize: 'clamp(64px, 10vw, 100px)', letterSpacing: -2, fontWeight: 300, fontStyle: 'italic',
              background: LUM_GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              lineHeight: 1, marginBottom: 28, userSelect: 'none'
            }}>{p.initials}</div>
            <div style={{ fontFamily: 'Newsreader, serif', fontSize: 'clamp(24px, 4vw, 30px)', color: LUM_INK, letterSpacing: -0.6, lineHeight: 1.2, marginBottom: 10, fontWeight: 400 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: LUM_BLUE, fontWeight: 600, letterSpacing: 1.2, marginBottom: 24, textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>{p.role}</div>
            <p style={{ fontSize: 16, color: LUM_DIM, lineHeight: 1.72, margin: 0, maxWidth: 480 }}>{p.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


// ---- Contact / footer ----
function LumenContact() {
  const [email, setEmail] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const onPrefill = (e) => setSubject(e.detail || '');
    window.addEventListener('lum:prefill-subject', onPrefill);
    return () => window.removeEventListener('lum:prefill-subject', onPrefill);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    fetch(CONTACT_FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, subject, message })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Request failed');
        setSent(true);
        setEmail('');
        setSubject('');
        setMessage('');
      })
      .catch(() => {
        setError("Something went wrong sending your message. Please email us directly at info@torrington-gb.com.");
      })
      .finally(() => setSubmitting(false));
  };

  const fieldStyle = {
    width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 14,
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'
  };

  return (
    <div id="contact" style={{
      background: LUM_INK, color: '#fff', padding: 'clamp(64px, 12vw, 120px) clamp(20px, 5vw, 56px) 48px',
      position: 'relative', overflow: 'hidden', scrollMarginTop: 80
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.22,
        maskImage: 'linear-gradient(to right, transparent 0%, black 50%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 50%, transparent 100%)'
      }}>
        <LumenStream density={0.7} />
      </div>
      <div style={{
        position: 'absolute', left: '40%', top: '-20%', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(91,174,157,0.25), transparent 60%)', pointerEvents: 'none'
      }} />
      <style>{`
        .lum-contact-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 60px; }
        @media (max-width: 760px) { .lum-contact-grid { grid-template-columns: 1fr; gap: 40px; } }
      `}</style>

      <div className="lum-contact-grid" style={{ position: 'relative', zIndex: 2, paddingBottom: 72, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 24, fontWeight: 600 }}>
            <span style={{ width: 24, height: 1, background: LUM_GRAD }} />
            04 — Get in touch
          </div>
          <h2 style={{
            fontFamily: 'Newsreader, serif', fontWeight: 300, fontSize: 'clamp(44px, 9vw, 88px)', color: '#fff',
            margin: '0 0 32px', letterSpacing: -2.8, lineHeight: 0.98
          }}>
            Start a<br />
            <span style={{
              fontStyle: 'italic', fontWeight: 400,
              background: LUM_GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>conversation</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: '0 0 36px', maxWidth: 460 }}>
            Tell us about your samples, your study, or the test you can't get answered locally. A scientist replies within one working day.
          </p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 460 }}>
            <input
              type="email" required placeholder="you@institution.org"
              value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ ...fieldStyle, borderRadius: 999 }}
            />
            <input
              type="text" required placeholder="Subject: what's this about?"
              value={subject} onChange={(e) => setSubject(e.target.value)}
              style={{ ...fieldStyle, borderRadius: 999 }}
            />
            <textarea
              required placeholder="Tell us a little more about your samples, study, or question…"
              value={message} onChange={(e) => setMessage(e.target.value)}
              rows={4}
              style={{ ...fieldStyle, borderRadius: 18, resize: 'vertical', lineHeight: 1.5 }}
            />
            <button type="submit" disabled={submitting} style={{
              alignSelf: 'flex-start', padding: '15px 28px', background: LUM_GRAD, color: '#fff', border: 'none', borderRadius: 999,
              fontSize: 13, fontWeight: 600, cursor: submitting ? 'default' : 'pointer',
              boxShadow: '0 10px 32px -8px rgba(61,168,200,0.6)', opacity: submitting ? 0.6 : 1
            }}>{submitting ? 'Sending…' : 'Send message →'}</button>
            {error &&
            <div style={{ fontSize: 13, color: '#ff9b9b', lineHeight: 1.5 }}>{error}</div>}
          </form>
        </div>
        <div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 18, fontWeight: 600 }}>Headquarters</div>
          <div style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.9)' }}>
            Orion Towers<br />Colombo, Western Province<br />Sri Lanka
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            {[
              { name: 'LinkedIn', href: '#', path: 'M4.98 3.5a2.5 2.5 0 1 1-.02 5 2.5 2.5 0 0 1 .02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3-.02-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21H9z' },
              { name: 'Instagram', href: '#', path: 'M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.14 0-3.51.01-4.75.07-.9.04-1.39.19-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.32-.28.81-.32 1.71-.06 1.24-.07 1.61-.07 4.75s.01 3.51.07 4.75c.04.9.19 1.39.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.13.81.28 1.71.32 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c.9-.04 1.39-.19 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.32.28-.81.32-1.71.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75c-.04-.9-.19-1.39-.32-1.71-.17-.43-.37-.74-.69-1.06-.32-.32-.63-.52-1.06-.69-.32-.13-.81-.28-1.71-.32-1.24-.06-1.61-.07-4.75-.07zm0 3.06a4.94 4.94 0 1 1 0 9.88 4.94 4.94 0 0 1 0-9.88zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28zm5.14-3.2a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3z' },
              { name: 'Facebook', href: '#', path: 'M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.54-1.5H16.7V3.63A21 21 0 0 0 14.3 3.5c-2.37 0-4 1.45-4 4.1V9.9H7.6V13h2.7v8z' }
            ].map(s => (
              <a key={s.name} href={s.href} aria-label={s.name} title={s.name} style={{
                width: 36, height: 36, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)',
                textDecoration: 'none', transition: 'background 0.15s ease, border-color 0.15s ease'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
              </a>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 18, fontWeight: 600 }}>Direct</div>
          <div style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.9)' }}>
            info@torrington-gb.com
          </div>
        </div>
      </div>
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 32, fontSize: 12, color: 'rgba(255,255,255,0.55)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.3 }}>
        <div>© 2026 Torrington Genomics &amp; Bioinformatics (Pvt) Ltd · torrington-gb.com</div>
      </div>

      {sent &&
      <div
        onClick={() => setSent(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(6,12,18,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
        }}>
        <style>{`@keyframes lumModalIn { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: none; } }`}</style>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: LUM_PAPER, color: LUM_INK, borderRadius: 20, padding: '44px 40px 36px',
            maxWidth: 380, width: '100%', textAlign: 'center', animation: 'lumModalIn 0.25s ease',
            boxShadow: '0 30px 80px -20px rgba(0,0,0,0.5)'
          }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: LUM_GRAD, margin: '0 auto 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 32px -8px rgba(61,168,200,0.6)'
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 12.5 9.5 18 20 6" />
            </svg>
          </div>
          <h3 style={{ fontFamily: 'Newsreader, serif', fontWeight: 400, fontSize: 26, margin: '0 0 10px', letterSpacing: -0.5 }}>Message sent</h3>
          <p style={{ fontSize: 14.5, color: LUM_DIM, lineHeight: 1.6, margin: '0 0 28px' }}>
            Thanks for reaching out. We'll get back to you within one working day.
          </p>
          <button onClick={() => setSent(false)} style={{
            padding: '13px 28px', background: LUM_GRAD, color: '#fff', border: 'none', borderRadius: 999,
            fontSize: 13, fontWeight: 600, cursor: 'pointer'
          }}>Done</button>
        </div>
      </div>}
    </div>);

}

function DirectionLumen() {
  return (
    <div style={{ background: LUM_PAPER, color: LUM_INK, fontFamily: 'Inter, sans-serif', minHeight: '100%' }}>
      <LumenNav />
      <LumenHero />
      <LumenServices />
      <LumenPartners />
      <LumenClients />
      {/* Hidden for now — pending content sign-off.
          NOTE: section numbers are hand-written in each component. While these three
          are hidden the visible sequence is 01 Services / 02 Partners / 03 Clients /
          04 Get in touch. Re-enabling them means renumbering: Leadership 04,
          Compliance 05, News 06, Get in touch 07.
      <LumenTeam />
      <LumenCompliance />
      <LumenNews />
      */}
      <LumenContact />
    </div>);

}

window.DirectionLumen = DirectionLumen;