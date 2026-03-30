import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import osirisLogo from "@/LOGO/new-logo/new-logo-trans-osiris@10x.png";

export default function FullScript() {
  const [, setLocation] = useLocation();
  const [q, setQ] = useState("");
  const [content, setContent] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim();
    if (!t) return content;
    const parts = content.split(/\r?\n/);
    const out: string[] = [];
    const needle = t.toLowerCase();
    for (const line of parts) {
      if (line.toLowerCase().includes(needle)) out.push(line);
    }
    return out.join("\n");
  }, [q, content]);

  useEffect(() => {
    fetch("/script/OSIRIS_Final_Interactive_Script.md")
      .then((r) => r.text())
      .then((t) => setContent(t))
      .catch(() => setContent(""));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={osirisLogo} alt="OSIRIS" className="w-8 h-8 opacity-90" />
            <div>
              <div className="text-[10px] font-mono tracking-[0.28em] text-white/55">FULL SCRIPT</div>
              <div className="text-sm font-arabic-ui text-white/85" dir="rtl">النص الكامل</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="بحث / Search"
              className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white/85 text-sm w-44 sm:w-64 outline-none"
            />
            <button
              onClick={() => setLocation("/")}
              className="px-3 py-2 rounded-xl border border-white/10 bg-black/30 text-white/80 text-[10px] font-mono tracking-wider"
            >
              HOME
            </button>
            <button
              onClick={() => setLocation("/play")}
              className="px-3 py-2 rounded-xl border border-white/10 bg-black/30 text-white/80 text-[10px] font-mono tracking-wider"
            >
              PLAY
            </button>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 py-10"
      >
        <div
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7"
          style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.7)" }}
        >
          <div
            dir="rtl"
            className="font-arabic-ui text-[15px] leading-8 text-white/90"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {filtered || "Loading..."}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
