/* eslint-disable */
// @ts-nocheck
"use client";
/**
 * Stella OS — the approved interactive mock, ported as-is (look + behaviour), then wired to the real robot.
 *
 *  - Demo mode (not on the tailnet): the built-in simulator drives everything (rooms, LiDAR ray-casting, FPV, voice).
 *  - Live mode (props.live.connection === "live"): the simulator's motion is switched off and every control talks to
 *    the Pi through the v3 store / robot API. See docs/OS-DASHBOARD.md for the endpoint contract.
 *
 * Markup lives in ./template.tsx (generated from the mock), styles in ./os.css. This file is logic only.
 */
import React from "react";
import "./os.css";
import { renderTemplate } from "./template";
import { voiceOut as getVoiceOut, setVoiceOut, nextVoiceOut, VOICE_OUT_LABEL } from "@/lib/stella-prefs";

export class StellaOSImpl extends React.Component<any, any> {
constructor(p) {
  super(p);
  // Real apartment: the listing floor plan mirrored left-to-right (balcony on the left, kitchen bottom-right). Plan px -> world units; edit PLAN_* to adjust.
  const K = 360 / 735, MX = (x) => Math.round(300 - (x - 392.5) * K), MY = (y) => Math.round(20 + (y - 5) * K);   // plan mirrored left-right (King's apartment is the listing plan flipped horizontally)
  const sg = (a, b, c, d) => [MX(a), MY(b), MX(c), MY(d)];
  const rm = (id, n, floor, x1, y1, x2, y2) => { const xa = Math.min(MX(x1), MX(x2)), xb = Math.max(MX(x1), MX(x2)), ya = Math.min(MY(y1), MY(y2)), yb = Math.max(MY(y1), MY(y2)); return { id, n, floor, x: xa, y: ya, w: xb - xa, h: yb - ya, lx: Math.round((xa + xb) / 2), ly: Math.round((ya + yb) / 2) + 4, c: [Math.round((xa + xb) / 2), Math.round((ya + yb) / 2)] }; };
  const pt = (x, y) => [MX(x), MY(y)];
  const fr = (x1, y1, x2, y2) => { const xa = Math.min(MX(x1), MX(x2)), xb = Math.max(MX(x1), MX(x2)), ya = Math.min(MY(y1), MY(y2)), yb = Math.max(MY(y1), MY(y2)); return 'M' + xa + ' ' + ya + 'h' + (xb - xa) + 'v' + (yb - ya) + 'h' + (xa - xb) + 'z'; };
  this.W = [sg(75,5,710,5), sg(710,5,710,235), sg(710,235,475,235), sg(475,235,475,740), sg(475,740,75,740), sg(75,740,75,5),
    sg(475,5,475,170), sg(315,5,315,235), sg(75,235,150,235), sg(240,235,315,235), sg(315,165,370,165), sg(450,165,475,165)];
  this.R = [
    rm('bedroom1', 'Bedroom 1', 'carpet', 75, 5, 315, 235), rm('bath', 'Bath', 'wood', 315, 5, 475, 165), rm('hall', 'Hall', 'carpet', 315, 165, 475, 235),
    rm('bedroom2', 'Bedroom 2', 'carpet', 475, 5, 710, 235), rm('living', 'Living room', 'carpet', 75, 235, 475, 545),
    rm('kitchen', 'Kitchen', 'wood', 75, 545, 300, 740), rm('dining', 'Dining', 'wood', 300, 545, 475, 740)
  ];
  this.ADJ = { living: ['hall', 'bedroom1', 'kitchen', 'dining'], hall: ['living', 'bath', 'bedroom2'], bath: ['hall'], bedroom1: ['living'], bedroom2: ['hall'], kitchen: ['living', 'dining'], dining: ['living', 'kitchen'] };
  this.DOOR = { 'bedroom1|living': pt(195, 235), 'bath|hall': pt(410, 165), 'bedroom2|hall': pt(475, 200), 'hall|living': pt(395, 235), 'kitchen|living': pt(190, 545), 'dining|living': pt(390, 545), 'dining|kitchen': pt(300, 640) };
  this.DK = pt(450, 500); this.START = this.R.find(r => r.id === 'living').c; this.NOGO = { x: MX(218), y: MY(278), w: Math.round(110 * K), h: Math.round(110 * K) }   // chimney / fireplace corner of the living room;
  this.FURN = [fr(115,135,275,235), fr(185,60,280,110), fr(515,125,650,230), fr(495,40,570,100), fr(190,375,350,530), fr(145,320,300,460), fr(115,285,205,375), fr(315,560,435,690), fr(60,548,220,600), fr(60,680,270,740)].join('');
  this.x = this.START[0]; this.y = this.START[1]; this.h = 90; this.sw = 0; this.bat = 74; this.st = 'idle';
  this.route = []; this.goal = ''; this.queue = []; this.holdDir = ''; this.stk = [0, 0];
  this.rot = 35; this.dragging = false; this.lastMove = 0; this.n = 0; this.exp = new Uint8Array(28 * 18); this.expPath = ''; this.expDirty = true;
  this.logs = []; this.act = {}; this.tl = 0; this.scanCache = null; this.look = 0; this.skip = {}; this.done = {}; this.lk = null; this.zd = null; this.vm = 'idle';
  this.PH = ['Stella, where are you?', 'Go to the kitchen', 'Set the temperature to 70', 'Volume up', 'Play Stranger Things', 'Dock'];
  this.state = {
    app: 'home', theme: 'dark', ctrl: 'console', pad: 'stick', speed: 50, tools: { v: false, m: false, s: false },
    layers: { scan: true, explored: true, labels: true }, toast: '', signed: true, internet: true, brain: 'auto',
    voiceOpen: false, listening: false, thinking: false, heard: '', reply: '', vsrc: '', vms: 0, vi: 0,
    fpv: false, turns: [], part: 'lidar', suction: 'normal', logSrc: ['driver', 'lidar', 'api', 'voice', 'battery', 'system'], logLv: 'good',
    tvSel: 0, tvs: [{ n: '75 Living', on: true, app: 'Netflix', vol: 18, playing: true, mute: false }, { n: 'ds twin', on: false, app: '—', vol: 12, playing: false, mute: false }, { n: 'sharif d ace', on: false, app: '—', vol: 10, playing: false, mute: false }],
    cur: 71.8, set: 72, cmode: 'auto', camOn: true, bump: 0, eco: true,
    zones: [Object.assign({ n: 'Chimney' }, this.NOGO)], selRoom: 'living', draw: false, camSrc: 'lidar', traceOpen: false,
    camZoom: 1, camPx: 0, camPy: 0, camFlip: false,
    lay: { order: ['map', 'control', 'shortcuts', 'flowmini', 'apps'], size: { map: 'L', control: 'M', shortcuts: 'M', flowmini: 'M', apps: 'F' }, hidden: {}, edit: false }, shortcuts: [{ id: 'sc1', n: 'Netflix', k: 'roku', a: 'netflix' }, { id: 'sc2', n: 'Charge', k: 'dock' }], flowSel: 'pi', scNew: false, scName: '', layouts: null, layActive: 'l1', accent: '', lnName: '', scKind: 'roku', scA: '', scB: '',
    cfg: { wake: true, spoken: true, vstyle: 'Warm', confirm: false, autoDock: 15, idleDock: 0, voiceOut: 'Device', resume: 90, edge: true, maxSpd: 100, lostStop: true, cliff: true, aBat: true, aStuck: true, aDone: true, quiet: 'Off', units: 'F', t24: false }
  };
  this.state.layouts = [{ id: 'l1', n: 'Everyday', lay: this.state.lay }];
  [['system', 'info', 'Stella API started · demo robot'], ['api', 'info', 'WS /live connected · 0.5 s frames'], ['driver', 'warn', 'Unknown mode detected (known noisy 600-series packet)'], ['lidar', 'info', 'RPLIDAR C1 · scan 10 Hz · 360 pts'], ['battery', 'info', 'Pack 15.28 V · 74%'], ['voice', 'info', 'Brain ready: Claude (cloud) + on-device fallback']].forEach(a => this.log(a[0], a[1], a[2]));
}
componentDidMount() {
  this.iv = setInterval(() => this.tick(), 120);
  this.fv = setInterval(() => { if (this.state.app === 'flow' || this.state.app === 'home') this.forceUpdate(); }, 1000);
  this.loadLayout();
  this.loadSaved();
  this.onNet = () => this.setState({ internet: typeof navigator === 'undefined' ? true : navigator.onLine });
  window.addEventListener('online', this.onNet); window.addEventListener('offline', this.onNet); this.onNet();
}
componentWillUnmount() { clearInterval(this.iv); clearInterval(this.fv); clearTimeout(this.tt); clearTimeout(this.pushT); if (this.onNet) { window.removeEventListener('online', this.onNet); window.removeEventListener('offline', this.onNet); } try { this.rec && this.rec.abort(); } catch (x) {} this.driveZero(); }
componentDidUpdate(_p, ps) {
  const s = this.state;
  if (ps.theme !== s.theme && this.props.onTheme) this.props.onTheme(s.theme);
  if (!this.loaded) return;
  if (this.skipPush) { this.skipPush = false; this.save(); return; }
  if (ps.cfg !== s.cfg || ps.zones !== s.zones || ps.theme !== s.theme || ps.brain !== s.brain || ps.suction !== s.suction || ps.set !== s.set || ps.cmode !== s.cmode || ps.eco !== s.eco) {
    this.save();
    clearTimeout(this.pushT); this.pushT = setTimeout(() => this.pushRemote(ps), 500);
  }
}
openTalk() { if (this.props.onTalk) this.props.onTalk(); else this.setState({ voiceOpen: true, heard: '', reply: '' }); }
/* ───────── live bridge: everything below talks to the real robot when connected ───────── */
live() { return (this.props && this.props.live) || {}; }
isLive() { const l = this.live(); return l.connection === 'live' && !!l.robotUrl; }
touch(src) { const a = this.act[src] || (this.act[src] = []); a.push(Date.now()); if (a.length > 200) a.shift(); }
async api(path, method, body, ms) {
  const l = this.live(); if (!l.robotUrl) return null;
  this.touch('api'); { const k = ({ pose: 'lidar', drive: 'driver', camera: 'camera', roku: 'tv', tv: 'tv', climate: 'climate' })[String(path).split('/')[1]]; if (k) this.touch(k); }
  const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), ms || 4000);
  try {
    const r = await fetch(l.robotUrl + path, { method: method || 'GET', headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body), signal: ctl.signal });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || d.success === false) return { __err: d.error || ('HTTP ' + r.status) };
    return d;
  } catch (x) { return null; } finally { clearTimeout(to); }
}
loadSaved() {
  try {
    const raw = localStorage.getItem('stella-os-v3'); if (raw) {
      const d = JSON.parse(raw), p = {};
      if (d.cfg) p.cfg = Object.assign({}, this.state.cfg, d.cfg);
      if (Array.isArray(d.zones)) p.zones = d.zones;
      if (d.theme) p.theme = d.theme; if (d.brain) p.brain = d.brain; if (d.suction) p.suction = d.suction;
      if (typeof d.set === 'number') p.set = d.set; if (d.cmode) p.cmode = d.cmode; if (typeof d.eco === 'boolean') p.eco = d.eco;
      if (d.rooms) this.R.forEach(r => { if (d.rooms[r.id]) r.n = d.rooms[r.id]; });
      if (d.skip) this.skip = d.skip;
      if (Object.keys(p).length) this.setState(p);
    }
  } catch (x) {}
  this.loaded = true;
}
save() {
  try { const s = this.state, rooms = {}; this.R.forEach(r => { rooms[r.id] = r.n; }); localStorage.setItem('stella-os-v3', JSON.stringify({ cfg: s.cfg, zones: s.zones, theme: s.theme, brain: s.brain, suction: s.suction, set: s.set, cmode: s.cmode, eco: s.eco, rooms, skip: this.skip })); } catch (x) {}
}
pushRemote(ps) {
  if (!this.isLive()) return;
  const s = this.state;
  if (ps.zones !== s.zones) this.api('/zones', 'POST', { zones: s.zones }).then(r => { if (r && r.__err) this.log('api', 'warn', 'Zones not saved on Stella: ' + r.__err); });
  if (ps.cfg !== s.cfg || ps.suction !== s.suction || ps.brain !== s.brain) this.api('/settings', 'POST', { cfg: s.cfg, suction: s.suction, brain: s.brain });
  if (ps.set !== s.set || ps.cmode !== s.cmode || ps.eco !== s.eco) this.api('/climate', 'POST', { set: s.set, mode: s.cmode, eco: s.eco, units: s.cfg.units }).then(r => { if (!r || r.__err) this.noClimate(r && r.__err); });
}
noClimate(msg) { const t = Date.now(); if (t - (this.ncT || 0) > 30000) { this.ncT = t; this.say(msg || 'Thermostat is not linked to Stella yet'); } }
driveVec(lin, ang) {
  const now = Date.now(); if (now - (this.dvT || 0) < 140 && (lin || ang)) return; this.dvT = now;
  this.driving = !!(lin || ang);
  this.api('/drive', 'POST', { linear: lin, angular: ang }, 1500);
}
driveZero() { if (this.driving && this.isLive()) { this.driving = false; this.api('/drive', 'POST', { linear: 0, angular: 0 }, 1500); } }
syncLive() {
  const l = this.live(), now = Date.now();
  // status the dashboard store already tracks over WS /live
  this.bat = typeof l.battery === 'number' ? l.battery : this.bat;
  if (l.robotOnline === false) { if (this.st !== 'fault') this.st = 'offline'; }
  else this.st = l.mode === 'docked' ? 'charging' : 'idle';
  if (l.mode === 'cleaning' || l.mode === 'returning') this.lastMove = now;
  if (this.isLive() && now - (this.vpT || 0) > 2000) {
    this.vpT = now;
    this.api('/voice/state', 'GET', undefined, 2500).then(d => { if (d && !d.__err) this.vst = d; else if (d === null) this.vst = null; });
    this.api('/voice/log?limit=12', 'GET', undefined, 2500).then(d => { if (d && Array.isArray(d.log)) { if (d.log.length && (!this.vlog || !this.vlog.length || this.vlog[0].t !== d.log[0].t)) this.touch('voice'); this.vlog = d.log; } });
  }
  if (now - (this.pollT || 0) > 700) {
    this.pollT = now;
    this.api('/pose', 'GET').then(p => {
      if (!p || p.__err) return; const q = p.pose || p;
      const px = q.x, py = q.y, th = q.theta !== undefined ? q.theta : q.yaw;
      if (typeof px === 'number' && typeof py === 'number') {
        // metres -> floor-plan units (50 u/m, origin at the dock). Calibrate once the real map is saved.
        this.x = Math.max(24, Math.min(576, this.DK[0] + px * 50)); this.y = Math.max(24, Math.min(376, this.DK[1] - py * 50));
        if (typeof th === 'number') this.h = ((90 - th * 180 / Math.PI) % 360 + 360) % 360;
      }
    });
  }
  if ((this.state.app === 'camera' || this.state.app === 'home' || this.state.fpv) && now - (this.ldT || 0) > 700) {
    this.ldT = now;
    this.api('/lidar', 'GET').then(d => { if (d && !d.__err && Array.isArray(d.r)) { this.lidar = d; this.lidarAt = Date.now(); } else this.lidar = null; });
  }
  if (now - (this.logT || 0) > 2500) {
    this.logT = now;
    this.api('/logs?since=' + (this.logSince || 0), 'GET').then(d => {
      if (!d || d.__err || !Array.isArray(d.logs)) return;
      d.logs.forEach(e => { this.logSince = Math.max(this.logSince || 0, e.ts || 0); this.logs.unshift({ t: e.t || '', src: e.src || 'system', lv: e.lv || 'info', m: e.m || '' }); });
      if (this.logs.length > 160) this.logs.length = 160;
    });
  }
  if (now - (this.tvT || 0) > 5000) {
    this.tvT = now;
    this.api('/tvs', 'GET').then(d => {
      const same = (x, y) => { x = String(x).toLowerCase(); y = String(y).toLowerCase(); return x === y || x.indexOf(y) >= 0 || y.indexOf(x) >= 0; };
      if (d && !d.__err && Array.isArray(d.tvs)) {
        const rows = d.tvs;
        this.setState({ tvs: this.state.tvs.map((x, i) => {
          const t = rows.find(r => same(r.name, x.n)) || (rows.length === 1 && i === 0 ? rows[0] : null);
          if (!t) return Object.assign({}, x, { on: false, app: '—', playing: false });
          return Object.assign({}, x, { on: !!t.on, app: t.on ? (t.app || 'Home') : '—', playing: !!t.on && /play/i.test(String(t.player || '')) });
        }) });
        return;
      }
      this.api('/tv/status', 'GET').then(d2 => {   // older Pi code: first TV only
        const t = d2 && d2.tv; if (!t) return;
        const on = !!t.power && !/off|standby|ready/i.test(String(t.power));
        this.setState({ tvs: this.state.tvs.map((x, i) => i === 0 ? Object.assign({}, x, { on, app: on ? (t.app_name || 'Home') : '—', playing: on && /play/i.test(String(t.player || '')) }) : x) });
      });
    });
  }
  if (now - (this.camT || 0) > 10000) {
    this.camT = now;
    this.api('/camera/status', 'GET').then(d => {
      this.camSt = d && !d.__err ? d : null;
      // first time a working camera shows up, switch the Camera window to it (user can still pick LiDAR)
      if (this.camSt && this.camSt.ok && !this.camAuto) { this.camAuto = true; this.setState({ camSrc: 'cam', camBad: 0 }); }
    });
  }
  if (now - (this.aiT || 0) > 10000) {
    this.aiT = now;
    this.api('/ai/status', 'GET').then(d => { this.aiSt = d && !d.__err ? d : null; });
  }
  if (now - (this.clT || 0) > 15000) {
    this.clT = now;
    this.api('/climate', 'GET').then(d => {
      if (!d || d.__err) return this.noClimate(d && d.__err);
      const p = {}; if (typeof d.cur === 'number') p.cur = d.cur; if (typeof d.set === 'number') p.set = d.set; if (d.mode) p.cmode = d.mode; if (typeof d.eco === 'boolean') p.eco = d.eco;
      if (Object.keys(p).length) { this.skipPush = true; this.setState(p); }
    });
  }
  if (!this.zonesLoaded) {
    this.zonesLoaded = true;
    this.api('/zones', 'GET').then(d => { const z = d && Array.isArray(d.zones) ? d.zones : null; if (z && z.length && z.every(q => typeof q.x === 'number' && typeof q.w === 'number')) this.setState({ zones: z.map((q, i) => ({ x: q.x, y: q.y, w: q.w, h: q.h, n: q.n || q.name || ('No-go ' + (i + 1)) })) }); });
  }
}
log(src, lv, m) {
  const d = new Date();
  const t = [d.getHours(), d.getMinutes(), d.getSeconds()].map(v => ('0' + v).slice(-2)).join(':');
  this.logs.unshift({ t, src, lv, m, ts: Date.now() }); this.touch(src);
  if (this.logs.length > 160) this.logs.pop();
}
say(m) { clearTimeout(this.tt); this.setState({ toast: m }); this.tt = setTimeout(() => this.setState({ toast: '' }), 2400); }
roomAt(x, y) { const r = this.R.find(r => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h); return r || { id: 'hall', n: 'Hall' }; }
segDist(px, py, s) {
  const dx = s[2] - s[0], dy = s[3] - s[1], l2 = dx * dx + dy * dy;
  let t = l2 ? ((px - s[0]) * dx + (py - s[1]) * dy) / l2 : 0; t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (s[0] + t * dx), py - (s[1] + t * dy));
}
blocked(x, y) { return this.W.some(s => this.segDist(x, y, s) < 11) || this.state.zones.some(z => x > z.x && x < z.x + z.w && y > z.y && y < z.y + z.h); }
ray(x, y, a) {
  const dx = Math.sin(a), dy = -Math.cos(a); let best = 400;
  for (const s of this.W) {
    const ex = s[2] - s[0], ey = s[3] - s[1], den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-9) continue;
    const t = ((s[0] - x) * ey - (s[1] - y) * ex) / den, u = ((s[0] - x) * dy - (s[1] - y) * dx) / den;
    if (t > 0 && u >= 0 && u <= 1 && t < best) best = t;
  }
  return best;
}
online() { return this.st !== 'offline' && this.st !== 'fault'; }
displayState() {
  if (this.st === 'idle') { if (Date.now() - this.lastMove < 900) return 'moving'; if (this.bat < 20) return 'low'; }
  return this.st;
}
move(fwd, turn) {
  if (!this.online()) { this.say('Stella is offline. Tap Wake Stella.'); this.stopAll(true); return false; }
  if (this.st === 'charging') { this.say('Docked in charging mode. Tap Wake Stella to drive.'); this.stopAll(true); return false; }
  this.h = (this.h + turn + 360) % 360;
  if (fwd) {
    const r = this.h * Math.PI / 180, nx = this.x + Math.sin(r) * fwd, ny = this.y - Math.cos(r) * fwd;
    if (this.blocked(nx, ny)) { if (Date.now() - this.tl > 1500) { this.tl = Date.now(); this.log('driver', 'warn', 'Bumper: obstacle ahead, stopped'); } return false; }
    this.x = nx; this.y = ny;
  }
  this.lastMove = Date.now();
  return true;
}
goTo(id, queued) {
  if (this.isLive()) {
    const l = this.live();
    if (l.robotOnline === false) { this.say('Stella is offline. Tap Wake.'); return; }
    if (this.st === 'charging') { this.say('Docked in charging mode. Tap Wake first.'); return; }
    this.goal = id;
    if (id === 'dock') { l.cleanMode('dock'); this.log('driver', 'info', 'Docking requested'); this.say('Heading to the dock'); return; }
    const nm = (this.R.find(r => r.id === id) || { n: id }).n;
    this.log('driver', 'info', 'Go to ' + nm + ' requested');
    this.api('/navigate', 'POST', { target: id, zones: this.state.zones }).then(r => { if (!r || r.__err) { this.say('Stella can’t navigate yet — drive manually'); this.log('api', 'warn', 'POST /navigate not available on this Stella'); this.goal = ''; this.forceUpdate(); } else this.say('Going to ' + nm); });
    return;
  }
  if (!this.online()) { this.say('Stella is offline. Tap Wake Stella.'); return; }
  if (this.st === 'charging') { this.say('Docked in charging mode. Tap Wake Stella first.'); return; }
  if (!queued) this.queue = [];
  const from = this.roomAt(this.x, this.y).id, to = id === 'dock' ? 'living' : id;
  let path = [from];
  if (from !== to && this.ADJ[from]) {
    const prev = { [from]: null }; const q = [from];
    while (q.length) { const c = q.shift(); if (c === to) break; for (const nx of this.ADJ[c]) if (!(nx in prev)) { prev[nx] = c; q.push(nx); } }
    path = []; let c = to; while (c) { path.unshift(c); c = prev[c]; }
  }
  const wp = [];
  for (let i = 0; i < path.length - 1; i++) wp.push(this.DOOR[[path[i], path[i + 1]].sort().join('|')]);
  wp.push(id === 'dock' ? this.DK.slice() : this.R.find(r => r.id === to).c);
  this.route = wp.map(p => p.slice()); this.goal = id;
  const nm = id === 'dock' ? 'the dock' : this.R.find(r => r.id === id).n;
  this.log('driver', 'info', 'Autonomy: heading to ' + nm);
}
stopAll(quiet) {
  this.route = []; this.queue = []; this.goal = ''; this.holdDir = ''; this.stk = [0, 0];
  if (this.isLive()) { this.driveZero(); this.live().cleanMode('stop'); }
  if (!quiet) { this.log('driver', 'info', 'Stop pressed'); this.say('Stopped'); }
  this.forceUpdate();
}
tick() {
  this.n++; this.sw = (this.sw + 26) % 360;
  if (this.state.spin !== false && !this.dragging && this.state.app === 'parts') this.rot = (this.rot + 0.6) % 360;
  const k = Math.min(this.state.speed, this.state.cfg.maxSpd) / 100, step = 9 * k, turn = 7 * k;
  let moved = false;
  const LIVE = this.isLive();
  if (LIVE) {
    this.syncLive();
    const l = this.live();
    if (l.robotOnline !== false && this.st !== 'charging') {
      const lin = this.holdDir === 'f' ? 1 : this.holdDir === 'b' ? -1 : this.holdDir ? 0 : -this.stk[1];
      const ang = this.holdDir === 'l' ? 1 : this.holdDir === 'r' ? -1 : this.holdDir ? 0 : -this.stk[0];
      if (Math.abs(lin) + Math.abs(ang) > 0.12) { this.driveVec(+(lin * 0.3 * k).toFixed(3), +(ang * 1.2 * k).toFixed(3)); moved = true; this.lastMove = Date.now(); }
      else this.driveZero();
    }
  }
  if (!LIVE && this.online() && this.st !== 'charging') {
    if (this.route.length) {
      const t = this.route[0], dx = t[0] - this.x, dy = t[1] - this.y, d = Math.hypot(dx, dy);
      if (d < 9) {
        this.route.shift();
        if (!this.route.length) {
          if (this.goal && this.goal !== 'dock') this.done[this.goal] = this.clock();
          if (this.goal === 'dock') { this.x = this.DK[0]; this.y = this.DK[1]; this.h = 0; this.st = 'charging'; this.log('battery', 'info', 'Docked · charging started'); this.say('Docked · charging'); }
          else if (this.queue.length) this.goTo(this.queue.shift(), true);
          else { this.log('driver', 'info', 'Arrived'); this.say('Arrived'); this.goal = ''; }
        }
      } else { this.h = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360; this.x += dx / d * 8; this.y += dy / d * 8; this.lastMove = Date.now(); moved = true; }
    } else if (this.holdDir) {
      const m = { f: [step, 0], b: [-step, 0], l: [0, -turn * 1.4], r: [0, turn * 1.4] }[this.holdDir];
      moved = this.move(m[0], m[1]);
    } else if (Math.abs(this.stk[0]) + Math.abs(this.stk[1]) > 0.12) {
      moved = this.move(-this.stk[1] * step, this.stk[0] * turn * 1.3);
    }
  }
  if (!LIVE) {
    if (this.st === 'charging') this.bat = Math.min(100, this.bat + 0.12);
    else if (this.online()) this.bat = Math.max(0, this.bat - (moved ? 0.05 : 0.002));
    if (this.n % 25 === 0 && this.online()) this.log('lidar', 'info', 'scan 10.0 Hz · 360 pts');
    if (this.n % 120 === 0) this.log('battery', 'info', 'Pack ' + (14.2 + this.bat * 0.0124).toFixed(2) + ' V · ' + Math.round(this.bat) + '%');
  }
  if (!LIVE && this.n % 40 === 0 && this.state.cmode !== 'off') { const s = this.state, d = s.set - s.cur; if (Math.abs(d) > 0.05) this.setState({ cur: +(s.cur + Math.sign(d) * 0.1).toFixed(1) }); }
  if (this.online()) this.mark();
  if (this.vm === 'listen' && this.state.listening && Date.now() - this.vt0 > 6500) this.vSend();
  const ae = typeof document !== 'undefined' && document.activeElement; if (ae && ae.tagName === 'INPUT' && ae.type !== 'range') return;
  this.forceUpdate();
}
mark() {
  let ch = false;
  for (let i = 0; i < 72; i++) {
    const a = i * 5 * Math.PI / 180, d = Math.min(this.ray(this.x, this.y, a), 260);
    for (let s = 0; s <= d; s += 10) {
      const cx = Math.floor((this.x + Math.sin(a) * s - 20) / 20), cy = Math.floor((this.y - Math.cos(a) * s - 20) / 20);
      if (cx >= 0 && cx < 28 && cy >= 0 && cy < 18 && !this.exp[cy * 28 + cx]) { this.exp[cy * 28 + cx] = 1; ch = true; }
    }
  }
  if (ch) { let p = ''; for (let i = 0; i < 504; i++) if (this.exp[i]) p += 'M' + (20 + (i % 28) * 20) + ' ' + (20 + Math.floor(i / 28) * 20) + 'h20v20h-20z'; this.expPath = p; }
}
loadLayout() {
  try {
    const raw = localStorage.getItem('stella-os-layout'); if (!raw) return;
    const d = JSON.parse(raw), p = {};
    if (d.lay && Array.isArray(d.lay.order)) { const all = ['map', 'control', 'shortcuts', 'flowmini', 'apps']; const ord = d.lay.order.filter(i => all.includes(i)); all.forEach(i => { if (!ord.includes(i)) ord.push(i); }); p.lay = { order: ord, size: Object.assign({}, this.state.lay.size, d.lay.size || {}), hidden: d.lay.hidden || {}, edit: false }; }
    if (Array.isArray(d.layouts) && d.layouts.length && d.layouts.every(l => l && l.id && l.lay && Array.isArray(l.lay.order))) {
      const act = d.layouts.find(l => l.id === d.layActive) || d.layouts[0], all = ['map', 'control', 'shortcuts', 'flowmini', 'apps'];
      const fix = l => { const ord = l.order.filter(i => all.includes(i)); all.forEach(i => { if (!ord.includes(i)) ord.push(i); }); return { order: ord, size: Object.assign({}, this.state.lay.size, l.size || {}), hidden: l.hidden || {}, edit: false }; };
      p.layouts = d.layouts.map(l => ({ id: l.id, n: String(l.n || 'Layout'), lay: fix(l.lay) })); p.layActive = act.id; p.lay = fix(act.lay);
    } else if (p.lay) p.layouts = [{ id: 'l1', n: 'Everyday', lay: p.lay }];
    if (typeof d.accent === 'string' && /^#[0-9a-f]{6}$/i.test(d.accent)) p.accent = d.accent;
    if (Array.isArray(d.shortcuts)) p.shortcuts = d.shortcuts;
    if (Object.keys(p).length) this.setState(p);
  } catch (x) {}
}
saveLayout(lay, shortcuts, extra) {
  const s = this.state, x = extra || {}, act = x.active || s.layActive, clean = Object.assign({}, lay, { edit: false });
  const layouts = x.layouts || (s.layouts || []).map(l => l.id === act ? Object.assign({}, l, { lay: clean }) : l);
  try { localStorage.setItem('stella-os-layout', JSON.stringify({ lay: clean, shortcuts, layouts, layActive: act, accent: 'accent' in x ? x.accent : s.accent })); } catch (e) {}
  return layouts;
}
setLay(fn) { const lay = fn(this.state.lay); const layouts = this.saveLayout(lay, this.state.shortcuts); this.setState({ lay, layouts }); }
runShortcut(sc) {
  const l = this.live();
  if (sc.k === 'dock') { this.say('Sending Stella to the dock'); return this.dockNow ? this.dockNow() : this.api('/control/dock', 'POST'); }
  if (sc.k === 'clean') { this.say('Starting a clean'); return this.api('/control/start', 'POST'); }
  if (sc.k === 'say') { this.say(sc.a || ''); if (l.speak) l.speak(sc.a || ''); return; }
  const cmd = sc.k === 'roku' ? { action: 'roku', app: sc.a } : sc.k === 'tv_play' ? { action: 'tv_play', app: sc.b || 'netflix', query: sc.a } : sc.k === 'tv_key' ? { action: 'tv_key', key: sc.a || 'Power' } : null;
  if (!cmd) return;
  this.log('voice', 'info', 'Shortcut “' + sc.n + '” → ' + cmd.action);
  this.say(sc.n); if (l.runCommand) l.runCommand(cmd);
}
flowVm(P, on, b) {
  const s = this.state, now = Date.now(), part = id => P.find(p => p.id === id) || { st: 'off', head: '—', m: [] };
  const rate = k => { const a = this.act[k] || []; while (a.length && now - a[0] > 60000) a.shift(); return a.length; };
  const recent = k => { const a = this.act[k] || []; return a.length && now - a[a.length - 1] < 6000; };
  const live = this.isLive(), net = s.internet;
  const tvOn = s.tvs.some(x => x.on);
  const N = {
    you: { n: 'Your phone', x: 90, y: 50, st: 'ok', h: live ? 'Linked to Stella' : 'Demo mode', m: [['Where', 'This browser'], ['Link', live ? 'Live (Tailscale)' : 'Demo']] },
    web: { n: 'Website', x: 250, y: 50, st: net ? 'ok' : 'off', h: net ? 'Vercel · online' : 'No internet', m: [['Role', 'Serves this page'], ['Host', 'Vercel · Next.js']] },
    claude: { n: 'Claude AI', x: 410, y: 50, st: b.id === 'claude' ? 'ok' : 'off', h: b.long, m: [['Used for', 'Hard questions'], ['Brain mode', s.brain]] },
    tvs: { n: 'Roku TVs', x: 590, y: 50, st: tvOn ? 'ok' : 'off', h: tvOn ? 'On · ' + (s.tvs.find(x => x.on) || {}).app : 'All off', m: s.tvs.map(x => [x.n, x.on ? x.app : 'off']) },
    api: { n: 'Web server', x: 90, y: 190, st: part('pi').st, h: part('pi').head, m: part('pi').m },
    router: { n: 'AI router', x: 250, y: 190, st: on ? (b.id === 'none' ? 'warn' : 'ok') : 'off', h: on ? b.short : 'Pi offline', m: [['Picks', 'One safe action'], ['Fallback', 'On-device'], ['Brain', b.long]] },
    voice: { n: 'Voice', x: 410, y: 190, st: this.vst ? (this.vst.alive ? 'ok' : 'warn') : part('audio').st, h: this.vst ? (this.vst.alive ? 'Mic ' + this.vst.state : 'Voice service not running') : part('audio').head, m: this.vst ? [['State', this.vst.state], ['Last heard', this.vst.heard || '—'], ['Wake words', 'Stella · Kalani bear']] : part('audio').m },
    roku: { n: 'Roku control', x: 590, y: 190, st: on ? 'ok' : 'off', h: on ? 'Ready' : 'Pi offline', m: [['Talks to', 'TVs on :8060'], ['Needs', 'Same Wi-Fi']] },
    camera: { n: 'Pi Camera', x: 90, y: 335, st: part('camera').st, h: part('camera').head, m: part('camera').m },
    lidar: { n: 'RPLIDAR C1', x: 250, y: 335, st: part('lidar').st, h: part('lidar').head, m: part('lidar').m },
    base: { n: 'Roomba 694', x: 410, y: 335, st: part('base').st, h: part('base').head, m: part('base').m },
    audio: { n: 'Mic + speaker', x: 590, y: 335, st: part('audio').st, h: part('audio').head, m: part('audio').m },
    battery: { n: 'Battery', x: 410, y: 430, st: part('battery').st, h: part('battery').head, m: part('battery').m }
  };
  const E = [['you', 'web', 'api', 'page'], ['web', 'claude', 'claude', 'chat'], ['you', 'api', 'api', 'live + commands'], ['claude', 'router', 'claude', 'asks Claude'], ['api', 'router', 'voice', 'text'], ['voice', 'router', 'voice', 'heard'], ['router', 'roku', 'tv', 'action'], ['roku', 'tvs', 'tv', 'ECP'], ['api', 'camera', 'camera', 'video'], ['lidar', 'api', 'lidar', 'scan'], ['router', 'base', 'driver', 'drive'], ['voice', 'audio', 'voice', 'sound'], ['battery', 'base', 'battery', 'power']];
  const SC = { ok: 'var(--ok)', warn: 'var(--warn)', off: 'var(--bad)' };
  const nodes = Object.keys(N).map(id => { const n = N[id]; return { id, n: n.n, x: n.x - 62, y: n.y - 26, cx: n.x, cy: n.y, col: SC[n.st], sub: String(n.h).slice(0, 20), sel: s.flowSel === id, pick: () => this.setState({ flowSel: id }) }; });
  const edges = E.map((e, i) => {
    const a = N[e[0]], c = N[e[1]], dx = c.x - a.x, dy = c.y - a.y, L = Math.hypot(dx, dy) || 1;
    const ux = dx / L, uy = dy / L, ex = Math.abs(ux) > Math.abs(uy) ? 62 : 0, ey = Math.abs(ux) > Math.abs(uy) ? 0 : 26;
    const x1 = a.x + Math.sign(dx) * (ex || 0) + (ex ? 0 : ux * 0), y1 = a.y + Math.sign(dy) * (ey || 0);
    const x2 = c.x - Math.sign(dx) * (ex || 0), y2 = c.y - Math.sign(dy) * (ey || 0);
    const bad = a.st === 'off' || c.st === 'off', act = !bad && recent(e[2]), cnt = rate(e[2]);
    return { k: i, x1, y1, x2, y2, mx: (x1 + x2) / 2, my: (y1 + y2) / 2 - 4, col: bad ? 'var(--bad)' : act ? 'var(--acc)' : 'var(--mute)', w: act ? 2.6 : 1.4, dash: bad ? '2 5' : act ? '7 6' : '3 6', cls: act ? 'fl-go' : '', op: bad ? .7 : act ? 1 : .5, lab: act || cnt ? (cnt + '/min') : '', tip: e[3] };
  });
  const sel = N[s.flowSel] || N.api;
  const feed = this.logs.slice(0, 8).map(l => ({ t: l.t, svc: l.src, m: l.m, col: l.lv === 'warn' ? 'var(--warn)' : l.lv === 'err' ? 'var(--bad)' : 'var(--fg)' }));
  const okN = Object.keys(N).filter(k => N[k].st === 'ok').length;
  return { nodes, edges, sel: { n: sel.n, h: sel.h, col: SC[sel.st], m: sel.m.map(r => ({ k: r[0], v: r[1] })) }, feed, summary: okN + ' of ' + Object.keys(N).length + ' parts healthy', live };
}

brain() {
  const s = this.state;
  if (s.brain === 'local') return { id: 'local', short: 'On-device', long: 'On-device · offline', dot: '#3ecf8e' };
  if (!s.internet) return s.brain === 'claude' ? { id: 'none', short: 'No internet', long: 'Claude unreachable', dot: '#ff4d3a' } : { id: 'local', short: 'On-device', long: 'On-device · offline fallback', dot: '#3ecf8e' };
  return { id: 'claude', short: 'Claude', long: 'Claude · cloud', dot: '#a78bfa' };
}
hold(d) { this.holdDir = d; this.tick(); }
stickMove(e) {
  const r = this.stickRect; if (!r) return;
  let dx = (e.clientX - (r.left + r.width / 2)) / (r.width * 0.34), dy = (e.clientY - (r.top + r.height / 2)) / (r.width * 0.34);
  const m = Math.hypot(dx, dy); if (m > 1) { dx /= m; dy /= m; }
  this.stk = [dx, dy]; this.forceUpdate();
}
clean() {
  if (this.isLive()) {
    // Check what she is really doing first (the Pi reports charging / offline-asleep / moving).
    if (this.live().robotOnline === false || this.st === 'offline') return this.say('Stella is asleep or offline. Tap Wake.');
    if (this.st === 'charging') return this.say('She’s on the dock charging. Tap Wake, then drive her.');
    const ids = this.R.filter(r => !this.skip[r.id]).map(r => r.id); if (!ids.length) return this.say('All rooms are skipped');
    // Ask the Pi first. Until the lidar map + navigation exist it says no, and we must NOT spin the vacuum for nothing.
    this.api('/control/start', 'POST').then(r => {
      if (r && r.success !== false && !r.__err) {
        this.setState({ tools: { v: true, m: true, s: true } }); this.live().setCleaningMotors(true, true, true);
        this.log('driver', 'info', 'Clean requested · tools on'); this.live().cleanMode('all'); this.say('Cleaning');
      } else {
        this.log('driver', 'info', 'Clean pressed · auto-clean needs the lidar map first');
        this.say('Auto-clean needs the lidar map first. Drive her with the stick, or switch the vacuum on yourself.');
      }
    });
    return;
  }
  if (!this.online()) return this.say('Stella is offline. Tap Wake Stella.');
  if (this.st === 'charging') return this.say('Docked in charging mode. Tap Wake Stella first.');
  const ids = this.R.filter(r => !this.skip[r.id]).map(r => r.id); if (!ids.length) return this.say('All rooms are skipped'); const first = ids.shift(); this.queue = ids;
  this.setState({ tools: { v: true, m: true, s: true } });
  this.log('driver', 'info', 'Clean started · all rooms'); this.say('Cleaning all rooms'); this.goTo(first, true);
}
wake() {
  if (this.isLive()) { this.log('driver', 'warn', 'Waking Stella…'); this.say('Waking Stella…'); this.live().wakeRobot(); return; }
  if (this.st === 'charging') { this.st = 'idle'; this.log('driver', 'info', 'Driver restarted · Full mode (cliff stops off)'); this.say('Awake · ready to drive'); return; }
  this.log('driver', 'warn', 'Reconnecting to the Roomba…'); this.say('Reconnecting…');
  setTimeout(() => { this.st = 'idle'; this.log('driver', 'info', 'Roomba answered · odom 10 Hz'); this.forceUpdate(); }, 1200);
}
setTool(k) {
  const t = Object.assign({}, this.state.tools); t[k] = !t[k]; this.setState({ tools: t });
  if (this.isLive()) this.live().setCleaningMotors(!!t.v, !!t.m, !!t.s);
  this.log('driver', 'info', { v: 'Vacuum', m: 'Main brush', s: 'Side brush' }[k] + (t[k] ? ' on' : ' off'));
}
liveLidarCols() {
  const d = this.lidar; if (!this.isLive() || !d || Date.now() - (this.lidarAt || 0) > 3000) return null;
  const out = [{ x: 0, y: 0, w: 640, h: 360, f: '#07090d', o: 1 }], S = 45;      // 45 px per metre, robot in the middle
  for (const m of [1, 2, 3]) out.push({ x: 320 - m * S, y: 180 - 0.5, w: m * S * 2, h: 1, f: '#ffffff', o: 0.08 }, { x: 320 - 0.5, y: 180 - m * S, w: 1, h: m * S * 2, f: '#ffffff', o: 0.08 });
  d.r.forEach((m, i) => {
    if (!m) return; const a = d.angle_min + i * d.angle_inc;
    const x = 320 - m * Math.sin(a) * S, y = 180 - m * Math.cos(a) * S;
    if (x < 0 || x > 640 || y < 0 || y > 360) return;
    out.push({ x: x - 1.6, y: y - 1.6, w: 3.2, h: 3.2, f: '#3ecf8e', o: 0.95 });
  });
  out.push({ x: 314, y: 174, w: 12, h: 12, f: '#ffffff', o: 1 });
  return out;
}
camSet(z, x, y) {
  // zoom 1x-5x; pan is a percent of the frame and can't go past the picture edge
  z = Math.min(5, Math.max(1, z)); const mx = (z - 1) / 2 * 100;
  this.setState({ camZoom: z, camPx: z <= 1 ? 0 : Math.max(-mx, Math.min(mx, x)), camPy: z <= 1 ? 0 : Math.max(-mx, Math.min(mx, y)) });
}
camPtr(kind, e) {
  // one finger/mouse drags the picture (when zoomed in), two fingers pinch to zoom
  const P = this.cptr || (this.cptr = new Map()), st = this.state;
  const base = () => { const f = P.values().next().value; this.cg = { z: st.camZoom || 1, px: st.camPx || 0, py: st.camPy || 0, x: f ? f.x : 0, y: f ? f.y : 0, d: this.camDist(P) }; };
  if (kind === 'down') {
    e.stopPropagation(); try { e.currentTarget.setPointerCapture(e.pointerId); } catch (x) {}
    P.set(e.pointerId, { x: e.clientX, y: e.clientY }); base(); return;
  }
  if (!P.has(e.pointerId)) return;
  if (kind === 'up') { P.delete(e.pointerId); if (P.size) base(); else this.cg = null; return; }
  P.set(e.pointerId, { x: e.clientX, y: e.clientY });
  const r = e.currentTarget.getBoundingClientRect(), g = this.cg; if (!g || !r.width) return;
  if (P.size >= 2 && g.d > 0) this.camSet(g.z * this.camDist(P) / g.d, g.px, g.py);
  else if (P.size === 1 && g.z > 1) this.camSet(g.z, g.px + (e.clientX - g.x) / r.width * 100, g.py + (e.clientY - g.y) / r.height * 100);
}
camDist(P) { const v = Array.from(P.values()); return v.length >= 2 ? Math.hypot(v[0].x - v[1].x, v[0].y - v[1].y) : 0; }
fpvCols() {
  const N = 80, FOV = 100, out = []; let near = 999;
  for (let i = 0; i < N; i++) {
    const rel = (i / (N - 1) - 0.5) * FOV, d = this.ray(this.x, this.y, (this.h + this.look + rel) * Math.PI / 180), dp = Math.max(8, d * Math.cos(rel * Math.PI / 180));
    if (Math.abs(rel) < 12) near = Math.min(near, d);
    const hh = Math.min(350, Math.max(6, 16000 / dp)), q = Math.min(d / 300, 1);
    out.push({ x: i * 8, y: 180 - hh / 2, w: 8.4, h: hh, f: 'hsl(' + Math.round(18 + q * 190) + ' 92% ' + Math.round(60 - q * 8) + '%)', o: +(0.95 - q * 0.65).toFixed(2) });
  }
  this.near = near; return out;
}
compass() { const a = ((this.h + this.look) % 360 + 360) % 360; return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(a / 45) % 8]; }
clock() { const d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
vBegin() {
  const s = this.state; if (s.thinking || s.listening) return; this.vm = 'listen'; this.vt0 = Date.now(); this.srText = ''; this.useSR = false;
  const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  if (SR) {
    try {
      const r = new SR(); r.lang = 'en-US'; r.interimResults = true; r.continuous = false;
      r.onresult = e => { let t = ''; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; this.srText = t; if (e.results[e.results.length - 1].isFinal) this.vSend(); };
      r.onerror = () => { this.rec = null; };
      r.onend = () => { this.rec = null; };
      r.start(); this.rec = r; this.useSR = true;
    } catch (x) { this.useSR = false; }
  }
  this.setState({ listening: true, heard: '', reply: '' });
}
vSend() {
  const s = this.state; if (!s.listening) return;
  try { this.rec && this.rec.abort(); } catch (x) {} this.rec = null;
  if (this.useSR) {
    const t = (this.srText || '').trim();
    if (!t) { this.vm = 'idle'; this.setState({ listening: false }); this.say('Didn’t catch that'); return; }
    this.voiceRun(t); return;
  }
  const ph = this.PH[s.vi % this.PH.length]; this.setState({ vi: s.vi + 1 }); this.voiceRun(ph);
}
renderVals() {
  const s = this.state, ds = this.displayState(), here = this.roomAt(this.x, this.y), cfg = s.cfg, signed = this.isLive();
  const STC = { idle: '#3ecf8e', moving: '#3ecf8e', charging: '#ffd23f', low: '#ff7a1a', fault: '#ff4d3a', offline: '#8d8d94' };
  const LBL = { idle: 'Idle', moving: 'Moving', charging: 'Charging', low: 'Battery low', fault: 'Stopped', offline: 'Offline' };
  const wk = this.st === 'charging' || this.st === 'offline' || this.st === 'fault';
  const on = this.online(), bat = Math.round(this.bat), R = this.R, spd = Math.min(s.speed, cfg.maxSpd), act = this.route.length > 0 || (this.isLive() && (this.live().mode === 'cleaning' || this.live().mode === 'returning'));
  let poly = '', hits = '', wedge = '';
  for (let i = 0; i < 90; i++) {
    const a = i * 4 * Math.PI / 180, d = Math.min(this.ray(this.x, this.y, a), 260), px = (this.x + Math.sin(a) * d).toFixed(1), py = (this.y - Math.cos(a) * d).toFixed(1);
    poly += (i ? 'L' : 'M') + px + ' ' + py;
    if (d < 260) hits += 'M' + px + ' ' + py + 'h.1';
  }
  poly += 'Z';
  wedge = 'M' + this.x.toFixed(1) + ' ' + this.y.toFixed(1);
  for (let a = this.sw - 34; a <= this.sw; a += 6) { const r = a * Math.PI / 180, d = Math.min(this.ray(this.x, this.y, r), 260); wedge += 'L' + (this.x + Math.sin(r) * d).toFixed(1) + ' ' + (this.y - Math.cos(r) * d).toFixed(1); }
  wedge += 'Z';
  const bc = !on ? 'var(--mute)' : this.st === 'charging' ? '#ffd23f' : bat < 20 ? '#ff7a1a' : '#3ecf8e';
  const lay = [['scan', 'LiDAR scan', 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM12 12l6.5-4'], ['explored', 'Explored area', 'M4 4h16v16H4zM9.3 4v16M14.7 4v16M4 9.3h16M4 14.7h16'], ['labels', 'Room names', 'M3 12l9-9h8v8l-9 9zM16 7.5h.01']];
  const need = (s.app === 'home' && (s.camOn || s.ctrl === 'camera')) || s.app === 'camera' || s.fpv;
  const mag = this.holdDir ? spd : Math.round(Math.min(1, Math.hypot(this.stk[0], this.stk[1])) * spd);
  const mapApp = s.app === 'map', selId = mapApp ? s.selRoom : here.id;
  const spdSegs = []; for (let i = 0; i < 10; i++) { const v = (i + 1) * 10; spdSegs.push({ label: v + '%', pick: () => this.setState({ speed: Math.min(v, cfg.maxSpd) }), style: 'flex:1;border-radius:4px;border:1px solid var(--line);height:' + (30 + i * 7) + '%;background:' + (v <= spd ? 'var(--acc)' : 'var(--soft)') + ';opacity:' + (v > cfg.maxSpd ? 0.35 : 1) }); }
  const goalName = this.goal === 'dock' ? 'the dock' : (R.find(r => r.id === this.goal) || { n: '' }).n;
  const zd = this.zd ? { x: Math.min(this.zd.x0, this.zd.x1), y: Math.min(this.zd.y0, this.zd.y1), w: Math.abs(this.zd.x1 - this.zd.x0), h: Math.abs(this.zd.y1 - this.zd.y0) } : { x: 0, y: 0, w: 0, h: 0 };
  const o = {
    rot: 'rotate(0 300 200)', dockR: { x: this.DK[0] - 12, y: this.DK[1] - 14, w: 8, h: 28 },
    themeClass: s.theme === 'light' ? 'light' : '', color: STC[ds],
    sub: this.goal && ds === 'moving' ? (this.goal === 'dock' ? 'Docking' : 'Going to ' + goalName) : ds === 'moving' ? 'Moving' : !on ? 'Asleep or offline' : this.st === 'charging' ? (bat >= 100 ? 'Fully charged' : 'Charging') : bat < 20 ? 'Low battery' : 'Not charging', hasSub: true,
    room: on ? here.n : '—', batt: on ? bat + '%' : '—', battStyle: 'color:' + bc + ';border-color:' + bc, battFill: Math.max(1, Math.round(bat / 100 * 10)), offline: !on,
    linkDot: !signed ? '#ffd23f' : on ? '#3ecf8e' : '#8d8d94', linkLabel: !signed ? 'Demo' : on ? 'King' : 'Offline',
    toggleSigned: () => { if (this.isLive()) { this.say('Signed in as King'); return; } this.setState({ signed: !s.signed }); this.say(s.signed ? 'Signed out · demo robot' : 'Signed in as King'); },
    openVoice: () => this.openTalk(),
    goHome: () => this.setState({ app: 'home' }), openMap: () => this.setState({ app: 'map' }), openCam: () => this.setState({ app: 'camera' }),
    isHome: s.app === 'home', notHome: s.app !== 'home',
    rooms: R.map(r => ({ floor: r.floor === 'wood' ? 'url(#wood)' : 'url(#carpet)', x: r.x, y: r.y, w: r.w, h: r.h, lx: r.lx, ly: r.ly, up: r.n.toUpperCase(), lop: mapApp ? 1 : (s.layers.labels && r.id !== here.id ? 1 : 0), fill: r.id === selId ? 'var(--soft)' : this.skip[r.id] && mapApp ? 'rgba(141,141,148,.12)' : 'transparent', stroke: mapApp && r.id === s.selRoom ? 'var(--acc)' : 'transparent', pick: mapApp ? () => this.setState({ selRoom: r.id }) : () => this.goTo(r.id) })),
    zones: s.zones.map(z => ({ x: z.x, y: z.y, w: z.w, h: z.h, n: z.n, tx: z.x + 4, ty: z.y + 13 })), zd,
    expPath: this.expPath, expOp: s.layers.explored ? (on ? 0.2 : 0.1) : 0,
    furn: this.FURN,
    scanPoly: poly, scanOp: s.layers.scan && on ? 0.13 : 0, wedge, wedgeOp: s.layers.scan && on ? 0.3 : 0, hits, hitOp: s.layers.scan && on ? 0.9 : 0,
    walls: this.W.map(w => 'M' + w[0] + ' ' + w[1] + 'L' + w[2] + ' ' + w[3]).join(''),
    robotT: 'translate(' + this.x.toFixed(1) + 'px,' + this.y.toFixed(1) + 'px) rotate(' + this.h.toFixed(0) + 'deg)',
    layers: lay.map(l => ({ label: l[1], icon: l[2], on: !!s.layers[l[0]], cls: s.layers[l[0]] ? 'on' : '', pick: () => this.setState({ layers: Object.assign({}, s.layers, { [l[0]]: !s.layers[l[0]] }) }) })),
    canWake: this.st === 'charging' || this.st === 'offline' || this.st === 'fault', wake: () => this.wake(),
    goIsStop: act, goIsGo: !act && !wk, showDock: this.st !== 'charging', goLabel: wk ? 'Wake' : act ? 'Stop' : 'Clean', goCls: wk ? 'inv' : act ? 'dng' : 'pri', goTog: () => wk ? this.wake() : act ? this.stopAll(false) : this.clean(),
    stop: () => this.stopAll(false), dock: () => { this.goTo('dock'); },
    ctrlTabs: [['console', 'Console'], ['camera', 'Camera']].map(c => ({ label: c[1], cls: s.ctrl === c[0] ? 'on' : '', pick: () => this.setState({ ctrl: c[0] }) })),
    ctrlConsole: s.ctrl !== 'camera', ctrlCam: s.ctrl === 'camera',
    stickCls: s.pad === 'stick' ? 'on' : '', padCls: s.pad === 'pad' ? 'on' : '', setStick: () => this.setState({ pad: 'stick' }), setPad: () => this.setState({ pad: 'pad' }),
    padStick: s.pad === 'stick', padBtns: s.pad === 'pad',
    sd: e => { try { this.stickRect = e.currentTarget.getBoundingClientRect(); this.stickOn = true; e.currentTarget.setPointerCapture(e.pointerId); this.stickMove(e); } catch (x) {} },
    sm: e => { if (this.stickOn) this.stickMove(e); }, su: () => { this.stickOn = false; this.stk = [0, 0]; this.forceUpdate(); },
    knobT: 'translate(' + (this.stk[0] * 106).toFixed(0) + '%,' + (this.stk[1] * 106).toFixed(0) + '%)',
    miniT: 'translate(75 75) rotate(' + (-(this.h + this.look)).toFixed(1) + ') scale(0.38) translate(' + (-this.x).toFixed(1) + ' ' + (-this.y).toFixed(1) + ')', headDir: this.compass(),
    viewDeg: Math.round(((this.h + this.look) % 360 + 360) % 360),
    mainStyle: s.app === 'home' ? 'max-width:1240px;margin:0 auto;padding:68px 12px 40px;display:flex;flex-direction:column;gap:14px' : 'position:fixed;inset:0;z-index:30;overflow:auto;background:var(--bg);display:flex;flex-direction:column;gap:12px;padding:68px ' + (s.app === 'logs' ? '12px' : 'max(12px,calc((100% - 1240px)/2))') + ' 12px',
    hf: () => this.hold('f'), hb: () => this.hold('b'), hl: () => this.hold('l'), hr: () => this.hold('r'), hu: () => { this.holdDir = ''; },
    driveRead: mag > 0 ? 'Driving at ' + mag + '%' : on ? 'Hold to drive' : 'Offline',
    fp: need ? (this.liveLidarCols() || this.fpvCols()) : [], openFpv: () => this.setState({ fpv: true }),
    lookDown: e => { if (e.target && e.target.closest && e.target.closest('button')) return; this.lk = { x: e.clientX, l: this.look }; try { e.currentTarget.setPointerCapture(e.pointerId); } catch (x) {} },
    lookMove: e => { if (!this.lk) return; const l = this.lk.l - (e.clientX - this.lk.x) * 0.4; this.look = ((l + 540) % 360) - 180; this.forceUpdate(); },
    lookUp: () => { this.lk = null; }, lookCenter: () => { this.look = 0; this.forceUpdate(); }, lookOff: Math.abs(this.look) > 2,
    speed: spd, spdSegs,
    tools: [['v', 'Vacuum'], ['m', 'Main brush'], ['s', 'Side brush']].map(t => ({ n: t[1], on: s.tools[t[0]], dot: s.tools[t[0]] ? 'var(--ok)' : 'var(--mute)', style: s.tools[t[0]] ? 'border-color:var(--ok)' : '', pick: () => this.setTool(t[0]) })),
    toast: s.toast
  };
  const L = s.lay, SZ = { S: 'span 4', M: 'span 4', L: 'span 8', F: 'span 12' }, NAME = { map: 'Map', control: 'Controls', shortcuts: 'My shortcuts', flowmini: 'Live status', apps: 'Apps' };
  const vis = L.order.filter(i => !L.hidden[i]);
  o.hw = (L.edit ? L.order : vis).map((id, i, arr) => ({ id, name: NAME[id], hid: !!L.hidden[id], span: SZ[L.size[id] || 'M'], size: L.size[id] || 'M',
    first: i === 0, last: i === arr.length - 1,
    up: () => this.setLay(l => { const o = l.order.slice(), k = o.indexOf(id); if (k > 0) { o.splice(k, 1); o.splice(k - 1, 0, id); } return Object.assign({}, l, { order: o }); }),
    down: () => this.setLay(l => { const o = l.order.slice(), k = o.indexOf(id); if (k < o.length - 1) { o.splice(k, 1); o.splice(k + 1, 0, id); } return Object.assign({}, l, { order: o }); }),
    sizes: ['M', 'L', 'F'].map(z => ({ z, label: z === 'M' ? '1/3' : z === 'L' ? '2/3' : 'Full', on: (L.size[id] || 'M') === z, pick: () => this.setLay(l => Object.assign({}, l, { size: Object.assign({}, l.size, { [id]: z }) })) })),
    toggleHide: () => this.setLay(l => Object.assign({}, l, { hidden: Object.assign({}, l.hidden, { [id]: !l.hidden[id] }) })) }));
  o.lay = { edit: L.edit, toggle: () => this.setState({ lay: Object.assign({}, L, { edit: !L.edit }), scNew: false }), reset: () => { const lay = { order: ['map', 'control', 'shortcuts', 'flowmini', 'apps'], size: { map: 'L', control: 'M', shortcuts: 'M', flowmini: 'M', apps: 'F' }, hidden: {}, edit: true }; this.setState({ lay }); this.saveLayout(lay, s.shortcuts); this.say('Layout reset'); } };
  o.greet = (() => { const h = new Date().getHours(); return (h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening') + ', King Sharif.'; })();
  o.greetSub = on ? ('Stella is ' + (this.st === 'charging' ? 'docked and charging' : this.displayState() === 'moving' ? 'out cleaning' : 'idle') + ' · ' + Math.round(this.bat) + '%') : 'Stella is offline';
  o.sc = { list: s.shortcuts.map(c => ({ n: c.n, sub: c.k === 'roku' ? 'Open ' + c.a : c.k === 'tv_play' ? 'Play ' + c.a + ' on ' + (c.b || 'netflix') : c.k === 'dock' ? 'Send to dock' : c.k === 'clean' ? 'Start cleaning' : c.k === 'say' ? 'Say it' : 'TV ' + (c.a || 'Power'), run: () => this.runShortcut(c), del: () => { const sh = s.shortcuts.filter(x => x.id !== c.id); this.setState({ shortcuts: sh }); this.saveLayout(L, sh); } })),
    edit: L.edit, adding: s.scNew, openNew: () => this.setState({ scNew: true }), cancel: () => this.setState({ scNew: false }), name: s.scName, a: s.scA, b: s.scB, kind: s.scKind,
    setName: e => this.setState({ scName: e.target.value }), setA: e => this.setState({ scA: e.target.value }), setB: e => this.setState({ scB: e.target.value }),
    needA: ['roku', 'tv_play', 'say', 'tv_key'].includes(s.scKind), needB: s.scKind === 'tv_play',
    aHint: s.scKind === 'roku' ? 'App, e.g. netflix' : s.scKind === 'tv_play' ? 'Title, e.g. The Sandman' : s.scKind === 'say' ? 'What Stella says' : 'Key, e.g. Power',
    kinds: [['roku', 'Open app'], ['tv_play', 'Play title'], ['tv_key', 'TV key'], ['say', 'Say'], ['clean', 'Clean'], ['dock', 'Dock']].map(k => ({ label: k[1], cls: s.scKind === k[0] ? 'on' : '', pick: () => this.setState({ scKind: k[0] }) })),
    save: () => { if (!s.scName.trim()) { this.say('Give it a name'); return; } const sh = s.shortcuts.concat([{ id: 'sc' + Date.now(), n: s.scName.trim(), k: s.scKind, a: s.scA.trim(), b: s.scB.trim() }]); this.setState({ shortcuts: sh, scNew: false, scName: '', scA: '', scB: '' }); this.saveLayout(L, sh); this.say('Shortcut added'); } };
  o.mini = this.parts().map(p => ({ n: p.n, col: p.st === 'ok' ? 'var(--ok)' : p.st === 'warn' ? 'var(--warn)' : 'var(--bad)', head: p.head })).slice(0, 6);

  { const cur = s.layouts || [], keep = (extra) => this.saveLayout(s.lay, s.shortcuts, extra);
    const sw = id => { const layouts = keep(); const tg = layouts.find(l => l.id === id); if (!tg) return; this.setState({ layouts, layActive: id, lay: Object.assign({}, tg.lay, { edit: s.lay.edit }) }); this.saveLayout(tg.lay, s.shortcuts, { layouts, active: id }); };
    o.lays = { list: cur.map(l => ({ n: l.n, on: l.id === s.layActive, pick: () => sw(l.id) })), edit: s.lay.edit, name: s.lnName, setName: e => this.setState({ lnName: e.target.value }), canDel: cur.length > 1,
      add: () => { const layouts = keep(); const id = 'l' + Date.now(), n = s.lnName.trim() || ('Layout ' + (layouts.length + 1)); const nl = layouts.concat([{ id, n, lay: Object.assign({}, s.lay, { edit: false }) }]); this.setState({ layouts: nl, layActive: id, lnName: '' }); this.saveLayout(s.lay, s.shortcuts, { layouts: nl, active: id }); this.say('Saved “' + n + '”'); },
      del: () => { const layouts = cur.filter(l => l.id !== s.layActive); if (!layouts.length) return; const tg = layouts[0]; this.setState({ layouts, layActive: tg.id, lay: Object.assign({}, tg.lay, { edit: true }) }); this.saveLayout(tg.lay, s.shortcuts, { layouts, active: tg.id }); this.say('Layout deleted'); },
      accents: [['Orange', ''], ['Mint', '#3ecf8e'], ['Blue', '#6aa2ff'], ['Violet', '#a78bfa'], ['Pink', '#ff6fae']].map(a => ({ name: a[0], c: a[1] || '#ff5a1f', on: s.accent === a[1], pick: () => { this.setState({ accent: a[1] }); keep({ accent: a[1] }); } })) };
    o.accentStyle = s.accent ? ';--acc:' + s.accent : ''; }

  { const VS = this.vst, LG = (this.vlog || []), live = this.isLive();
    const LBL = { listening: 'Listening', heard: 'Heard you', thinking: 'Thinking', speaking: 'Speaking', off: 'Voice is off' };
    const COL = { listening: 'var(--ok)', heard: 'var(--acc)', thinking: '#a78bfa', speaking: 'var(--acc)', off: 'var(--bad)' };
    const st = VS ? (VS.alive ? VS.state : 'off') : '';
    o.voiceLog = { live, has: !!VS, state: LBL[st] || '—', col: COL[st] || 'var(--mute)', heard: VS ? VS.heard : '', empty: live && LG.length === 0,
      note: live ? 'Newest first. Heard is what the mic caught. Brain shows who decided: Claude or the Pi on its own.' : 'Connect to Stella to see what she heard.',
      rows: LG.slice(0, 10).map(r => ({ t: String(r.t || '').slice(11, 19), heard: r.heard || '—', intent: r.intent || '—', brain: r.brain === 'claude' ? 'Claude' : 'On-device', ok: r.ok !== false, res: r.message || r.say || '', col: r.ok === false ? 'var(--bad)' : 'var(--fg)' })) }; }
  o.openFlow = () => this.setState({ app: 'flow' });
  const TIT = { flow: 'Live flow', camera: 'Camera', map: 'Map', parts: 'Parts', logs: 'Logs', tv: 'TV', climate: 'Climate', settings: 'Settings' };
  o.appTitle = TIT[s.app] || '';
  Object.assign(o, this.rvApps(o, ds, on, here));
  return o;
}
parts() {
  const on = this.online(), s = this.state, chg = this.st === 'charging', mv = this.displayState() === 'moving', bat = Math.round(this.bat);
  const k = Math.min(s.speed, s.cfg.maxSpd) / 100, SUC = { eco: 1.4, normal: 2.2, turbo: 3.1 };
  return [
    { id: 'pi', n: 'Raspberry Pi 4', st: on ? 'ok' : 'off', src: 'api', head: on ? 'Online · the brain' : 'Not reachable', m: [['OS', 'Ubuntu 24.04'], ['ROS 2', 'Jazzy'], ['CPU temp', on ? '52 °C' : '—'], ['Throttled', on ? '0x0 (power OK)' : '—'], ['API', on ? 'WS /live · 0.5 s' : 'down']] },
    { id: 'lidar', n: 'RPLIDAR C1', st: on ? 'warn' : 'off', src: 'lidar', head: on ? 'Scanning · not mounted yet' : 'Offline', m: [['Rate', on ? '10 Hz' : '—'], ['Points', on ? '360 / scan' : '—'], ['Range', '12 m'], ['Adapter', 'Red CP2102 · 460800'], ['Mount', 'Pending']] },
    (() => {
      const c = this.camSt;
      if (on && c && c.ok) return { id: 'camera', n: 'Pi Camera', st: 'ok', src: 'camera', head: c.streaming ? 'Live · ' + (c.fps || 0) + ' fps' : 'Detected · ready', m: [['Program', c.tool || '—'], ['Size', c.size || '—'], ['Stream', '/camera/stream'], ['Runs', 'only while you watch']] };
      return { id: 'camera', n: 'Pi Camera', st: 'off', src: 'camera', head: on && c ? 'Not working' : 'Not detected', m: [['Program', (c && c.tool) || '—'], ['Problem', (c && c.error) || (on ? 'No camera answered' : 'Pi offline')], ['Check', 'Ribbon + camera_check.sh'], ['Fallback', 'LiDAR view']] };
    })(),
    { id: 'base', n: 'Roomba 694 base', st: this.st === 'fault' ? 'off' : on ? 'ok' : 'off', src: 'driver', head: on ? 'Full mode · 115200 baud' : 'No answer', m: [['Mode', chg ? 'Passive (charging)' : on ? 'Full' : '—'], ['Cliff stops', on ? 'OFF in Full mode' : '—'], ['Bumper L / R', on ? '0 / 0' : '—'], ['Link', '/dev/stella-roomba']] },
    { id: 'battery', n: 'Battery', st: !on ? 'off' : bat < 20 && !chg ? 'warn' : 'ok', src: 'battery', head: on ? bat + '% · ' + (chg ? 'charging' : 'discharging') : 'No reading', m: [['Voltage', on ? (14.2 + this.bat * 0.0124).toFixed(2) + ' V' : '—'], ['Current', on ? (chg ? '+1.18 A' : mv ? '−0.84 A' : '−0.31 A') : '—'], ['Pack', 'Li-ion 14.4 V']] },
    { id: 'vacuum', n: 'Vacuum', st: on ? 'ok' : 'off', src: 'driver', head: s.tools.v ? 'Running · ' + s.suction : 'Off', m: [['Suction', SUC[s.suction] + ' kPa'], ['Mode', s.suction], ['Motor', s.tools.v ? 'on' : 'off']] },
    { id: 'main', n: 'Main brush', st: on ? 'ok' : 'off', src: 'driver', head: s.tools.m ? 'Spinning' : 'Off', m: [['Motor', s.tools.m ? 'on' : 'off'], ['Current', s.tools.m ? '0.31 A' : '0 A']] },
    { id: 'side', n: 'Side brush', st: on ? 'ok' : 'off', src: 'driver', head: s.tools.s ? 'Spinning' : 'Off', m: [['Motor', s.tools.s ? 'on' : 'off'], ['Current', s.tools.s ? '0.12 A' : '0 A']] },
    { id: 'wheels', n: 'Wheels', st: on ? 'ok' : 'off', src: 'driver', head: mv ? 'Driving' : 'Stopped', m: [['Limit', '0.30 m/s · 1.5 rad/s'], ['Now', mv ? (0.3 * k).toFixed(2) + ' m/s' : '0.00 m/s'], ['Encoders', 'Single-channel']] },
    { id: 'adapters', n: 'USB-TTL ×2', st: on ? 'ok' : 'off', src: 'driver', head: 'Two red CP2102 boards', m: [['Roomba', '/dev/stella-roomba · 115200'], ['LiDAR', '/dev/stella-lidar · 460800'], ['Named by', 'Pi USB port 1.1 / 1.3']] },
    { id: 'power', n: 'Buck + cutoff', st: 'warn', src: 'battery', head: 'Not wired to the Roomba yet', m: [['Buck', 'DROK 5 A · set 5.1 V'], ['Cutoff', 'XH-M609'], ['Pi power now', 'Wall USB-C']] },
    { id: 'audio', n: 'Speaker + mic', st: on ? 'ok' : 'off', src: 'voice', head: 'Offline voice · always listening', m: [['Speaker', 'ASHATA 3.5 mm · PCM 85%'], ['Mic', 'JOUNIVO USB · gain ×5'], ['Hears', 'Vosk (offline)'], ['Speaks', 'Piper (offline)']] },
    { id: 'deck', n: 'Acrylic deck', st: 'ok', src: 'system', head: 'Carries the Pi, LiDAR and boards', m: [['Plate', '10 in clear acrylic'], ['Standoffs', '35 mm × 4']] }
  ];
}
voiceRun(text) {
  const b = this.brain(), ms = b.id === 'claude' ? 700 + Math.round(Math.random() * 400) : b.id === 'local' ? 1800 + Math.round(Math.random() * 700) : 400;
  const t = text.toLowerCase(), heard = this.vt0 ? (Date.now() - this.vt0) / 1000 : 1.2; this.vt0 = 0;
  this.vm = 'think'; this.setState({ heard: text, reply: '', thinking: true, listening: false });
  this.log('voice', 'info', 'STT|"' + text + '" · ' + heard.toFixed(1) + ' s of audio');
  this.log('voice', 'info', 'BRAIN|' + b.long + ' · thinking');
  const finish = (r, il, took, brainObj) => {
    const dur = Math.max(1400, r.length * 48);
    this.vm = 'speak'; this.spk = { t0: Date.now(), dur };
    this.log('voice', 'info', 'INTENT|' + (brainObj.id === 'none' ? 'unavailable (no internet)' : il));
    this.log('voice', 'info', 'REPLY|' + brainObj.short + ' · ' + (took / 1000).toFixed(1) + ' s · ' + r.split(' ').length + ' words');
    this.log('voice', 'info', 'TTS|speaking for ' + (dur / 1000).toFixed(1) + ' s');
    if (this.state.cfg.spoken && brainObj.id !== 'none' && this.live().speak) { try { this.live().speak(r); } catch (x) {} }
    this.setState({ thinking: false, reply: r, vsrc: brainObj.id, vms: took, turns: this.state.turns.concat({ heard: text, reply: r, src: brainObj.id, ms: took, il }).slice(-4) });
    clearTimeout(this.vt1); this.vt1 = setTimeout(() => { this.vm = 'idle'; this.forceUpdate(); }, dur);
  };
  const local = (bo, took) => { const il = this.intentLabel(t), r = this.intent(t, bo); finish(r, il, took, bo); };
  if (b.id === 'claude') {
    const t0 = Date.now();
    const history = this.state.turns.slice(-4).flatMap(x => [{ role: 'user', text: x.heard }, { role: 'assistant', text: x.reply }]);
    this.touch('claude'); this.touch('voice');
    fetch('/api/stella/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, history, mode: 'call' }) })
      .then(r => r.json()).then(d => {
        if (!d || !d.reply) throw new Error('empty');
        const cmds = Array.isArray(d.commands) ? d.commands : [];
        const il = cmds.length ? cmds.map(c => c.action).join(' → ') : 'chat.reply';
        if (this.isLive() && this.live().runCommand) { (async () => { for (const c of cmds) { try { await this.live().runCommand(c); } catch (x) {} } })(); }
        else this.intent(t, b); // demo: let the simulated robot act on it too
        finish(d.reply, il, Date.now() - t0, b);
      }).catch(() => { this.log('voice', 'warn', 'BRAIN|Claude unreachable · falling back to on-device'); local({ id: 'local', short: 'On-device', long: 'On-device · offline fallback', dot: '#3ecf8e' }, Date.now() - t0); });
    return;
  }
  setTimeout(() => local(b, ms), ms);
}
intentLabel(t) {
  if (/\bstop\b/.test(t)) return 'drive.stop';
  if (/\bdock\b|charge/.test(t)) return 'nav.dock';
  const rm = this.R.find(r => t.indexOf(r.n.toLowerCase().split(' ')[0]) >= 0);
  if (rm && /go|clean|drive|take/.test(t)) return 'nav.go_to(' + rm.id + ')';
  if (/where/.test(t)) return 'status.where';
  if (/temp|degree|warmer|cooler/.test(t)) return 'climate.set';
  if (/volume/.test(t)) return 'tv.volume';
  if (/play|watch|netflix|youtube|spotify/.test(t)) return 'tv.play';
  if (/forward|ahead|back|left|right/.test(t)) return 'drive.move';
  if (/twerk|dance/.test(t)) return 'fun.spin';
  return 'chat.open';
}
vbars(b) {
  const out = [], n = this.n, m = this.vm || 'idle', col = m === 'listen' ? '#ff5a1f' : m === 'speak' ? b.dot : m === 'think' ? '#ffd23f' : '#8d8d94';
  for (let i = 0; i < 48; i++) {
    const a = i * 7.5 * Math.PI / 180; let k;
    if (m === 'listen') k = 0.22 + 0.78 * Math.abs(Math.sin(n * 0.42 + i * 0.7)) * (0.55 + 0.45 * Math.sin(n * 0.17 + i * 1.3));
    else if (m === 'speak') k = 0.2 + 0.8 * Math.abs(Math.sin(n * 0.3 + i * 0.35)) * Math.abs(Math.sin(n * 0.11 + i * 0.12) + 0.2);
    else if (m === 'think') k = 0.1 + 0.6 * Math.pow(Math.max(0, Math.cos(a - n * 0.25)), 3);
    else k = 0.1 + 0.05 * Math.sin(n * 0.08 + i);
    k = Math.min(1, k); const r0 = 64, r1 = r0 + 4 + k * 36;
    out.push({ x1: (Math.sin(a) * r0).toFixed(1), y1: (-Math.cos(a) * r0).toFixed(1), x2: (Math.sin(a) * r1).toFixed(1), y2: (-Math.cos(a) * r1).toFixed(1), c: col, o: (0.3 + 0.7 * k).toFixed(2) });
  }
  return out;
}
intent(t, b) {
  const cloud = b.id === 'claude', s = this.state;
  if (b.id === 'none') return 'I can’t reach Claude right now. Switch to On-device in the voice panel.';
  const burst = (d, ms) => { this.holdDir = d; setTimeout(() => { this.holdDir = ''; }, ms); };
  if (/\bstop\b/.test(t)) { this.stopAll(true); return 'Stopped.'; }
  if (/\bdock\b|charge/.test(t)) { this.goTo('dock'); return 'Heading to the dock.'; }
  const rm = this.R.find(r => t.indexOf(r.n.toLowerCase().split(' ')[0]) >= 0);
  if (rm && /go|clean|drive|take/.test(t)) { this.goTo(rm.id); return 'On my way to the ' + rm.n.toLowerCase() + '.'; }
  if (/where/.test(t)) return 'I’m in the ' + this.roomAt(this.x, this.y).n.toLowerCase() + ', battery ' + Math.round(this.bat) + '%.';
  const tm = t.match(/(\d{2})/);
  if (/temp|degree|warmer|cooler/.test(t)) { const v = tm ? +tm[1] : s.set + (/cool/.test(t) ? -2 : 2); this.setState({ set: v }); return 'Setting the house to ' + v + ' degrees.'; }
  if (/volume/.test(t)) { const tvs = s.tvs.map((x, i) => i === s.tvSel ? Object.assign({}, x, { vol: Math.max(0, Math.min(40, x.vol + (/down/.test(t) ? -3 : 3))) }) : x); this.setState({ tvs }); return /down/.test(t) ? 'Turning it down.' : 'Turning it up.'; }
  if (/play|watch|netflix|youtube|spotify/.test(t)) {
    if (!cloud) return 'I can’t search titles offline. I can still drive, dock, change temperature and volume.';
    const app = /youtube/.test(t) ? 'YouTube' : /spotify/.test(t) ? 'Spotify' : 'Netflix';
    this.setState({ tvs: s.tvs.map((x, i) => i === s.tvSel ? Object.assign({}, x, { on: true, app }) : x) }); return 'Opening ' + app + ' on the ' + s.tvs[s.tvSel].n + ' TV and finding it.';
  }
  if (/forward|ahead/.test(t)) { burst('f', 900); return 'Moving forward.'; }
  if (/back/.test(t)) { burst('b', 900); return 'Backing up.'; }
  if (/left/.test(t)) { burst('l', 700); return 'Turning left.'; }
  if (/right/.test(t)) { burst('r', 700); return 'Turning right.'; }
  if (/twerk|dance/.test(t)) { burst('r', 1800); return cloud ? 'Let’s get it! Spinning up the party.' : 'Spinning.'; }
  return cloud ? 'All systems good and ready for the next one, King.' : 'That one needs Claude and I’m offline. Try a basic command.';
}
model3d(sel, e) {
  const out = [], self = this;
  const add = (part, w, h, cx, cy, z, css, txt, round) => {
    const hl = part === sel ? 'outline:2px solid #ff5a1f;box-shadow:0 0 30px rgba(255,90,31,.75);' : '';
    out.push({ txt: txt || '', pick: () => self.setState({ part }), style: 'position:absolute;left:' + (cx - w / 2) + 'px;top:' + (cy - h / 2) + 'px;width:' + w + 'px;height:' + h + 'px;transform:translateZ(' + z.toFixed(1) + 'px);cursor:pointer;display:flex;align-items:center;justify-content:center;font:600 9px JetBrains Mono,monospace;color:#e4e4ea;' + (round ? 'border-radius:50%;' : '') + css + hl });
  };
  const dsk = (part, d, cx, cy, z, c1, c2, extra) => add(part, d, d, cx, cy, z, 'background:radial-gradient(circle at 38% 32%,' + c1 + ',' + c2 + ');' + (extra || ''), '', true);
  const Z = (n, x) => n + x * e;
  // Roomba 694 body
  for (let i = 0; i < 5; i++) dsk('base', 260, 0, 0, -10 + i * 2.5, '#2a2a2f', '#121215');
  dsk('base', 260, 0, 0, 0, '#3b3b42', '#1b1b1f', 'border:3px solid #57575f;');
  add('base', 260, 260, 0, 0, 1, 'border-top:12px solid #8a8a93;border-left:12px solid transparent;border-right:12px solid transparent;border-bottom:0;', '', true);
  dsk('base', 46, 0, 18, 1.5, '#d8d8de', '#7c7c85', 'border:2px solid #4a4a52;');
  add('wheels', 24, 66, -122, 30, -6, 'background:repeating-linear-gradient(0deg,#0c0c0e 0 5px,#222226 5px 8px);border-radius:6px;');
  add('wheels', 24, 66, 122, 30, -6, 'background:repeating-linear-gradient(0deg,#0c0c0e 0 5px,#222226 5px 8px);border-radius:6px;');
  add('battery', 150, 80, 0, 38, Z(4, 25) - 3, 'background:#1d1d22;border-radius:12px;');
  add('battery', 150, 80, 0, 38, Z(4, 25), 'background:linear-gradient(90deg,#3a3a42 0 82%,#3ecf8e 82% 86%,#3a3a42 86%);border-radius:12px;border:2px solid #55555d;', 'BATTERY');
  add('vacuum', 110, 70, 0, -42, Z(9, 55), 'background:linear-gradient(180deg,#4a4a52,#2b2b31);border-radius:10px;border:2px solid #6a6a72;', 'VACUUM');
  add('main', 200, 28, 0, 48, Z(9, 55), 'background:repeating-linear-gradient(90deg,#c25b1f 0 8px,#8f3f12 8px 14px);border-radius:8px;', 'BRUSH');
  dsk('side', 58, 92, -84, Z(8, 75), '#e6e6ea', '#9a9aa3', 'background-image:conic-gradient(#ff5a1f 0 8%,transparent 8% 33%,#ff5a1f 33% 41%,transparent 41% 66%,#ff5a1f 66% 74%,transparent 74%);');
  // 35 mm standoffs
  [[-78, -70], [78, -70], [-78, 70], [78, 70]].forEach(p => { for (let k = 0; k < 4; k++) dsk('deck', 12, p[0], p[1], Z(6 + k * 8, 25 + k * 22), '#e6e6ea', '#8a8a93', 'border:1px solid #5a5a62;'); });
  // clear acrylic deck
  dsk('deck', 214, 0, -4, Z(36, 120), 'rgba(170,225,255,.20)', 'rgba(170,225,255,.07)', 'border:2px solid rgba(190,235,255,.6);');
  // Pi 4
  const zp = Z(38, 140);
  add('pi', 100, 66, 4, -6, zp, 'background:#17794a;border-radius:6px;border:1px solid #2fa66b;', 'PI 4');
  add('pi', 30, 26, 22, -18, zp + 2, 'background:linear-gradient(135deg,#c9c9d0,#8c8c95);border-radius:3px;');
  add('pi', 20, 34, 42, 4, zp + 2, 'background:linear-gradient(135deg,#d8d8de,#9a9aa3);border-radius:3px;');
  // two red CP2102 boards, buck, cutoff
  add('adapters', 20, 44, 78, -18, zp + 1, 'background:#c0392b;border-radius:3px;border:1px solid #e57368;font-size:7px;', 'USB');
  add('adapters', 20, 44, 78, 30, zp + 1, 'background:#c0392b;border-radius:3px;border:1px solid #e57368;font-size:7px;', 'USB');
  add('power', 56, 26, -44, 52, zp + 1, 'background:#1565c0;border-radius:3px;border:1px solid #5b9be0;', 'BUCK');
  add('power', 58, 34, 22, 56, zp + 1, 'background:#0d47a1;border-radius:3px;border:1px solid #5b9be0;', 'CUTOFF');
  // speaker + mic
  dsk('audio', 34, -78, -30, zp + 1, '#3a3a40', '#121215', 'border:2px solid #6a6a72;');
  add('audio', 10, 32, -80, 20, zp + 1, 'background:#55555d;border-radius:5px;');
  // camera at the front edge
  add('camera', 46, 22, 4, -92, Z(40, 120), 'background:#0c0c0f;border:2px solid #3b3b42;border-radius:5px;');
  dsk('camera', 12, 4, -92, Z(40, 120) + 2, '#7fb4ff', '#1a3d7a');
  // LiDAR puck on top
  for (let i = 0; i < 4; i++) dsk('lidar', 70, 4, -6, Z(52, 220) + i * 3, '#34343a', '#1d1d21');
  dsk('lidar', 70, 4, -6, Z(52, 220) + 12, '#4a4a52', '#26262b', 'border:2px solid #6a6a72;');
  dsk('lidar', 28, 4, -6, Z(52, 220) + 13, '#16161a', '#050506', 'border:2px solid #ff5a1f;');
  return out;
}
rvApps(o, ds, on, here) {
  const s = this.state, P = this.parts(), b = this.brain(), cfg = s.cfg, signed = this.isLive();
  const okN = P.filter(p => p.st === 'ok').length, warnN = this.logs.filter(l => l.lv === 'warn').length;
  const expPct = Math.round(this.exp.reduce((a, v) => a + v, 0) / 504 * 100);
  const tv = s.tvs[s.tvSel];
  const SC = { ok: 'var(--ok)', warn: 'var(--warn)', off: 'var(--mute)' };
  const cs = s.camSrc || 'lidar';
  const r = {
    apps: [
      ['camera', 'Camera', s.camOn ? (cs === 'cam' && this.camSt && this.camSt.ok ? 'Live video' : 'LiDAR · live') : 'Off', 'M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 100-7 3.5 3.5 0 000 7', on && s.camOn ? 'var(--ok)' : 'var(--mute)'],
      ['map', 'Map', expPct + '% mapped', 'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14', 'var(--ok)'],
      ['parts', 'Parts', okN + ' of ' + P.length + ' ok', 'M9 3h6v4H9zM4 9h16v6H4zM9 17h6v4H9z', okN === P.length ? 'var(--ok)' : 'var(--warn)'],
      ['logs', 'Logs', warnN ? warnN + ' warning' + (warnN === 1 ? '' : 's') : 'All clear', 'M5 6h14M5 12h14M5 18h9', warnN ? 'var(--warn)' : 'var(--ok)'],
      ['tv', 'TV', tv.on ? tv.app : 'Off', 'M3 6h18v11H3zM8 21h8', tv.on ? 'var(--ok)' : 'var(--mute)'],
      ['climate', 'Climate', s.cur.toFixed(0) + '° → ' + s.set + '°', 'M10 4a2 2 0 014 0v9.5a4.5 4.5 0 11-4 0z', 'var(--ok)'],
      ['flow', 'Live flow', on ? 'Data moving' : 'Offline', 'M5 6a2 2 0 100 4 2 2 0 000-4zM19 14a2 2 0 100 4 2 2 0 000-4zM7 8h4a4 4 0 014 4v2M15 16h-2', on ? 'var(--ok)' : 'var(--mute)'],
      ['voice', 'Voice', b.short, 'M9 3h6v10a3 3 0 01-6 0zM5 11a7 7 0 0014 0M12 18v3', b.dot],
      ['settings', 'Settings', 'Voice · alerts', 'M12 9a3 3 0 100 6 3 3 0 000-6M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2', 'var(--mute)']
    ].map(a => ({ title: a[1], sub: a[2], icon: a[3], dot: a[4], pick: () => a[0] === 'voice' ? this.openTalk() : a[0] === 'tv' && this.props.onRemote ? this.props.onRemote() : this.setState({ app: a[0] }) })),
    isFlow: s.app === 'flow', flow: this.flowVm(P, on, b),
    isCam: s.app === 'camera', isMap: s.app === 'map', isParts: s.app === 'parts', isLogs: s.app === 'logs', isTv: s.app === 'tv', isClimate: s.app === 'climate', isSettings: s.app === 'settings',
    camTabs: [['cam', 'Camera'], ['lidar', 'LiDAR']].map(c => ({ label: c[1], cls: cs === c[0] ? 'on' : '', pick: () => this.setState({ camSrc: c[0] }) })),
    camIsCam: cs === 'cam', camIsLidar: cs !== 'cam', useLidar: () => this.setState({ camSrc: 'lidar' }),
    camLive: !!(this.isLive() && this.camSt && this.camSt.ok && !s.camBad), camUrl: (this.live().robotUrl || '') + '/camera/stream?n=' + (s.camKey || 0),
    camShow: !!(cs === 'cam' && this.isLive() && this.camSt && this.camSt.ok && !s.camBad),
    camZoomLbl: (s.camZoom || 1).toFixed((s.camZoom || 1) % 1 ? 1 : 0) + '×', camZoomed: (s.camZoom || 1) > 1.01, camFlip: !!s.camFlip,
    camImgStyle: `position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000;pointer-events:none;transform-origin:center;transform:translate(${(s.camPx || 0).toFixed(2)}%,${(s.camPy || 0).toFixed(2)}%) scale(${(s.camZoom || 1).toFixed(3)}) rotate(${s.camFlip ? 180 : 0}deg)`,
    camDown: e => this.camPtr('down', e), camMove: e => this.camPtr('move', e), camUp: e => this.camPtr('up', e),
    camDbl: () => this.camSet((s.camZoom || 1) > 1.01 ? 1 : 2.5, 0, 0),
    camZin: () => this.camSet((s.camZoom || 1) * 1.5, s.camPx || 0, s.camPy || 0), camZout: () => this.camSet((s.camZoom || 1) / 1.5, s.camPx || 0, s.camPy || 0),
    camZreset: () => this.camSet(1, 0, 0), camFlipTog: () => this.setState({ camFlip: !s.camFlip }),
    camPhoto: () => { try { window.open((this.live().robotUrl || '') + '/camera/snapshot', '_blank', 'noopener'); } catch (x) {} },
    camErr: () => this.setState({ camBad: Date.now() }), camRetry: () => { this.camT = 0; this.setState({ camBad: 0, camKey: Date.now() }); },
    camMsg: !this.isLive() ? 'Camera works when you’re on your home network (Tailscale).' : !this.camSt ? 'Asking the Pi…' : (this.camSt.error || (s.camBad ? 'The video stopped.' : 'No camera detected on the Pi.')),
    camOn: s.camOn, camOff: !s.camOn, camTog: () => this.setState({ camOn: !s.camOn }), camTogCls: s.camOn ? 'tog on' : 'tog',
    nearLabel: this.near < 400 ? (this.near / 80).toFixed(1) + ' m' : '—', closeFpv: () => this.setState({ fpv: false })
  };
  // map editing
  const sel = this.R.find(x => x.id === s.selRoom) || this.R[0];
  const mapped = rm => { let n = 0, t = 0; for (let cy = (rm.y - 20) / 20; cy < (rm.y + rm.h - 20) / 20; cy++) for (let cx = (rm.x - 20) / 20; cx < (rm.x + rm.w - 20) / 20; cx++) { t++; if (this.exp[cy * 28 + cx]) n++; } return t ? Math.round(n / t * 100) : 0; };
  const pt = e => { const rc = e.currentTarget.getBoundingClientRect(); return [Math.max(0, Math.min(600, (e.clientX - rc.left) / rc.width * 600)), Math.max(0, Math.min(400, (e.clientY - rc.top) / rc.height * 400))]; };
  Object.assign(r, {
    selName: sel.n, selMapped: mapped(sel) + '%', selDone: this.done[sel.id] || 'never',
    renameRoom: e => { const v = ((e.target && e.target.value) || '').slice(0, 16); if (v !== sel.n) { sel.n = v; this.save(); this.forceUpdate(); } },
    sendSel: () => { this.setState({ app: 'home' }); this.goTo(sel.id); },
    selSkipCls: this.skip[sel.id] ? 'tog on' : 'tog', selSkip: () => { this.skip[sel.id] = !this.skip[sel.id]; this.save(); this.log('system', 'info', sel.n + (this.skip[sel.id] ? ' skipped in cleans' : ' back in cleans')); this.forceUpdate(); },
    drawCls: s.draw ? 'pri' : '', drawLabel: s.draw ? 'Drag on the map…' : 'Draw no-go zone', drawTog: () => this.setState({ draw: !s.draw }),
    mapTouch: s.draw ? 'none' : 'auto',
    mapDown: e => { if (!s.draw) return; const p = pt(e); this.zd = { x0: p[0], y0: p[1], x1: p[0], y1: p[1] }; try { e.currentTarget.setPointerCapture(e.pointerId); } catch (x) {} },
    mapMove: e => { if (!this.zd) return; const p = pt(e); this.zd.x1 = p[0]; this.zd.y1 = p[1]; this.forceUpdate(); },
    mapUp: () => { const d = this.zd; this.zd = null; if (!d) return; const x = Math.min(d.x0, d.x1), y = Math.min(d.y0, d.y1), w = Math.abs(d.x1 - d.x0), h = Math.abs(d.y1 - d.y0); if (w > 16 && h > 16) { this.setState({ zones: s.zones.concat({ x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h), n: 'No-go ' + (s.zones.length + 1) }), draw: false }); this.log('system', 'info', 'No-go zone added'); } else this.forceUpdate(); },
    zoneList: s.zones.map((z, i) => ({ n: z.n, rename: e => { const v = ((e.target && e.target.value) || '').slice(0, 18); z.n = v; this.setState({ zones: s.zones.slice() }); }, del: () => { this.setState({ zones: s.zones.filter((q, j) => j !== i) }); this.log('system', 'info', z.n + ' removed'); } })),
    roomChips: this.R.map(rm => ({ n: rm.n + (this.skip[rm.id] ? ' ✕' : ''), cls: rm.id === s.selRoom ? 'on' : '', pick: () => this.setState({ selRoom: rm.id }) })),
    resetExp: () => { this.exp = new Uint8Array(504); this.expPath = ''; this.say('Map cleared'); }
  });
  // parts
  const sp = P.find(p => p.id === s.part) || P[0];
  Object.assign(r, {
    partChips: P.map(p => ({ n: p.n, dot: SC[p.st], cls: s.part === p.id ? 'on' : '', pick: () => this.setState({ part: p.id }) })),
    partName: sp.n, partHead: sp.head, partDot: SC[sp.st], partRows: sp.m.map(m => ({ k: m[0], v: m[1] })),
    partLogs: this.logs.filter(l => l.src === sp.src).slice(0, 3),
    isVac: sp.id === 'vacuum', isBrushM: sp.id === 'main', isBrushS: sp.id === 'side',
    suctionBtns: [['eco', 'Eco 1.4'], ['normal', 'Normal 2.2'], ['turbo', 'Turbo 3.1']].map(x => ({ label: x[1], cls: s.suction === x[0] ? 'on' : '', pick: () => { this.setState({ suction: x[0] }); this.log('driver', 'info', 'Suction mode: ' + x[0]); } })),
    vacTog: () => this.setTool('v'), vacCls: s.tools.v ? 'tog on' : 'tog', mTog: () => this.setTool('m'), mCls: s.tools.m ? 'tog on' : 'tog', sTog: () => this.setTool('s'), sCls: s.tools.s ? 'tog on' : 'tog'
  });
  const ex = s.expl === undefined ? 55 : s.expl;
  r.expl = ex; r.setExpl = e => this.setState({ expl: +e.target.value }); r.rl = s.app === 'parts' ? this.model3d(s.part, ex / 100) : [];
  r.sceneT = 'rotateX(60deg) rotateZ(' + this.rot.toFixed(1) + 'deg) scale(0.95)';
  r.spinTog = () => this.setState({ spin: s.spin === false }); r.spinLabel = s.spin === false ? 'Spin: off' : 'Spin: on';
  r.rd = e => { try { this.dragging = true; this.dx0 = e.clientX; this.rot0 = this.rot; e.currentTarget.setPointerCapture(e.pointerId); } catch (x) {} };
  r.rm = e => { if (this.dragging) { this.rot = (this.rot0 + (e.clientX - this.dx0) * 0.6 + 360) % 360; this.forceUpdate(); } };
  r.ru = () => { this.dragging = false; };
  // logs
  const SRC = ['driver', 'lidar', 'api', 'camera', 'voice', 'battery', 'system', 'tv', 'climate'], LV = { info: 'var(--fg)', warn: 'var(--warn)', err: 'var(--bad)' }, BAR = { info: 'var(--line)', warn: 'var(--warn)', err: 'var(--bad)' };
  const SVC = { driver: 'roomba-driver', api: 'stella-api', lidar: 'stella-lidar', camera: 'stella-camera', voice: 'stella-voice', battery: 'stella-battery', system: 'stella', tv: 'stella-tv', climate: 'stella-climate' };
  r.srcChips = SRC.map(k => ({ n: k, style: s.logSrc.indexOf(k) >= 0 ? 'background:var(--fg);color:var(--bg);border-color:var(--fg)' : '', pick: () => this.setState({ logSrc: s.logSrc.indexOf(k) >= 0 ? s.logSrc.filter(x => x !== k) : s.logSrc.concat(k) }) }));
  r.logAll = () => this.setState({ logSrc: SRC.slice() }); r.logNone = () => this.setState({ logSrc: [] });
  r.lvTabs = [['good', 'Good'], ['all', 'All']].map(x => ({ label: x[1], cls: s.logLv === x[0] ? 'on' : '', pick: () => this.setState({ logLv: x[0] }) }));
  const rows = s.app === 'logs' ? this.logs.filter(l => s.logSrc.indexOf(l.src) >= 0 && (s.logLv === 'all' || l.lv === 'info')).slice(0, 80) : [];
  r.logRows = rows.map(l => ({ t: l.t, svc: SVC[l.src] || l.src, m: l.m.replace('|', ' · '), col: LV[l.lv], bar: BAR[l.lv] })); r.logEmpty = rows.length === 0;
  // tv
  r.tvTabs = s.tvs.map((t, i) => ({ n: t.n, dot: t.on ? 'var(--ok)' : 'var(--mute)', st: t.on ? (t.playing ? 'Playing' : 'Paused') : 'Off', style: 'display:flex;flex-direction:column;align-items:flex-start;padding:8px 10px;border-radius:12px;min-width:0;text-align:left;border:1.5px solid ' + (i === s.tvSel ? 'var(--acc)' : 'var(--line)') + ';background:' + (i === s.tvSel ? 'var(--soft)' : 'transparent'), pick: () => this.setState({ tvSel: i }) }));
  const upd = f => this.setState({ tvs: s.tvs.map((x, i) => i === s.tvSel ? Object.assign({}, x, f(x)) : x) });
  r.tvApp = tv.on ? tv.app : '—';
  const RK = { Up: 'Up', Down: 'Down', Left: 'Left', Right: 'Right', OK: 'Select', Back: 'Back', Options: 'Info', Home: 'Home', Rewind: 'Rev', 'Fast forward': 'Fwd', 'Play/Pause': 'Play', 'Vol +': 'VolumeUp', 'Vol −': 'VolumeDown', Mute: 'VolumeMute' };
  const tvSend = (path, body, label) => { if (!this.isLive()) return; this.api(path, 'POST', Object.assign({ tv: tv.n }, body)).then(x => { if (!x || x.__err) this.say((x && x.__err) || 'TV didn’t answer'); else this.log('tv', 'info', label); }); };
  const kk = (nm, f) => () => { if (!tv.on && this.isLive() === false) { this.say(tv.n + ' is off. Press power first.'); return; } if (f) upd(f); this.log('tv', 'info', tv.n + ' key ' + nm); tvSend('/roku/key', { key: RK[nm] }, tv.n + ' key ' + nm); };
  r.kPower = () => { upd(x => ({ on: !x.on, app: x.on ? '—' : 'Home', playing: false })); this.log('tv', 'info', tv.n + (tv.on ? ' off' : ' on')); tvSend('/roku/key', { key: 'Power' }, tv.n + ' power'); };
  r.kUp = kk('Up'); r.kDn = kk('Down'); r.kL = kk('Left'); r.kR = kk('Right'); r.kOk = kk('OK'); r.kBack = kk('Back'); r.kOpt = kk('Options');
  r.kHome = kk('Home', () => ({ app: 'Home', playing: false })); r.kRw = kk('Rewind'); r.kFf = kk('Fast forward');
  r.kPlay = kk('Play/Pause', x => ({ playing: !x.playing })); r.kPlayLbl = tv.playing ? '❚❚' : '▶';
  r.kVu = kk('Vol +', x => ({ vol: Math.min(40, x.vol + 2), mute: false })); r.kVd = kk('Vol −', x => ({ vol: Math.max(0, x.vol - 2) }));
  r.kMute = kk('Mute', x => ({ mute: !x.mute })); r.kMuteBg = tv.mute ? '#d62b2b' : '#2a1a4a';
  r.tvDot = tv.on ? 'var(--ok)' : 'var(--mute)'; r.tvStatus = tv.on ? 'On' : 'Off';
  r.tvPlayTxt = !tv.on ? 'Standby' : tv.playing ? 'Playing' : 'Paused'; r.tvMuteTxt = tv.mute ? 'Muted' : 'Vol ' + tv.vol;
  const TSC = [['Netflix', '#e50914', '#fff'], ['YouTube', '#ff3b30', '#fff'], ['Spotify', '#1db954', '#06210f'], ['Hulu', '#1ce783', '#06210f']];
  r.tvShort = TSC.map(a => ({ n: a[0], style: 'height:36px;border-radius:11px;font-size:10px;letter-spacing:-.02em;background:' + a[1] + ';color:' + a[2] + ';box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 3px 0 rgba(0,0,0,.45)', pick: () => { upd(() => ({ on: true, app: a[0], playing: true })); this.log('tv', 'info', tv.n + ' → ' + a[0]); tvSend('/roku/launch', { app: a[0].toLowerCase() }, tv.n + ' → ' + a[0]); } }));
  // climate
  r.curTxt = s.cur.toFixed(1);
  const cm = s.cmode === 'auto' ? (s.set >= s.cur ? 'heat' : 'cool') : s.cmode, offM = s.cmode === 'off';
  r.climBg = { heat: 'radial-gradient(circle at 50% 28%,#ff9a3c,#e8590c 55%,#8a2c06)', cool: 'radial-gradient(circle at 50% 28%,#5aa9ff,#1f63d6 55%,#0e2f78)', off: 'linear-gradient(#26262c,#16161a)' }[offM ? 'off' : cm];
  r.climLbl = offM ? 'OFF' : Math.abs(s.set - s.cur) < 0.3 ? 'HOLDING' : s.set > s.cur ? 'HEATING TO' : 'COOLING TO'; r.setBig = offM ? '—' : String(s.set);
  r.equipTxt = offM ? 'System off' : Math.abs(s.set - s.cur) < 0.3 ? 'Idle' : s.set > s.cur ? 'Heat running' : 'Cool running';
  r.setUp = () => this.setState({ set: Math.min(85, s.set + 1) }); r.setDn = () => this.setState({ set: Math.max(55, s.set - 1) });
  r.cmodes = [['heat', 'Heat'], ['cool', 'Cool'], ['auto', 'Heat·Cool'], ['off', 'Off']].map(m => ({ label: m[1], style: 'flex:1;height:40px;border-radius:24px;border:0;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;' + (s.cmode === m[0] ? 'background:#fff;color:#111' : 'background:transparent;color:#fff'), pick: () => { this.setState({ cmode: m[0] }); this.log('climate', 'info', 'Mode: ' + m[1]); } }));
  r.presets = [['Comfort', 72], ['Eco', 66], ['Sleep', 68]].map(p => ({ n: p[0], v: p[1], style: 'flex:1;border-radius:14px;padding:8px 6px;display:flex;flex-direction:column;align-items:center;gap:2px;color:#fff;border:1px solid rgba(255,255,255,.2);cursor:pointer;background:' + (s.set === p[1] ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.22)'), pick: () => { this.setState({ set: p[1] }); this.log('climate', 'info', p[0] + ' preset · ' + p[1] + '°F'); } }));
  r.ticks = []; for (let i = 0; i < 61; i++) {
    const f = i / 60, th = (-135 + 270 * f) * Math.PI / 180, tp = 55 + f * 30, lo = Math.min(s.cur, s.set), hi = Math.max(s.cur, s.set);
    const isS = !offM && Math.abs(tp - s.set) < 0.26, isC = Math.abs(tp - s.cur) < 0.26, bt = !offM && tp > lo && tp < hi;
    const r0 = 118, r1 = isS ? 146 : isC ? 140 : 130, sn = Math.sin(th), cs2 = Math.cos(th);
    r.ticks.push({ x1: (150 + sn * r0).toFixed(1), y1: (150 - cs2 * r0).toFixed(1), x2: (150 + sn * r1).toFixed(1), y2: (150 - cs2 * r1).toFixed(1), c: isS ? '#fff' : isC ? 'rgba(255,255,255,.95)' : bt ? 'rgba(255,255,255,.85)' : 'rgba(255,255,255,.32)', w: isS ? 4 : isC ? 3 : bt ? 2 : 1.6 });
  }
  const dset = e => { const rc = e.currentTarget.getBoundingClientRect(); const th = Math.atan2(e.clientX - (rc.left + rc.width / 2), -(e.clientY - (rc.top + rc.height / 2))) * 180 / Math.PI; if (Math.abs(th) > 138 || this.state.cmode === 'off') return; const v = Math.round(55 + (Math.max(-135, Math.min(135, th)) + 135) / 270 * 30); if (v !== this.state.set) this.setState({ set: v }); };
  r.dialDown = e => { this.dd = true; try { e.currentTarget.setPointerCapture(e.pointerId); } catch (x) {} dset(e); }; r.dialMove = e => { if (this.dd) dset(e); }; r.dialUp = () => { if (this.dd) { this.dd = false; this.log('climate', 'info', 'Set to ' + this.state.set + '°F'); } };
  r.humid = 41; r.ecoTxt = s.eco ? 'On' : 'Off'; r.ecoCol = s.eco ? '#3ecf8e' : 'var(--mute)'; r.ecoTog = () => this.setState({ eco: !s.eco });
  r.nextT = '68°'; r.nextWhen = 'Sleep · 10 pm';
  const RV = [2.1, 3.4, 1.8, 2.9, 3.6, 2.2, 3.2], DL = 'SMTWTFS';
  r.runToday = '3.2'; r.runBars = RV.map((v, i) => ({ x: i * 30, h: Math.round(v / 4 * 44) + 4, y: 60 - (Math.round(v / 4 * 44) + 4), f: i === 6 ? 'var(--acc)' : 'var(--line)', d: DL[(new Date(Date.now() - (6 - i) * 864e5)).getDay()] }));
  // state chips + brain tabs + theme
  r.isDemo = !this.isLive();
  r.stateChips = ['idle', 'charging', 'low', 'fault', 'offline'].map(k => ({ label: k, cls: this.st === k || (k === 'low' && this.st === 'idle' && this.bat < 20) ? 'on' : '', pick: () => { this.stopAll(true); if (k === 'low') { this.st = 'idle'; this.bat = 15; } else { this.st = k; if (k === 'idle' && this.bat < 20) this.bat = 74; } if (k === 'charging') { this.x = this.DK[0]; this.y = this.DK[1]; this.h = 0; } this.log('system', k === 'fault' ? 'err' : 'info', 'Demo state → ' + k); } }));
  r.brainTabs = [['auto', 'Auto'], ['claude', 'Claude'], ['local', 'On-device']].map(x => ({ label: x[1], cls: s.brain === x[0] ? 'on' : '', pick: () => this.setState({ brain: x[0] }) }));
  r.themeTabs = [['dark', 'Dark'], ['light', 'Light']].map(x => ({ label: x[1], cls: s.theme === x[0] ? 'on' : '', pick: () => this.setState({ theme: x[0] }) }));
  // settings rows
  const setCfg = (k, v) => this.setState({ cfg: Object.assign({}, this.state.cfg, { [k]: v }) });
  const T = (label, k) => ({ label, val: '', tc: cfg[k] ? 'tog on' : 'tog', showTog: 'display:block', showVal: 'display:none', pick: () => setCfg(k, !cfg[k]) });
  const C = (label, k, opts, fmt) => ({ label, val: fmt(cfg[k]), tc: 'tog', showTog: 'display:none', showVal: 'display:inline-flex', pick: () => setCfg(k, opts[(opts.indexOf(cfg[k]) + 1) % opts.length]) });
  const SU = ['eco', 'normal', 'turbo'];
  r.sV = [T('Wake word “Stella”', 'wake'), T('Spoken replies', 'spoken'), C('Voice', 'vstyle', ['Warm', 'Crisp', 'Low'], v => v), { label: 'Voice plays on', val: VOICE_OUT_LABEL[getVoiceOut()], tc: 'tog', showTog: 'display:none', showVal: 'display:inline-flex', pick: () => { setVoiceOut(nextVoiceOut(getVoiceOut())); this.forceUpdate(); } }, T('Ask before big moves', 'confirm')]
    .concat(this.isLive() ? [
      (() => { const a = this.aiSt; const val = !a ? 'Pi not reachable' : a.engine === 'claude' ? 'Claude · ' + String(a.model || '').replace('claude-', '') : 'Offline' + (a.reason ? ' – ' + a.reason : '');
        return { label: 'Pi voice brain', val, tc: 'tog', showTog: 'display:none', showVal: 'display:inline-flex', pick: () => {
          const a2 = this.aiSt; if (!a2) return this.say('Pi not reachable');
          this.say(a2.engine === 'claude' ? 'Using Claude (' + a2.used_today + '/' + a2.cap + ' today)' : 'Offline: ' + (a2.reason || 'unknown') + (a2.last_err ? ' — ' + a2.last_err : '')); } }; })(),
      { label: 'What she says', val: 'Edit', tc: 'tog', showTog: 'display:none', showVal: 'display:inline-flex', pick: () => this.props.onLines ? this.props.onLines() : null },
      { label: 'Self-check', val: this.scTxt || 'Run', tc: 'tog', showTog: 'display:none', showVal: 'display:inline-flex', pick: () => {
        this.scTxt = 'Checking…'; this.forceUpdate();
        this.api('/selfcheck', 'GET', undefined, 25000).then(x => {
          const p = x && x.problems; this.scTxt = !x || x.__err ? 'No answer' : p.length ? p.length + ' issue' + (p.length > 1 ? 's' : '') : 'All good';
          this.say(!x || x.__err ? 'Self-check failed' : p.length ? 'Self-check: ' + p.slice(0, 2).join('; ') : 'Self-check: everything looks good'); this.forceUpdate();
        }); } },
      { label: 'Test Pi brain', val: this.aiTest || 'Run', tc: 'tog', showTog: 'display:none', showVal: 'display:inline-flex', pick: () => {
        this.aiTest = 'Testing…'; this.forceUpdate();
        this.api('/ai/test', 'POST', {}, 20000).then(x => {
          this.aiTest = x && x.ok ? 'Works · ' + x.ms + ' ms' : 'Failed';
          this.say(x && x.ok ? 'Claude answered in ' + x.ms + ' ms' : 'Brain test failed: ' + ((x && (x.error || x.__err)) || 'no answer'));
          this.aiT = 0; this.forceUpdate();
        }); } },
    ] : []);
  r.sC = [C('Auto-dock at', 'autoDock', [15, 20, 25], v => v + '%'), C('Go dock when idle', 'idleDock', [0, 5, 10, 20], v => v ? v + ' min' : 'Off'), C('Resume after charge', 'resume', [80, 90, 100], v => v + '%'), T('Edge cleaning', 'edge'), { label: 'Default suction', val: s.suction, tc: 'tog', showTog: 'display:none', showVal: 'display:inline-flex', pick: () => this.setState({ suction: SU[(SU.indexOf(s.suction) + 1) % 3] }) }];
  r.sS = [C('Max drive speed', 'maxSpd', [50, 75, 100], v => v + '%'), T('Stop if connection drops', 'lostStop'), T('Cliff warnings', 'cliff'), T('Alert: battery low', 'aBat'), T('Alert: stuck', 'aStuck'), T('Alert: clean finished', 'aDone'), C('Quiet hours', 'quiet', ['Off', '10 pm – 7 am'], v => v)];
  r.sD = [C('Temperature', 'units', ['F', 'C'], v => '°' + v), T('24-hour time', 't24')].concat(this.isLive() ? [] : [{ label: 'Simulate no internet', val: '', tc: !s.internet ? 'tog on' : 'tog', showTog: 'display:block', showVal: 'display:none', pick: () => this.setState({ internet: !s.internet }) }]);
  // voice
  const vm = this.vm || 'idle', BC = { listen: '#ff5a1f', think: '#ffd23f', speak: b.dot, idle: '#8d8d94' }[vm];
  const spN = this.spk && vm === 'speak' ? Math.floor((Date.now() - this.spk.t0) / 30) : 0;
  const TG = id => ({ claude: 'Claude · cloud', local: 'On-device', none: 'No brain' }[id]), DC = id => ({ claude: '#a78bfa', local: '#3ecf8e', none: '#ff4d3a' }[id]);
  const last = s.turns[s.turns.length - 1], tagOf = t => TG(t.src) + ' · ' + (t.ms / 1000).toFixed(1) + ' s · ' + t.il;
  r.voiceOpen = s.voiceOpen; r.closeVoice = () => { this.vm = 'idle'; this.setState({ voiceOpen: false, listening: false }); };
  r.vb = s.voiceOpen ? this.vbars(b) : [];
  r.orbC1 = { listen: '#ff8a55', think: '#ffe27a', speak: b.id === 'claude' ? '#c4b2ff' : '#7de3b3', idle: '#ff8a55' }[vm]; r.orbC2 = { listen: '#c93d0a', think: '#b8860b', speak: b.id === 'claude' ? '#5b3fd6' : '#1c8a5a', idle: '#c93d0a' }[vm];
  r.orbGlowC = BC; r.ringR = 62 + (vm === 'idle' ? 0 : 4 * Math.sin(this.n * 0.3)); r.ringO = vm === 'idle' ? 0.25 : 0.7;
  r.dotRot = (this.n * 14) % 360; r.vmIdle = vm === 'idle'; r.vmThink = vm === 'think'; r.vmTalk = vm === 'listen' || vm === 'speak'; r.midText = vm === 'listen' ? 'YOU' : 'STELLA';
  r.vState = vm === 'listen' ? 'Listening…' : vm === 'think' ? 'Thinking…' : vm === 'speak' ? 'Stella' : '';
  r.vDown = () => { if (s.listening) { this.vSend(); this.vIgnore = true; return; } this.vBegin(); this.vh = Date.now(); };
  r.vUp = () => { if (this.vIgnore) { this.vIgnore = false; return; } if (this.state.listening && Date.now() - (this.vh || 0) > 700) this.vSend(); };
  const full = this.PH[s.vi % this.PH.length], typed = vm === 'listen' ? (this.useSR ? (this.srText || '') : full.slice(0, Math.max(0, Math.floor((Date.now() - (this.vt0 || Date.now())) / 55)))) : '';
  r.oldTurns = s.turns.slice(0, vm === 'listen' ? s.turns.length : -1).map(t => ({ heard: t.heard, reply: t.reply }));
  if (vm === 'listen') { r.curUser = typed + '▍'; r.userSize = '26px'; r.userCol = '#ffb089'; r.curReply = ''; r.hasReply = false; r.curTag = ''; r.showCur = true; }
  else if (vm === 'think') { r.curUser = s.heard; r.userSize = '26px'; r.userCol = '#e8e8ee'; r.curReply = ''; r.hasReply = false; r.curTag = ''; r.showCur = !!s.heard; }
  else if (last) { r.curUser = last.heard; r.userSize = '15px'; r.userCol = '#9a9aa3'; r.hasReply = true; r.curReply = vm === 'speak' ? last.reply.slice(0, spN) + (spN < last.reply.length ? '▍' : '') : last.reply; r.curTag = vm === 'speak' ? '' : tagOf(last); r.showCur = true; }
  else { r.curUser = ''; r.userSize = '15px'; r.userCol = '#9a9aa3'; r.curReply = ''; r.hasReply = false; r.curTag = ''; r.showCur = false; }
  r.curDot = last ? DC(last.src) : '#8d8d94'; r.showEmpty = !r.showCur && !s.turns.length;
  const bi = ['auto', 'claude', 'local'].indexOf(s.brain), BCOL = ['#ffd23f', '#a78bfa', '#3ecf8e'][bi];
  r.selThumb = 'position:absolute;top:4px;bottom:4px;margin-left:4px;width:calc(33.333% - 8px);left:' + (bi * 33.333).toFixed(2) + '%;border-radius:999px;transition:left .28s cubic-bezier(.3,.8,.3,1),border-color .2s;background:#22222b;border:1.5px solid ' + BCOL + ';box-shadow:0 0 16px ' + BCOL + '44';
  r.selOpts = [['auto', 'Auto'], ['claude', 'Claude'], ['local', 'On-device']].map(x => ({ label: x[1], pick: () => this.setState({ brain: x[0] }), style: 'position:relative;z-index:1;font-weight:700;font-size:14px;border-radius:999px;display:flex;align-items:center;justify-content:center;color:' + (s.brain === x[0] ? '#fff' : '#8d8d94') }));
  r.usingTxt = s.brain === 'auto' ? 'Auto · now using ' + b.long : b.long; r.brainDotC = b.dot;
  r.traceLabel = b.short + (s.traceOpen ? ' · hide trace' : ' · trace'); r.traceOpen = s.traceOpen; r.traceTog = () => this.setState({ traceOpen: !s.traceOpen });
  const VT = { STT: '#ff8a55', BRAIN: '#a78bfa', INTENT: '#ffd23f', REPLY: '#7de3b3', TTS: '#7fb4ff' };
  r.vlogs = this.logs.filter(l => l.src === 'voice' && l.m.indexOf('|') > 0).slice(0, 6).map(l => { const p = l.m.split('|'); return { t: l.t, tag: p[0], m: p.slice(1).join('|'), col: VT[p[0]] || '#8d8d94' }; });
  r.fpv = s.fpv;
  return r;
}
render() { return renderTemplate(this.renderVals()); }
}
