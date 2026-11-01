// Results portal (torrington-gb.com/portal/): invited clients sign in and download their
// delivery files from gs://tgb-seq-deliveries. Sign-in is Google Identity Platform; the files
// are listed and signed by the portal API on Cloud Run (portal-api/), never exposed directly.

import { initializeApp } from '@firebase/app';
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut,
  sendPasswordResetEmail, verifyPasswordResetCode, confirmPasswordReset,
  setPersistence, browserSessionPersistence,
} from '@firebase/auth';

const PORTAL_API = 'https://tgb-portal-api-1004817965363.asia-south1.run.app';
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCSq-59Jx7j8jdr1I5mgdKuGapG3dOUZUU', // public web key; access is enforced by the API
  authDomain: 'tgb-seq-service.firebaseapp.com',
  projectId: 'tgb-seq-service',
};
const CONTACT_EMAIL = 'info@torrington-gb.com';
const MIN_PASSWORD = 10;

const fbApp = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(fbApp);
// Sessions end when the browser closes: these are patient-derived data.
setPersistence(auth, browserSessionPersistence);

const { useState, useEffect, useCallback } = React;

// ---- helpers ----
function fmtBytes(n) {
  if (n == null) return '';
  const u = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (n >= 1000 && i < u.length - 1) { n /= 1000; i++; }
  return `${n >= 100 || i === 0 ? Math.round(n) : n.toFixed(1)} ${u[i]}`;
}

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(`${String(iso).slice(0, 10)}T00:00:00`);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function daysLeft(expires) {
  if (!expires) return null;
  const end = new Date(`${String(expires).slice(0, 10)}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((end - today) / 86400000);
}

function fileKind(name) {
  const n = name.split('/').pop().toLowerCase();
  if (n.endsWith('.g.vcf.gz')) return { label: 'gVCF', rank: 2 };
  if (n.endsWith('.vcf.gz') || n.endsWith('.vcf')) return { label: 'VCF', rank: 1 };
  if (n.endsWith('.bam')) return { label: 'BAM', rank: 3 };
  if (n.endsWith('.cram')) return { label: 'CRAM', rank: 3 };
  if (n.endsWith('.tbi') || n.endsWith('.bai') || n.endsWith('.crai') || n.endsWith('.csi')) return { label: 'Index', rank: 0.5 };
  if (n.endsWith('.fastq.gz') || n.endsWith('.fq.gz')) return { label: 'FASTQ', rank: 4 };
  if (n.endsWith('.pdf') || n.endsWith('.html')) return { label: 'Report', rank: 0 };
  if (n.startsWith('readme')) return { label: 'Readme', rank: -1 };
  if (n.startsWith('md5')) return { label: 'Checksums', rank: 5 };
  if (n.endsWith('.json')) return { label: 'Manifest', rank: 5.5 };
  return { label: 'File', rank: 6 };
}

// Indexes sort straight after the file they belong to.
function sortFiles(files) {
  const base = (p) => p.replace(/\.(tbi|bai|crai|csi)$/i, '');
  return [...files].sort((a, b) => {
    const ka = fileKind(base(a.path)).rank, kb = fileKind(base(b.path)).rank;
    if (ka !== kb) return ka - kb;
    if (base(a.path) !== base(b.path)) return a.path.localeCompare(b.path);
    return a.path.length - b.path.length;
  });
}

function authMessage(e) {
  const code = (e && e.code) || '';
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found') || code.includes('invalid-email'))
    return 'That email and password do not match an account.';
  if (code.includes('too-many-requests')) return 'Too many attempts. Wait a few minutes, then try again.';
  if (code.includes('user-disabled')) return `This account has been disabled. Contact ${CONTACT_EMAIL} if you need access.`;
  if (code.includes('expired-action-code') || code.includes('invalid-action-code'))
    return 'This link has expired or has already been used. Request a new one below.';
  if (code.includes('password-does-not-meet-requirements') || code.includes('weak-password'))
    return `Use at least ${MIN_PASSWORD} characters.`;
  if (code.includes('network-request-failed')) return 'Could not reach the server. Check your connection and try again.';
  return 'Something went wrong. Please try again.';
}

async function api(path, opts = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in required.');
  const token = await user.getIdToken();
  let res;
  try {
    res = await fetch(`${PORTAL_API}${path}`, {
      ...opts,
      headers: { Authorization: `Bearer ${token}`, ...(opts.body ? { 'Content-Type': 'application/json' } : {}) },
    });
  } catch (e) {
    throw new Error('Could not reach the results service. Check your connection and try again.');
  }
  if (!res.ok) {
    let msg = 'Something went wrong. Please try again.';
    try { msg = (await res.json()).error || msg; } catch (e) {}
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return res;
}

function useRoute() {
  const read = () => {
    const parts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    if (parts[0] === 'accounts') return { page: 'accounts' };
    return parts.length === 2 ? { inst: parts[0], order: parts[1] } : null;
  };
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => setRoute(read());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

// ---- styles ----
const CSS = `
.tp { --ink:#0f1a24; --ink2:#2a3a4a; --dim:#6b7c8c; --line:rgba(15,26,36,0.09); --blue:#3DA8C8; --teal:#5BAE9D;
  --paper:#ffffff; --paper2:#f6f9fb; --forest:#0d201e; --red:#b5483b;
  min-height:100vh; background:var(--paper2); color:var(--ink); font-family:'Inter',-apple-system,system-ui,sans-serif; }
.tp * { box-sizing:border-box; }
.tp a { color:inherit; }
.tp-mono { font-family:'JetBrains Mono',ui-monospace,monospace; }
.tp-kicker { font-family:'JetBrains Mono',ui-monospace,monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--blue); }
.tp-serif { font-family:'Newsreader',Georgia,serif; font-weight:400; letter-spacing:-0.01em; }

/* sign-in */
.tp-auth { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); min-height:100vh; }
.tp-auth-side { background:var(--forest); color:#e8f1ef; padding:56px 64px; display:flex; flex-direction:column; justify-content:space-between; position:relative; overflow:hidden; }
.tp-auth-side::after { content:''; position:absolute; right:-160px; bottom:-160px; width:420px; height:420px; border-radius:50%;
  background:radial-gradient(circle, rgba(68,190,219,0.22) 0%, rgba(91,174,157,0.08) 45%, transparent 70%); }
.tp-auth-side h1 { font-size:46px; line-height:1.08; margin:18px 0 0; max-width:440px; color:#fff; }
.tp-auth-side h1 em { font-style:italic; color:#7fd3e6; }
.tp-points { list-style:none; padding:0; margin:40px 0 0; display:grid; gap:16px; max-width:420px; position:relative; z-index:1; }
.tp-points li { display:grid; grid-template-columns:28px 1fr; gap:12px; font-size:14.5px; line-height:1.55; color:rgba(232,241,239,0.82); }
.tp-points li span { font-family:'JetBrains Mono',monospace; font-size:11px; color:#7fd3e6; padding-top:3px; }
.tp-auth-side .tp-back { font-size:13px; color:rgba(232,241,239,0.6); text-decoration:none; position:relative; z-index:1; }
.tp-auth-side .tp-back:hover { color:#fff; }
.tp-auth-main { background:var(--paper); display:flex; align-items:center; justify-content:center; padding:48px 24px; }
.tp-card { width:100%; max-width:400px; }
.tp-card .tp-logo { height:44px; display:block; margin-bottom:40px; }
.tp-card h2 { font-size:30px; margin:8px 0 6px; }
.tp-card p.tp-sub { color:var(--dim); font-size:14.5px; line-height:1.55; margin:0 0 28px; }
.tp-field { display:block; margin-bottom:16px; }
.tp-field > span { display:block; font-size:13px; font-weight:500; color:var(--ink2); margin-bottom:6px; }
.tp-field input:not([type=radio]):not([type=checkbox]) { width:100%; height:46px; border:1px solid rgba(15,26,36,0.16); border-radius:10px; padding:0 14px;
  font:inherit; font-size:15px; color:var(--ink); background:#fff; outline:none; transition:border-color .15s, box-shadow .15s; }
.tp-field input:not([type=radio]):not([type=checkbox]):focus { border-color:var(--blue); box-shadow:0 0 0 3px rgba(61,168,200,0.16); }
.tp-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; height:46px; padding:0 20px; border-radius:999px;
  border:0; font:inherit; font-size:14.5px; font-weight:600; cursor:pointer; text-decoration:none; transition:transform .1s, opacity .15s, background .15s; white-space:nowrap; }
.tp-btn:active { transform:translateY(1px); }
.tp-btn:disabled { opacity:.55; cursor:default; }
.tp-btn-primary { background:var(--ink); color:#fff; width:100%; }
.tp-btn-primary:hover:not(:disabled) { background:#1d3040; }
.tp-btn-ghost { background:transparent; color:var(--ink2); border:1px solid rgba(15,26,36,0.16); height:38px; font-size:13.5px; font-weight:500; padding:0 16px; }
.tp-btn-ghost:hover:not(:disabled) { border-color:var(--ink2); }
.tp-btn-dl { background:transparent; color:var(--blue); border:1px solid rgba(61,168,200,0.4); height:34px; font-size:13px; font-weight:600; padding:0 14px; }
.tp-btn-dl:hover:not(:disabled) { background:rgba(61,168,200,0.08); border-color:var(--blue); }
.tp-link { background:none; border:0; padding:0; font:inherit; font-size:13.5px; color:var(--blue); cursor:pointer; }
.tp-link:hover { text-decoration:underline; }
.tp-row { display:flex; justify-content:space-between; align-items:center; margin:4px 0 22px; }
.tp-msg { font-size:13.5px; line-height:1.5; padding:11px 14px; border-radius:10px; margin-bottom:18px; }
.tp-msg-err { background:rgba(181,72,59,0.08); color:var(--red); }
.tp-msg-ok { background:rgba(91,174,157,0.12); color:#2f6f61; }
.tp-help { margin-top:28px; font-size:13px; color:var(--dim); line-height:1.55; }

/* signed in */
.tp-top { background:var(--paper); border-bottom:1px solid var(--line); }
.tp-top-in { max-width:1080px; margin:0 auto; padding:0 24px; height:68px; display:flex; align-items:center; gap:18px; }
.tp-top-in .tp-logo { height:34px; display:block; }
.tp-top-div { width:1px; height:24px; background:var(--line); }
.tp-top-title { font-size:14px; font-weight:500; color:var(--ink2); }
.tp-top-right { margin-left:auto; display:flex; align-items:center; gap:14px; min-width:0; }
.tp-top-email { font-size:13.5px; color:var(--dim); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.tp-main { max-width:1080px; margin:0 auto; padding:40px 24px 80px; }
.tp-main h1 { font-size:36px; margin:10px 0 6px; }
.tp-lead { color:var(--dim); font-size:15px; line-height:1.6; margin:0 0 32px; max-width:640px; }
.tp-orders { display:grid; gap:12px; }
.tp-order { display:grid; grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr) 140px 20px; gap:20px; align-items:center;
  background:var(--paper); border:1px solid var(--line); border-radius:14px; padding:20px 24px; text-decoration:none; transition:border-color .15s, box-shadow .15s; }
.tp-order:hover { border-color:rgba(61,168,200,0.5); box-shadow:0 6px 20px rgba(15,26,36,0.05); }
.tp-order-id { font-size:17px; font-weight:600; }
.tp-order-inst { font-size:12.5px; color:var(--dim); margin-top:3px; }
.tp-stat { font-size:13.5px; color:var(--ink2); }
.tp-stat small { display:block; font-size:11.5px; color:var(--dim); margin-bottom:2px; }
.tp-pill { display:inline-block; font-size:12px; font-weight:600; padding:5px 10px; border-radius:999px; background:rgba(91,174,157,0.14); color:#2f6f61; }
.tp-pill-warn { background:rgba(214,150,52,0.16); color:#8a5a12; }
.tp-pill-gone { background:rgba(181,72,59,0.1); color:var(--red); }
.tp-arrow { color:var(--dim); font-size:18px; }
.tp-empty { background:var(--paper); border:1px dashed rgba(15,26,36,0.18); border-radius:14px; padding:40px 28px; text-align:center; color:var(--dim); font-size:14.5px; line-height:1.6; }
.tp-crumb { font-size:13.5px; color:var(--dim); text-decoration:none; }
.tp-crumb:hover { color:var(--ink); }
.tp-ohead { display:flex; justify-content:space-between; align-items:flex-end; gap:24px; flex-wrap:wrap; margin-bottom:28px; }
.tp-ometa { display:flex; gap:28px; flex-wrap:wrap; margin-top:14px; }
.tp-bulk { background:var(--forest); color:#e8f1ef; border-radius:14px; padding:22px 24px; display:grid; grid-template-columns:1fr auto; gap:20px; align-items:center; margin-bottom:28px; }
.tp-bulk b { color:#fff; font-weight:600; }
.tp-bulk p { margin:4px 0 0; font-size:13.5px; line-height:1.55; color:rgba(232,241,239,0.75); }
.tp-bulk code { font-family:'JetBrains Mono',monospace; font-size:12.5px; background:rgba(255,255,255,0.08); padding:2px 6px; border-radius:5px; color:#bfe9f2; }
.tp-btn-light { background:#fff; color:var(--forest); }
.tp-btn-light:hover:not(:disabled) { background:#e8f6f9; }
.tp-group { background:var(--paper); border:1px solid var(--line); border-radius:14px; margin-bottom:14px; overflow:hidden; }
.tp-group-h { display:flex; justify-content:space-between; align-items:center; padding:14px 22px; border-bottom:1px solid var(--line); background:#fbfcfd; }
.tp-group-h b { font-size:14.5px; font-weight:600; }
.tp-group-h span { font-size:12.5px; color:var(--dim); }
.tp-file { display:grid; grid-template-columns:76px minmax(0,1fr) 90px 120px; gap:16px; align-items:center; padding:12px 22px; border-top:1px solid var(--line); }
.tp-file:first-of-type { border-top:0; }
.tp-tag { font-family:'JetBrains Mono',monospace; font-size:10.5px; font-weight:600; letter-spacing:0.04em; text-align:center; padding:4px 0; border-radius:6px; background:rgba(61,168,200,0.1); color:#2a7e98; }
.tp-tag-Index, .tp-tag-Manifest, .tp-tag-Checksums, .tp-tag-File { background:rgba(15,26,36,0.05); color:var(--dim); }
.tp-tag-BAM, .tp-tag-CRAM, .tp-tag-FASTQ { background:rgba(91,174,157,0.14); color:#2f6f61; }
.tp-tag-Report, .tp-tag-Readme { background:rgba(214,150,52,0.14); color:#8a5a12; }
.tp-fname { font-family:'JetBrains Mono',monospace; font-size:13px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.tp-fsize { font-size:13px; color:var(--dim); text-align:right; }
.tp-file .tp-btn-dl { justify-self:end; }
.tp-readme { margin-top:28px; }
.tp-readme summary { cursor:pointer; font-size:14px; font-weight:500; color:var(--ink2); }
.tp-readme pre { white-space:pre-wrap; word-break:break-word; font-family:'JetBrains Mono',monospace; font-size:12.5px; line-height:1.6; color:var(--ink2);
  background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:18px 20px; margin:12px 0 0; }
.tp-note { font-size:12.5px; color:var(--dim); margin-top:24px; line-height:1.6; }
.tp-loading { padding:80px 0; text-align:center; color:var(--dim); font-size:14px; }

/* staff: accounts */
.tp-tabs { display:flex; gap:4px; }
.tp-tabs a { font-size:14px; font-weight:500; color:var(--dim); text-decoration:none; padding:8px 12px; border-radius:8px; }
.tp-tabs a:hover { color:var(--ink); background:var(--paper2); }
.tp-tabs a.on { color:var(--ink); background:rgba(61,168,200,0.1); }
.tp-btn-dark { background:var(--ink); color:#fff; height:42px; }
.tp-btn-dark:hover:not(:disabled) { background:#1d3040; }
.tp-btn-red { color:var(--red); border-color:rgba(181,72,59,0.3); }
.tp-btn-red:hover:not(:disabled) { border-color:var(--red); }
.tp-input { width:100%; height:44px; border:1px solid rgba(15,26,36,0.16); border-radius:10px; padding:0 12px; font:inherit; font-size:14.5px; color:var(--ink); background:#fff; outline:none; }
.tp-input:focus { border-color:var(--blue); box-shadow:0 0 0 3px rgba(61,168,200,0.16); }
.tp-search { max-width:360px; margin-bottom:14px; }
.tp-acc { background:var(--paper); border:1px solid var(--line); border-radius:14px; overflow:hidden; }
.tp-acc-row { display:grid; grid-template-columns:minmax(0,1.3fr) minmax(0,1.3fr) 120px 90px; gap:16px; align-items:center; width:100%;
  padding:14px 22px; border:0; border-top:1px solid var(--line); background:none; font:inherit; color:inherit; text-align:left; cursor:pointer; }
.tp-acc-row:hover { background:#fbfcfd; }
.tp-acc-head { border-top:0; cursor:default; background:#fbfcfd; font-size:11.5px; font-weight:600; color:var(--dim); text-transform:uppercase; letter-spacing:0.08em; padding:11px 22px; }
.tp-acc-who { min-width:0; }
.tp-acc-who b { display:block; font-size:14.5px; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.tp-acc-who small { display:block; font-size:12.5px; color:var(--dim); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:2px; }
.tp-acc-access { font-size:13.5px; color:var(--ink2); }
.tp-acc-last { font-size:13px; color:var(--dim); }
.tp-acc-status { justify-self:end; }
.tp-acc-edit { font-size:13px; font-weight:600; color:var(--blue); }
.tp-acc-off .tp-acc-who b, .tp-acc-off .tp-acc-access { color:var(--dim); }
.tp-modal { position:fixed; inset:0; z-index:50; background:rgba(6,12,18,0.55); backdrop-filter:blur(3px); display:flex; align-items:flex-start; justify-content:center; padding:48px 16px; overflow-y:auto; }
.tp-modal-card { position:relative; width:100%; max-width:520px; background:var(--paper); border-radius:18px; padding:32px; box-shadow:0 24px 60px rgba(6,12,18,0.25); }
.tp-modal-x { position:absolute; top:14px; right:16px; width:34px; height:34px; border:0; background:none; font-size:24px; line-height:1; color:var(--dim); cursor:pointer; border-radius:8px; }
.tp-modal-x:hover { background:var(--paper2); color:var(--ink); }
.tp-seg { display:inline-flex; background:var(--paper2); border:1px solid var(--line); border-radius:10px; padding:3px; }
.tp-seg button { border:0; background:none; font:inherit; font-size:14px; font-weight:500; color:var(--dim); padding:8px 16px; border-radius:8px; cursor:pointer; }
.tp-seg button.on { background:#fff; color:var(--ink); box-shadow:0 1px 3px rgba(15,26,36,0.12); }
.tp-seg button:disabled { cursor:default; }
.tp-check { display:grid; grid-template-columns:20px 1fr; gap:10px; align-items:start; margin-bottom:18px; font-size:14px; font-weight:500; cursor:pointer; }
.tp-check input { margin-top:3px; }
.tp-check small { display:block; font-weight:400; font-size:12.5px; color:var(--dim); line-height:1.5; margin-top:3px; }
.tp-choice { display:grid; gap:9px; font-size:14px; }
.tp-choice > label { display:flex; gap:9px; align-items:flex-start; cursor:pointer; line-height:1.45; }
.tp-choice > label input { margin-top:3px; }
.tp-orders-pick { display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:8px; padding:12px 14px; background:var(--paper2); border-radius:10px; font-size:13px; }
.tp-orders-pick label { display:flex; gap:8px; align-items:center; cursor:pointer; }
.tp-orders-pick small { color:var(--dim); }
.tp-danger { margin-top:24px; padding-top:20px; border-top:1px solid var(--line); }
.tp-actions { display:flex; flex-wrap:wrap; gap:10px; }
.tp-hint { display:block; font-size:12.5px; color:var(--dim); margin-top:10px; }
.tp-cred { background:var(--paper2); border:1px solid var(--line); border-radius:14px; padding:20px; }
.tp-cred-h { font-size:12px; font-weight:600; color:#2f6f61; margin-bottom:14px; }
.tp-cred-row { display:grid; grid-template-columns:90px minmax(0,1fr); gap:12px; font-size:14px; padding:7px 0; border-top:1px solid var(--line); }
.tp-cred-row span { color:var(--dim); }
.tp-cred-row b { font-weight:600; word-break:break-all; }
.tp-cred .tp-btn { margin-top:14px; }
.tp-cred p { font-size:12.5px; color:var(--dim); margin:12px 0 0; }

@media (max-width: 900px) {
  .tp-auth { grid-template-columns:1fr; }
  .tp-auth-side { padding:36px 24px 40px; }
  .tp-points { margin-top:28px; }
  .tp-auth-side .tp-back { margin-top:28px; }
  .tp-auth-main { order:-1; padding:32px 20px 48px; align-items:flex-start; }
  .tp-auth-side h1 { font-size:28px; }
  .tp-card .tp-logo { margin-bottom:28px; }
  .tp-order { grid-template-columns:1fr auto; gap:10px 16px; padding:18px; }
  .tp-order .tp-stat { grid-column:1; }
  .tp-order .tp-order-pill { grid-column:2; grid-row:1; justify-self:end; }
  .tp-order .tp-arrow { display:none; }
}
@media (max-width: 640px) {
  .tp-top-in { padding:0 16px; gap:12px; height:60px; }
  .tp-top-in .tp-logo { height:28px; }
  .tp-top-div, .tp-top-title, .tp-top-email { display:none; }
  .tp-main { padding:28px 16px 64px; }
  .tp-main h1 { font-size:28px; }
  .tp-bulk { grid-template-columns:1fr; padding:20px; }
  .tp-file { grid-template-columns:56px minmax(0,1fr) auto; grid-template-rows:auto auto; gap:4px 12px; padding:12px 16px; }
  .tp-file .tp-tag { grid-row:1 / span 2; align-self:center; }
  .tp-file .tp-fsize { grid-column:2; grid-row:2; text-align:left; }
  .tp-file .tp-btn-dl { grid-column:3; grid-row:1 / span 2; }
  .tp-group-h { padding:12px 16px; }
  .tp-tabs a { padding:8px 10px; }
  .tp-acc-head { display:none; }
  .tp-acc-row { grid-template-columns:minmax(0,1fr) auto; gap:4px 12px; padding:14px 16px; }
  .tp-acc-access, .tp-acc-last { grid-column:1; font-size:12.5px; }
  .tp-acc-status { grid-column:2; grid-row:1; }
  .tp-modal { padding:16px 10px; }
  .tp-modal-card { padding:24px 18px; }
}
`;

// ---- sign-in screens ----
function AuthShell({ children }) {
  return (
    <div className="tp-auth">
      <aside className="tp-auth-side">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="tp-kicker" style={{ color: '#7fd3e6' }}>Torrington Genomics &amp; Bioinformatics</div>
          <h1 className="tp-serif">Your results, <em>delivered securely.</em></h1>
          <ul className="tp-points">
            <li><span>01</span>Only your institution's orders are visible to your account.</li>
            <li><span>02</span>Sign in any time within 30 days of delivery and download your files as often as you need.</li>
            <li><span>03</span>Your files are never public. They are removed after 30 days, so please keep your own copy.</li>
          </ul>
        </div>
        <a className="tp-back" href="/">← Back to torrington-gb.com</a>
      </aside>
      <main className="tp-auth-main">
        <div className="tp-card">
          <a href="/"><img className="tp-logo" src="../assets/TGB-logo-trimmed.png" alt="Torrington Genomics &amp; Bioinformatics" /></a>
          {children}
        </div>
      </main>
    </div>
  );
}

function SignIn({ notice, error }) {
  const [mode, setMode] = useState('signin'); // signin | forgot
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(error || '');
  const [ok, setOk] = useState(notice || '');

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setOk(''); setBusy(true);
    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await sendPasswordResetEmail(auth, email.trim(), { url: window.location.origin + window.location.pathname });
        setOk('If that email has a portal account, a reset link is on its way. Check your spam folder too.');
        setMode('signin');
      }
    } catch (e2) {
      // Never reveal whether an address has an account.
      if (mode === 'forgot' && !String(e2.code).includes('too-many')) {
        setOk('If that email has a portal account, a reset link is on its way. Check your spam folder too.');
        setMode('signin');
      } else setErr(authMessage(e2));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell>
      <div className="tp-kicker">Results portal</div>
      <h2 className="tp-serif">{mode === 'signin' ? 'Sign in' : 'Reset your password'}</h2>
      <p className="tp-sub">
        {mode === 'signin'
          ? 'Use the email address your invitation was sent to.'
          : "Enter your account email and we'll send you a link to choose a new password."}
      </p>
      {err && <div className="tp-msg tp-msg-err">{err}</div>}
      {ok && <div className="tp-msg tp-msg-ok">{ok}</div>}
      <form onSubmit={submit} noValidate>
        <label className="tp-field">
          <span>Email</span>
          <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        {mode === 'signin' && (
          <label className="tp-field">
            <span>Password</span>
            <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
        )}
        <div className="tp-row">
          <button type="button" className="tp-link" onClick={() => { setMode(mode === 'signin' ? 'forgot' : 'signin'); setErr(''); setOk(''); }}>
            {mode === 'signin' ? 'Forgot password?' : '← Back to sign in'}
          </button>
        </div>
        <button className="tp-btn tp-btn-primary" disabled={busy || !email || (mode === 'signin' && !password)}>
          {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Send reset link'}
        </button>
      </form>
      <p className="tp-help">
        Accounts are by invitation only. To get access for your institution, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </AuthShell>
  );
}

function SetPassword({ code, onDone }) {
  const [email, setEmail] = useState(null);
  const [bad, setBad] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    verifyPasswordResetCode(auth, code).then(setEmail).catch((e) => {
      window.history.replaceState(null, '', window.location.pathname);
      setBad(authMessage(e));
    });
  }, [code]);

  const submit = async (e) => {
    e.preventDefault();
    if (pw.length < MIN_PASSWORD) return setErr(`Use at least ${MIN_PASSWORD} characters.`);
    if (pw !== pw2) return setErr('The two passwords do not match.');
    setErr(''); setBusy(true);
    try {
      await confirmPasswordReset(auth, code, pw);
      await signInWithEmailAndPassword(auth, email, pw);
      onDone();
    } catch (e2) {
      setErr(authMessage(e2));
      setBusy(false);
    }
  };

  if (bad) return <SignIn error={bad} />;
  return (
    <AuthShell>
      <div className="tp-kicker">Results portal</div>
      <h2 className="tp-serif">Choose a password</h2>
      <p className="tp-sub">{email ? <>For <b style={{ color: '#0f1a24', fontWeight: 600 }}>{email}</b>. Use at least {MIN_PASSWORD} characters.</> : 'Checking your link…'}</p>
      {err && <div className="tp-msg tp-msg-err">{err}</div>}
      {email && (
        <form onSubmit={submit} noValidate>
          <input type="email" autoComplete="username" value={email} readOnly hidden />
          <label className="tp-field">
            <span>New password</span>
            <input type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
          </label>
          <label className="tp-field" style={{ marginBottom: 24 }}>
            <span>Confirm password</span>
            <input type="password" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} />
          </label>
          <button className="tp-btn tp-btn-primary" disabled={busy || !pw || !pw2}>{busy ? 'Saving…' : 'Save and sign in'}</button>
        </form>
      )}
    </AuthShell>
  );
}

// ---- signed-in screens ----
function TopBar({ user, me, route }) {
  return (
    <header className="tp-top">
      <div className="tp-top-in">
        <a href="/"><img className="tp-logo" src="../assets/TGB-logo-trimmed.png" alt="Torrington Genomics &amp; Bioinformatics" /></a>
        <div className="tp-top-div" />
        {me && me.admin ? (
          <nav className="tp-tabs">
            <a href="#/" className={!route || !route.page ? 'on' : ''}>Results</a>
            <a href="#/accounts" className={route && route.page === 'accounts' ? 'on' : ''}>Accounts</a>
          </nav>
        ) : (
          <a href="#/" className="tp-top-title" style={{ textDecoration: 'none' }}>Results portal</a>
        )}
        <div className="tp-top-right">
          <span className="tp-top-email">{user.email}</span>
          <button className="tp-btn tp-btn-ghost" onClick={() => { window.location.hash = ''; signOut(auth); }}>Sign out</button>
        </div>
      </div>
    </header>
  );
}

function ExpiryPill({ expires }) {
  const d = daysLeft(expires);
  if (d == null) return <span className="tp-pill">Available</span>;
  if (d < 0) return <span className="tp-pill tp-pill-gone">Expired</span>;
  return <span className={`tp-pill ${d <= 7 ? 'tp-pill-warn' : ''}`}>{d === 0 ? 'Last day' : `${d} day${d === 1 ? '' : 's'} left`}</span>;
}

function Orders({ me }) {
  const [orders, setOrders] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    api('/api/orders').then((r) => r.json()).then((d) => setOrders(d.orders)).catch((e) => setErr(e.message));
  }, []);
  const showInst = me && (me.staff || me.institutions.length > 1);

  return (
    <>
      <div className="tp-kicker">Deliveries</div>
      <h1 className="tp-serif">Your results</h1>
      <p className="tp-lead">Each order is kept for 30 days after delivery, then removed automatically. Download what you need and keep your own copy.</p>
      {err && <div className="tp-msg tp-msg-err">{err}</div>}
      {!orders && !err && <div className="tp-loading">Loading your orders…</div>}
      {orders && orders.length === 0 && (
        <div className="tp-empty">There are no deliveries for your account right now.<br />We'll email you when your results are ready.</div>
      )}
      {orders && orders.length > 0 && (
        <div className="tp-orders">
          {orders.map((o) => (
            <a key={`${o.inst}/${o.order}`} className="tp-order" href={`#/${encodeURIComponent(o.inst)}/${encodeURIComponent(o.order)}`}>
              <div>
                <div className="tp-order-id">{o.order}</div>
                {showInst && <div className="tp-order-inst">{o.inst}</div>}
              </div>
              <div className="tp-stat"><small>Delivered</small>{o.prepared ? fmtDate(o.prepared) : '—'}</div>
              <div className="tp-stat"><small>Contents</small>{o.samples ? `${o.samples} sample${o.samples === 1 ? '' : 's'}` : ''}{o.samples && o.bytes ? ' · ' : ''}{fmtBytes(o.bytes)}</div>
              <div className="tp-order-pill"><ExpiryPill expires={o.expires} /></div>
              <div className="tp-arrow">→</div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}

function saveBlob(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}

function OrderDetail({ inst, order }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(''); // path being fetched, or '*script'
  const base = `/api/orders/${encodeURIComponent(inst)}/${encodeURIComponent(order)}`;

  useEffect(() => {
    setData(null); setErr('');
    api(base).then((r) => r.json()).then(setData).catch((e) => setErr(e.message));
  }, [base]);

  const download = async (path) => {
    setBusy(path); setErr('');
    try {
      const { url } = await (await api(`${base}/link`, { method: 'POST', body: JSON.stringify({ path }) })).json();
      window.location.href = url; // served as an attachment, so the page stays put
    } catch (e) {
      setErr(e.message);
    } finally {
      setTimeout(() => setBusy(''), 800);
    }
  };

  const script = async () => {
    setBusy('*script'); setErr('');
    try {
      const blob = await (await api(`${base}/script`, { method: 'POST' })).blob();
      saveBlob(blob, `download-${order}.sh`);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy('');
    }
  };

  const groups = [];
  if (data) {
    const root = data.files.filter((f) => !f.path.includes('/'));
    const bySample = {};
    data.files.filter((f) => f.path.includes('/')).forEach((f) => {
      const s = f.path.split('/')[0];
      (bySample[s] = bySample[s] || []).push(f);
    });
    if (root.length) groups.push({ name: 'Project files', files: sortFiles(root) });
    Object.keys(bySample).sort().forEach((s) => groups.push({ name: s, sample: true, files: sortFiles(bySample[s]) }));
  }
  const total = data ? data.files.reduce((s, f) => s + f.bytes, 0) : 0;
  const sampleCount = groups.filter((g) => g.sample).length;

  return (
    <>
      <a className="tp-crumb" href="#/">← All orders</a>
      <div className="tp-ohead">
        <div>
          <div className="tp-kicker" style={{ marginTop: 18, textTransform: 'none' }}>{inst}</div>
          <h1 className="tp-serif">{order}</h1>
          {data && (
            <div className="tp-ometa">
              <div className="tp-stat"><small>Delivered</small>{data.prepared ? fmtDate(data.prepared) : '—'}</div>
              <div className="tp-stat"><small>Available until</small>{data.expires ? fmtDate(data.expires) : '—'}</div>
              <div className="tp-stat"><small>Contents</small>{sampleCount ? `${sampleCount} samples · ` : ''}{data.files.length} files · {fmtBytes(total)}</div>
            </div>
          )}
        </div>
        {data && <ExpiryPill expires={data.expires} />}
      </div>
      {err && <div className="tp-msg tp-msg-err">{err}</div>}
      {!data && !err && <div className="tp-loading">Loading files…</div>}
      {data && (
        <>
          <div className="tp-bulk">
            <div>
              <b>Download the whole order</b>
              <p>For large orders, get a script that downloads every file, resumes if your connection drops, and checks the md5 checksums. Run it with <code>bash download-{order}.sh</code> on Mac or Linux. Its links work for 7 days. If it stops part-way, run it again and it carries on where it left off.</p>
            </div>
            <button className="tp-btn tp-btn-light" onClick={script} disabled={busy === '*script'}>
              {busy === '*script' ? 'Preparing…' : 'Get download script'}
            </button>
          </div>
          {groups.map((g) => (
            <section className="tp-group" key={g.name}>
              <div className="tp-group-h">
                <b className={g.sample ? 'tp-mono' : ''}>{g.name}</b>
                <span>{g.files.length} file{g.files.length === 1 ? '' : 's'} · {fmtBytes(g.files.reduce((s, f) => s + f.bytes, 0))}</span>
              </div>
              {g.files.map((f) => {
                const k = fileKind(f.path);
                const name = f.path.split('/').pop();
                return (
                  <div className="tp-file" key={f.path}>
                    <span className={`tp-tag tp-tag-${k.label}`}>{k.label}</span>
                    <span className="tp-fname" title={name}>{name}</span>
                    <span className="tp-fsize">{fmtBytes(f.bytes)}</span>
                    <button className="tp-btn tp-btn-dl" onClick={() => download(f.path)} disabled={busy === f.path}>
                      {busy === f.path ? 'Starting…' : 'Download'}
                    </button>
                  </div>
                );
              })}
            </section>
          ))}
          {data.readme && (
            <details className="tp-readme" open>
              <summary>About these files</summary>
              <pre>{data.readme}</pre>
            </details>
          )}
          <p className="tp-note">
            If a large download is interrupted, use the download script, which picks up where it stopped.
            Questions about your results? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and quote {order}.
          </p>
        </>
      )}
    </>
  );
}

// ---- staff: account management ----
const loginText = (email, password) =>
  `Your Torrington Genomics & Bioinformatics results portal account\n\n` +
  `Sign in at: https://torrington-gb.com/portal/\nEmail: ${email}\nPassword: ${password}\n\n` +
  `You can choose your own password any time with "Forgot password?" on the sign-in page.`;

function accessLabel(u) {
  if (u.role === 'staff') return u.admin ? 'Staff · admin' : 'Staff · all institutions';
  if (!u.inst) return 'No access';
  return `${[].concat(u.inst).join(', ')}${u.orders ? ` · ${u.orders.join(', ')}` : ' · all orders'}`;
}

function Credentials({ email, password }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(loginText(email, password)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="tp-cred">
      <div className="tp-cred-h">Login details: send these to the account holder</div>
      <div className="tp-cred-row"><span>Sign in at</span><b>torrington-gb.com/portal/</b></div>
      <div className="tp-cred-row"><span>Email</span><b>{email}</b></div>
      <div className="tp-cred-row"><span>Password</span><b className="tp-mono">{password}</b></div>
      <button type="button" className="tp-btn tp-btn-dark" onClick={copy}>{copied ? 'Copied ✓' : 'Copy login details'}</button>
      <p>This password is shown only once. If it's lost, set a new one.</p>
    </div>
  );
}

function AccountEditor({ account, me, institutions, onClose, onSaved, onDeleted }) {
  const isNew = !account;
  const self = account && account.email === me.email;
  const [f, setF] = useState(() => ({
    email: '',
    name: account ? account.name : '',
    role: account ? account.role : 'client',
    admin: account ? account.admin : false,
    inst: account && account.inst ? [].concat(account.inst)[0] : '',
    newInst: '',
    limit: !!(account && account.orders),
    orders: (account && account.orders) || [],
    pwMode: 'generate',
    password: '',
  }));
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const [cred, setCred] = useState(null);
  const [pwOpen, setPwOpen] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e && e.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e });

  const instName = f.inst === '__new' ? f.newInst.trim() : f.inst;
  const instOrders = (institutions.find((i) => i.inst === instName) || {}).orders || [];
  const toggleOrder = (o) => setF({ ...f, orders: f.orders.includes(o) ? f.orders.filter((x) => x !== o) : [...f.orders, o] });

  const body = () => ({
    name: f.name,
    role: f.role,
    admin: f.role === 'staff' && f.admin,
    inst: f.role === 'client' ? instName : undefined,
    orders: f.role === 'client' && f.limit ? f.orders : [],
  });

  const run = async (label, fn) => {
    setBusy(label); setErr('');
    try { await fn(); } catch (e) { setErr(e.message); } finally { setBusy(''); }
  };

  const save = (e) => {
    e.preventDefault();
    if (f.role === 'client' && !instName) return setErr('Choose the institution folder this account can see.');
    if (f.role === 'client' && f.limit && !f.orders.length) return setErr('Tick at least one order, or choose "All orders".');
    run('save', async () => {
      if (isNew) {
        const r = await (await api('/api/admin/users', { method: 'POST', body: JSON.stringify({ ...body(), email: f.email, password: f.pwMode === 'own' ? f.password : '' }) })).json();
        setCred({ email: r.user.email, password: r.password });
        onSaved(r.user, true);
      } else {
        const r = await (await api(`/api/admin/users/${account.uid}`, { method: 'PATCH', body: JSON.stringify(body()) })).json();
        onSaved(r.user);
        onClose();
      }
    });
  };

  const newPassword = () => run('pw', async () => {
    const r = await (await api(`/api/admin/users/${account.uid}/password`, { method: 'POST', body: JSON.stringify({ password: f.pwMode === 'own' ? f.password : '' }) })).json();
    setCred({ email: r.user.email, password: r.password });
    setPwOpen(false);
  });

  const toggleDisabled = () => run('disable', async () => {
    const r = await (await api(`/api/admin/users/${account.uid}`, { method: 'PATCH', body: JSON.stringify({ disabled: !account.disabled }) })).json();
    onSaved(r.user);
    onClose();
  });

  const remove = () => {
    if (!window.confirm(`Delete the account for ${account.email}? They will no longer be able to sign in. Their files in the bucket are not affected.`)) return;
    run('delete', async () => {
      await api(`/api/admin/users/${account.uid}`, { method: 'DELETE' });
      onDeleted(account.uid);
      onClose();
    });
  };

  const passwordChoice = () => (
    <div className="tp-choice">
      <label><input type="radio" checked={f.pwMode === 'generate'} onChange={() => setF({ ...f, pwMode: 'generate' })} /> Generate a password</label>
      <label><input type="radio" checked={f.pwMode === 'own'} onChange={() => setF({ ...f, pwMode: 'own' })} /> Set one myself</label>
      {f.pwMode === 'own' && (
        <input className="tp-input" type="text" autoComplete="off" placeholder={`At least ${MIN_PASSWORD} characters`} value={f.password} onChange={set('password')} />
      )}
    </div>
  );

  return (
    <div className="tp-modal" onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) onClose(); }}>
      <div className="tp-modal-card">
        <button className="tp-modal-x" onClick={onClose} aria-label="Close">×</button>
        <div className="tp-kicker">{isNew ? 'New account' : 'Edit account'}</div>
        <h2 className="tp-serif" style={{ fontSize: 26, margin: '6px 0 20px', wordBreak: 'break-word' }}>{isNew ? 'Create an account' : account.email}</h2>
        {err && <div className="tp-msg tp-msg-err">{err}</div>}

        {cred ? (
          <>
            <Credentials {...cred} />
            <button className="tp-btn tp-btn-ghost" style={{ marginTop: 16 }} onClick={onClose}>Done</button>
          </>
        ) : (
          <form onSubmit={save} noValidate>
            {isNew && (
              <label className="tp-field"><span>Email</span>
                <input type="email" autoComplete="off" value={f.email} onChange={set('email')} placeholder="name@institution.lk" />
              </label>
            )}
            <label className="tp-field"><span>Name (optional)</span>
              <input type="text" autoComplete="off" value={f.name} onChange={set('name')} placeholder="Dr A. Perera" />
            </label>

            <div className="tp-field"><span>Account type</span>
              <div className="tp-seg">
                <button type="button" className={f.role === 'client' ? 'on' : ''} disabled={self} onClick={() => setF({ ...f, role: 'client' })}>Client</button>
                <button type="button" className={f.role === 'staff' ? 'on' : ''} onClick={() => setF({ ...f, role: 'staff' })}>TGB staff</button>
              </div>
            </div>

            {f.role === 'staff' ? (
              <label className="tp-check">
                <input type="checkbox" checked={f.admin} disabled={self} onChange={set('admin')} />
                <span>Can manage accounts <small>Staff always see every institution's results. Admins can also create and change accounts here.</small></span>
              </label>
            ) : (
              <>
                <label className="tp-field"><span>Institution</span>
                  <select className="tp-input" value={f.inst} onChange={(e) => setF({ ...f, inst: e.target.value, orders: [] })}>
                    <option value="">Choose a folder…</option>
                    {institutions.map((i) => <option key={i.inst} value={i.inst}>{i.inst} ({i.orders.length} order{i.orders.length === 1 ? '' : 's'})</option>)}
                    <option value="__new">New institution (no deliveries yet)…</option>
                  </select>
                </label>
                {f.inst === '__new' && (
                  <label className="tp-field"><span>Folder name, exactly as your pipeline will write it</span>
                    <input type="text" className="tp-mono" value={f.newInst} onChange={set('newInst')} placeholder="e.g. UoC-FoM" />
                  </label>
                )}
                {instName && (
                  <div className="tp-field"><span>Orders</span>
                    <div className="tp-choice">
                      <label><input type="radio" checked={!f.limit} onChange={() => setF({ ...f, limit: false })} /> All orders for this institution, including future ones</label>
                      <label><input type="radio" checked={f.limit} onChange={() => setF({ ...f, limit: true })} /> Only selected orders</label>
                      {f.limit && (
                        <div className="tp-orders-pick">
                          {instOrders.length === 0 && <small>No orders delivered for this institution yet.</small>}
                          {instOrders.map((o) => (
                            <label key={o}><input type="checkbox" checked={f.orders.includes(o)} onChange={() => toggleOrder(o)} /> <span className="tp-mono">{o}</span></label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {isNew && <div className="tp-field"><span>Password</span>{passwordChoice()}</div>}

            <button className="tp-btn tp-btn-primary" style={{ marginTop: 8 }} disabled={!!busy}>
              {busy === 'save' ? 'Saving…' : isNew ? 'Create account' : 'Save changes'}
            </button>

            {!isNew && (
              <div className="tp-danger">
                {pwOpen ? (
                  <div className="tp-field" style={{ marginBottom: 0 }}><span>New password</span>
                    {passwordChoice()}
                    <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                      <button type="button" className="tp-btn tp-btn-dark" onClick={newPassword} disabled={!!busy}>{busy === 'pw' ? 'Saving…' : 'Set password'}</button>
                      <button type="button" className="tp-btn tp-btn-ghost" onClick={() => setPwOpen(false)}>Cancel</button>
                    </div>
                    <small className="tp-hint">{self ? 'You stay signed in here.' : 'They will be signed out everywhere and need the new password.'}</small>
                  </div>
                ) : (
                  <div className="tp-actions">
                    <button type="button" className="tp-btn tp-btn-ghost" onClick={() => setPwOpen(true)}>Set new password</button>
                    {!self && (
                      <button type="button" className="tp-btn tp-btn-ghost" onClick={toggleDisabled} disabled={!!busy}>
                        {busy === 'disable' ? 'Saving…' : account.disabled ? 'Enable account' : 'Disable account'}
                      </button>
                    )}
                    {!self && <button type="button" className="tp-btn tp-btn-ghost tp-btn-red" onClick={remove} disabled={!!busy}>{busy === 'delete' ? 'Deleting…' : 'Delete'}</button>}
                  </div>
                )}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

function Accounts({ me }) {
  const [users, setUsers] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null); // account object, 'new', or null

  useEffect(() => {
    api('/api/admin/users').then((r) => r.json()).then((d) => setUsers(d.users)).catch((e) => setErr(e.message));
    api('/api/admin/institutions').then((r) => r.json()).then((d) => setInstitutions(d.institutions)).catch(() => {});
  }, []);

  const saved = (u, isNew) => {
    setUsers((list) => {
      const rest = (list || []).filter((x) => x.uid !== u.uid);
      return [...rest, u].sort((a, b) => a.email.localeCompare(b.email));
    });
  };

  const ql = q.trim().toLowerCase();
  const shown = (users || []).filter((u) => !ql || [u.email, u.name, accessLabel(u)].join(' ').toLowerCase().includes(ql));

  return (
    <>
      <div className="tp-ohead" style={{ alignItems: 'flex-end' }}>
        <div>
          <div className="tp-kicker">Staff</div>
          <h1 className="tp-serif">Accounts</h1>
          <p className="tp-lead" style={{ margin: 0 }}>Create logins for clients, choose which institution and orders they can see, and reset passwords.</p>
        </div>
        <button className="tp-btn tp-btn-dark" onClick={() => setEditing('new')}>+ New account</button>
      </div>
      {err && <div className="tp-msg tp-msg-err">{err}</div>}
      {!users && !err && <div className="tp-loading">Loading accounts…</div>}
      {users && (
        <>
          <input className="tp-input tp-search" type="search" placeholder="Search by email, name or institution" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="tp-acc">
            <div className="tp-acc-row tp-acc-head"><span>Account</span><span>Access</span><span>Last sign-in</span><span /></div>
            {shown.map((u) => (
              <button key={u.uid} className={`tp-acc-row${u.disabled ? ' tp-acc-off' : ''}`} onClick={() => setEditing(u)}>
                <span className="tp-acc-who">
                  <b>{u.name || u.email}</b>
                  {u.name && <small>{u.email}</small>}
                </span>
                <span className="tp-acc-access">{accessLabel(u)}</span>
                <span className="tp-acc-last">{u.lastSignIn ? fmtDate(new Date(u.lastSignIn).toISOString()) : 'Never'}</span>
                <span className="tp-acc-status">{u.disabled ? <span className="tp-pill tp-pill-gone">Disabled</span> : <span className="tp-acc-edit">Edit →</span>}</span>
              </button>
            ))}
            {shown.length === 0 && <div className="tp-empty" style={{ border: 0 }}>No accounts match.</div>}
          </div>
        </>
      )}
      {editing && (
        <AccountEditor
          key={editing === 'new' ? 'new' : editing.uid}
          account={editing === 'new' ? null : editing}
          me={me}
          institutions={institutions}
          onClose={() => setEditing(null)}
          onSaved={saved}
          onDeleted={(uid) => setUsers((list) => list.filter((x) => x.uid !== uid))}
        />
      )}
    </>
  );
}

function Dashboard({ user }) {
  const route = useRoute();
  const [me, setMe] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    api('/api/me').then((r) => r.json()).then(setMe).catch((e) => setErr(e.message));
  }, [user.uid]);

  return (
    <>
      <TopBar user={user} me={me} route={route} />
      <main className="tp-main">
        {err ? (
          <div className="tp-empty">{err}<br />If you think this is a mistake, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</div>
        ) : !me ? (
          <div className="tp-loading">Loading…</div>
        ) : route && route.page === 'accounts' ? (
          me.admin ? <Accounts me={me} /> : <Orders me={me} />
        ) : route ? (
          <OrderDetail inst={route.inst} order={route.order} />
        ) : (
          <Orders me={me} />
        )}
      </main>
    </>
  );
}

function Portal() {
  const [user, setUser] = useState(undefined);
  const params = new URLSearchParams(window.location.search);
  const [resetCode, setResetCode] = useState(params.get('mode') === 'resetPassword' ? params.get('oobCode') : null);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  const clearReset = useCallback(() => {
    window.history.replaceState(null, '', window.location.pathname);
    setResetCode(null);
  }, []);

  let body;
  if (resetCode) body = <SetPassword code={resetCode} onDone={clearReset} />;
  else if (user === undefined) body = <div className="tp-loading">Loading…</div>;
  else if (!user) body = <SignIn />;
  else body = <Dashboard user={user} />;

  return (
    <div className="tp">
      <style>{CSS}</style>
      {body}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Portal />);
