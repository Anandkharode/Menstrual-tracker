import React from 'react';

export default function HealthAssistantMarkup() {
  return (
    <div id="health-assistant-root">


<div id="toast"></div>

<div className="shell min-h-screen grid grid-cols-[220px_1fr] bg-[#0d0a14] text-[#f0eaf8]" id="app-shell" style={{ display: "none" }}>

<aside className="sidebar sticky top-0 h-screen overflow-y-auto bg-[#16111f] border-r border-white/10 px-5 py-8 flex flex-col gap-2">
  <div className="logo flex items-center gap-2.5 px-2 pb-7 mb-2 border-b border-white/10" data-onclick="goToWelcome()" title="Back to Welcome" style={{ cursor: "pointer", transition: "opacity 0.2s" }} data-onmouseover="this.style.opacity='0.75'" data-onmouseout="this.style.opacity='1'">
    <div className="logo-icon h-9 w-9 rounded-full bg-gradient-to-br from-[#e8617a] to-[#9b7fe8] text-white flex items-center justify-center text-sm">🌙</div>
    <span className="logo-text font-['Playfair_Display'] text-[22px] tracking-tight bg-gradient-to-br from-[#f0eaf8] to-[#9b7fe8] text-transparent bg-clip-text" style={{ fontSize: "15px", fontWeight: "500" }}>Health Assistant</span>
    <span style={{ marginLeft: "auto", fontSize: "11px", color: "var(--text-dim)" }}>← Home</span>
  </div>
  <button className="nav-item active w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 text-sm bg-[#9b7fe8]/15 text-[#9b7fe8] font-medium" id="nav-dashboard" data-onclick="goTo('dashboard')"><span className="nav-icon">⊞</span>Dashboard</button>
  <button className="nav-item w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#f0eaf8]/60 hover:text-[#f0eaf8] hover:bg-white/5 transition" id="nav-log" data-onclick="goTo('log')"><span className="nav-icon">📋</span>Log Symptoms</button>
  <button className="nav-item w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#f0eaf8]/60 hover:text-[#f0eaf8] hover:bg-white/5 transition" id="nav-symptom-history" data-onclick="goTo('symptom-history')"><span className="nav-icon">🕐</span>Symptom History</button>
  <button className="nav-item w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#f0eaf8]/60 hover:text-[#f0eaf8] hover:bg-white/5 transition" id="nav-history" data-onclick="goTo('history')"><span className="nav-icon">📅</span>Cycle History</button>
  <button className="nav-item w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#f0eaf8]/60 hover:text-[#f0eaf8] hover:bg-white/5 transition" id="nav-predictions" data-onclick="goTo('predictions')"><span className="nav-icon">🔮</span>Predictions</button>
  <div className="nav-section text-[10px] uppercase tracking-[1.2px] text-[#f0eaf8]/30 px-3 pt-4 pb-1">Insights</div>
  <button className="nav-item w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#f0eaf8]/60 hover:text-[#f0eaf8] hover:bg-white/5 transition" id="nav-insights" data-onclick="goTo('insights')"><span className="nav-icon">📊</span>Graphs</button>
  <button className="nav-item w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#f0eaf8]/60 hover:text-[#f0eaf8] hover:bg-white/5 transition" id="nav-anomalies" data-onclick="goTo('anomalies')"><span className="nav-icon">⚠️</span>Anomalies</button>
  <div className="nav-section text-[10px] uppercase tracking-[1.2px] text-[#f0eaf8]/30 px-3 pt-4 pb-1">Support</div>
  <button className="nav-item w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#f0eaf8]/60 hover:text-[#f0eaf8] hover:bg-white/5 transition" id="nav-ai" data-onclick="goTo('ai')"><span className="nav-icon">💬</span>AI Assistant<div className="notif-dot ml-auto h-2 w-2 rounded-full bg-[#e8617a] animate-pulse"></div></button>
  <button className="nav-item w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#f0eaf8]/60 hover:text-[#f0eaf8] hover:bg-white/5 transition" id="nav-chat-history" data-onclick="goTo('chat-history')"><span className="nav-icon">💾</span>Chat History</button>
  <button className="nav-item w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#f0eaf8]/60 hover:text-[#f0eaf8] hover:bg-white/5 transition" id="nav-reminders" data-onclick="goTo('reminders')"><span className="nav-icon">⏰</span>Reminders</button>
  <button className="nav-item w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#f0eaf8]/60 hover:text-[#f0eaf8] hover:bg-white/5 transition" id="nav-notifications" data-onclick="goTo('notifications')"><span className="nav-icon">🔔</span>Notifications</button>
  <button className="nav-item w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#f0eaf8]/60 hover:text-[#f0eaf8] hover:bg-white/5 transition" id="nav-settings" data-onclick="goTo('settings')"><span className="nav-icon">⚙️</span>Settings</button>
  <div className="sidebar-footer mt-auto px-3 pt-4 border-t border-white/10 flex items-center gap-2">
    <div className="avatar h-9 w-9 rounded-full border border-[#9b7fe8] bg-gradient-to-br from-[#e8617a]/15 to-[#9b7fe8]/15 flex items-center justify-center text-sm" id="sidebar-avatar">S</div>
    <div className="user-info"><div className="name" id="sidebar-name">Sneha</div><div className="role">Cycle day 14</div></div>
  </div>
</aside>


<main className="main min-h-screen flex flex-col gap-6 px-10 py-9">


<div className="page active" id="page-dashboard">
  <div className="topbar flex items-start justify-between">
    <div><h1 className="page-title font-['Playfair_Display'] text-[28px] font-semibold tracking-tight">Good morning, <span className="user-display-name">Sneha</span> ✨</h1><p className="page-subtitle mt-1 text-xs text-[#f0eaf8]/50">Friday, March 27 · Here's your cycle overview</p></div>
    <div className="top-actions flex items-center gap-2.5">
      <button className="btn btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium border border-white/10 text-[#f0eaf8]/60 hover:text-[#9b7fe8] hover:border-[#9b7fe8] transition" id="theme-toggle-btn" data-onclick="toggleTheme()" title="Toggle day/night mode" style={{ fontSize: "16px", padding: "9px 14px" }}>🌙</button>
      <button className="btn btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium border border-white/10 text-[#f0eaf8]/60 hover:text-[#9b7fe8] hover:border-[#9b7fe8] transition" data-onclick="exportData()">📤 Export</button>
      <button className="btn btn-primary inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium bg-gradient-to-br from-[#e8617a] to-[#9b7fe8] text-white hover:opacity-90 active:scale-[0.98] transition" data-onclick="goTo('log')">+ Log Today</button>
    </div>
  </div>
  <div className="alert-strip flex items-center gap-3 rounded-xl border border-[#4ecdc4]/20 bg-gradient-to-r from-[#4ecdc4]/10 to-[#4ecdc4]/5 px-4 py-3 text-sm text-[#4ecdc4]"><div className="dot"></div><span>Ovulation window predicted in <strong>3 days</strong> (Mar 30). You may notice changes in discharge and energy.</span></div>
  <div className="cycle-row grid gap-5 lg:grid-cols-[280px_1fr]">
    <div className="cycle-card relative overflow-hidden rounded-2xl border border-white/10 bg-[#16111f] p-7 flex flex-col items-center gap-5">
      <div className="ring-wrap relative h-40 w-40">
        <svg viewBox="0 0 160 160">
          <defs><linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#e8617a"/><stop offset="100%" stop-color="#9b7fe8"/></linearGradient></defs>
          <circle className="ring-bg" cx="80" cy="80" r="70"/>
          <circle className="ring-fill" cx="80" cy="80" r="70"/>
        </svg>
        <div className="ring-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"><div className="ring-day">14</div><div className="ring-label">of 28 days</div></div>
      </div>
      <div className="cycle-info w-full">
        <div className="cycle-phase flex items-center justify-between rounded-xl bg-[#e8617a]/15 px-3.5 py-2"><span className="phase-name">🌸 Follicular Phase</span><span className="phase-days">Days 5–14</span></div>
        <div className="cycle-stats grid grid-cols-2 gap-2">
          <div className="cstat rounded-xl bg-[#1e1729] px-3 py-2"><div className="cstat-label">Next Period</div><div className="cstat-val" style={{ color: "var(--rose)" }}>Apr 10</div></div>
          <div className="cstat rounded-xl bg-[#1e1729] px-3 py-2"><div className="cstat-label">Cycle Length</div><div className="cstat-val">28 days</div></div>
          <div className="cstat rounded-xl bg-[#1e1729] px-3 py-2"><div className="cstat-label">Last Period</div><div className="cstat-val">Mar 13</div></div>
          <div className="cstat rounded-xl bg-[#1e1729] px-3 py-2"><div className="cstat-label">Ovulation</div><div className="cstat-val" style={{ color: "var(--teal)" }}>Mar 30</div></div>
        </div>
      </div>
    </div>
    <div className="predictions-card rounded-2xl border border-white/10 bg-[#16111f] p-7 flex flex-col gap-4">
      <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]">Cycle Calendar</span><span className="badge badge-teal rounded-full px-2.5 py-1 text-[11px] font-medium bg-[#4ecdc4]/15 text-[#4ecdc4]">March – April</span></div>
      <div className="cal-strip grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1">
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Fr</span><div className="cal-num today">27</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Sa</span><div className="cal-num flex h-7 w-7 items-center justify-center rounded-lg text-xs transition hover:bg-white/5">28</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Su</span><div className="cal-num flex h-7 w-7 items-center justify-center rounded-lg text-xs transition hover:bg-white/5">29</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Mo</span><div className="cal-num fertile">30</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Tu</span><div className="cal-num fertile">31</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">We</span><div className="cal-num ovulation">1</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Th</span><div className="cal-num fertile">2</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Fr</span><div className="cal-num fertile">3</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Sa</span><div className="cal-num flex h-7 w-7 items-center justify-center rounded-lg text-xs transition hover:bg-white/5">4</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Su</span><div className="cal-num flex h-7 w-7 items-center justify-center rounded-lg text-xs transition hover:bg-white/5">5</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Mo</span><div className="cal-num flex h-7 w-7 items-center justify-center rounded-lg text-xs transition hover:bg-white/5">6</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Tu</span><div className="cal-num flex h-7 w-7 items-center justify-center rounded-lg text-xs transition hover:bg-white/5">7</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">We</span><div className="cal-num flex h-7 w-7 items-center justify-center rounded-lg text-xs transition hover:bg-white/5">8</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Th</span><div className="cal-num flex h-7 w-7 items-center justify-center rounded-lg text-xs transition hover:bg-white/5">9</div></div>
      </div>
      <div className="cal-strip grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1">
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Fr</span><div className="cal-num predicted">10</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Sa</span><div className="cal-num predicted">11</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Su</span><div className="cal-num predicted">12</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Mo</span><div className="cal-num predicted">13</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Tu</span><div className="cal-num predicted">14</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">We</span><div className="cal-num flex h-7 w-7 items-center justify-center rounded-lg text-xs transition hover:bg-white/5">15</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Th</span><div className="cal-num flex h-7 w-7 items-center justify-center rounded-lg text-xs transition hover:bg-white/5">16</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Fr</span><div className="cal-num flex h-7 w-7 items-center justify-center rounded-lg text-xs transition hover:bg-white/5">17</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Sa</span><div className="cal-num flex h-7 w-7 items-center justify-center rounded-lg text-xs transition hover:bg-white/5">18</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Su</span><div className="cal-num flex h-7 w-7 items-center justify-center rounded-lg text-xs transition hover:bg-white/5">19</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Mo</span><div className="cal-num flex h-7 w-7 items-center justify-center rounded-lg text-xs transition hover:bg-white/5">20</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Tu</span><div className="cal-num flex h-7 w-7 items-center justify-center rounded-lg text-xs transition hover:bg-white/5">21</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">We</span><div className="cal-num flex h-7 w-7 items-center justify-center rounded-lg text-xs transition hover:bg-white/5">22</div></div>
        <div className="cal-day flex flex-col items-center gap-1"><span className="cal-dow text-[9px] uppercase tracking-[0.5px] text-[#f0eaf8]/30">Th</span><div className="cal-num flex h-7 w-7 items-center justify-center rounded-lg text-xs transition hover:bg-white/5">23</div></div>
      </div>
      <div className="cal-legend flex flex-wrap gap-4">
        <div className="legend-item flex items-center gap-1.5 text-[11px] text-[#f0eaf8]/50"><div className="legend-dot h-2 w-2 rounded-[3px]" style={{ background: "linear-gradient(135deg,var(--rose),var(--lavender))" }}></div>Today</div>
        <div className="legend-item flex items-center gap-1.5 text-[11px] text-[#f0eaf8]/50"><div className="legend-dot h-2 w-2 rounded-[3px]" style={{ background: "rgba(78,205,196,0.3)" }}></div>Fertile</div>
        <div className="legend-item flex items-center gap-1.5 text-[11px] text-[#f0eaf8]/50"><div className="legend-dot h-2 w-2 rounded-[3px]" style={{ background: "var(--teal-soft)", border: "1px solid var(--teal)" }}></div>Ovulation</div>
        <div className="legend-item flex items-center gap-1.5 text-[11px] text-[#f0eaf8]/50"><div className="legend-dot h-2 w-2 rounded-[3px]" style={{ border: "1px dashed rgba(232,97,122,0.5)" }}></div>Predicted</div>
      </div>
    </div>
  </div>
  <div className="bottom-grid grid gap-5 lg:grid-cols-3">
    <div className="mini-card rounded-2xl border border-white/10 bg-[#16111f] p-5">
      <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]" style={{ fontSize: "15px" }}>Today's Symptoms</span><span className="badge badge-rose rounded-full px-2.5 py-1 text-[11px] font-medium bg-[#e8617a]/15 text-[#e8617a]" style={{ cursor: "pointer" }} data-onclick="goTo('log')">Log now</span></div>
      <div className="symptom-grid grid grid-cols-2 gap-2">
        <div className="symptom-chip flex items-center gap-2 rounded-xl bg-[#1e1729] px-3 py-2 text-xs"><span className="s-icon">😊</span><span className="s-name text-[#f0eaf8]/50">Mood</span><span className="s-level s-mid">Good</span></div>
        <div className="symptom-chip flex items-center gap-2 rounded-xl bg-[#1e1729] px-3 py-2 text-xs"><span className="s-icon">🔥</span><span className="s-name text-[#f0eaf8]/50">Pain</span><span className="s-level s-low">None</span></div>
        <div className="symptom-chip flex items-center gap-2 rounded-xl bg-[#1e1729] px-3 py-2 text-xs"><span className="s-icon">💧</span><span className="s-name text-[#f0eaf8]/50">Flow</span><span className="s-level s-low">Light</span></div>
        <div className="symptom-chip flex items-center gap-2 rounded-xl bg-[#1e1729] px-3 py-2 text-xs"><span className="s-icon">⚡</span><span className="s-name text-[#f0eaf8]/50">Energy</span><span className="s-level s-high">High</span></div>
        <div className="symptom-chip flex items-center gap-2 rounded-xl bg-[#1e1729] px-3 py-2 text-xs"><span className="s-icon">😴</span><span className="s-name text-[#f0eaf8]/50">Sleep</span><span className="s-level s-mid">7 hrs</span></div>
        <div className="symptom-chip flex items-center gap-2 rounded-xl bg-[#1e1729] px-3 py-2 text-xs"><span className="s-icon">🍽️</span><span className="s-name text-[#f0eaf8]/50">Appetite</span><span className="s-level s-mid">Norm</span></div>
      </div>
    </div>
    <div className="mini-card rounded-2xl border border-white/10 bg-[#16111f] p-5">
      <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]" style={{ fontSize: "15px" }}>AI Assistant</span><span className="badge badge-lavender rounded-full px-2.5 py-1 text-[11px] font-medium bg-[#9b7fe8]/15 text-[#9b7fe8]" style={{ cursor: "pointer" }} data-onclick="goTo('ai')">Chat now</span></div>
      <div className="chat-preview flex flex-col gap-2.5" id="dash-chat-preview">
        <div className="msg msg-ai">You're in your peak energy phase! Great time for intense workouts. 🌟</div>
        <div className="msg msg-user">What foods should I eat today?</div>
        <div className="msg msg-ai">Leafy greens & iron-rich foods like lentils support follicular phase well.</div>
      </div>
      <div className="chat-input-row mt-1 flex gap-2">
        <input className="chat-inp flex-1 rounded-xl border border-white/10 bg-[#1e1729] px-3 py-2 text-xs text-[#f0eaf8] placeholder:text-[#f0eaf8]/30 focus:border-[#9b7fe8] focus:outline-none" id="dash-inp" placeholder="Ask anything…" data-onkeydown="if(event.key==='Enter')dashSend()"/>
        <button className="chat-send h-9 w-9 rounded-xl bg-[#9b7fe8] text-white transition hover:opacity-80" data-onclick="dashSend()">↑</button>
      </div>
    </div>
    <div className="mini-card rounded-2xl border border-white/10 bg-[#16111f] p-5">
      <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]" style={{ fontSize: "15px" }}>Cycle Insights</span><span className="badge badge-teal rounded-full px-2.5 py-1 text-[11px] font-medium bg-[#4ecdc4]/15 text-[#4ecdc4]" style={{ cursor: "pointer" }} data-onclick="goTo('insights')">View all</span></div>
      <div className="insight-list flex flex-col gap-3">
        <div className="insight-row"><div className="insight-meta flex items-center justify-between text-xs"><span className="insight-name text-[#f0eaf8]/60">Cycle Regularity</span><span className="insight-val" style={{ color: "var(--teal)" }}>92%</span></div><div className="bar-track h-1.5 rounded-full bg-white/5 overflow-hidden"><div className="bar-fill h-full rounded-full" style={{ width: "92%", background: "var(--teal)" }}></div></div></div>
        <div className="insight-row"><div className="insight-meta flex items-center justify-between text-xs"><span className="insight-name text-[#f0eaf8]/60">Avg Period Length</span><span className="insight-val">5.2 days</span></div><div className="bar-track h-1.5 rounded-full bg-white/5 overflow-hidden"><div className="bar-fill h-full rounded-full" style={{ width: "74%", background: "var(--lavender)" }}></div></div></div>
        <div className="insight-row"><div className="insight-meta flex items-center justify-between text-xs"><span className="insight-name text-[#f0eaf8]/60">Mood Stability</span><span className="insight-val" style={{ color: "var(--amber)" }}>68%</span></div><div className="bar-track h-1.5 rounded-full bg-white/5 overflow-hidden"><div className="bar-fill h-full rounded-full" style={{ width: "68%", background: "var(--amber)" }}></div></div></div>
        <div className="insight-row"><div className="insight-meta flex items-center justify-between text-xs"><span className="insight-name text-[#f0eaf8]/60">Pain Trend</span><span className="insight-val" style={{ color: "var(--rose)" }}>Mild ↓</span></div><div className="bar-track h-1.5 rounded-full bg-white/5 overflow-hidden"><div className="bar-fill h-full rounded-full" style={{ width: "30%", background: "var(--rose)" }}></div></div></div>
        <div className="insight-row"><div className="insight-meta flex items-center justify-between text-xs"><span className="insight-name text-[#f0eaf8]/60">Logging Streak</span><span className="insight-val" style={{ color: "var(--lavender)" }}>12 days 🔥</span></div><div className="bar-track h-1.5 rounded-full bg-white/5 overflow-hidden"><div className="bar-fill h-full rounded-full" style={{ width: "85%", background: "linear-gradient(90deg,var(--rose),var(--lavender))" }}></div></div></div>
      </div>
    </div>
  </div>
</div>


<div className="page" id="page-log">
  <div className="topbar flex items-start justify-between">
    <div><h1 className="page-title font-['Playfair_Display'] text-[28px] font-semibold tracking-tight">Log Symptoms</h1><p className="page-subtitle mt-1 text-xs text-[#f0eaf8]/50">Cycle Day 14 · Friday, March 27</p></div>
    <div className="top-actions flex items-center gap-2.5">
      <button className="btn btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium border border-white/10 text-[#f0eaf8]/60 hover:text-[#9b7fe8] hover:border-[#9b7fe8] transition" data-onclick="goTo('symptom-history')">🕐 History</button>
      <button className="btn btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium border border-white/10 text-[#f0eaf8]/60 hover:text-[#9b7fe8] hover:border-[#9b7fe8] transition" data-onclick="viewHistory()">📋 View History</button>
      <button className="btn btn-primary inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium bg-gradient-to-br from-[#e8617a] to-[#9b7fe8] text-white hover:opacity-90 active:scale-[0.98] transition" data-onclick="saveLog()">✓ Save Log</button>
    </div>
  </div>
  
  <div className="date-strip" id="date-strip"></div>
  <div className="log-layout">
    <div className="log-main">
      
      <div className="card rounded-2xl border border-white/10 bg-[#16111f] p-6">
        <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]">Flow Intensity</span><span className="badge badge-rose rounded-full px-2.5 py-1 text-[11px] font-medium bg-[#e8617a]/15 text-[#e8617a]">Required</span></div>
        <div className="chip-row" id="flow-group">
          <button className="chip" data-onclick="selGroup(this,'flow-group','sel-rose')">None</button>
          <button className="chip" data-onclick="selGroup(this,'flow-group','sel-rose')">Spotting</button>
          <button className="chip sel-rose" data-onclick="selGroup(this,'flow-group','sel-rose')">Light</button>
          <button className="chip" data-onclick="selGroup(this,'flow-group','sel-rose')">Medium</button>
          <button className="chip" data-onclick="selGroup(this,'flow-group','sel-rose')">Heavy</button>
        </div>
      </div>
      
      <div className="card rounded-2xl border border-white/10 bg-[#16111f] p-6">
        <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]">Mood</span></div>
        <div className="mood-row" id="mood-group">
          <button className="mood-btn sel" data-onclick="selGroup(this,'mood-group','sel')"><span className="me">😊</span><span className="ml">Happy</span></button>
          <button className="mood-btn" data-onclick="selGroup(this,'mood-group','sel')"><span className="me">😔</span><span className="ml">Sad</span></button>
          <button className="mood-btn" data-onclick="selGroup(this,'mood-group','sel')"><span className="me">😤</span><span className="ml">Irritable</span></button>
          <button className="mood-btn" data-onclick="selGroup(this,'mood-group','sel')"><span className="me">😴</span><span className="ml">Tired</span></button>
          <button className="mood-btn" data-onclick="selGroup(this,'mood-group','sel')"><span className="me">😰</span><span className="ml">Anxious</span></button>
          <button className="mood-btn" data-onclick="selGroup(this,'mood-group','sel')"><span className="me">🤩</span><span className="ml">Energetic</span></button>
          <button className="mood-btn" data-onclick="selGroup(this,'mood-group','sel')"><span className="me">😌</span><span className="ml">Calm</span></button>
          <button className="mood-btn" data-onclick="selGroup(this,'mood-group','sel')"><span className="me">🥴</span><span className="ml">Nauseous</span></button>
        </div>
      </div>
      
      <div className="card rounded-2xl border border-white/10 bg-[#16111f] p-6">
        <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]">Symptoms</span><span className="badge badge-lavender rounded-full px-2.5 py-1 text-[11px] font-medium bg-[#9b7fe8]/15 text-[#9b7fe8]">Select all that apply</span></div>
        <div className="sym-grid">
          <button className="sym-btn" data-onclick="this.classList.toggle('sel')"><span className="si mt-3 flex items-center justify-center gap-3 text-[#f0eaf8]/60">😣</span>Cramps</button>
          <button className="sym-btn sel" data-onclick="this.classList.toggle('sel')"><span className="si mt-3 flex items-center justify-center gap-3 text-[#f0eaf8]/60">🤕</span>Headache</button>
          <button className="sym-btn" data-onclick="this.classList.toggle('sel')"><span className="si mt-3 flex items-center justify-center gap-3 text-[#f0eaf8]/60">🫃</span>Bloating</button>
          <button className="sym-btn" data-onclick="this.classList.toggle('sel')"><span className="si mt-3 flex items-center justify-center gap-3 text-[#f0eaf8]/60">🤢</span>Nausea</button>
          <button className="sym-btn" data-onclick="this.classList.toggle('sel')"><span className="si mt-3 flex items-center justify-center gap-3 text-[#f0eaf8]/60">😪</span>Fatigue</button>
          <button className="sym-btn" data-onclick="this.classList.toggle('sel')"><span className="si mt-3 flex items-center justify-center gap-3 text-[#f0eaf8]/60">💪</span>Tender Breasts</button>
          <button className="sym-btn" data-onclick="this.classList.toggle('sel')"><span className="si mt-3 flex items-center justify-center gap-3 text-[#f0eaf8]/60">🔙</span>Back Pain</button>
          <button className="sym-btn" data-onclick="this.classList.toggle('sel')"><span className="si mt-3 flex items-center justify-center gap-3 text-[#f0eaf8]/60">🧠</span>Brain Fog</button>
          <button className="sym-btn" data-onclick="this.classList.toggle('sel')"><span className="si mt-3 flex items-center justify-center gap-3 text-[#f0eaf8]/60">💧</span>Discharge</button>
          <button className="sym-btn" data-onclick="this.classList.toggle('sel')"><span className="si mt-3 flex items-center justify-center gap-3 text-[#f0eaf8]/60">🌡️</span>Fever</button>
          <button className="sym-btn" data-onclick="this.classList.toggle('sel')"><span className="si mt-3 flex items-center justify-center gap-3 text-[#f0eaf8]/60">😵</span>Dizziness</button>
          <button className="sym-btn" data-onclick="this.classList.toggle('sel')"><span className="si mt-3 flex items-center justify-center gap-3 text-[#f0eaf8]/60">🍫</span>Cravings</button>
        </div>
      </div>
      
      <div className="card rounded-2xl border border-white/10 bg-[#16111f] p-6">
        <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]">Pain Level</span><span className="badge badge-rose rounded-full px-2.5 py-1 text-[11px] font-medium bg-[#e8617a]/15 text-[#e8617a]" id="pain-badge">0 / 10</span></div>
        <div className="slider-wrap">
          <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>None</span>
          <input type="range" min="0" max="10" value="0" id="pain-sl" data-oninput="updatePain(this.value)" style={{ flex: "1", accentColor: "var(--rose)" }}/>
          <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>Severe</span>
          <div className="slider-val" id="pain-val">0</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
          <span style={{ fontSize: "11px", color: "var(--text-dim)" }}>0</span>
          <span style={{ fontSize: "11px", color: "var(--text-dim)" }}>5</span>
          <span style={{ fontSize: "11px", color: "var(--text-dim)" }}>10</span>
        </div>
      </div>
      
      <div className="card rounded-2xl border border-white/10 bg-[#16111f] p-6">
        <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]">Notes</span><span className="badge badge-lavender rounded-full px-2.5 py-1 text-[11px] font-medium bg-[#9b7fe8]/15 text-[#9b7fe8]">Optional</span></div>
        <textarea className="note-inp" id="log-notes" placeholder="Add any observations, feelings, or details for today…"></textarea>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px", fontSize: "11px", color: "var(--text-dim)" }} id="note-counter">0 / 300</div>
      </div>
    </div>
    <div className="log-side">
      
      <div className="card rounded-2xl border border-white/10 bg-[#16111f] p-6">
        <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]">Energy</span></div>
        <div className="chip-row" id="energy-group">
          <button className="chip" data-onclick="selGroup(this,'energy-group','sel-teal')">Very Low</button>
          <button className="chip" data-onclick="selGroup(this,'energy-group','sel-teal')">Low</button>
          <button className="chip sel-teal" data-onclick="selGroup(this,'energy-group','sel-teal')">Medium</button>
          <button className="chip" data-onclick="selGroup(this,'energy-group','sel-teal')">High</button>
        </div>
      </div>
      <div className="card rounded-2xl border border-white/10 bg-[#16111f] p-6">
        <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]">Sleep Last Night</span></div>
        <div className="chip-row" id="sleep-group">
          <button className="chip" data-onclick="selGroup(this,'sleep-group','sel')">≤4 hrs</button>
          <button className="chip" data-onclick="selGroup(this,'sleep-group','sel')">5–6 hrs</button>
          <button className="chip sel" data-onclick="selGroup(this,'sleep-group','sel')">7–8 hrs</button>
          <button className="chip" data-onclick="selGroup(this,'sleep-group','sel')">9+ hrs</button>
        </div>
      </div>
      <div className="card rounded-2xl border border-white/10 bg-[#16111f] p-6">
        <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]">Appetite</span></div>
        <div className="chip-row" id="app-group">
          <button className="chip" data-onclick="selGroup(this,'app-group','sel')">Very Low</button>
          <button className="chip sel" data-onclick="selGroup(this,'app-group','sel')">Normal</button>
          <button className="chip" data-onclick="selGroup(this,'app-group','sel')">Increased</button>
          <button className="chip" data-onclick="selGroup(this,'app-group','sel')">Cravings</button>
        </div>
      </div>
      
      <div className="card rounded-2xl border border-white/10 bg-[#16111f] p-6">
        <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]">Today's Summary</span></div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--surface2)", borderRadius: "8px" }}><span style={{ color: "var(--text-muted)" }}>Phase</span><span style={{ color: "var(--rose)" }}>🌸 Follicular</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--surface2)", borderRadius: "8px" }}><span style={{ color: "var(--text-muted)" }}>Ovulation in</span><span style={{ color: "var(--teal)" }}>3 days</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--surface2)", borderRadius: "8px" }}><span style={{ color: "var(--text-muted)" }}>Fertile window</span><span style={{ color: "var(--teal)" }}>Soon</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--surface2)", borderRadius: "8px" }}><span style={{ color: "var(--text-muted)" }}>Logging streak</span><span style={{ color: "var(--amber)" }}>12 days 🔥</span></div>
        </div>
      </div>
      
      <div className="card rounded-2xl border border-white/10 bg-[#16111f] p-6">
        <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]">Recent Logs</span></div>
        <div className="log-hist-item"><div className="hist-date">Mar 26</div><div className="hist-tags"><span className="hist-tag">Happy</span><span className="hist-tag rose">Light flow</span><span className="hist-tag teal">High energy</span></div></div>
        <div className="log-hist-item"><div className="hist-date">Mar 25</div><div className="hist-tags"><span className="hist-tag">Calm</span><span className="hist-tag rose">Light flow</span></div></div>
        <div className="log-hist-item"><div className="hist-date">Mar 24</div><div className="hist-tags"><span className="hist-tag rose">Headache</span><span className="hist-tag">Tired</span><span className="hist-tag teal">7 hrs sleep</span></div></div>
      </div>
    </div>
  </div>
