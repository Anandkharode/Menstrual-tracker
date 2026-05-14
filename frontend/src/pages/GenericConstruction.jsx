import React from "react";

export default function GenericConstruction({ title, icon, desc }) {
  return (
    <div className="p-6 lg:p-8 flex flex-col items-center justify-center h-[70vh] text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-[32px] mb-5" style={{ background: "rgba(255,255,255,0.03)" }}>
        {icon}
      </div>
      <h1 className="text-[1.5rem] font-semibold mb-2" style={{ color: "#f0eaf8" }}>{title}</h1>
      <p className="text-[13px] max-w-[300px]" style={{ color: "rgba(240,234,248,0.45)" }}>{desc}</p>
      
      <div className="mt-8 px-4 py-2 rounded-full border border-[rgba(255,255,255,0.04)] text-[11px] uppercase tracking-wider text-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.02)]">
        Coming Soon
      </div>
    </div>
  );
}
