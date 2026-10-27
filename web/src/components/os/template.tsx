/* eslint-disable */
// @ts-nocheck
// GENERATED from the approved Stella OS mock (Main.dc.html). Edit stella-os.tsx / os.css for behaviour and styling;
// markup changes belong in this template.
import { Fragment, type CSSProperties } from "react";

export function S(s: string): CSSProperties {
  const o: Record<string, string> = {};
  if (!s) return o as CSSProperties;
  for (const d of String(s).split(";")) {
    const i = d.indexOf(":"); if (i < 0) continue;
    const k = d.slice(0, i).trim(), val = d.slice(i + 1).trim(); if (!k) continue;
    o[k.startsWith("--") ? k : k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = val;
  }
  return o as CSSProperties;
}

const CHIP = "height:34px;min-width:44px;padding:0 10px;font-size:14px;font-weight:600;background:rgba(0,0,0,.55);color:#fff;border-color:rgba(255,255,255,.3)";
function CamControls({ v, pos, row }: { v: any; pos: string; row?: boolean }) {
  return (<div style={S(`position:absolute;${pos};display:flex;flex-direction:${row ? "row" : "column"};gap:6px;align-items:stretch`)}>
    <button type="button" className="chip" aria-label="Zoom in" onClick={v.camZin} style={S(CHIP)}>{"+"}</button>
    <button type="button" className="chip" aria-label="Zoom out" onClick={v.camZout} style={S(CHIP)}>{"−"}</button>
    {v.camZoomed && (<button type="button" className="chip" aria-label="Reset zoom" onClick={v.camZreset} style={S(CHIP)}>{v.camZoomLbl}</button>)}
    <button type="button" className="chip" aria-label="Flip upside down" aria-pressed={v.camFlip} onClick={v.camFlipTog} style={S(CHIP + (v.camFlip ? ";background:#fff;color:#111" : ""))}>{"Flip"}</button>
    <button type="button" className="chip" aria-label="Open a photo" onClick={v.camPhoto} style={S(CHIP)}>{"Photo"}</button>
  </div>);
}

export function renderTemplate(v: any) {
  const HMAP = (<section className="card" aria-label="Live map" style={S("padding:0;overflow:hidden;height:100%")}><div className="aur a1" style={S("left:-40px;top:-30px;width:260px;height:260px;background:var(--st)")}></div>
<div className="aur a2" style={S("right:-50px;bottom:-40px;width:300px;height:300px;background:var(--st);opacity:.32")}></div>
<div className="aur a3" style={S("right:30%;top:20%;width:180px;height:180px;background:#6a5cff;opacity:.22")}></div>
<div style={S("position:relative;padding:14px 16px 0;display:flex;align-items:center;flex-wrap:wrap;gap:6px 12px")}><div style={S("font-size:30px;font-weight:700;letter-spacing:-.03em")}>{v.room}</div>
<span className="chip mono" style={S(v.battStyle)}><svg width="17" height="11" viewBox="0 0 17 11" aria-hidden="true"><rect x=".75" y=".75" width="13.5" height="9.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
<rect x="15" y="3.5" width="1.5" height="4" rx=".5" fill="currentColor" />
<rect x="2.5" y="2.5" width={v.battFill} height="6" rx="1" fill="currentColor" /></svg>
{v.batt}</span>
{v.hasSub && (<><span className="sm">{v.sub}</span></>)}</div>
<div style={S("position:relative;padding:6px 8px 8px")}><svg viewBox="0 0 600 400" width="100%" style={S("display:block")} role="img" aria-label="Floor plan with live LiDAR scan"><defs><pattern id="wood" width="26" height="9" patternUnits="userSpaceOnUse"><rect width="26" height="9" fill="rgba(176,120,70,.16)" /><path d="M0 8.5h26M13 0v8.5" stroke="rgba(176,120,70,.38)" strokeWidth=".8" /></pattern><pattern id="carpet" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="rgba(120,130,170,.10)" /><circle cx="1.5" cy="1.5" r=".7" fill="rgba(120,130,170,.35)" /><circle cx="4.5" cy="4.5" r=".7" fill="rgba(120,130,170,.35)" /></pattern><pattern id="ng" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="rgba(255,77,58,.12)" />
<rect width="4" height="10" fill="rgba(255,77,58,.5)" /></pattern></defs><g transform={v.rot}>
{v.rooms.map((r: any, __i: number) => (<Fragment key={__i}><rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.floor} style={S("pointer-events:none")} /><rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} onClick={r.pick} style={S("cursor:pointer")} /></Fragment>))}
<path d={v.expPath} fill="var(--st)" opacity={v.expOp} />
<path d={v.furn} fill="var(--line)" opacity=".7" />
{v.zones.map((z: any, __i: number) => (<Fragment key={__i}><rect x={z.x} y={z.y} width={z.w} height={z.h} fill="url(#ng)" stroke="var(--bad)" strokeWidth="1.5" strokeDasharray="5 4" />
<text x={z.tx} y={z.ty} fontSize="10" fill="var(--bad)" fontFamily="JetBrains Mono, monospace" style={S("pointer-events:none")}>{z.n}</text></Fragment>))}
<path d={v.scanPoly} fill="var(--st)" opacity={v.scanOp} />
<path d={v.wedge} fill="var(--st)" opacity={v.wedgeOp} />
<path d={v.walls} fill="none" stroke="var(--mute)" strokeWidth="5" strokeLinecap="square" />
<path d={v.hits} fill="none" stroke="var(--st)" strokeWidth="3.5" strokeLinecap="round" opacity={v.hitOp} />
<rect x={v.dockR.x} y={v.dockR.y} width={v.dockR.w} height={v.dockR.h} rx="3" fill="var(--warn)" />
{v.rooms.map((r: any, __i: number) => (<Fragment key={__i}><text x={r.lx} y={r.ly} textAnchor="middle" fontSize="11" letterSpacing="1" fill="var(--mute)" opacity={r.lop} fontFamily="JetBrains Mono, monospace">{r.up}</text></Fragment>))}
<g style={S(`transform:${v.robotT};transition:transform .12s linear`)}><circle r="26" fill="var(--st)" opacity=".18" />
<circle r="13" fill="var(--st)" />
<path d="M0 -3 L0 -12" stroke="var(--bg)" strokeWidth="3" strokeLinecap="round" /></g></g></svg>
<div style={S("position:absolute;right:18px;top:16px;display:flex;flex-direction:column;gap:8px")}>{v.layers.map((l: any, __i: number) => (<Fragment key={__i}><button type="button" className={`ib ${l.cls}`} aria-label={l.label} aria-pressed={l.on} onClick={l.pick}><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={l.icon} /></svg></button></Fragment>))}
<button type="button" className="ib" aria-label="Edit map" onClick={v.openMap}><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" /></svg></button></div>
{v.camOn && (<><button type="button" onClick={v.openCam} aria-label="Open camera" style={S("position:absolute;left:18px;bottom:18px;width:132px;height:78px;border-radius:12px;overflow:hidden;border:1.5px solid rgba(255,255,255,.3);background:#07070a;box-shadow:0 6px 20px rgba(0,0,0,.45);padding:0")}><svg viewBox="0 0 640 360" preserveAspectRatio="none" width="100%" height="100%" style={S("position:absolute;inset:0")} aria-hidden="true">{v.fp.map((c: any, __i: number) => (<Fragment key={__i}><rect x={c.x} y={c.y} width={c.w} height={c.h} fill={c.f} opacity={c.o} /></Fragment>))}</svg>
<span className="mono" style={S("position:absolute;left:7px;top:5px;font-size:9.5px;color:#fff;display:flex;align-items:center;gap:5px")}><span className="dot" style={S("width:6px;height:6px;background:var(--bad)")}></span>
{"LIDAR"}</span></button></>)}
{v.offline && (<><div style={S("position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);font-size:18px;font-weight:600")}>{"Stella is offline"}</div></>)}</div></section>);
  const HCTL = (<section className="card" aria-label="Control" style={S("height:100%;display:flex;flex-direction:column;gap:12px")}><div style={S("display:flex;gap:8px")}><button type="button" className={`btn ${v.goCls}`} style={S("flex:1;height:52px;font-size:16px")} onClick={v.goTog}>{v.goIsStop && (<><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2" /></svg></>)}
{v.goIsGo && (<><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4l13 8-13 8z" /></svg></>)}
{" "}{v.goLabel}</button>
{v.showDock && (<><button type="button" className="btn" style={S("height:52px;padding:0 18px")} onClick={v.dock}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg>
{"Charge"}</button></>)}</div>
<div style={S("display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px")}>{v.tools.map((t: any, __i: number) => (<Fragment key={__i}><button type="button" className="btn" onClick={t.pick} role="switch" aria-checked={t.on} style={S(`height:44px;padding:0 8px;gap:7px;font-size:13px;${t.style}`)}><span className="dot" style={S(`background:${t.dot}`)}></span>
{t.n}</button></Fragment>))}</div>
<div className="seg" role="tablist" aria-label="Control style">{v.ctrlTabs.map((c: any, __i: number) => (<Fragment key={__i}><button type="button" role="tab" className={c.cls} onClick={c.pick}>{c.label}</button></Fragment>))}</div>
{v.ctrlConsole && (<><div style={S("display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:14px")}>{v.padStick && (<><div className="stick sm" onPointerDown={v.sd} onPointerMove={v.sm} onPointerUp={v.su} onPointerCancel={v.su} aria-label="Drive stick"><div style={S("position:absolute;left:50%;top:10px;bottom:10px;width:1px;background:var(--line)")}></div>
<div style={S("position:absolute;top:50%;left:10px;right:10px;height:1px;background:var(--line)")}></div>
<div className="knob" style={S(`transform:${v.knobT}`)}></div></div></>)}
{v.padBtns && (<><div style={S("display:grid;grid-template-columns:repeat(3,56px);gap:6px")}><span></span>
<button type="button" className="pb" style={S("height:50px")} aria-label="Forward" onPointerDown={v.hf} onPointerUp={v.hu} onPointerLeave={v.hu} onPointerCancel={v.hu}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg></button>
<span></span>
<button type="button" className="pb" style={S("height:50px")} aria-label="Turn left" onPointerDown={v.hl} onPointerUp={v.hu} onPointerLeave={v.hu} onPointerCancel={v.hu}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M9 14L4 9l5-5" />
<path d="M4 9h10a6 6 0 010 12h-3" /></svg></button>
<button type="button" className="pb" style={S("height:50px;color:var(--bad)")} aria-label="Stop" onClick={v.stop}><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" /></svg></button>
<button type="button" className="pb" style={S("height:50px")} aria-label="Turn right" onPointerDown={v.hr} onPointerUp={v.hu} onPointerLeave={v.hu} onPointerCancel={v.hu}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M15 14l5-5-5-5" />
<path d="M20 9H10a6 6 0 000 12h3" /></svg></button>
<span></span>
<button type="button" className="pb" style={S("height:50px")} aria-label="Back" onPointerDown={v.hb} onPointerUp={v.hu} onPointerLeave={v.hu} onPointerCancel={v.hu}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7" /></svg></button>
<span></span></div></>)}
<div style={S("flex:1 1 150px;display:flex;flex-direction:column;gap:10px;min-width:0")}><div style={S("display:flex;justify-content:space-between;align-items:baseline")}><span className="lbl">{"Speed"}</span>
<span className="mono" style={S("font-size:22px;font-weight:500;color:var(--acc)")}>{v.speed}
<span style={S("font-size:12px;color:var(--mute)")}>{"%"}</span></span></div>
<div style={S("display:flex;gap:3px;height:40px;align-items:flex-end")}>{v.spdSegs.map((g: any, __i: number) => (<Fragment key={__i}><button type="button" aria-label={g.label} onClick={g.pick} style={S(g.style)}></button></Fragment>))}</div>
<div className="seg" style={S("width:130px")}><button type="button" className={v.stickCls} onClick={v.setStick}>{"Stick"}</button>
<button type="button" className={v.padCls} onClick={v.setPad}>{"Pad"}</button></div></div></div></>)}
{v.ctrlCam && (<><div style={S("position:relative;border-radius:12px;overflow:hidden;border:1px solid var(--line);background:#07070a;height:150px;touch-action:none;cursor:grab")} onPointerDown={v.lookDown} onPointerMove={v.lookMove} onPointerUp={v.lookUp} onPointerCancel={v.lookUp}><div className="aur a1" style={S("left:-30px;top:-30px;width:180px;height:180px;background:var(--st);opacity:.4")}></div>
<div className="aur a2" style={S("right:-30px;bottom:-30px;width:180px;height:180px;background:#6a5cff;opacity:.35")}></div>
<svg viewBox="0 0 640 360" preserveAspectRatio="none" width="100%" height="100%" style={S("position:absolute;inset:0;pointer-events:none")} aria-hidden="true">{v.fp.map((c: any, __i: number) => (<Fragment key={__i}><rect x={c.x} y={c.y} width={c.w} height={c.h} fill={c.f} opacity={c.o} /></Fragment>))}</svg>
<div className="mono" style={S("position:absolute;left:10px;top:8px;font-size:11px;color:#fff;opacity:.9;pointer-events:none")}>{v.viewDeg}{"° "}{v.headDir}</div>
<button type="button" className="chip" onClick={v.openFpv} style={S("position:absolute;right:8px;top:8px;height:28px;background:rgba(0,0,0,.5);color:#fff;border-color:rgba(255,255,255,.25)")}>{"Expand"}</button></div>
<div style={S("display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:14px")}><div className="stick sm" onPointerDown={v.sd} onPointerMove={v.sm} onPointerUp={v.su} onPointerCancel={v.su} aria-label="Drive stick"><div style={S("position:absolute;left:50%;top:10px;bottom:10px;width:1px;background:var(--line)")}></div>
<div style={S("position:absolute;top:50%;left:10px;right:10px;height:1px;background:var(--line)")}></div>
<div className="knob" style={S(`transform:${v.knobT}`)}></div></div>
<div style={S("flex:1 1 150px;display:flex;flex-direction:column;gap:10px;min-width:0")}><div style={S("display:flex;justify-content:space-between;align-items:baseline")}><span className="lbl">{"Speed"}</span>
<span className="mono" style={S("font-size:22px;font-weight:500;color:var(--acc)")}>{v.speed}
<span style={S("font-size:12px;color:var(--mute)")}>{"%"}</span></span></div>
<div style={S("display:flex;gap:3px;height:40px;align-items:flex-end")}>{v.spdSegs.map((g: any, __i: number) => (<Fragment key={__i}><button type="button" aria-label={g.label} onClick={g.pick} style={S(g.style)}></button></Fragment>))}</div></div></div></>)}</section>);
  const HAPPS = (<section aria-label="Apps"><div style={S("display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px")}>{v.apps.map((a: any, __i: number) => (<Fragment key={__i}><button type="button" className="app" onClick={a.pick}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--fg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={a.icon} /></svg>
<span style={S("font-size:17px;font-weight:600;letter-spacing:-.01em")}>{a.title}</span>
<span className="sm mono" style={S("font-size:12px")}>{a.sub}</span>
<span className="dot" style={S(`position:absolute;right:12px;top:12px;background:${a.dot}`)}></span></button></Fragment>))}</div></section>);
  const HSC = (<section className="card" aria-label="My shortcuts" style={S("height:100%;display:flex;flex-direction:column;gap:10px")}><div style={S("display:flex;align-items:center;justify-content:space-between")}><span className="lbl">{"My shortcuts"}</span>{!v.sc.adding && (<button type="button" className="chip" onClick={v.sc.openNew}>{"+ New"}</button>)}</div>
<div style={S("display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px")}>{v.sc.list.map((c: any, i: number) => (<div key={i} style={S("position:relative")}><button type="button" className="app" onClick={c.run} style={S("min-height:70px;width:100%;padding:12px")}><span style={S("font-size:15px;font-weight:600")}>{c.n}</span><span className="sm mono" style={S("font-size:11.5px")}>{c.sub}</span></button>{v.sc.edit && (<button type="button" aria-label={"Delete " + c.n} onClick={c.del} className="chip" style={S("position:absolute;right:6px;top:6px;height:24px;padding:0 8px;color:var(--bad)")}>{"×"}</button>)}</div>))}</div>
{v.sc.list.length === 0 && (<div className="sm">{"No shortcuts yet. Tap + New."}</div>)}
{v.sc.adding && (<div style={S("display:flex;flex-direction:column;gap:8px;border-top:1px solid var(--line);padding-top:10px")}><input aria-label="Shortcut name" placeholder="Name, e.g. Movie night" value={v.sc.name} onChange={v.sc.setName} style={S("height:42px;border-radius:10px;border:1px solid var(--line);background:var(--soft);color:var(--fg);padding:0 12px;font:inherit")} />
<div style={S("display:flex;flex-wrap:wrap;gap:6px")}>{v.sc.kinds.map((k: any, i: number) => (<button key={i} type="button" className={"chip " + (k.cls === "on" ? "on" : "")} onClick={k.pick}>{k.label}</button>))}</div>
{v.sc.needA && (<input aria-label="Value" placeholder={v.sc.aHint} value={v.sc.a} onChange={v.sc.setA} style={S("height:42px;border-radius:10px;border:1px solid var(--line);background:var(--soft);color:var(--fg);padding:0 12px;font:inherit")} />)}
{v.sc.needB && (<input aria-label="On which app" placeholder="On which app, e.g. netflix" value={v.sc.b} onChange={v.sc.setB} style={S("height:42px;border-radius:10px;border:1px solid var(--line);background:var(--soft);color:var(--fg);padding:0 12px;font:inherit")} />)}
<div style={S("display:flex;gap:8px")}><button type="button" className="btn pri" style={S("flex:1;height:42px")} onClick={v.sc.save}>{"Save shortcut"}</button><button type="button" className="btn" style={S("height:42px")} onClick={v.sc.cancel}>{"Cancel"}</button></div></div>)}</section>);
  const HMINI = (<section className="card" aria-label="Live status" style={S("height:100%;display:flex;flex-direction:column;gap:8px")}><div style={S("display:flex;align-items:center;justify-content:space-between")}><span className="lbl">{"Live status"}</span><button type="button" className="chip" onClick={v.openFlow}>{"Open flow"}</button></div>
{v.mini.map((p: any, i: number) => (<div key={i} className="row" style={S("padding:6px 0")}><span style={S("display:flex;align-items:center;gap:8px;font-size:14px")}><span className="dot" style={S("background:" + p.col)}></span>{p.n}</span><span className="sm" style={S("font-size:12px;text-align:right")}>{p.head}</span></div>))}</section>);
  return (
    <>
<div className={`sf ${v.themeClass}`} style={S(`--st: ${v.color}${v.accentStyle}`)}><header style={S("position:fixed;top:0;left:0;right:0;z-index:45;pointer-events:none;padding:10px 12px")}><div style={S("max-width:1240px;margin:0 auto;display:flex;align-items:center;gap:8px")}>{v.isHome && (<><button type="button" className="glass" onClick={v.goHome} aria-label="Home" style={S("height:44px;padding:0 16px 0 10px;border-radius:999px;display:flex;align-items:center;gap:8px")}><svg width="26" height="26" viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="12" fill="none" stroke="var(--st)" strokeWidth="2.5" />
<circle cx="15" cy="15" r="5" fill="var(--st)" />
<path d="M15 3v5" stroke="var(--fg)" strokeWidth="2.5" strokeLinecap="round" /></svg>
<span style={S("font-size:19px;font-weight:700;letter-spacing:-.03em")}>{"Stella"}</span></button></>)}
{v.notHome && (<><button type="button" className="glass" onClick={v.goHome} aria-label="Back to home" style={S("height:44px;padding:0 18px 0 12px;border-radius:999px;display:flex;align-items:center;gap:8px")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
<span style={S("font-size:17px;font-weight:700;letter-spacing:-.02em")}>{v.appTitle}</span></button></>)}
<button type="button" className="glass" onClick={v.toggleSigned} aria-label="Account" style={S("margin-left:auto;height:36px;padding:0 13px;border-radius:999px;display:flex;align-items:center;gap:7px;font-size:13px;font-weight:600")}><span className="dot" style={S(`background:${v.linkDot}`)}></span>
{v.linkLabel}</button>
<button type="button" className="btn pri" style={S("height:44px;border-radius:999px;padding:0 18px;pointer-events:auto")} onClick={v.openVoice}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M9 3h6v10a3 3 0 01-6 0zM5 11a7 7 0 0014 0M12 18v3" /></svg>
{"Talk"}</button></div></header>
<main style={S(v.mainStyle)}>{v.isHome && (<><div style={S("display:flex;flex-wrap:wrap;align-items:flex-end;gap:10px;justify-content:space-between")}><div><div style={S("font-size:26px;font-weight:700;letter-spacing:-.03em")}>{v.greet}</div><div className="sm">{v.greetSub}</div></div>
<div style={S("display:flex;gap:8px;flex-wrap:wrap;align-items:center")}>{v.lays.list.map((l: any, i: number) => (<button key={i} type="button" className={"chip " + (l.on ? "on" : "")} onClick={l.pick}>{l.n}</button>))}{v.lay.edit && (<button type="button" className="chip" onClick={v.lay.reset}>{"Reset layout"}</button>)}<button type="button" className={"chip " + (v.lay.edit ? "on" : "")} onClick={v.lay.toggle}>{v.lay.edit ? "Done" : "Edit layout"}</button></div></div>
{v.lay.edit && (<div className="card" style={S("padding:12px 14px;border-color:var(--acc);display:flex;flex-direction:column;gap:10px")}><span className="sm">{"Move cards with the arrows, pick a size, or hide one. Everything saves on this device."}</span><div style={S("display:flex;flex-wrap:wrap;gap:8px;align-items:center")}><input aria-label="Layout name" placeholder="Name this layout, e.g. Movie night" value={v.lays.name} onChange={v.lays.setName} style={S("height:38px;flex:1 1 180px;border-radius:10px;border:1px solid var(--line);background:var(--soft);color:var(--fg);padding:0 12px;font:inherit")} /><button type="button" className="chip" onClick={v.lays.add}>{"Save as new"}</button>{v.lays.canDel && (<button type="button" className="chip" style={S("color:var(--bad)")} onClick={v.lays.del}>{"Delete this layout"}</button>)}</div><div style={S("display:flex;align-items:center;gap:8px")}><span className="sm">{"Accent"}</span>{v.lays.accents.map((a: any, i: number) => (<button key={i} type="button" aria-label={a.name} aria-pressed={a.on} onClick={a.pick} style={S("width:28px;height:28px;border-radius:50%;border:2px solid " + (a.on ? "var(--fg)" : "var(--line)") + ";background:" + a.c)}></button>))}</div></div>)}
<div className="hg">{v.hw.map((w: any) => (<div key={w.id} className="hw" style={S("grid-column:" + w.span)}>{v.lay.edit && (<div className="glass" style={S("display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:6px 8px;border-radius:12px;margin-bottom:6px")}><b style={S("font-size:13px;flex:1;min-width:70px")}>{w.name}</b><button type="button" className="chip" aria-label="Move earlier" disabled={w.first} onClick={w.up}>{"↑"}</button><button type="button" className="chip" aria-label="Move later" disabled={w.last} onClick={w.down}>{"↓"}</button>{w.sizes.map((z: any) => (<button key={z.z} type="button" className={"chip " + (z.on ? "on" : "")} onClick={z.pick}>{z.label}</button>))}<button type="button" className="chip" onClick={w.toggleHide}>{w.hid ? "Show" : "Hide"}</button></div>)}
<div style={S(w.hid ? "opacity:.35;pointer-events:none" : "")}>{w.id === "map" && HMAP}{w.id === "control" && HCTL}{w.id === "shortcuts" && HSC}{w.id === "flowmini" && HMINI}{w.id === "apps" && HAPPS}</div></div>))}</div></>)}
{v.isFlow && (<><div style={S("flex:1;display:flex;flex-direction:column;gap:12px")}><div style={S("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}><span className="chip mono"><span className="dot" style={S("background:" + (v.flow.live ? "var(--ok)" : "var(--warn)"))}></span>{v.flow.live ? "Live" : "Demo data"}</span><span className="sm">{v.flow.summary}</span></div>
<section className="card" style={S("padding:8px;overflow-x:auto")} aria-label="Live flow graph"><svg viewBox="0 0 680 480" width="100%" role="img" aria-label="Live graph of how Stella parts connect and where data is moving" style={S("display:block;min-width:640px")}>
<rect x="10" y="108" width="660" height="132" rx="16" fill="none" stroke="var(--line)" strokeDasharray="4 4" /><text x="656" y="126" textAnchor="end" fontSize="11" fill="var(--mute)" fontFamily="JetBrains Mono, monospace">{"BRAIN · RASPBERRY PI"}</text>
<rect x="10" y="262" width="660" height="214" rx="16" fill="none" stroke="var(--line)" strokeDasharray="4 4" /><text x="656" y="280" textAnchor="end" fontSize="11" fill="var(--mute)" fontFamily="JetBrains Mono, monospace">{"BODY · HARDWARE"}</text>
<text x="656" y="20" textAnchor="end" fontSize="11" fill="var(--mute)" fontFamily="JetBrains Mono, monospace">{"YOU AND THE INTERNET"}</text>
{v.flow.edges.map((e: any) => (<g key={e.k}><line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={e.col} strokeWidth={e.w} strokeDasharray={e.dash} opacity={e.op} className={e.cls} />{e.lab && (<text x={e.mx} y={e.my} fontSize="10" fill="var(--acc)" textAnchor="middle" fontFamily="JetBrains Mono, monospace">{e.lab}</text>)}</g>))}
{v.flow.nodes.map((n: any) => (<g key={n.id} onClick={n.pick} style={S("cursor:pointer")} role="button" aria-label={n.n + " " + n.sub}><rect x={n.x} y={n.y} width="124" height="52" rx="10" fill="var(--card)" stroke={n.sel ? "var(--fg)" : n.col} strokeWidth={n.sel ? 2 : 1.5} /><circle cx={n.x + 12} cy={n.y + 14} r="4" fill={n.col} /><text x={n.x + 22} y={n.y + 18} fontSize="12.5" fontWeight="600" fill="var(--fg)">{n.n}</text><text x={n.x + 12} y={n.y + 38} fontSize="10.5" fill="var(--mute)">{n.sub}</text></g>))}</svg></section>
<div style={S("display:flex;flex-wrap:wrap;gap:12px;align-items:flex-start")}><section className="card" style={S("flex:1 1 280px")}><div style={S("display:flex;align-items:center;gap:8px")}><span className="dot" style={S("background:" + v.flow.sel.col)}></span><b style={S("font-size:17px")}>{v.flow.sel.n}</b></div><div className="sm" style={S("margin:2px 0 8px")}>{v.flow.sel.h}</div>{v.flow.sel.m.map((r: any, i: number) => (<div key={i} className="row" style={S("padding:6px 0")}><span className="sm">{r.k}</span><span className="mono" style={S("font-size:12.5px;text-align:right")}>{r.v}</span></div>))}</section>
<section className="card" style={S("flex:1 1 280px")}><span className="lbl">{"Data moving now"}</span><div className="mono" style={S("font-size:12px;line-height:1.7;margin-top:8px")}>{v.flow.feed.map((l: any, i: number) => (<div key={i}><span style={S("color:var(--mute)")}>{l.t}</span>{" "}<span style={S("color:var(--acc)")}>{l.svc}</span>{" "}<span style={S("color:" + l.col)}>{l.m}</span></div>))}</div></section></div></div></>)}
{v.isCam && (<><div style={S("flex:1;min-height:0;display:flex;flex-direction:column;gap:10px")}><div style={S("display:flex;align-items:center;gap:10px")}><div className="seg" style={S("flex:1")}>{v.camTabs.map((c: any, __i: number) => (<Fragment key={__i}><button type="button" className={c.cls} onClick={c.pick}>{c.label}</button></Fragment>))}</div>
<button type="button" className={v.camTogCls} role="switch" aria-label="Camera on" onClick={v.camTog}><i></i></button></div>
<div style={S("position:relative;flex:1;min-height:300px;border-radius:16px;overflow:hidden;border:1px solid var(--line);background:#07070a;touch-action:none;cursor:grab")} onPointerDown={v.lookDown} onPointerMove={v.lookMove} onPointerUp={v.lookUp} onPointerCancel={v.lookUp}>{v.camOff && (<><div style={S("position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#8d8d94;font-size:16px")}>{"Camera off"}</div></>)}
{v.camOn && (<><div className="aur a1" style={S("left:-40px;top:-40px;width:260px;height:260px;background:var(--st);opacity:.42")}></div>
<div className="aur a2" style={S("right:-40px;bottom:-40px;width:300px;height:300px;background:#6a5cff;opacity:.38")}></div>
<div className="aur a3" style={S("left:40%;top:30%;width:200px;height:200px;background:#00d4ff;opacity:.25")}></div>
{v.camIsCam && v.camLive && !v.fpv && (<><img key={v.camUrl} src={v.camUrl} alt="Stella camera, live" onError={v.camErr} style={S(v.camImgStyle)} />
<div aria-label="Pinch or double-tap to zoom, drag to move" onPointerDown={v.camDown} onPointerMove={v.camMove} onPointerUp={v.camUp} onPointerCancel={v.camUp} onDoubleClick={v.camDbl} style={S("position:absolute;inset:0;touch-action:none;cursor:zoom-in")}></div>
<CamControls v={v} pos="right:12px;top:12px" /></>)}
{v.camIsCam && !v.camLive && (<><div style={S("position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:#c9c9cf;padding:0 24px;text-align:center")}><b style={S("font-size:18px")}>{"No camera picture"}</b>
<span style={S("font-size:13px;opacity:.8;max-width:320px")}>{v.camMsg}</span>
<div style={S("display:flex;gap:8px")}><button type="button" className="btn" onClick={v.camRetry} style={S("background:rgba(255,255,255,.1);color:#fff;border-color:rgba(255,255,255,.25)")}>{"Try again"}</button>
<button type="button" className="btn" onClick={v.useLidar} style={S("background:rgba(255,255,255,.1);color:#fff;border-color:rgba(255,255,255,.25)")}>{"Use LiDAR"}</button></div></div></>)}
{v.camIsLidar && (<><svg viewBox="0 0 640 360" preserveAspectRatio="none" width="100%" height="100%" style={S("position:absolute;inset:0;pointer-events:none")} aria-hidden="true">{v.fp.map((c: any, __i: number) => (<Fragment key={__i}><rect x={c.x} y={c.y} width={c.w} height={c.h} fill={c.f} opacity={c.o} /></Fragment>))}</svg>
<svg viewBox="0 0 100 100" width="44" height="44" style={S("position:absolute;left:50%;top:50%;margin:-22px 0 0 -22px;opacity:.7;pointer-events:none")} aria-hidden="true"><path d="M50 20v20M50 60v20M20 50h20M60 50h20" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>
<div className="mono" style={S("position:absolute;left:50%;top:12px;transform:translateX(-50%);font-size:13px;color:#fff;background:rgba(0,0,0,.45);padding:4px 12px;border-radius:999px;pointer-events:none")}>{v.viewDeg}{"° "}{v.headDir}</div>
<div className="mono" style={S("position:absolute;right:12px;top:14px;font-size:11px;color:#fff;opacity:.9;pointer-events:none")}>{"AHEAD "}{v.nearLabel}</div>
{v.lookOff && (<><button type="button" className="chip" onClick={v.lookCenter} style={S("position:absolute;left:12px;top:10px;background:rgba(0,0,0,.55);color:#fff;border-color:rgba(255,255,255,.3)")}>{"Center"}</button></>)}</>)}
<button type="button" onClick={v.openMap} aria-label="Open map" style={S("position:absolute;left:12px;bottom:12px;width:96px;height:96px;border-radius:14px;overflow:hidden;border:1.5px solid rgba(255,255,255,.35);background:rgba(8,8,12,.7);padding:0")}><svg viewBox="0 0 600 400" width="100%" height="100%" aria-hidden="true"><path d={v.expPath} fill="var(--st)" opacity=".3" />
<path d={v.walls} fill="none" stroke="#d8d8de" strokeWidth="9" />
<g style={S(`transform:${v.robotT}`)}><circle r="26" fill="var(--st)" />
<path d="M0 -4L0 -22" stroke="#000" strokeWidth="7" strokeLinecap="round" /></g></svg></button>
<button type="button" className="chip" onClick={v.openFpv} style={S("position:absolute;right:12px;bottom:12px;height:44px;padding:0 16px;background:rgba(0,0,0,.6);color:#fff;border-color:rgba(255,255,255,.3);font-size:14px")}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
{"Expand"}</button></>)}</div></div></>)}
{v.isMap && (<><div style={S("display:flex;flex-wrap:wrap;gap:12px;align-items:flex-start")}><section className="card" style={S("flex:999 1 420px;padding:8px")}><svg viewBox="0 0 600 400" width="100%" style={S(`display:block;touch-action:${v.mapTouch}`)} role="img" aria-label="Floor plan" onPointerDown={v.mapDown} onPointerMove={v.mapMove} onPointerUp={v.mapUp} onPointerCancel={v.mapUp}><defs><pattern id="wood" width="26" height="9" patternUnits="userSpaceOnUse"><rect width="26" height="9" fill="rgba(176,120,70,.16)" /><path d="M0 8.5h26M13 0v8.5" stroke="rgba(176,120,70,.38)" strokeWidth=".8" /></pattern><pattern id="carpet" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="rgba(120,130,170,.10)" /><circle cx="1.5" cy="1.5" r=".7" fill="rgba(120,130,170,.35)" /><circle cx="4.5" cy="4.5" r=".7" fill="rgba(120,130,170,.35)" /></pattern><pattern id="ng" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="rgba(255,77,58,.12)" />
<rect width="4" height="10" fill="rgba(255,77,58,.5)" /></pattern></defs><g transform={v.rot}>
{v.rooms.map((r: any, __i: number) => (<Fragment key={__i}><rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.floor} style={S("pointer-events:none")} /><rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} stroke={r.stroke} strokeWidth="2.5" onClick={r.pick} style={S("cursor:pointer")} /></Fragment>))}
<path d={v.expPath} fill="var(--st)" opacity=".2" />
<path d={v.furn} fill="var(--line)" opacity=".7" />
{v.zones.map((z: any, __i: number) => (<Fragment key={__i}><rect x={z.x} y={z.y} width={z.w} height={z.h} fill="url(#ng)" stroke="var(--bad)" strokeWidth="1.5" strokeDasharray="5 4" />
<text x={z.tx} y={z.ty} fontSize="10" fill="var(--bad)" fontFamily="JetBrains Mono, monospace" style={S("pointer-events:none")}>{z.n}</text></Fragment>))}
<rect x={v.zd.x} y={v.zd.y} width={v.zd.w} height={v.zd.h} fill="rgba(255,77,58,.25)" stroke="var(--bad)" strokeWidth="1.5" strokeDasharray="5 4" />
<path d={v.scanPoly} fill="var(--st)" opacity=".12" />
<path d={v.walls} fill="none" stroke="var(--mute)" strokeWidth="5" strokeLinecap="square" />
<path d={v.hits} fill="none" stroke="var(--st)" strokeWidth="3.5" strokeLinecap="round" />
<rect x={v.dockR.x} y={v.dockR.y} width={v.dockR.w} height={v.dockR.h} rx="3" fill="var(--warn)" />
{v.rooms.map((r: any, __i: number) => (<Fragment key={__i}><text x={r.lx} y={r.ly} textAnchor="middle" fontSize="11" letterSpacing="1" fill="var(--fg)" opacity=".75" fontFamily="JetBrains Mono, monospace" style={S("pointer-events:none")}>{r.up}</text></Fragment>))}
<g style={S(`transform:${v.robotT};pointer-events:none`)}><circle r="26" fill="var(--st)" opacity=".18" />
<circle r="13" fill="var(--st)" />
<path d="M0 -3L0 -12" stroke="var(--bg)" strokeWidth="3" strokeLinecap="round" /></g></g></svg></section>
<aside className="card" style={S("flex:1 1 290px;display:flex;flex-direction:column;gap:10px")}><div style={S("display:flex;align-items:center;gap:8px")}><input value={v.selName} onChange={v.renameRoom} aria-label="Room name" style={S("flex:1;min-width:0;height:44px;border-radius:11px;border:1px solid var(--line);background:var(--soft);color:var(--fg);font:inherit;font-weight:700;font-size:18px;padding:0 12px")} />
<button type="button" className="btn pri" style={S("height:44px;padding:0 14px")} onClick={v.sendSel}>{"Send"}</button></div>
<div style={S("display:flex;flex-wrap:wrap;gap:6px")}><span className="chip mono">{"Mapped "}{v.selMapped}</span>
<span className="chip mono">{"Cleaned "}{v.selDone}</span></div>
<div className="row" style={S("padding:6px 0")}><span>{"Skip when cleaning"}</span>
<button type="button" className={v.selSkipCls} role="switch" aria-label="Skip room" onClick={v.selSkip}><i></i></button></div>
<div style={S("display:flex;gap:8px")}><button type="button" className={`btn ${v.drawCls}`} style={S("flex:1;height:44px;font-size:14px")} onClick={v.drawTog}>{v.drawLabel}</button>
<button type="button" className="btn" style={S("height:44px;padding:0 14px;font-size:14px")} onClick={v.resetExp}>{"Reset map"}</button></div>
{v.zoneList.map((z: any, __i: number) => (<Fragment key={__i}><div className="row" style={S("padding:6px 0")}><span style={S("display:flex;align-items:center;gap:8px;flex:1;min-width:0")}><span className="dot" style={S("background:var(--bad)")}></span>
<input value={z.n} onChange={z.rename} aria-label="Zone name" style={S("flex:1;min-width:0;height:36px;border-radius:9px;border:1px solid var(--line);background:var(--soft);color:var(--fg);font:inherit;font-size:14px;padding:0 10px")} /></span>
<button type="button" className="chip" onClick={z.del}>{"Remove"}</button></div></Fragment>))}
<div style={S("display:flex;flex-wrap:wrap;gap:6px")}>{v.roomChips.map((r: any, __i: number) => (<Fragment key={__i}><button type="button" className={`chip ${r.cls}`} onClick={r.pick}>{r.n}</button></Fragment>))}</div></aside></div></>)}
{v.isParts && (<><div style={S("flex:1;min-height:0;display:flex;flex-wrap:wrap;gap:12px;align-items:stretch")}><section className="card" aria-label="Robot 3D" style={S("flex:1 1 340px;display:flex;flex-direction:column;gap:8px;min-height:380px;padding:12px")}><div style={S("display:flex;align-items:center;justify-content:space-between;gap:10px")}><div className="lbl">{"Stella · 3D"}</div>
<button type="button" className="chip" onClick={v.spinTog}>{v.spinLabel}</button></div>
<div onPointerDown={v.rd} onPointerMove={v.rm} onPointerUp={v.ru} onPointerCancel={v.ru} style={S("position:relative;flex:1;min-height:250px;touch-action:none;perspective:1100px;overflow:hidden;cursor:grab")} aria-label="3D model of Stella"><div className="aur a1" style={S("left:20%;top:30%;width:240px;height:240px;background:var(--st);opacity:.22")}></div>
<div style={S(`position:absolute;left:50%;top:62%;width:0;height:0;transform-style:preserve-3d;transform:${v.sceneT}`)}>{v.rl.map((p: any, __i: number) => (<Fragment key={__i}><div onClick={p.pick} style={S(p.style)}>{p.txt}</div></Fragment>))}</div></div>
<div style={S("display:flex;align-items:center;gap:12px")}><span className="lbl">{"Explode"}</span>
<input type="range" min="0" max="100" step="2" value={v.expl} onChange={v.setExpl} aria-label="Explode" />
<span className="mono" style={S("width:38px;text-align:right")}>{v.expl}{"%"}</span></div>
<div style={S("display:flex;gap:6px;overflow-x:auto;padding-bottom:2px")}>{v.partChips.map((p: any, __i: number) => (<Fragment key={__i}><button type="button" className={`chip ${p.cls}`} style={S("flex:none")} onClick={p.pick}><span className="dot" style={S(`background:${p.dot}`)}></span>
{p.n}</button></Fragment>))}</div></section>
<section className="card" aria-label="Part detail" style={S("flex:1 1 300px;display:flex;flex-direction:column;gap:8px;padding:14px")}><div style={S("display:flex;align-items:center;gap:10px")}><span className="dot" style={S(`width:12px;height:12px;background:${v.partDot}`)}></span>
<span style={S("font-size:24px;font-weight:700;letter-spacing:-.02em")}>{v.partName}</span></div>
<div className="sm">{v.partHead}</div>
<div>{v.partRows.map((m: any, __i: number) => (<Fragment key={__i}><div className="row" style={S("padding:7px 0")}><span className="sm">{m.k}</span>
<b className="mono" style={S("font-size:13px;text-align:right")}>{m.v}</b></div></Fragment>))}</div>
{v.isVac && (<><div className="seg">{v.suctionBtns.map((b: any, __i: number) => (<Fragment key={__i}><button type="button" className={b.cls} onClick={b.pick}>{b.label}</button></Fragment>))}</div>
<div className="row"><span>{"Vacuum motor"}</span>
<button type="button" className={v.vacCls} role="switch" aria-label="Vacuum" onClick={v.vacTog}><i></i></button></div></>)}
{v.isBrushM && (<><div className="row"><span>{"Main brush"}</span>
<button type="button" className={v.mCls} role="switch" aria-label="Main brush" onClick={v.mTog}><i></i></button></div></>)}
{v.isBrushS && (<><div className="row"><span>{"Side brush"}</span>
<button type="button" className={v.sCls} role="switch" aria-label="Side brush" onClick={v.sTog}><i></i></button></div></>)}
<div className="mono" style={S("font-size:11.5px;line-height:1.7;color:var(--mute)")}>{v.partLogs.map((l: any, __i: number) => (<Fragment key={__i}><div><span>{l.t}</span>
{" "}{l.m}</div></Fragment>))}</div></section></div></>)}
{v.isLogs && (<><section className="card" style={S("flex:1;min-height:0;display:flex;flex-direction:column;gap:10px;padding:12px")}><div className="seg" style={S("width:100%")}>{v.lvTabs.map((v: any, __i: number) => (<Fragment key={__i}><button type="button" className={v.cls} onClick={v.pick}>{v.label}</button></Fragment>))}</div>
<div style={S("display:flex;flex-wrap:wrap;gap:6px;align-items:center")}><span className="sm" style={S("flex:none;margin-right:2px")}>{"Show from"}</span><button type="button" className="chip" style={S("flex:none")} onClick={v.logAll}>{"All"}</button>
<button type="button" className="chip" style={S("flex:none")} onClick={v.logNone}>{"None"}</button>
{v.srcChips.map((c: any, __i: number) => (<Fragment key={__i}><button type="button" className="chip mono" style={S(`flex:none;${c.style}`)} onClick={c.pick}>{c.n}</button></Fragment>))}</div>
<div className="mono" style={S("flex:1;min-height:0;overflow:auto;font-size:13px;line-height:1.7;border:1px solid var(--line);border-radius:10px;padding:8px 10px;background:var(--bg)")}>{v.logEmpty && (<><div className="sm">{"Nothing to show."}</div></>)}
{v.logRows.map((l: any, __i: number) => (<Fragment key={__i}><div style={S(`display:flex;flex-wrap:wrap;gap:0 10px;border-left:3px solid ${l.bar};padding-left:8px;margin-bottom:4px`)}><span style={S("color:var(--mute);flex:none")}>{l.t}</span>
<span style={S("color:var(--acc);flex:none")}>{l.svc}</span>
<span style={S(`color:${l.col};white-space:normal;flex:1 1 220px`)}>{l.m}</span></div></Fragment>))}</div></section></>)}
{v.isTv && (<><div style={S("flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;gap:12px")}><section className="card" style={S("width:100%;max-width:520px;padding:10px;display:flex;flex-direction:column;gap:8px")}><div style={S("display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px")}>{v.tvTabs.map((t: any, __i: number) => (<Fragment key={__i}><button type="button" onClick={t.pick} style={S(t.style)}><span style={S("display:flex;align-items:center;gap:6px;font-weight:700;font-size:13.5px;min-width:0")}><span className="dot" style={S(`background:${t.dot}`)}></span>
<span style={S("overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>{t.n}</span></span>
<span className="mono" style={S("font-size:11px;opacity:.75;margin-top:2px")}>{t.st}</span></button></Fragment>))}</div>
<div style={S("display:flex;flex-wrap:wrap;gap:6px;align-items:center")}><span className="chip"><span className="dot" style={S(`background:${v.tvDot}`)}></span>
{v.tvStatus}</span>
<span className="chip">{v.tvApp}</span>
<span className="chip">{v.tvPlayTxt}</span>
<span className="chip mono">{v.tvMuteTxt}</span></div></section>
<div style={S("width:min(268px,76vw);padding:14px 16px 18px;border-radius:40px;background:linear-gradient(160deg,#33205c,#1d1138 55%,#120a24);border:1px solid #43307a;box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 18px 40px rgba(0,0,0,.5);display:flex;flex-direction:column;align-items:center;gap:12px")}><div style={S("display:flex;align-items:center;justify-content:space-between;width:100%")}><span style={S(`width:8px;height:8px;border-radius:50%;background:${v.tvDot};box-shadow:0 0 8px ${v.tvDot}`)}></span>
<button type="button" className="rk" style={S("width:42px;height:42px;background:#d62b2b;box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 3px 0 #5e0f0f")} aria-label="Power" onClick={v.kPower}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M12 3v9M6.3 6.8a8 8 0 1011.4 0" /></svg></button></div>
<div style={S("position:relative;width:170px;height:170px;border-radius:50%;background:radial-gradient(circle,#0e0820 0,#150c2c 70%);border:1px solid #3a2a63;box-shadow:inset 0 2px 10px rgba(0,0,0,.6)")}><button type="button" className="rk" style={S("position:absolute;left:55px;top:5px;width:60px;height:46px;border-radius:30px 30px 8px 8px;background:transparent;box-shadow:none;font-size:18px")} aria-label="Up" onClick={v.kUp}>{"▲"}</button>
<button type="button" className="rk" style={S("position:absolute;left:55px;bottom:5px;width:60px;height:46px;border-radius:8px 8px 30px 30px;background:transparent;box-shadow:none;font-size:18px")} aria-label="Down" onClick={v.kDn}>{"▼"}</button>
<button type="button" className="rk" style={S("position:absolute;left:5px;top:55px;width:46px;height:60px;border-radius:30px 8px 8px 30px;background:transparent;box-shadow:none;font-size:18px")} aria-label="Left" onClick={v.kL}>{"◀"}</button>
<button type="button" className="rk" style={S("position:absolute;right:5px;top:55px;width:46px;height:60px;border-radius:8px 30px 30px 8px;background:transparent;box-shadow:none;font-size:18px")} aria-label="Right" onClick={v.kR}>{"▶"}</button>
<button type="button" className="rk" style={S("position:absolute;left:51px;top:51px;width:68px;height:68px;background:radial-gradient(circle at 35% 30%,#8a5cf0,#5a2fc0);box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 3px 0 #2a1470;font-size:16px")} aria-label="OK" onClick={v.kOk}>{"OK"}</button></div>
<div style={S("display:flex;justify-content:space-between;width:100%;padding:0 8px")}><button type="button" className="rk" style={S("width:48px;height:48px")} aria-label="Back" onClick={v.kBack}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ececec" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 7L4 12l5 5M4 12h10a6 6 0 010 8h-2" /></svg></button>
<button type="button" className="rk" style={S("width:48px;height:48px")} aria-label="Home" onClick={v.kHome}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ececec" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" /></svg></button></div>
<div style={S("display:flex;width:100%;border-radius:30px;background:#0e0820;border:1px solid #3a2a63;overflow:hidden")}><button type="button" className="rk" style={S("flex:1;height:46px;border-radius:0;background:transparent;box-shadow:none")} aria-label="Rewind" onClick={v.kRw}>{"◀◀"}</button>
<button type="button" className="rk" style={S("flex:1;height:46px;border-radius:0;background:transparent;box-shadow:none;font-size:16px")} aria-label="Play or pause" onClick={v.kPlay}>{v.kPlayLbl}</button>
<button type="button" className="rk" style={S("flex:1;height:46px;border-radius:0;background:transparent;box-shadow:none")} aria-label="Fast forward" onClick={v.kFf}>{"▶▶"}</button></div>
<div style={S("display:flex;align-items:center;justify-content:space-between;width:100%;padding:0 8px")}><div style={S("display:flex;flex-direction:column;width:52px;border-radius:30px;background:#0e0820;border:1px solid #3a2a63;overflow:hidden")}><button type="button" className="rk" style={S("height:48px;border-radius:0;background:transparent;box-shadow:none;font-size:22px")} aria-label="Volume up" onClick={v.kVu}>{"+"}</button>
<span className="mono" style={S("text-align:center;font-size:10px;color:#9d8bd0;letter-spacing:.14em;padding:2px 0")}>{"VOL"}</span>
<button type="button" className="rk" style={S("height:48px;border-radius:0;background:transparent;box-shadow:none;font-size:22px")} aria-label="Volume down" onClick={v.kVd}>{"−"}</button></div>
<button type="button" className="rk" style={S(`width:50px;height:50px;background:${v.kMuteBg}`)} aria-label="Mute" onClick={v.kMute}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ececec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9h4l5-4v14l-5-4H4zM17 9l4 6M21 9l-4 6" /></svg></button>
<button type="button" className="rk" style={S("width:50px;height:50px")} aria-label="Options" onClick={v.kOpt}>{"✱"}</button></div>
<div style={S("display:grid;grid-template-columns:repeat(4,1fr);gap:6px;width:100%")}>{v.tvShort.map((a: any, __i: number) => (<Fragment key={__i}><button type="button" className="rk" style={S(a.style)} onClick={a.pick}>{a.n}</button></Fragment>))}</div></div></div></>)}
{v.isClimate && (<><div style={S("display:flex;flex-wrap:wrap;gap:12px;align-items:flex-start")}><section className="card" style={S(`flex:1 1 340px;background:${v.climBg};border-color:transparent;color:#fff;display:flex;flex-direction:column;align-items:center;gap:12px;padding:14px 14px 16px;transition:background .5s`)}><div style={S("align-self:stretch;display:flex;justify-content:space-between;align-items:center")}><span style={S("font-size:14px;font-weight:600")}>{"Living Room · Nest"}</span>
<span style={S("font-size:12px;opacity:.8")}>{v.equipTxt}</span></div>
<div style={S("position:relative;width:min(280px,76vw);aspect-ratio:1;touch-action:none;user-select:none;cursor:pointer")} onPointerDown={v.dialDown} onPointerMove={v.dialMove} onPointerUp={v.dialUp} onPointerCancel={v.dialUp}><svg viewBox="0 0 300 300" width="100%" height="100%" aria-hidden="true" style={S("display:block")}>{v.ticks.map((t: any, __i: number) => (<Fragment key={__i}><line x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.c} strokeWidth={t.w} strokeLinecap="round" /></Fragment>))}</svg>
<div style={S("position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none")}><span style={S("font-size:11px;letter-spacing:.16em;font-weight:600;opacity:.85")}>{v.climLbl}</span>
<span style={S("font-size:84px;font-weight:300;line-height:1;letter-spacing:-.04em")}>{v.setBig}</span>
<span style={S("font-size:14px;opacity:.85;margin-top:4px")}>{"Inside "}{v.curTxt}{"°"}</span></div></div>
<div style={S("display:flex;align-items:center;gap:22px")}><button type="button" style={S("width:52px;height:52px;border-radius:50%;border:1.5px solid rgba(255,255,255,.55);background:rgba(255,255,255,.12);color:#fff;font-size:26px;cursor:pointer")} aria-label="Lower" onClick={v.setDn}>{"−"}</button>
<button type="button" style={S("width:52px;height:52px;border-radius:50%;border:1.5px solid rgba(255,255,255,.55);background:rgba(255,255,255,.12);color:#fff;font-size:26px;cursor:pointer")} aria-label="Raise" onClick={v.setUp}>{"+"}</button></div>
<div style={S("display:flex;width:100%;gap:6px;padding:4px;border-radius:30px;background:rgba(0,0,0,.25)")}>{v.cmodes.map((m: any, __i: number) => (<Fragment key={__i}><button type="button" style={S(m.style)} onClick={m.pick}>{m.label}</button></Fragment>))}</div>
<div style={S("display:flex;width:100%;gap:6px")}>{v.presets.map((p: any, __i: number) => (<Fragment key={__i}><button type="button" style={S(p.style)} onClick={p.pick}><span style={S("font-size:11px;opacity:.8")}>{p.n}</span>
<span style={S("font-size:18px;font-weight:600")}>{p.v}{"°"}</span></button></Fragment>))}</div></section>
<section style={S("flex:1 1 300px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px")}><div className="card" style={S("padding:12px")}><div className="lbl">{"Next"}</div>
<div style={S("font-size:19px;font-weight:700;margin-top:6px")}>{v.nextT}</div>
<div className="sm">{v.nextWhen}</div></div>
<button type="button" className="card" style={S("padding:12px;text-align:left")} onClick={v.ecoTog}><div className="lbl">{"Eco when away"}</div>
<div style={S(`font-size:19px;font-weight:700;margin-top:6px;color:${v.ecoCol}`)}>{v.ecoTxt}</div>
<div className="sm">{"Tap to switch"}</div></button>
<div className="card" style={S("padding:12px;grid-column:1 / -1")}><div style={S("display:flex;justify-content:space-between;align-items:baseline")}><span className="lbl">{"Runtime · 7 days"}</span>
<span className="mono" style={S("font-size:13px")}>{v.runToday}{" h today"}</span></div>
<svg viewBox="0 0 210 64" width="100%" style={S("display:block;margin-top:8px")} aria-hidden="true">{v.runBars.map((b: any, __i: number) => (<Fragment key={__i}><rect x={b.x} y={b.y} width="22" height={b.h} rx="4" fill={b.f} /></Fragment>))}</svg>
<div style={S("display:flex;justify-content:space-between;margin-top:4px")} className="sm">{v.runBars.map((b: any, __i: number) => (<Fragment key={__i}><span style={S("width:30px;text-align:center;font-size:11px")}>{b.d}</span></Fragment>))}</div></div>
<div className="card" style={S("padding:12px")}><div className="lbl">{"Air filter"}</div>
<div style={S("font-size:19px;font-weight:700;margin-top:6px")}>{"62%"}</div>
<div style={S("height:5px;border-radius:3px;background:var(--soft);margin-top:6px")}><div style={S("height:5px;width:62%;border-radius:3px;background:var(--ok)")}></div></div></div>
<div className="card" style={S("padding:12px")}><div className="lbl">{"Safety temps"}</div>
<div className="mono" style={S("font-size:19px;font-weight:700;margin-top:6px")}><span style={S("color:#ff7a1a")}>{"40°"}</span>
{" · "}
<span style={S("color:#5aa9ff")}>{"95°"}</span></div>
<div className="sm">{"Humidity "}{v.humid}{"%"}</div></div></section></div></>)}
{v.isSettings && (<><div style={S("display:flex;flex-wrap:wrap;gap:12px;align-items:flex-start")}><section className="card" style={S("flex:1 1 320px;display:flex;flex-direction:column;gap:6px")}><div className="lbl" style={S("margin-bottom:4px")}>{"Voice"}</div>
<div className="seg">{v.brainTabs.map((b: any, __i: number) => (<Fragment key={__i}><button type="button" className={b.cls} onClick={b.pick}>{b.label}</button></Fragment>))}</div>
{v.sV.map((x: any, __i: number) => (<Fragment key={__i}><button type="button" className="row" style={S("width:100%;text-align:left")} onClick={x.pick}><span>{x.label}</span>
<span className={x.tc} style={S(x.showTog)}><i></i></span>
<span className="chip mono" style={S(x.showVal)}>{x.val}</span></button></Fragment>))}</section>
<section className="card" style={S("flex:1 1 320px;display:flex;flex-direction:column;gap:6px")}><div className="lbl" style={S("margin-bottom:4px")}>{"Cleaning and dock"}</div>
{v.sC.map((x: any, __i: number) => (<Fragment key={__i}><button type="button" className="row" style={S("width:100%;text-align:left")} onClick={x.pick}><span>{x.label}</span>
<span className={x.tc} style={S(x.showTog)}><i></i></span>
<span className="chip mono" style={S(x.showVal)}>{x.val}</span></button></Fragment>))}</section>
<section className="card" style={S("flex:1 1 320px;display:flex;flex-direction:column;gap:6px")}><div className="lbl" style={S("margin-bottom:4px")}>{"Safety and alerts"}</div>
{v.sS.map((x: any, __i: number) => (<Fragment key={__i}><button type="button" className="row" style={S("width:100%;text-align:left")} onClick={x.pick}><span>{x.label}</span>
<span className={x.tc} style={S(x.showTog)}><i></i></span>
<span className="chip mono" style={S(x.showVal)}>{x.val}</span></button></Fragment>))}</section>
<section className="card" style={S("flex:1 1 320px;display:flex;flex-direction:column;gap:6px")}><div className="lbl" style={S("margin-bottom:4px")}>{"Display and account"}</div>
<div className="seg">{v.themeTabs.map((t: any, __i: number) => (<Fragment key={__i}><button type="button" className={t.cls} onClick={t.pick}>{t.label}</button></Fragment>))}</div>
{v.sD.map((x: any, __i: number) => (<Fragment key={__i}><button type="button" className="row" style={S("width:100%;text-align:left")} onClick={x.pick}><span>{x.label}</span>
<span className={x.tc} style={S(x.showTog)}><i></i></span>
<span className="chip mono" style={S(x.showVal)}>{x.val}</span></button></Fragment>))}
{v.isDemo && (<><div className="lbl" style={S("margin-top:8px")}>{"Demo robot state"}</div>
<div style={S("display:flex;flex-wrap:wrap;gap:6px")}>{v.stateChips.map((c: any, __i: number) => (<Fragment key={__i}><button type="button" className={`chip ${c.cls}`} onClick={c.pick}>{c.label}</button></Fragment>))}</div></>)}</section></div></>)}</main>
{v.voiceOpen && (<><div role="dialog" aria-label="Voice" style={S("position:fixed;inset:0;z-index:50;background:radial-gradient(ellipse at 50% 22%,#17171d,#050507 72%);color:#ececec;display:flex;flex-direction:column;overflow:hidden")}><div className="aur a1" style={S(`left:50%;top:40px;margin-left:-190px;width:380px;height:380px;background:${v.orbGlowC};opacity:.28`)}></div>
<div style={S("position:relative;display:flex;align-items:center;justify-content:space-between;padding:14px 14px 0")}><button type="button" onClick={v.traceTog} style={S("height:38px;padding:0 14px;border-radius:999px;border:1px solid #2c2c34;background:#111116;color:#ececec;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px")}><span className="dot" style={S(`background:${v.brainDotC};box-shadow:0 0 10px ${v.brainDotC}`)}></span>
{v.traceLabel}</button>
<button type="button" onClick={v.closeVoice} aria-label="Close voice" style={S("width:44px;height:44px;border-radius:50%;border:1px solid #2c2c34;background:#111116;display:flex;align-items:center;justify-content:center")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ececec" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></button></div>
{v.traceOpen && (<><div style={S("position:relative;margin:10px 14px 0;border:1px solid #2c2c34;border-radius:14px;background:rgba(12,12,16,.92);padding:10px 12px")}><div className="mono" style={S("font-size:12px;line-height:1.8")}>{v.vlogs.map((l: any, __i: number) => (<Fragment key={__i}><div style={S("display:flex;gap:8px")}><span style={S("color:#6d6d76")}>{l.t}</span>
<span style={S(`color:${l.col};min-width:52px`)}>{l.tag}</span>
<span style={S("color:#b9b9c2")}>{l.m}</span></div></Fragment>))}</div></div></>)}
<div style={S("position:relative;display:flex;justify-content:center;padding-top:8px")}><div style={S(`position:relative;width:min(250px,60vw);aspect-ratio:1;filter:drop-shadow(0 0 26px ${v.orbGlowC})`)}><svg viewBox="-120 -120 240 240" width="100%" height="100%" aria-hidden="true"><defs><radialGradient id="orbg" cx=".35" cy=".3" r=".9"><stop offset="0" stopColor={v.orbC1} />
<stop offset="1" stopColor={v.orbC2} /></radialGradient></defs>
{v.vb.map((b: any, __i: number) => (<Fragment key={__i}><line x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} stroke={b.c} strokeWidth="3.2" strokeLinecap="round" opacity={b.o} /></Fragment>))}
<circle r={v.ringR} fill="none" stroke={v.orbGlowC} strokeWidth="1.5" opacity={v.ringO} />
<circle r="56" fill="url(#orbg)" />
{v.vmIdle && (<><g stroke="#fff" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" transform="translate(-14 -18) scale(1.17)"><path d="M9 3h6v10a3 3 0 01-6 0zM5 11a7 7 0 0014 0M12 18v3" /></g></>)}
{v.vmThink && (<><g transform={`rotate(${v.dotRot})`} fill="#fff"><circle cx="0" cy="-22" r="5" />
<circle cx="19" cy="11" r="4" opacity=".7" />
<circle cx="-19" cy="11" r="3" opacity=".45" /></g></>)}
{v.vmTalk && (<><text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" letterSpacing="3" fontFamily="JetBrains Mono, monospace">{v.midText}</text></>)}</svg>
<button type="button" aria-label="Talk" onPointerDown={v.vDown} onPointerUp={v.vUp} style={S("position:absolute;left:22%;top:22%;width:56%;height:56%;border-radius:50%;touch-action:none;user-select:none;-webkit-touch-callout:none")}></button></div></div>
<div style={S("position:relative;text-align:center;font-size:14px;color:#9a9aa3;height:20px")}>{v.vState}</div>
<div style={S("position:relative;flex:1;min-height:0;overflow:auto;padding:10px 20px 8px;display:flex;flex-direction:column;gap:14px")}>{v.oldTurns.map((t: any, __i: number) => (<Fragment key={__i}><div style={S("display:flex;flex-direction:column;gap:3px;opacity:.5")}><div style={S("font-size:14px;color:#c9c9d1")}>{t.heard}</div>
<div style={S("font-size:16px;font-weight:500;line-height:1.35")}>{t.reply}</div></div></Fragment>))}
{v.showCur && (<><div style={S("display:flex;flex-direction:column;gap:8px")}><div style={S(`font-size:${v.userSize};color:${v.userCol};line-height:1.3;font-weight:500`)}>{v.curUser}</div>
{v.hasReply && (<><div style={S("font-size:26px;font-weight:600;letter-spacing:-.02em;line-height:1.25")}>{v.curReply}</div></>)}
{v.curTag && (<><div className="mono" style={S("font-size:11.5px;color:#8d8d94;display:flex;align-items:center;gap:8px")}><span className="dot" style={S(`background:${v.curDot}`)}></span>
{v.curTag}</div></>)}</div></>)}
{v.showEmpty && (<><div style={S("margin:auto;font-size:20px;color:#6d6d76;text-align:center")}>{"Tap the orb and talk"}</div></>)}</div>
<div style={S("position:relative;padding:8px 14px 18px;display:flex;flex-direction:column;align-items:center;gap:8px")}><div style={S("position:relative;width:min(380px,100%);height:48px;border-radius:999px;background:#111116;border:1px solid #2c2c34;display:grid;grid-template-columns:repeat(3,1fr)")}><div style={S(v.selThumb)}></div>
{v.selOpts.map((o: any, __i: number) => (<Fragment key={__i}><button type="button" onClick={o.pick} style={S(o.style)}>{o.label}</button></Fragment>))}</div>
<div style={S("font-size:12.5px;color:#9a9aa3;display:flex;align-items:center;gap:7px")}><span className="dot" style={S(`background:${v.brainDotC}`)}></span>
{v.usingTxt}</div></div></div></>)}
{v.fpv && (<><div role="dialog" aria-label="First-person drive" style={S("position:fixed;inset:0;z-index:55;background:#05050a;color:#fff;overflow:hidden")}><div className="aur a1" style={S("left:-60px;top:-60px;width:340px;height:340px;background:var(--st);opacity:.4")}></div>
<div className="aur a2" style={S("right:-60px;bottom:-60px;width:380px;height:380px;background:#6a5cff;opacity:.38")}></div>
<div className="aur a3" style={S("left:40%;top:25%;width:260px;height:260px;background:#00d4ff;opacity:.22")}></div>
{v.camShow ? (<><img key={v.camUrl} src={v.camUrl} alt="Stella camera, live" onError={v.camErr} style={S(v.camImgStyle)} />
<div aria-label="Pinch or double-tap to zoom, drag to move" onPointerDown={v.camDown} onPointerMove={v.camMove} onPointerUp={v.camUp} onPointerCancel={v.camUp} onDoubleClick={v.camDbl} style={S("position:absolute;inset:0;touch-action:none;cursor:zoom-in")}></div>
<CamControls v={v} pos="left:50%;top:56px;transform:translateX(-50%)" row /></>) : (<><svg viewBox="0 0 640 360" preserveAspectRatio="none" width="100%" height="100%" style={S("position:absolute;inset:0;pointer-events:none")} aria-hidden="true">{v.fp.map((c: any, __i: number) => (<Fragment key={__i}><rect x={c.x} y={c.y} width={c.w} height={c.h} fill={c.f} opacity={c.o} /></Fragment>))}</svg>
<div style={S("position:absolute;inset:0;touch-action:none;cursor:grab")} onPointerDown={v.lookDown} onPointerMove={v.lookMove} onPointerUp={v.lookUp} onPointerCancel={v.lookUp}></div></>)}
{!v.camShow && (<><svg viewBox="0 0 100 100" width="60" height="60" style={S("position:absolute;left:50%;top:50%;margin:-30px 0 0 -30px;opacity:.75;pointer-events:none")} aria-hidden="true"><path d="M50 18v22M50 60v22M18 50h22M60 50h22" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
<circle cx="50" cy="50" r="3" fill="#fff" /></svg>
<div className="mono" style={S("position:absolute;left:50%;top:58px;transform:translateX(-50%);font-size:13px;background:rgba(0,0,0,.5);padding:5px 14px;border-radius:999px;pointer-events:none")}>{v.viewDeg}{"° "}{v.headDir}{" · "}{v.nearLabel}</div></>)}
<div role="group" aria-label="View" style={S("position:absolute;left:50%;top:10px;transform:translateX(-50%);display:flex;gap:4px;padding:3px;border-radius:999px;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.3)")}>{v.camTabs.map((c: any, __i: number) => (<Fragment key={__i}><button type="button" onClick={c.pick} aria-pressed={c.cls === "on"} style={S(`height:34px;padding:0 14px;border-radius:999px;font-size:13px;font-weight:600;${c.cls === "on" ? "background:#fff;color:#111" : "background:transparent;color:#fff"}`)}>{c.label}</button></Fragment>))}</div>
<button type="button" className="chip" onClick={v.closeFpv} style={S("position:absolute;right:14px;top:10px;height:40px;padding:0 16px;background:rgba(0,0,0,.55);color:#fff;border-color:rgba(255,255,255,.3)")}>{"Close"}</button>
{v.lookOff && (<><button type="button" className="chip" onClick={v.lookCenter} style={S("position:absolute;left:14px;top:10px;height:40px;padding:0 16px;background:rgba(0,0,0,.55);color:#fff;border-color:rgba(255,255,255,.3)")}>{"Center"}</button></>)}
<svg viewBox="0 0 150 150" width="132" height="132" style={S("position:absolute;left:14px;top:60px;pointer-events:none")} aria-hidden="true"><defs><clipPath id="mmclip"><circle cx="75" cy="75" r="72" /></clipPath></defs>
<circle cx="75" cy="75" r="72" fill="rgba(0,0,0,.6)" />
<g clipPath="url(#mmclip)"><g transform={v.miniT}><path d={v.expPath} fill="var(--st)" opacity=".3" />
<path d={v.scanPoly} fill="var(--st)" opacity=".22" />
<path d={v.walls} fill="none" stroke="#d8d8de" strokeWidth="6" />
<path d={v.hits} fill="none" stroke="var(--st)" strokeWidth="5" strokeLinecap="round" /></g>
<path d="M75 75L19.8 28.7A72 72 0 0 1 130.2 28.7Z" fill="rgba(255,255,255,.13)" /></g>
<circle cx="75" cy="75" r="72" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2" />
<path d="M75 64L69 82L75 78L81 82Z" fill="#fff" />
<text x="75" y="14" textAnchor="middle" fontSize="10" fill="#fff" fontFamily="JetBrains Mono, monospace">{v.headDir}</text></svg>
<div style={S("position:absolute;left:14px;bottom:18px;touch-action:none")}><div className="stick sm" onPointerDown={v.sd} onPointerMove={v.sm} onPointerUp={v.su} onPointerCancel={v.su} aria-label="Drive stick" style={S("background:rgba(0,0,0,.35);border-color:rgba(255,255,255,.3)")}><div style={S("position:absolute;left:50%;top:10px;bottom:10px;width:1px;background:rgba(255,255,255,.2)")}></div>
<div style={S("position:absolute;top:50%;left:10px;right:10px;height:1px;background:rgba(255,255,255,.2)")}></div>
<div className="knob" style={S(`transform:${v.knobT}`)}></div></div></div>
<div style={S("position:absolute;left:14px;bottom:186px;display:flex;gap:8px")}>{v.tools.map((t: any, __i: number) => (<Fragment key={__i}><button type="button" className="btn" onClick={t.pick} role="switch" aria-checked={t.on} style={S(`height:44px;padding:0 12px;font-size:13px;background:rgba(0,0,0,.55);color:#fff;${t.style}`)}><span className="dot" style={S(`background:${t.dot}`)}></span>
{t.n}</button></Fragment>))}</div>
<div style={S("position:absolute;right:14px;bottom:18px;display:flex;flex-direction:column;gap:10px;align-items:stretch;width:176px;padding:12px;border-radius:18px;background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.15)")}><div style={S("display:flex;justify-content:space-between;align-items:baseline")}><span className="lbl">{"Speed"}</span>
<span className="mono" style={S("font-size:24px;font-weight:500;color:#ff8a55")}>{v.speed}
<span style={S("font-size:12px;color:#9a9aa3")}>{"%"}</span></span></div>
<div style={S("display:flex;gap:3px;height:44px;align-items:flex-end")}>{v.spdSegs.map((g: any, __i: number) => (<Fragment key={__i}><button type="button" aria-label={g.label} onClick={g.pick} style={S(g.style)}></button></Fragment>))}</div>
<div style={S("display:flex;gap:8px")}><button type="button" className={`btn ${v.goCls}`} style={S("flex:1;height:46px;padding:0 8px;background:rgba(0,0,0,.5)")} onClick={v.goTog}>{v.goLabel}</button>
{v.showDock && (<><button type="button" className="btn" style={S("height:46px;padding:0 12px;background:rgba(0,0,0,.5);color:#fff")} onClick={v.dock}>{"Charge"}</button></>)}</div></div></div></>)}
{v.toast && (<><div role="status" style={S("position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:60;background:var(--fg);color:var(--bg);padding:11px 18px;border-radius:12px;font-weight:600;font-size:14px;max-width:90vw;box-shadow:0 8px 30px rgba(0,0,0,.4)")}>{v.toast}</div></>)}</div>
    </>
  );
}