</div>


<div className="page" id="page-history">
  <div className="topbar flex items-start justify-between">
    <div><h1 className="page-title font-['Playfair_Display'] text-[28px] font-semibold tracking-tight">Cycle History</h1><p className="page-subtitle mt-1 text-xs text-[#f0eaf8]/50">Your complete menstrual health timeline</p></div>
    <div className="top-actions flex items-center gap-2.5">
      <button className="btn btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium border border-white/10 text-[#f0eaf8]/60 hover:text-[#9b7fe8] hover:border-[#9b7fe8] transition" data-onclick="goTo('predictions')">🔮 Predictions</button>
      <button className="btn btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium border border-white/10 text-[#f0eaf8]/60 hover:text-[#9b7fe8] hover:border-[#9b7fe8] transition" data-onclick="exportData()">📤 Export</button></div>
  </div>
  <div className="hist-filters">
    <button className="hf-btn active" data-onclick="filterHist(this)">All</button>
    <button className="hf-btn" data-onclick="filterHist(this)">2025</button>
    <button className="hf-btn" data-onclick="filterHist(this)">2024</button>
    <button className="hf-btn" data-onclick="filterHist(this)">2023</button>
  </div>
  <div className="card rounded-2xl border border-white/10 bg-[#16111f] p-6">
    <table className="data-table">
      <thead><tr><th>Cycle #</th><th>Start Date</th><th>End Date</th><th>Duration</th><th>Cycle Length</th><th>Notes</th></tr></thead>
      <tbody>
        <tr><td style={{ color: "var(--lavender)" }}>#24</td><td>Mar 13, 2025</td><td>Mar 17, 2025</td><td style={{ color: "var(--teal)" }}>5 days</td><td>28 days</td><td style={{ color: "var(--text-dim)" }}>Normal</td></tr>
        <tr><td style={{ color: "var(--lavender)" }}>#23</td><td>Feb 13, 2025</td><td>Feb 17, 2025</td><td style={{ color: "var(--teal)" }}>5 days</td><td>28 days</td><td style={{ color: "var(--text-dim)" }}>Mild cramps</td></tr>
        <tr><td style={{ color: "var(--lavender)" }}>#22</td><td>Jan 16, 2025</td><td>Jan 20, 2025</td><td style={{ color: "var(--teal)" }}>5 days</td><td>28 days</td><td style={{ color: "var(--text-dim)" }}>Normal</td></tr>
        <tr><td style={{ color: "var(--lavender)" }}>#21</td><td>Dec 19, 2024</td><td>Dec 23, 2024</td><td style={{ color: "var(--amber)" }}>5 days</td><td style={{ color: "var(--amber)" }}>29 days</td><td style={{ color: "var(--text-dim)" }}>Slightly longer</td></tr>
        <tr><td style={{ color: "var(--lavender)" }}>#20</td><td>Nov 20, 2024</td><td>Nov 24, 2024</td><td style={{ color: "var(--teal)" }}>5 days</td><td>28 days</td><td style={{ color: "var(--text-dim)" }}>Normal</td></tr>
        <tr><td style={{ color: "var(--lavender)" }}>#19</td><td>Oct 23, 2024</td><td>Oct 27, 2024</td><td style={{ color: "var(--teal)" }}>5 days</td><td style={{ color: "var(--amber)" }}>27 days</td><td style={{ color: "var(--text-dim)" }}>Slight irregularity</td></tr>
      </tbody>
    </table>
  </div>
