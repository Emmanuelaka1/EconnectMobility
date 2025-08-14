import React from "react";
function initials(name?: string) { if (!name) return "U"; return name.split(" ").filter(Boolean).slice(0,2).map(n=>n[0]?.toUpperCase()).join(""); }
export default function UserAvatar({ name, url, size=32 }:{name?:string; url?:string|null; size?:number}) {
  const style = { width: size, height: size };
  if (url) return (<img src={url} alt={name ?? "Avatar"} className="rounded-full object-cover ring-2 ring-white/10" style={style} />);
  return (<div className="rounded-full bg-slate-600 text-white grid place-items-center ring-2 ring-white/10" style={style}><span className="text-xs font-semibold">{initials(name)}</span></div>);
}
