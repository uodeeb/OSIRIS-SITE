import { useMemo } from "react";
import { motion } from "framer-motion";
import { useMediaState } from "@/contexts/MediaStateContext";
import { useMediaActions } from "@/contexts/MediaActionsContext";

function withAlpha(hex: string, alpha: number) {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? `${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}` : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function MediaTransportBar() {
  const state = useMediaState();
  const { toggle, seekToMs, pause } = useMediaActions();

  const accent = state.accentColor || "#c9a96e";
  const glow = useMemo(() => `0 0 28px ${withAlpha(accent, 0.22)}`, [accent]);
  const isArabic = state.uiLang === "ar";

  return (
    <div className="fixed left-0 right-0 bottom-0 z-40 pointer-events-none" dir={isArabic ? "rtl" : "ltr"}>
      <div className="px-3 pb-[max(10px,env(safe-area-inset-bottom))]">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="pointer-events-auto mx-auto w-fit rounded-2xl border backdrop-blur-md"
          style={{
            borderColor: withAlpha(accent, 0.22),
            background: "rgba(0,0,0,0.58)",
            boxShadow: glow,
          }}
        >
          <div className={`flex items-center gap-2 px-3 py-3 ${isArabic ? "flex-row-reverse" : ""}`}>
            <button
              onClick={toggle}
              className="h-10 w-10 rounded-xl border flex items-center justify-center"
              style={{ borderColor: withAlpha(accent, 0.28), color: accent, background: "rgba(0,0,0,0.35)" }}
              aria-label={state.isPlaying ? (isArabic ? "إيقاف كل الوسائط" : "Pause all media") : (isArabic ? "تشغيل كل الوسائط" : "Play all media")}
            >
              {state.isPlaying ? (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => {
                pause();
                seekToMs(0);
              }}
              className="h-10 w-10 rounded-xl border flex items-center justify-center"
              style={{ borderColor: "rgba(255,255,255,0.28)", color: "rgba(255,255,255,0.90)", background: "rgba(0,0,0,0.35)" }}
              aria-label={isArabic ? "إيقاف كل الوسائط" : "Stop all media"}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h12v12H6z" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