</div>


<div className="page" id="page-insights">
  <div className="topbar flex items-start justify-between">
    <div><h1 className="page-title font-['Playfair_Display'] text-[28px] font-semibold tracking-tight">Graphs & Trends</h1><p className="page-subtitle mt-1 text-xs text-[#f0eaf8]/50">ML-powered analysis · Last 6 months</p></div>
    <div className="top-actions flex items-center gap-2.5"><button className="btn btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium border border-white/10 text-[#f0eaf8]/60 hover:text-[#9b7fe8] hover:border-[#9b7fe8] transition" data-onclick="exportData()">📤 Export</button></div>
  </div>
  <div className="ins-tabs">
    <button className="ins-tab active" data-onclick="selInsTab(this)">Cycle Length</button>
    <button className="ins-tab" data-onclick="selInsTab(this)">Symptoms</button>
    <button className="ins-tab" data-onclick="selInsTab(this)">Mood</button>
    <button className="ins-tab" data-onclick="selInsTab(this)">Flow</button>
  </div>
  <div className="ins-grid">
    <div className="ins-stat"><div style={{ fontSize: "22px" }}>📅</div><div className="isn" style={{ color: "var(--lavender)" }}>28</div><div className="isl">Avg cycle (days)</div><div className="ist" style={{ color: "var(--teal)" }}>→ Stable</div></div>
    <div className="ins-stat"><div style={{ fontSize: "22px" }}>🩸</div><div className="isn" style={{ color: "var(--rose)" }}>5.2</div><div className="isl">Avg period (days)</div><div className="ist" style={{ color: "var(--teal)" }}>↓ Normal</div></div>
    <div className="ins-stat"><div style={{ fontSize: "22px" }}>🎯</div><div className="isn" style={{ color: "var(--teal)" }}>91%</div><div className="isl">Prediction accuracy</div><div className="ist" style={{ color: "var(--teal)" }}>↑ +3% this month</div></div>
    <div className="ins-stat"><div style={{ fontSize: "22px" }}>⚠️</div><div className="isn" style={{ color: "var(--amber)" }}>1</div><div className="isl">Minor anomalies</div><div className="ist" style={{ color: "var(--amber)" }}>Oct 2024</div></div>
  </div>
  <div className="ins-two-col">
    <div className="chart-card">
      <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]">Cycle Length Trend</span><span className="badge badge-lavender rounded-full px-2.5 py-1 text-[11px] font-medium bg-[#9b7fe8]/15 text-[#9b7fe8]">6 months</span></div>
      <div className="bar-chart-wrap" id="cycle-chart"></div>
      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "14px" }}>Average: 28 days · Trend: Stable ✓</div>
    </div>
    <div className="chart-card">
      <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]">Symptom Frequency</span><span className="badge badge-rose rounded-full px-2.5 py-1 text-[11px] font-medium bg-[#e8617a]/15 text-[#e8617a]">Top 5</span></div>
      <div id="sym-chart"></div>
    </div>
  </div>
  <div className="chart-card">
    <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]">Mood Distribution</span><span className="badge badge-amber rounded-full px-2.5 py-1 text-[11px] font-medium bg-[#f4a261]/15 text-[#f4a261]">Last 30 days</span></div>
    <div id="mood-chart"></div>
  </div>
  <div className="anomaly-banner">
    <div className="anb-icon">🤖</div>
    <div><div className="anb-title">Isolation Forest ML Model — All Clear</div><div className="anb-sub">Analyzed 6 cycles. No significant anomalies detected. Your cycle regularity score is 92%. Continue logging for improved accuracy.</div></div>
    <button className="btn btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium border border-white/10 text-[#f0eaf8]/60 hover:text-[#9b7fe8] hover:border-[#9b7fe8] transition" data-onclick="goTo('anomalies')" style={{ flexShrink: "0" }}>View Details →</button>
  </div>
</div>


<div className="page" id="page-ai">
  <div className="topbar flex items-start justify-between">
    <div><h1 className="page-title font-['Playfair_Display'] text-[28px] font-semibold tracking-tight">AI Assistant</h1><p className="page-subtitle mt-1 text-xs text-[#f0eaf8]/50">Health Assistant · NLP-powered · Cycle-aware</p></div>
    <div className="top-actions flex items-center gap-2.5">
      <button className="btn btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium border border-white/10 text-[#f0eaf8]/60 hover:text-[#9b7fe8] hover:border-[#9b7fe8] transition" data-onclick="goTo('chat-history')">💾 Saved Chats</button>
      <button className="btn btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium border border-white/10 text-[#f0eaf8]/60 hover:text-[#9b7fe8] hover:border-[#9b7fe8] transition" data-onclick="clearAI()">🗑 Clear chat</button></div>
  </div>
  <div className="ai-layout">
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      <div className="chat-wrap">
        <div className="chat-top">
          <div className="ai-avatar">🌙</div>
          <div><div className="ai-name">Health Assistant</div><div className="ai-status"><div className="ai-status-dot"></div>Online · Cycle day 14</div></div>
          <button className="btn btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium border border-white/10 text-[#f0eaf8]/60 hover:text-[#9b7fe8] hover:border-[#9b7fe8] transition" style={{ marginLeft: "auto", fontSize: "12px" }} data-onclick="clearAI()">Clear</button>
        </div>
        <div className="chat-msgs" id="ai-msgs">
          <div className="chat-msg ai"><div className="cm-avatar cm-ai-av">🌙</div><div><div className="cm-bubble" id="ai-welcome-msg">Hi there! 🌸 I'm your Health Assistant. You're on cycle day 14 — your follicular phase is ending and ovulation is just 3 days away! Ask me anything about your health, symptoms, or cycle. 💜</div><div className="cm-time">Just now</div></div></div>
        </div>
        <div className="suggest-chips">
          <button className="sug-chip" data-onclick="askLuna('When is my next period?')">🩸 Next period?</button>
          <button className="sug-chip" data-onclick="askLuna('What should I eat during ovulation?')">🥗 What to eat?</button>
          <button className="sug-chip" data-onclick="askLuna('Tell me about my fertile window')">🌺 Fertile window</button>
          <button className="sug-chip" data-onclick="askLuna('How do I manage cramps?')">😣 Cramp relief</button>
          <button className="sug-chip" data-onclick="askLuna('Is my cycle normal?')">📊 Am I normal?</button>
          <button className="sug-chip" data-onclick="askLuna('What are the signs of ovulation?')">🌡️ Ovulation signs</button>
        </div>
        <div className="full-chat-inp-row">
          <input className="full-chat-inp" id="ai-inp" placeholder="Ask about your cycle, symptoms, or health…" data-onkeydown="if(event.key==='Enter')sendLuna()"/>
          <button className="chat-send-btn" data-onclick="sendLuna()">↑</button>
        </div>
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div className="ai-sidebar-card">
        <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]" style={{ fontSize: "15px" }}>Daily Tips</span></div>
        <div className="ai-tip-item">💧 Stay extra hydrated — estrogen rises before ovulation</div>
        <div className="ai-tip-item">🥦 Iron-rich foods like spinach help replenish after period</div>
        <div className="ai-tip-item">🧘 Light yoga reduces pre-ovulation tension</div>
      </div>
      <div className="ai-sidebar-card">
        <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]" style={{ fontSize: "15px" }}>Chat History</span></div>
        <div className="chat-hist-item"><span className="chi-icon">🩸</span><div><div className="chi-text">When is my next period?</div><div className="chi-time">Yesterday</div></div></div>
        <div className="chat-hist-item"><span className="chi-icon">🥗</span><div><div className="chi-text">Best foods for follicular phase</div><div className="chi-time">Mar 25</div></div></div>
        <div className="chat-hist-item"><span className="chi-icon">😣</span><div><div className="chi-text">Why do I have cramps mid-cycle?</div><div className="chi-time">Mar 22</div></div></div>
      </div>
    </div>
  </div>
</div>


<div className="page" id="page-anomalies">
  <div className="topbar flex items-start justify-between">
    <div><h1 className="page-title font-['Playfair_Display'] text-[28px] font-semibold tracking-tight">Anomaly Detection</h1><p className="page-subtitle mt-1 text-xs text-[#f0eaf8]/50">Isolation Forest ML model analysis</p></div>
    <div className="top-actions flex items-center gap-2.5"><span style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "rgba(78,205,196,0.1)", border: "1px solid rgba(78,205,196,0.3)", borderRadius: "10px", fontSize: "12px", color: "var(--teal)" }}><div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--teal)", animation: "pulse 2s infinite" }}></div>Model Active</span></div>
  </div>
  <div className="anom-grid">
    <div className="anom-stat"><div style={{ fontSize: "24px" }}>✅</div><div className="asn" style={{ color: "var(--teal)" }}>0</div><div className="asl">Critical anomalies</div></div>
    <div className="anom-stat"><div style={{ fontSize: "24px" }}>⚠️</div><div className="asn" style={{ color: "var(--amber)" }}>1</div><div className="asl">Minor irregularity</div></div>
    <div className="anom-stat"><div style={{ fontSize: "24px" }}>📊</div><div className="asn" style={{ color: "var(--lavender)" }}>91%</div><div className="asl">Detection accuracy</div></div>
    <div className="anom-stat"><div style={{ fontSize: "24px" }}>📅</div><div className="asn">6</div><div className="asl">Months analyzed</div></div>
  </div>
  <div className="card rounded-2xl border border-white/10 bg-[#16111f] p-6">
    <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]">Anomaly Log</span><span className="badge badge-teal rounded-full px-2.5 py-1 text-[11px] font-medium bg-[#4ecdc4]/15 text-[#4ecdc4]">All clear</span></div>
    <div className="anom-item" data-onclick="toast('Oct 2024 — cycle was 27 days vs avg 28')">
      <div className="anom-item-icon" style={{ background: "var(--amber-soft)" }}>⚠️</div>
      <div className="anom-item-text"><h4>Cycle Length Variation</h4><p>27-day cycle vs avg 28 days · October 2024</p></div>
      <span className="anom-level" style={{ background: "var(--amber-soft)", color: "var(--amber)" }}>Minor</span>
    </div>
    <div className="anom-item" data-onclick="toast('All other cycles were within normal range')">
      <div className="anom-item-icon" style={{ background: "var(--teal-soft)" }}>✅</div>
      <div className="anom-item-text"><h4>All Other Cycles</h4><p>Within normal range (26–32 days) · 5 cycles</p></div>
      <span className="anom-level" style={{ background: "var(--teal-soft)", color: "var(--teal)" }}>Normal</span>
    </div>
    <div style={{ marginTop: "16px", padding: "18px", background: "rgba(78,205,196,0.06)", border: "1px solid rgba(78,205,196,0.2)", borderRadius: "12px" }}>
      <div style={{ fontSize: "13px", color: "var(--teal)", fontWeight: "500", marginBottom: "6px" }}>🤖 ML Model Summary</div>
      <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.7" }}>Isolation Forest has analyzed your last 6 cycles. All detected anomalies are minor and within clinically normal range. No patterns suggesting PCOS, endometriosis, or hormonal imbalance were detected. Anomaly score: 0.08 (threshold: 0.3). Continue logging for improved accuracy.</div>
    </div>
  </div>
</div>


<div className="page" id="page-notifications">
  <div className="topbar flex items-start justify-between">
    <div><h1 className="page-title font-['Playfair_Display'] text-[28px] font-semibold tracking-tight">Notifications</h1><p className="page-subtitle mt-1 text-xs text-[#f0eaf8]/50">3 unread</p></div>
    <div className="top-actions flex items-center gap-2.5"><button className="btn btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium border border-white/10 text-[#f0eaf8]/60 hover:text-[#9b7fe8] hover:border-[#9b7fe8] transition" data-onclick="markAllRead()">✓ Mark all read</button></div>
  </div>
  <div id="notif-list">
    <div className="notif-item unread" data-onclick="readNotif(this)"><div className="notif-icon-wrap" style={{ background: "var(--teal-soft)" }}>🌡️</div><div className="notif-body"><h4>Ovulation window approaching</h4><p>Your fertile window opens in 3 days (Mar 30). Track carefully!</p></div><div className="notif-meta"><div className="notif-time">Just now</div><div className="notif-unread-dot"></div></div></div>
    <div className="notif-item unread" data-onclick="readNotif(this)"><div className="notif-icon-wrap" style={{ background: "var(--lavender-soft)" }}>💊</div><div className="notif-body"><h4>Log reminder</h4><p>You haven't logged today's symptoms yet. Tap to log now.</p></div><div className="notif-meta"><div className="notif-time">9:00 AM</div><div className="notif-unread-dot"></div></div></div>
    <div className="notif-item unread" data-onclick="readNotif(this)"><div className="notif-icon-wrap" style={{ background: "var(--rose-soft)" }}>🩸</div><div className="notif-body"><h4>Period reminder</h4><p>Your period is predicted in 14 days (Apr 10). Stock up on essentials!</p></div><div className="notif-meta"><div className="notif-time">8:00 AM</div><div className="notif-unread-dot"></div></div></div>
    <div className="notif-item" data-onclick="readNotif(this)"><div className="notif-icon-wrap" style={{ background: "var(--amber-soft)" }}>📊</div><div className="notif-body"><h4>Monthly report ready</h4><p>Your February cycle report is ready. 28-day cycle, regular pattern.</p></div><div className="notif-meta"><div className="notif-time">Yesterday</div></div></div>
    <div className="notif-item" data-onclick="readNotif(this)"><div className="notif-icon-wrap" style={{ background: "var(--teal-soft)" }}>⚠️</div><div className="notif-body"><h4>Anomaly cleared</h4><p>The October irregularity has been reviewed. No action needed.</p></div><div className="notif-meta"><div className="notif-time">Mar 24</div></div></div>
    <div className="notif-item" data-onclick="readNotif(this)"><div className="notif-icon-wrap" style={{ background: "var(--lavender-soft)" }}>🤖</div><div className="notif-body"><h4>AI Insight</h4><p>Energy peaks on days 12–16. Schedule important tasks now!</p></div><div className="notif-meta"><div className="notif-time">Mar 23</div></div></div>
  </div>
</div>


<div className="page" id="page-settings">
  <div className="topbar flex items-start justify-between">
    <div><h1 className="page-title font-['Playfair_Display'] text-[28px] font-semibold tracking-tight">Settings & Profile</h1><p className="page-subtitle mt-1 text-xs text-[#f0eaf8]/50">Manage your Health Assistant account</p></div>
    <div className="top-actions flex items-center gap-2.5"><button className="btn btn-primary inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium bg-gradient-to-br from-[#e8617a] to-[#9b7fe8] text-white hover:opacity-90 active:scale-[0.98] transition" data-onclick="toast('✓ Settings saved!')">Save changes</button></div>
  </div>
  <div className="profile-layout">
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div className="profile-hero-card">
        <div className="prof-avatar" id="prof-avatar-initial" data-onclick="toast('Photo upload — coming soon!')">S</div>
        <div className="prof-name" id="prof-name-display">Sneha Kulkarni</div>
        <div className="prof-email"><a href="/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="cbb8a5aea3aa8baea6aaa2a7e5a8a4a6">[email&#160;protected]</a></div>
        <div className="prof-stats">
          <div className="ps"><div className="psn">6</div><div className="psl">Months</div></div>
          <div className="ps"><div className="psn">142</div><div className="psl">Days logged</div></div>
          <div className="ps"><div className="psn">3</div><div className="psl">Reports</div></div>
        </div>
        <div className="prof-streak">🔥 12-day logging streak — keep it up!</div>
      </div>
      <div className="settings-section">
        <div className="settings-title">Notifications</div>
        <div className="settings-row"><div className="sr-icon" style={{ background: "var(--rose-soft)" }}>🩸</div><div className="sr-text"><h4>Period reminder</h4><p>3 days before predicted period</p></div><button className="toggle on" data-onclick="this.classList.toggle('on')"></button></div>
        <div className="settings-row"><div className="sr-icon" style={{ background: "var(--teal-soft)" }}>🌡️</div><div className="sr-text"><h4>Ovulation alert</h4><p>Notify when fertile window opens</p></div><button className="toggle on" data-onclick="this.classList.toggle('on')"></button></div>
        <div className="settings-row"><div className="sr-icon" style={{ background: "var(--lavender-soft)" }}>💊</div><div className="sr-text"><h4>Daily log reminder</h4><p>Remind me to log symptoms</p></div><button className="toggle on" data-onclick="this.classList.toggle('on')"></button></div>
        <div className="settings-row"><div className="sr-icon" style={{ background: "var(--amber-soft)" }}>📊</div><div className="sr-text"><h4>Weekly insights</h4><p>Summary every Sunday</p></div><button className="toggle" data-onclick="this.classList.toggle('on')"></button></div>
        <div className="settings-row"><div className="sr-icon" style={{ background: "var(--rose-soft)" }}>⚠️</div><div className="sr-text"><h4>Anomaly alerts</h4><p>Alert on irregular patterns</p></div><button className="toggle on" data-onclick="this.classList.toggle('on')"></button></div>
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div className="settings-section">
        <div className="settings-title">Profile Information</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div><div className="sec-label mb-2 text-[10px] uppercase tracking-[1.2px] text-[#f0eaf8]/30" style={{ fontSize: "10px", color: "var(--text-dim)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Name</div><input className="profile-inp" value="Sneha Kulkarni"/></div>
          <div><div className="sec-label mb-2 text-[10px] uppercase tracking-[1.2px] text-[#f0eaf8]/30" style={{ fontSize: "10px", color: "var(--text-dim)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Email</div><input className="profile-inp" value="sneha@email.com"/></div>
          <div><div className="sec-label mb-2 text-[10px] uppercase tracking-[1.2px] text-[#f0eaf8]/30" style={{ fontSize: "10px", color: "var(--text-dim)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Date of Birth</div><input className="profile-inp" value="01/01/1998"/></div>
          <div><div className="sec-label mb-2 text-[10px] uppercase tracking-[1.2px] text-[#f0eaf8]/30" style={{ fontSize: "10px", color: "var(--text-dim)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Location</div><input className="profile-inp" value="Pune, India"/></div>
        </div>
      </div>
      <div className="settings-section">
        <div className="settings-title">Cycle Settings</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div><div className="sec-label mb-2 text-[10px] uppercase tracking-[1.2px] text-[#f0eaf8]/30" style={{ fontSize: "10px", color: "var(--text-dim)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Avg cycle length</div><input className="profile-inp" value="28 days"/></div>
          <div><div className="sec-label mb-2 text-[10px] uppercase tracking-[1.2px] text-[#f0eaf8]/30" style={{ fontSize: "10px", color: "var(--text-dim)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Avg period length</div><input className="profile-inp" value="5 days"/></div>
          <div><div className="sec-label mb-2 text-[10px] uppercase tracking-[1.2px] text-[#f0eaf8]/30" style={{ fontSize: "10px", color: "var(--text-dim)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Tracking goal</div><input className="profile-inp" value="General health"/></div>
          <div><div className="sec-label mb-2 text-[10px] uppercase tracking-[1.2px] text-[#f0eaf8]/30" style={{ fontSize: "10px", color: "var(--text-dim)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Last period date</div><input className="profile-inp" value="Mar 13, 2025"/></div>
        </div>
      </div>
      <div className="settings-section">
        <div className="settings-title">Privacy & Data</div>
        <div className="privacy-grid">
          <div className="priv-card" data-onclick="toast('AES-256 encryption active ✓')"><div className="pc-icon">🔒</div><h4>Encryption</h4><p>AES-256 active</p></div>
          <div className="priv-card" data-onclick="toast('Data backup synced ✓')"><div className="pc-icon">☁️</div><h4>Cloud Backup</h4><p>Auto-synced</p></div>
          <div className="priv-card" data-onclick="confirmDelete()"><div className="pc-icon">🗑️</div><h4>Delete Data</h4><p>Erase all records</p></div>
        </div>
      </div>
      <button data-onclick="confirmLogout()" style={{ padding: "12px 24px", background: "transparent", border: "1px solid rgba(232,97,122,0.3)", color: "var(--rose)", borderRadius: "12px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "14px", width: "fit-content" }}>🚪 Log out</button>
    </div>
  </div>
</div>


<div className="page" id="page-symptom-history">
  <div className="topbar flex items-start justify-between">
    <div><h1 className="page-title font-['Playfair_Display'] text-[28px] font-semibold tracking-tight">Symptom History</h1><p className="page-subtitle mt-1 text-xs text-[#f0eaf8]/50">Your past logs timeline</p></div>
    <div className="top-actions flex items-center gap-2.5"><button className="btn btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium border border-white/10 text-[#f0eaf8]/60 hover:text-[#9b7fe8] hover:border-[#9b7fe8] transition" data-onclick="exportData()">📤 Export</button></div>
  </div>
  <div className="hist-filters">
    <button className="hf-btn active" data-onclick="filterHist(this)">All</button>
    <button className="hf-btn" data-onclick="filterHist(this)">This Week</button>
    <button className="hf-btn" data-onclick="filterHist(this)">This Month</button>
    <button className="hf-btn" data-onclick="filterHist(this)">Last 3 Months</button>
  </div>
  <div className="card rounded-2xl border border-white/10 bg-[#16111f] p-6">
    <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]">Timeline</span><span className="badge badge-lavender rounded-full px-2.5 py-1 text-[11px] font-medium bg-[#9b7fe8]/15 text-[#9b7fe8]">27 entries</span></div>
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      
      
      <div className="sh-entry">
        <div className="sh-timeline"><span className="sh-date-lbl">Mar<br />27</span><div className="sh-dot" style={{ background: "var(--teal)" }}></div><div className="sh-line"></div></div>
        <div className="sh-body"><div className="sh-day">Today</div><div className="sh-chips"><span className="sh-chip mood">😊 Happy</span><span className="sh-chip energy">⚡ High Energy</span><span className="sh-chip flow">💧 Light Flow</span></div><div className="sh-note">Feeling great today, workout done!</div><div className="sh-score">Pain: 1/10 · Sleep: 8h · Appetite: Normal</div></div>
      </div>
      <div className="sh-entry">
        <div className="sh-timeline"><span className="sh-date-lbl">Mar<br />26</span><div className="sh-dot" style={{ background: "var(--lavender)" }}></div><div className="sh-line"></div></div>
        <div className="sh-body"><div className="sh-day">Yesterday</div><div className="sh-chips"><span className="sh-chip mood">😌 Calm</span><span className="sh-chip energy">⚡ Moderate</span><span className="sh-chip flow">💧 Light Flow</span></div><div className="sh-score">Pain: 2/10 · Sleep: 7h · Appetite: Normal</div></div>
      </div>
      <div className="sh-entry">
        <div className="sh-timeline"><span className="sh-date-lbl">Mar<br />25</span><div className="sh-dot" style={{ background: "var(--amber)" }}></div><div className="sh-line"></div></div>
        <div className="sh-body"><div className="sh-day">March 25</div><div className="sh-chips"><span className="sh-chip mood">😴 Tired</span><span className="sh-chip pain">🔥 Mild Cramps</span></div><div className="sh-note">Slight headache in the afternoon</div><div className="sh-score">Pain: 4/10 · Sleep: 6h · Appetite: Low</div></div>
      </div>
      <div className="sh-entry">
        <div className="sh-timeline"><span className="sh-date-lbl">Mar<br />24</span><div className="sh-dot" style={{ background: "var(--rose)" }}></div><div className="sh-line"></div></div>
        <div className="sh-body"><div className="sh-day">March 24</div><div className="sh-chips"><span className="sh-chip pain">🔥 Headache</span><span className="sh-chip mood">😔 Low Mood</span></div><div className="sh-score">Pain: 5/10 · Sleep: 5h · Appetite: Low</div></div>
      </div>
      <div className="sh-entry">
        <div className="sh-timeline"><span className="sh-date-lbl">Mar<br />22</span><div className="sh-dot" style={{ background: "var(--teal)" }}></div><div className="sh-line"></div></div>
        <div className="sh-body"><div className="sh-day">March 22</div><div className="sh-chips"><span className="sh-chip mood">😊 Happy</span><span className="sh-chip energy">⚡ High Energy</span></div><div className="sh-score">Pain: 0/10 · Sleep: 8h · Appetite: High</div></div>
      </div>
      <div className="sh-entry">
        <div className="sh-timeline"><span className="sh-date-lbl">Mar<br />20</span><div className="sh-dot" style={{ background: "var(--lavender)" }}></div><div className="sh-line"></div></div>
        <div className="sh-body"><div className="sh-day">March 20</div><div className="sh-chips"><span className="sh-chip mood">😌 Calm</span><span className="sh-chip flow">💧 Spotting</span></div><div className="sh-score">Pain: 1/10 · Sleep: 7.5h · Appetite: Normal</div></div>
      </div>
      <div className="sh-entry">
        <div className="sh-timeline"><span className="sh-date-lbl">Mar<br />17</span><div className="sh-dot" style={{ background: "var(--rose)" }}></div><div className="sh-line"></div></div>
        <div className="sh-body"><div className="sh-day">March 17</div><div className="sh-chips"><span className="sh-chip pain">🔥 Heavy Cramps</span><span className="sh-chip flow">🩸 Heavy Flow</span><span className="sh-chip mood">😤 Irritable</span></div><div className="sh-note">Period day 5 — easing off</div><div className="sh-score">Pain: 7/10 · Sleep: 6h · Appetite: Low</div></div>
      </div>
    </div>
    <button className="btn btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium border border-white/10 text-[#f0eaf8]/60 hover:text-[#9b7fe8] hover:border-[#9b7fe8] transition" style={{ width: "100%", marginTop: "16px" }} data-onclick="toast('Loading more entries…')">Load more ↓</button>
  </div>
</div>


<div className="page" id="page-predictions">
  <div className="topbar flex items-start justify-between">
    <div><h1 className="page-title font-['Playfair_Display'] text-[28px] font-semibold tracking-tight">Predictions</h1><p className="page-subtitle mt-1 text-xs text-[#f0eaf8]/50">ML-powered next cycle forecast</p></div>
    <div className="top-actions flex items-center gap-2.5"><span style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "rgba(78,205,196,0.1)", border: "1px solid rgba(78,205,196,0.3)", borderRadius: "10px", fontSize: "12px", color: "var(--teal)" }}><div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--teal)", animation: "pulse 2s infinite" }}></div>Model Active</span></div>
  </div>
  
  <div className="pred-hero">
    <div className="pred-stat"><div className="ps-icon">🩸</div><div className="ps-val" style={{ color: "var(--rose)" }}>Apr 10</div><div className="ps-lbl">Next Period</div><div className="ps-conf">91% confidence · ±2 days</div></div>
    <div className="pred-stat"><div className="ps-icon">🌿</div><div className="ps-val" style={{ color: "var(--teal)" }}>Mar 30</div><div className="ps-lbl">Ovulation</div><div className="ps-conf">88% confidence · ±1 day</div></div>
    <div className="pred-stat"><div className="ps-icon">📅</div><div className="ps-val" style={{ color: "var(--lavender)" }}>28</div><div className="ps-lbl">Predicted Cycle Length</div><div className="ps-conf">Based on 6-cycle average</div></div>
  </div>
  <div className="card rounded-2xl border border-white/10 bg-[#16111f] p-6">
    <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]">Upcoming Events</span><span className="badge badge-teal rounded-full px-2.5 py-1 text-[11px] font-medium bg-[#4ecdc4]/15 text-[#4ecdc4]">Next 30 days</span></div>
    <div className="pred-timeline">
      <div className="pred-event fertile"><div className="pred-event-icon">🌱</div><div className="pred-event-body"><h4>Fertile Window Opens</h4><p>High conception probability begins</p></div><div><div className="pred-event-date">Mar 28</div><div className="pred-event-conf">↑ 85% confidence</div></div></div>
      <div className="pred-event ovulation"><div className="pred-event-icon">🌿</div><div className="pred-event-body"><h4>Peak Ovulation</h4><p>Highest fertile day · LH surge expected</p></div><div><div className="pred-event-date">Mar 30</div><div className="pred-event-conf">↑ 88% confidence</div></div></div>
      <div className="pred-event fertile"><div className="pred-event-icon">🌸</div><div className="pred-event-body"><h4>Fertile Window Closes</h4><p>Luteal phase begins</p></div><div><div className="pred-event-date">Apr 3</div><div className="pred-event-conf">↑ 85% confidence</div></div></div>
      <div className="pred-event pms"><div className="pred-event-icon">⚠️</div><div className="pred-event-body"><h4>PMS Window</h4><p>Possible mood shifts, bloating, fatigue</p></div><div><div className="pred-event-date">Apr 6–9</div><div className="pred-event-conf">↑ 72% confidence</div></div></div>
      <div className="pred-event period"><div className="pred-event-icon">🩸</div><div className="pred-event-body"><h4>Period Start</h4><p>Expected 5-day flow · stock up essentials</p></div><div><div className="pred-event-date">Apr 10</div><div className="pred-event-conf">↑ 91% confidence</div></div></div>
      <div className="pred-event period"><div className="pred-event-icon">✅</div><div className="pred-event-body"><h4>Period End</h4><p>Follicular phase begins again</p></div><div><div className="pred-event-date">Apr 15</div><div className="pred-event-conf">↑ 88% confidence</div></div></div>
    </div>
  </div>
  <div className="card rounded-2xl border border-white/10 bg-[#16111f] p-6">
    <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]">Prediction Factors</span><span className="badge badge-lavender rounded-full px-2.5 py-1 text-[11px] font-medium bg-[#9b7fe8]/15 text-[#9b7fe8]">ML inputs</span></div>
    <div className="pred-factors">
      <div className="pred-factor"><div className="pred-factor-icon">📊</div><div className="pred-factor-body"><h4>Cycle regularity</h4><p>92% — very stable</p></div></div>
      <div className="pred-factor"><div className="pred-factor-icon">📅</div><div className="pred-factor-body"><h4>Avg cycle length</h4><p>28.1 days (6 cycles)</p></div></div>
      <div className="pred-factor"><div className="pred-factor-icon">🩸</div><div className="pred-factor-body"><h4>Avg period duration</h4><p>5.2 days</p></div></div>
      <div className="pred-factor"><div className="pred-factor-icon">🤖</div><div className="pred-factor-body"><h4>Anomaly score</h4><p>0.08 — well within normal</p></div></div>
      <div className="pred-factor"><div className="pred-factor-icon">📝</div><div className="pred-factor-body"><h4>Logging streak</h4><p>12 days — improves accuracy</p></div></div>
      <div className="pred-factor"><div className="pred-factor-icon">📈</div><div className="pred-factor-body"><h4>Model confidence</h4><p>91% prediction accuracy</p></div></div>
    </div>
  </div>
</div>


<div className="page" id="page-chat-history">
  <div className="topbar flex items-start justify-between">
    <div><h1 className="page-title font-['Playfair_Display'] text-[28px] font-semibold tracking-tight">Chat History</h1><p className="page-subtitle mt-1 text-xs text-[#f0eaf8]/50">Saved conversations with Health Assistant</p></div>
    <div className="top-actions flex items-center gap-2.5"><button className="btn btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium border border-white/10 text-[#f0eaf8]/60 hover:text-[#9b7fe8] hover:border-[#9b7fe8] transition" data-onclick="toast('🗑 All chat history cleared')">🗑 Clear all</button></div>
  </div>
  
  <div className="ch-session" data-onclick="goTo('ai')">
    <div className="ch-session-header"><div className="ch-session-title">💧 Hydration & Ovulation Tips</div><div className="ch-session-date">Today, 10:14 AM</div></div>
    <div className="ch-session-msgs">
      <div className="ch-msg-preview user">What should I eat during ovulation?</div>
      <div className="ch-msg-preview ai">Around ovulation, estrogen peaks! Focus on leafy greens, salmon, eggs and berries…</div>
    </div>
    <div className="ch-session-footer"><span className="ch-session-meta">3 messages · 2 min</span><span className="ch-session-tag">Nutrition</span></div>
  </div>
  <div className="ch-session" data-onclick="goTo('ai')">
    <div className="ch-session-header"><div className="ch-session-title">🩸 Next Period Prediction</div><div className="ch-session-date">Yesterday, 8:45 PM</div></div>
    <div className="ch-session-msgs">
      <div className="ch-msg-preview user">When is my next period?</div>
      <div className="ch-msg-preview ai">Your next period is predicted for April 10, 2025 ±2 days…</div>
    </div>
    <div className="ch-session-footer"><span className="ch-session-meta">4 messages · 3 min</span><span className="ch-session-tag">Cycle</span></div>
  </div>
  <div className="ch-session" data-onclick="goTo('ai')">
    <div className="ch-session-header"><div className="ch-session-title">😣 Mid-Cycle Cramps</div><div className="ch-session-date">Mar 22, 3:12 PM</div></div>
    <div className="ch-session-msgs">
      <div className="ch-msg-preview user">Why do I have cramps mid-cycle?</div>
      <div className="ch-msg-preview ai">Mid-cycle cramping is called mittelschmerz — pain associated with ovulation…</div>
    </div>
    <div className="ch-session-footer"><span className="ch-session-meta">6 messages · 5 min</span><span className="ch-session-tag">Symptoms</span></div>
  </div>
  <div className="ch-session" data-onclick="goTo('ai')">
    <div className="ch-session-header"><div className="ch-session-title">🥗 Follicular Phase Diet</div><div className="ch-session-date">Mar 25, 11:00 AM</div></div>
    <div className="ch-session-msgs">
      <div className="ch-msg-preview user">Best foods for follicular phase?</div>
      <div className="ch-msg-preview ai">Great choice! Focus on iron-rich foods like lentils, spinach, and lean meats…</div>
    </div>
    <div className="ch-session-footer"><span className="ch-session-meta">5 messages · 4 min</span><span className="ch-session-tag">Nutrition</span></div>
  </div>
  <div className="ch-session" data-onclick="goTo('ai')">
    <div className="ch-session-header"><div className="ch-session-title">📊 Is My Cycle Normal?</div><div className="ch-session-date">Mar 20, 9:30 AM</div></div>
    <div className="ch-session-msgs">
      <div className="ch-msg-preview user">Is my cycle normal?</div>
      <div className="ch-msg-preview ai">Absolutely yes! Your 28-day cycle with 5-day periods is textbook normal…</div>
    </div>
    <div className="ch-session-footer"><span className="ch-session-meta">2 messages · 1 min</span><span className="ch-session-tag">General</span></div>
  </div>
</div>


<div className="page" id="page-reminders">
  <div className="topbar flex items-start justify-between">
    <div><h1 className="page-title font-['Playfair_Display'] text-[28px] font-semibold tracking-tight">Reminders</h1><p className="page-subtitle mt-1 text-xs text-[#f0eaf8]/50">Period, pill & check-in alerts</p></div>
    <div className="top-actions flex items-center gap-2.5"><button className="btn btn-primary inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium bg-gradient-to-br from-[#e8617a] to-[#9b7fe8] text-white hover:opacity-90 active:scale-[0.98] transition" data-onclick="toast('✓ Reminder saved!')">+ Add Reminder</button></div>
  </div>
  
  <div className="rem-grid">
    <div>
      <div className="rem-card">
        <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]">Active Reminders</span><span className="badge badge-teal rounded-full px-2.5 py-1 text-[11px] font-medium bg-[#4ecdc4]/15 text-[#4ecdc4]">4 active</span></div>
        <div className="rem-item">
          <div className="rem-icon-wrap" style={{ background: "var(--rose-soft)" }}>🩸</div>
          <div className="rem-body"><h4>Period Start Reminder</h4><p>2 days before predicted period</p></div>
          <div className="rem-right"><span className="rem-time">Apr 8 · 9:00 AM</span><button className="toggle on" data-onclick="this.classList.toggle('on');toast(this.classList.contains('on')?'Reminder on':'Reminder off')"></button></div>
        </div>
        <div className="rem-item">
          <div className="rem-icon-wrap" style={{ background: "var(--teal-soft)" }}>💊</div>
          <div className="rem-body"><h4>Daily Pill Reminder</h4><p>Take contraceptive pill</p></div>
          <div className="rem-right"><span className="rem-time">Daily · 8:00 AM</span><button className="toggle on" data-onclick="this.classList.toggle('on');toast(this.classList.contains('on')?'Reminder on':'Reminder off')"></button></div>
        </div>
        <div className="rem-item">
          <div className="rem-icon-wrap" style={{ background: "var(--lavender-soft)" }}>📋</div>
          <div className="rem-body"><h4>Daily Check-In</h4><p>Log today's symptoms</p></div>
          <div className="rem-right"><span className="rem-time">Daily · 8:00 PM</span><button className="toggle on" data-onclick="this.classList.toggle('on');toast(this.classList.contains('on')?'Reminder on':'Reminder off')"></button></div>
        </div>
        <div className="rem-item">
          <div className="rem-icon-wrap" style={{ background: "var(--amber-soft)" }}>🌿</div>
          <div className="rem-body"><h4>Ovulation Alert</h4><p>Fertile window opening soon</p></div>
          <div className="rem-right"><span className="rem-time">Mar 28 · 7:00 AM</span><button className="toggle on" data-onclick="this.classList.toggle('on');toast(this.classList.contains('on')?'Reminder on':'Reminder off')"></button></div>
        </div>
        <div className="rem-item">
          <div className="rem-icon-wrap" style={{ background: "var(--surface)" }}>💧</div>
          <div className="rem-body"><h4>Hydration Reminder</h4><p>Drink water during fertile phase</p></div>
          <div className="rem-right"><span className="rem-time">Daily · 12:00 PM</span><button className="toggle" data-onclick="this.classList.toggle('on');toast(this.classList.contains('on')?'Reminder on':'Reminder off')"></button></div>
        </div>
      </div>
    </div>
    <div>
      <div className="rem-card">
        <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]">Add New Reminder</span></div>
        <div className="rem-new-form">
          <div><label>Reminder Type</label>
            <select className="rem-select" style={{ marginTop: "6px" }}>
              <option>🩸 Period reminder</option>
              <option>💊 Pill reminder</option>
              <option>📋 Daily check-in</option>
              <option>🌿 Ovulation alert</option>
              <option>💧 Hydration</option>
              <option>🏃 Exercise</option>
              <option>📝 Custom</option>
            </select>
          </div>
          <div><label>Time</label>
            <input type="time" value="08:00" className="profile-inp" style={{ marginTop: "6px" }}/>
          </div>
          <div><label>Repeat</label>
            <select className="rem-select" style={{ marginTop: "6px" }}>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Specific date</option>
              <option>Cycle-based</option>
            </select>
          </div>
          <div><label>Note (optional)</label>
            <input type="text" placeholder="E.g. Take with food" className="profile-inp" style={{ marginTop: "6px" }}/>
          </div>
          <button className="btn btn-primary inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium bg-gradient-to-br from-[#e8617a] to-[#9b7fe8] text-white hover:opacity-90 active:scale-[0.98] transition" style={{ width: "100%" }} data-onclick="toast('✓ Reminder saved!')">Save Reminder</button>
        </div>
      </div>
      <div className="rem-card" style={{ marginTop: "0" }}>
        <div className="card-header mb-4 flex items-center justify-between"><span className="card-title font-['Playfair_Display'] text-[17px]">Upcoming</span><span className="badge badge-rose rounded-full px-2.5 py-1 text-[11px] font-medium bg-[#e8617a]/15 text-[#e8617a]">Next 7 days</span></div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "var(--surface2)", borderRadius: "10px" }}><span>💊 Pill</span><span style={{ color: "var(--text-muted)" }}>Tomorrow 8:00 AM</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "var(--surface2)", borderRadius: "10px" }}><span>🌿 Ovulation Alert</span><span style={{ color: "var(--teal)" }}>Mar 28 7:00 AM</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "var(--surface2)", borderRadius: "10px" }}><span>📋 Check-in</span><span style={{ color: "var(--text-muted)" }}>Tonight 8:00 PM</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "var(--surface2)", borderRadius: "10px" }}><span>🩸 Period Alert</span><span style={{ color: "var(--rose)" }}>Apr 8 9:00 AM</span></div>
        </div>
      </div>
    </div>
  </div>
</div>

</main>
</div>





<div id="bottom-nav">
  <div className="bnav-wrap">
    <button className="bnav-item active" id="bnav-dashboard" data-onclick="goTo('dashboard');setBottomNav('dashboard')">
      <span className="bnav-icon">⊞</span><span>Home</span>
    </button>
    <button className="bnav-item" id="bnav-log" data-onclick="goTo('log');setBottomNav('log')">
      <span className="bnav-icon">📋</span><span>Log</span>
    </button>
    <button className="bnav-item" id="bnav-ai" data-onclick="goTo('ai');setBottomNav('ai')">
      <span className="bnav-icon">💬</span><span>Chat</span>
    </button>
    <button className="bnav-item" id="bnav-settings" data-onclick="goTo('settings');setBottomNav('settings')">
      <span className="bnav-icon">👤</span><span>Me</span>
    </button>
  </div>
</div>



<div id="onboarding-overlay" style={{ display: "none" }}>
  <div className="ob-box">
    <div className="ob-steps">
      <div className="ob-step active" id="ob-s1"></div>
      <div className="ob-step" id="ob-s2"></div>
      <div className="ob-step" id="ob-s3"></div>
      <div className="ob-step" id="ob-s4"></div>
    </div>
    
    <div id="ob-step-1">
      <div className="ob-icon">🌸</div>
      <div className="ob-title">Welcome to Health Assistant</div>
      <div className="ob-sub">Let's set up your profile so we can personalise your experience and give you accurate predictions.</div>
      <div className="ob-row">
        <div className="ob-field"><label>First Name</label><input id="ob-name" type="text" placeholder="Your name"/></div>
        <div className="ob-field"><label>Date of Birth</label><input type="date" id="ob-dob"/></div>
      </div>
      <div className="ob-field"><label>Your Goal</label>
        <div className="ob-chip-row" id="ob-goals">
          <button className="ob-chip sel" data-onclick="selObChip(this,'ob-goals')">Track my cycle</button>
          <button className="ob-chip" data-onclick="selObChip(this,'ob-goals')">Manage symptoms</button>
          <button className="ob-chip" data-onclick="selObChip(this,'ob-goals')">Plan pregnancy</button>
          <button className="ob-chip" data-onclick="selObChip(this,'ob-goals')">General wellness</button>
        </div>
      </div>
      <div className="ob-btns"><button className="btn btn-primary inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium bg-gradient-to-br from-[#e8617a] to-[#9b7fe8] text-white hover:opacity-90 active:scale-[0.98] transition" style={{ flex: "1" }} data-onclick="obNext(2)">Continue →</button></div>
    </div>
    
    <div id="ob-step-2" style={{ display: "none" }}>
      <div className="ob-icon">🩸</div>
      <div className="ob-title">Your Cycle Details</div>
      <div className="ob-sub">Tell us about your cycle so our ML model can make accurate predictions from day one.</div>
      <div className="ob-row">
        <div className="ob-field"><label>Last Period Start</label><input type="date" id="ob-last-period"/></div>
        <div className="ob-field"><label>Avg Cycle Length (days)</label><input type="number" placeholder="28" min="21" max="45" value="28"/></div>
      </div>
      <div className="ob-row">
        <div className="ob-field"><label>Avg Period Duration (days)</label><input type="number" placeholder="5" min="1" max="10" value="5"/></div>
        <div className="ob-field"><label>Flow Intensity</label>
          <select><option>Light</option><option selected>Moderate</option><option>Heavy</option></select>
        </div>
      </div>
      <div className="ob-btns">
        <button className="btn btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium border border-white/10 text-[#f0eaf8]/60 hover:text-[#9b7fe8] hover:border-[#9b7fe8] transition" style={{ flex: "1" }} data-onclick="obNext(1)">← Back</button>
        <button className="btn btn-primary inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium bg-gradient-to-br from-[#e8617a] to-[#9b7fe8] text-white hover:opacity-90 active:scale-[0.98] transition" style={{ flex: "1" }} data-onclick="obNext(3)">Continue →</button>
      </div>
    </div>
    
    <div id="ob-step-3" style={{ display: "none" }}>
      <div className="ob-icon">⏰</div>
      <div className="ob-title">Set Up Reminders</div>
      <div className="ob-sub">Choose which reminders you'd like to receive to stay on top of your health.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--surface2)", borderRadius: "12px" }}><span style={{ fontSize: "13px" }}>🩸 Period start reminder</span><button className="toggle on" data-onclick="this.classList.toggle('on')"></button></div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--surface2)", borderRadius: "12px" }}><span style={{ fontSize: "13px" }}>💊 Daily pill reminder</span><button className="toggle" data-onclick="this.classList.toggle('on')"></button></div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--surface2)", borderRadius: "12px" }}><span style={{ fontSize: "13px" }}>📋 Daily symptom check-in</span><button className="toggle on" data-onclick="this.classList.toggle('on')"></button></div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--surface2)", borderRadius: "12px" }}><span style={{ fontSize: "13px" }}>🌿 Ovulation window alert</span><button className="toggle on" data-onclick="this.classList.toggle('on')"></button></div>
      </div>
      <div className="ob-btns">
        <button className="btn btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium border border-white/10 text-[#f0eaf8]/60 hover:text-[#9b7fe8] hover:border-[#9b7fe8] transition" style={{ flex: "1" }} data-onclick="obNext(2)">← Back</button>
        <button className="btn btn-primary inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium bg-gradient-to-br from-[#e8617a] to-[#9b7fe8] text-white hover:opacity-90 active:scale-[0.98] transition" style={{ flex: "1" }} data-onclick="obNext(4)">Continue →</button>
      </div>
    </div>
    
    <div id="ob-step-4" style={{ display: "none" }}>
      <div className="ob-icon">✨</div>
      <div className="ob-title">You're all set!</div>
      <div className="ob-sub">Your Health Assistant is personalised and ready. Your first cycle prediction is already loading based on what you've told us.</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
        <div style={{ background: "var(--rose-soft)", borderRadius: "12px", padding: "14px", textAlign: "center" }}><div style={{ fontSize: "20px", marginBottom: "4px" }}>🩸</div><div style={{ fontSize: "12px", color: "var(--rose)", fontWeight: "500" }}>Next period</div><div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Apr 10</div></div>
        <div style={{ background: "var(--teal-soft)", borderRadius: "12px", padding: "14px", textAlign: "center" }}><div style={{ fontSize: "20px", marginBottom: "4px" }}>🌿</div><div style={{ fontSize: "12px", color: "var(--teal)", fontWeight: "500" }}>Ovulation</div><div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Mar 30</div></div>
        <div style={{ background: "var(--lavender-soft)", borderRadius: "12px", padding: "14px", textAlign: "center" }}><div style={{ fontSize: "20px", marginBottom: "4px" }}>📊</div><div style={{ fontSize: "12px", color: "var(--lavender)", fontWeight: "500" }}>Cycle length</div><div style={{ fontSize: "11px", color: "var(--text-muted)" }}>28 days</div></div>
        <div style={{ background: "var(--amber-soft)", borderRadius: "12px", padding: "14px", textAlign: "center" }}><div style={{ fontSize: "20px", marginBottom: "4px" }}>⏰</div><div style={{ fontSize: "12px", color: "var(--amber)", fontWeight: "500" }}>Reminders</div><div style={{ fontSize: "11px", color: "var(--text-muted)" }}>3 active</div></div>
      </div>
      <div className="ob-btns"><button className="btn btn-primary inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-medium bg-gradient-to-br from-[#e8617a] to-[#9b7fe8] text-white hover:opacity-90 active:scale-[0.98] transition" style={{ flex: "1" }} data-onclick="finishOnboarding()">Go to Dashboard 🎉</button></div>
    </div>
  </div>
</div>


<div id="modal" style={{ display: "none", position: "fixed", inset: "0", zIndex: "9000", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", alignItems: "center", justifyContent: "center" }} data-onclick="if(event.target===this)closeModal()">
  <div id="modal-inner" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "32px", maxWidth: "380px", width: "90%", animation: "fadeIn 0.3s ease" }}></div>
</div>







<div id="screen-landing" style={{ display: "none" }}>

<nav>
  <div className="ln-logo"><div className="ln-circle">🌙</div><span className="ln-name">Health Assistant</span></div>
  <div className="ln-links">
    <a data-onclick="document.getElementById('ln-features').scrollIntoView({behavior:'smooth'})">Features</a>
    <a data-onclick="document.getElementById('ln-features').scrollIntoView({behavior:'smooth'})">About</a>
    <a data-onclick="document.getElementById('ln-features').scrollIntoView({behavior:'smooth'})">Research</a>
    <button className="ln-btn" data-onclick="showScreen('screen-auth')">Login / Sign up</button>
  </div>
</nav>
<section className="ln-hero">
  <div className="ln-bubbles" id="ln-bubbles"></div>
  <div className="ln-badge"><div className="ln-bdot"></div>AI-Powered Women's Health</div>
  <h1 className="ln-h1">Track Your Cycle,<br /><em>Understand Your Body</em></h1>
  <p className="ln-sub">An intelligent menstrual health platform combining machine learning, anomaly detection, and a 24/7 AI assistant — built for every body.</p>
  <div className="ln-btns">
    <button className="ln-p" data-onclick="showScreen('screen-auth');setTimeout(function(){document.getElementById('auth-reg-btn').click();},200)">✦ Get Started Free</button>
    <button className="ln-s" data-onclick="document.getElementById('ln-features').scrollIntoView({behavior:'smooth'})">See Features ↓</button>
  </div>
  <div className="ln-scroll"><span>Scroll to explore</span><svg className="ln-arr" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10l6 6 6-6" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
</section>
<div className="ln-stats">
  <div><div className="ln-sn">91%</div><div className="ln-sl">Prediction accuracy</div></div>
  <div><div className="ln-sn">24/7</div><div className="ln-sl">AI assistant</div></div>
  <div><div className="ln-sn">5+</div><div className="ln-sl">Health insights</div></div>
  <div><div className="ln-sn">100%</div><div className="ln-sl">Private & encrypted</div></div>
</div>
<section className="ln-feats" id="ln-features">
  <div className="ln-sh"><h2>Everything you need</h2><p>Powered by ML, NLP & anomaly detection</p></div>
  <div className="ln-fg">
    <div className="ln-fc" style={{ transitionDelay: "0s" }}><div className="ln-fi" style={{ background: "#fdf2f8" }}><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="#ec4899" strokeWidth="1.5"/><path d="M11 7v4l3 2" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round"/></svg></div><div className="ln-ft">Cycle prediction</div><div className="ln-fd">ML-powered forecasting of your next period and ovulation window with high accuracy.</div></div>
    <div className="ln-fc" style={{ transitionDelay: ".1s" }}><div className="ln-fi" style={{ background: "#f5f3ff" }}><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="#8b5cf6" strokeWidth="1.5"/><path d="M7 11h8M11 7v8" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round"/></svg></div><div className="ln-ft">Anomaly detection</div><div className="ln-fd">Identifies irregular cycles, missed periods, and abnormal patterns using Isolation Forest.</div></div>
    <div className="ln-fc" style={{ transitionDelay: ".2s" }}><div className="ln-fi" style={{ background: "#ecfdf5" }}><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 16l4-4 3 3 4-5 3 3" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div><div className="ln-ft">Fertile window</div><div className="ln-fd">Calculates your ovulation date and 6-day fertile window so you can plan ahead.</div></div>
    <div className="ln-fc" style={{ transitionDelay: ".3s" }}><div className="ln-fi" style={{ background: "#fff7ed" }}><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M6 8h10M6 12h7" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round"/><rect x="3" y="4" width="16" height="14" rx="3" stroke="#f97316" strokeWidth="1.5"/></svg></div><div className="ln-ft">AI health chatbot</div><div className="ln-fd">NLP-powered assistant answers health queries, sends reminders, and provides tips 24/7.</div></div>
    <div className="ln-fc" style={{ transitionDelay: ".4s" }}><div className="ln-fi" style={{ background: "#fdf2f8" }}><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#ec4899" strokeWidth="1.5"/><rect x="12" y="3" width="7" height="7" rx="1.5" stroke="#ec4899" strokeWidth="1.5"/><rect x="3" y="12" width="7" height="7" rx="1.5" stroke="#ec4899" strokeWidth="1.5"/><rect x="12" y="12" width="7" height="7" rx="1.5" stroke="#ec4899" strokeWidth="1.5"/></svg></div><div className="ln-ft">Dashboard & graphs</div><div className="ln-fd">Visual calendar, trend graphs, and symptom tracking to understand health over time.</div></div>
    <div className="ln-fc" style={{ transitionDelay: ".5s" }}><div className="ln-fi" style={{ background: "#f5f3ff" }}><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="4" y="3" width="14" height="16" rx="3" stroke="#8b5cf6" strokeWidth="1.5"/><path d="M8 8h6M8 12h4" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round"/></svg></div><div className="ln-ft">Private & secure</div><div className="ln-fd">End-to-end encrypted storage. Your sensitive health data stays yours, always.</div></div>
  </div>
</section>
<div style={{ padding: "0 2rem 3rem" }}><div className="ln-cta" id="ln-cta"><h2>Ready to know your body better?</h2><p>Join thousands who trust Health Assistant for personalized menstrual health insights.</p><button className="ln-cb" data-onclick="showScreen('screen-auth');setTimeout(function(){document.getElementById('auth-reg-btn').click();},200)">Start tracking today &rarr;</button></div></div>
<footer>Made with care — Anand Kharode, Sejal Rathod, Krushita Lambhate &nbsp;|&nbsp; Guided by Prof. T. B. Faruki</footer>

</div>


<div id="screen-auth" className="screen-auth fixed inset-0 z-40 flex min-h-screen w-full items-center justify-center bg-[#0d0a14]" style={{ display: "none" }}>

<div className="auth-petals absolute inset-0 overflow-hidden" id="auth-petals"></div>
<button className="auth-back absolute left-6 top-6 z-10 text-sm text-[#f0eaf8]/70 hover:text-[#f0eaf8]" data-onclick="showScreen('screen-landing')">← Back to home</button>
<div className="auth-box group relative w-[860px] max-w-[92vw] min-h-[520px] bg-[#16111f] border border-white/10 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden" id="auth-container">
  <div className="fb login absolute left-0 top-0 h-full w-1/2 p-10 flex flex-col justify-center gap-4">
    <form data-onsubmit="return false;">
      <h1>Login</h1>
      <div className="ib relative"><input className="w-full rounded-xl border border-white/10 bg-[#1e1729] px-4 py-3 text-sm text-[#f0eaf8] placeholder:text-[#f0eaf8]/30 focus:border-[#9b7fe8] focus:outline-none" type="text" placeholder="Username" required/><span className="ico pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#f0eaf8]/40"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></span></div>
      <div className="ib relative"><input className="w-full rounded-xl border border-white/10 bg-[#1e1729] px-4 py-3 text-sm text-[#f0eaf8] placeholder:text-[#f0eaf8]/30 focus:border-[#9b7fe8] focus:outline-none" type="password" placeholder="Password" required/><span className="ico pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#f0eaf8]/40"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span></div>
      <div className="fl text-right"><a className="text-xs text-[#9b7fe8] hover:text-[#e8617a]" href="#">Forgot Password?</a></div>
      <button className="ab mt-2 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-gradient-to-br from-[#e8617a] to-[#9b7fe8] text-white hover:opacity-90 transition" data-onclick="doLogin(this.closest('form'))">Login</button>
      <p className="sp mt-3 text-center text-xs text-[#f0eaf8]/40">or login with social platforms</p>
      <div className="si mt-3 flex items-center justify-center gap-3 text-[#f0eaf8]/60">
        <a href="#"><svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg></a>
        <a href="#"><svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
        <a href="#"><svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg></a>
        <a href="#"><svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
      </div>
    </form>
  </div>
  <div className="fb register absolute right-0 top-0 h-full w-1/2 p-10 flex flex-col justify-center gap-4">
    <form data-onsubmit="return false;">
      <h1>Registration</h1>
      <div className="ib relative"><input className="w-full rounded-xl border border-white/10 bg-[#1e1729] px-4 py-3 text-sm text-[#f0eaf8] placeholder:text-[#f0eaf8]/30 focus:border-[#9b7fe8] focus:outline-none" type="text" placeholder="Username" required/><span className="ico pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#f0eaf8]/40"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></span></div>
      <div className="ib relative"><input className="w-full rounded-xl border border-white/10 bg-[#1e1729] px-4 py-3 text-sm text-[#f0eaf8] placeholder:text-[#f0eaf8]/30 focus:border-[#9b7fe8] focus:outline-none" type="email" placeholder="Email" required/><span className="ico pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#f0eaf8]/40"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/></svg></span></div>
      <div className="ib relative"><input className="w-full rounded-xl border border-white/10 bg-[#1e1729] px-4 py-3 text-sm text-[#f0eaf8] placeholder:text-[#f0eaf8]/30 focus:border-[#9b7fe8] focus:outline-none" type="password" placeholder="Password" required/><span className="ico pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#f0eaf8]/40"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span></div>
      <button className="ab mt-2 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-gradient-to-br from-[#e8617a] to-[#9b7fe8] text-white hover:opacity-90 transition" data-onclick="doLogin(this.closest('form'))">Register</button>
      <p className="sp mt-3 text-center text-xs text-[#f0eaf8]/40">or register with social platforms</p>
      <div className="si mt-3 flex items-center justify-center gap-3 text-[#f0eaf8]/60">
        <a href="#"><svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg></a>
        <a href="#"><svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
        <a href="#"><svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg></a>
        <a href="#"><svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
      </div>
    </form>
  </div>
  <div className="tb absolute inset-y-0 left-1/2 w-1/2 bg-gradient-to-br from-[#1e1729] to-[#16111f] flex flex-col justify-center gap-6 p-10">
    <div className="tp-panel tp-left"><h1>Hello, Welcome!</h1><p className="tpt text-sm text-[#f0eaf8]/60">Don't have an account?</p><button className="ab mt-2 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-gradient-to-br from-[#e8617a] to-[#9b7fe8] text-white hover:opacity-90 transition" id="auth-reg-btn">Register</button></div>
    <div className="tp-panel tp-right"><h1>Welcome Back!</h1><p className="tpt text-sm text-[#f0eaf8]/60">Already have an account?</p><button className="ab mt-2 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-gradient-to-br from-[#e8617a] to-[#9b7fe8] text-white hover:opacity-90 transition" id="auth-login-btn">Login</button></div>
  </div>
</div>

</div>


<div id="fab-panel" style={{ display: "none", position: "fixed", bottom: "100px", right: "30px", zIndex: "1000", width: "360px", background: "#fff", borderRadius: "24px", boxShadow: "0 20px 60px rgba(0,0,0,.18),0 4px 16px rgba(155,127,232,.15)", overflow: "hidden", fontFamily: "'DM Sans',sans-serif" }}>
  <div style={{ background: "linear-gradient(135deg,#e8617a,#9b7fe8)", padding: "18px 20px 16px", display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
    <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(255,255,255,.2)", border: "2px solid rgba(255,255,255,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: "0" }}>🌙</div>
    <div style={{ flex: "1" }}><div style={{ color: "#fff", fontWeight: "600", fontSize: "15px" }}>Health Assistant AI</div><div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}><div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#a8f0b0" }}></div><span style={{ color: "rgba(255,255,255,.8)", fontSize: "11px" }}>Online · Cycle-aware</span></div></div>
    <div style={{ display: "flex", gap: "6px" }}>
      <button data-onclick="clearFabChat()" style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,.15)", border: "none", cursor: "pointer", color: "#fff", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center" }}>🗑</button>
      <button data-onclick="toggleFabPanel()" style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,.15)", border: "none", cursor: "pointer", color: "#fff", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
    </div>
    <div style={{ position: "absolute", top: "-20px", right: "40px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,.07)", pointerEvents: "none" }}></div>
  </div>
  <div style={{ background: "#fdf4f6", borderBottom: "1px solid #f0e6f0", padding: "9px 18px", display: "flex", alignItems: "center", gap: "8px" }}><span style={{ fontSize: "13px" }}>🌸</span><span style={{ fontSize: "12px", color: "#a060b0", fontWeight: "500" }}>Day 14 · Follicular Phase</span><span style={{ marginLeft: "auto", fontSize: "11px", color: "#c090c0" }}>Ovulation in 3 days</span></div>
  <div id="fab-msgs" style={{ height: "290px", overflowY: "auto", padding: "16px", background: "#fafafa", display: "flex", flexDirection: "column", gap: "12px", scrollBehavior: "smooth" }}>
    <div className="fab-msg-ai"><div className="fab-av-ai">🌙</div><div><div className="fab-bubble-ai" id="fab-welcome-msg">Hi there! 🌸 I'm your Health Assistant. How can I help today?</div><div className="fab-time">Just now</div></div></div>
  </div>
  <div id="fab-suggestions" style={{ padding: "10px 14px", background: "#fff", borderTop: "1px solid #f0eaf5", display: "flex", gap: "6px", flexWrap: "wrap" }}>
    <button className="fab-sugg" data-onclick="fabQuick(this,'Why am I so energetic today?')">⚡ Energy?</button>
    <button className="fab-sugg" data-onclick="fabQuick(this,'What should I eat this week?')">🥗 Diet?</button>
    <button className="fab-sugg" data-onclick="fabQuick(this,'When is my ovulation?')">🌿 Ovulation?</button>
    <button className="fab-sugg" data-onclick="fabQuick(this,'Help me with cramps')">🔥 Cramps?</button>
  </div>
  <div style={{ padding: "12px 14px 14px", background: "#fff", display: "flex", gap: "9px", alignItems: "flex-end" }}>
    <textarea id="fab-input" placeholder="Ask anything…" rows="1" style={{ flex: "1", border: "1.5px solid #e8dff0", borderRadius: "14px", padding: "10px 14px", fontSize: "13px", fontFamily: "'DM Sans',sans-serif", color: "#3d2a4a", background: "#fdf8ff", outline: "none", resize: "none", lineHeight: "1.4", transition: "border-color .2s" }} data-onfocus="this.style.borderColor='#9b7fe8'" data-onblur="this.style.borderColor='#e8dff0'" data-onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendFabMsg()}"></textarea>
    <button data-onclick="sendFabMsg()" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg,#e8617a,#9b7fe8)", border: "none", cursor: "pointer", color: "#fff", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(155,127,232,.35)", flexShrink: "0", transition: "transform .2s" }} data-onmouseover="this.style.transform='scale(1.08)'" data-onmouseout="this.style.transform='scale(1)'">↑</button>
  </div>
  <div style={{ padding: "8px 16px 12px", background: "#fff", textAlign: "center", borderTop: "1px solid #f5f0fa" }}><span style={{ fontSize: "10.5px", color: "#c0aad0" }}>✦ Powered by Health Assistant AI</span></div>
</div>
<div id="fab-btn-wrap" style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: "1001" }}>
  <div style={{ position: "absolute", inset: "-6px", borderRadius: "50%", border: "1.5px solid rgba(155,127,232,.4)", animation: "fabPing 2.8s ease-out infinite", pointerEvents: "none" }}></div>
  <div style={{ position: "absolute", inset: "-10px", borderRadius: "50%", background: "radial-gradient(circle,rgba(155,127,232,.25),transparent 70%)", pointerEvents: "none" }}></div>
  <button data-onclick="toggleFabPanel()" style={{ width: "54px", height: "54px", borderRadius: "50%", background: "linear-gradient(135deg,#e8617a,#9b7fe8)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 28px rgba(155,127,232,.45)", animation: "fabFloat 3.5s ease-in-out infinite", position: "relative", overflow: "hidden", transition: "transform .2s,box-shadow .2s" }} data-onmouseover="this.style.transform='scale(1.1)'" data-onmouseout="this.style.transform='scale(1)'"><span style={{ fontSize: "22px", color: "white", animation: "fabSpin 8s linear infinite" }}>✦</span></button>
  <div id="fab-badge" style={{ position: "absolute", top: "-2px", right: "-2px", width: "16px", height: "16px", background: "#e8617a", border: "2px solid #fff", borderRadius: "50%", display: "none", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "700", color: "#fff" }}>1</div>
</div>




    </div>
  );
}
