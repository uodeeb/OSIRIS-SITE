import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export type ChapterMeta = {
  id: string;
  title: string;
  arabicTitle: string;
  subtitle: string;
  arabicSubtitle: string;
  estMinutes: number;
  imageSrc: string;
  accentColor: string;
  sceneId: string;
};

function withAlpha(hex: string, alpha: number) {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? `${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}` : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function ChapterLaunchModal(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapter: ChapterMeta | null;
  uiLang: "en" | "ar";
  onStart: (chapter: ChapterMeta) => void;
}) {
  const { open, onOpenChange, chapter, uiLang, onStart } = props;
  const isArabic = uiLang === "ar";
  const accent = chapter?.accentColor || "#c9a96e";
  const startBtnRef = useRef<HTMLButtonElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  
  // Focus trap for accessibility
  const modalContentRef = useFocusTrap({
    isActive: open,
    initialFocus: startBtnRef.current,
    onEscape: () => onOpenChange(false)
  });

  const tips = useMemo(
    () => [
      {
        k: "headphones",
        title: isArabic ? "سماعات الأذن" : "Headphones",
        text: isArabic ? "استخدم سماعات الأذن لأفضل تجربة سينمائية." : "Use headphones for the best cinematic experience.",
      },
      {
        k: "fullscreen",
        title: isArabic ? "ملء الشاشة" : "Fullscreen",
        text: isArabic ? "فعّل ملء الشاشة لزيادة الانغماس." : "Enable fullscreen for maximum immersion.",
      },
      {
        k: "focus",
        title: isArabic ? "تركيز" : "Focus",
        text: isArabic ? "اضغط إيقاف عند المقاطعة—المؤقت يتوقف بدقة." : "Pause anytime—the timer stops accurately.",
      },
    ],
    [isArabic],
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild aria-modal="true">
              <motion.div
                ref={modalContentRef}
                role="dialog"
                initial={{ opacity: 0, y: 26, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 26, scale: 0.98 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.55, ease: "easeOut" }}
                className="fixed left-1/2 top-1/2 z-50 w-[min(960px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-black/90 shadow-2xl focus:outline-none"
                style={{ borderColor: withAlpha(accent, 0.25) }}
                dir={isArabic ? "rtl" : "ltr"}
              >
                {/* 🛡️ Accessibility: Visually Hidden Title & Description for Radix UI */}
                <Dialog.Title className="sr-only">
                  {isArabic ? chapter?.arabicTitle : chapter?.title}
                </Dialog.Title>
                <Dialog.Description className="sr-only">
                  {isArabic ? chapter?.arabicSubtitle : chapter?.subtitle}
                </Dialog.Description>

                <div className="grid grid-cols-1 md:grid-cols-5 overflow-hidden rounded-2xl">
                  <div className="md:col-span-2 relative min-h-[200px] md:min-h-[420px]">
                    {chapter?.imageSrc ? (
                      <img src={chapter.imageSrc} alt={isArabic ? chapter?.arabicTitle : chapter?.title} className="absolute inset-0 h-full w-full object-cover" width={1920} height={1080} />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black" />
                    )}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(180deg, ${withAlpha(accent, 0.08)} 0%, rgba(0,0,0,0.88) 70%, rgba(0,0,0,0.96) 100%)`,
                      }}
                    />
                    <div className="absolute left-4 right-4 bottom-4">
                      <div className="text-[11px] font-mono tracking-[0.24em] text-white/80">OSIRIS ARCHIVE</div>
                      <div id="chapter-title" className="mt-2 text-white font-semibold text-lg">
                        {isArabic ? chapter?.arabicTitle : chapter?.title}
                      </div>
                      <div className="mt-1 text-white/70 text-sm">
                        {isArabic ? chapter?.arabicSubtitle : chapter?.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-3 p-5 md:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-semibold text-white leading-normal">
                          {isArabic ? chapter?.arabicTitle : chapter?.title}
                        </h3>
                        <p className="mt-2 text-white/70 text-sm md:text-base leading-relaxed">
                          {isArabic
                            ? "اختيارك يحدد نقطة البداية. المؤقت والتحكم الموحد يستمران عبر الانتقالات."
                            : "Your selection sets the entry point. The unified controller and timer persist across transitions."}
                        </p>
                      </div>
                      <Dialog.Close asChild>
                        <button
                          className="h-10 w-10 rounded-xl border flex items-center justify-center text-white/70 hover:text-white"
                          style={{ borderColor: "rgba(255,255,255,0.14)", background: "rgba(0,0,0,0.35)" }}
                          aria-label="Close"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </Dialog.Close>
                    </div>

                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="rounded-xl border p-4" style={{ borderColor: "rgba(255,255,255,0.20)", background: "rgba(255,255,255,0.04)" }}>
                        <div className="text-[11px] font-mono tracking-wider text-white/70">{isArabic ? "الوقت" : "TIME"}</div>
                        <div className="mt-2 text-white font-semibold">
                          {chapter ? `${chapter.estMinutes} ${isArabic ? "دقيقة" : "min"}` : "--"}
                        </div>
                      </div>
                      <div className="rounded-xl border p-4" style={{ borderColor: "rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.04)" }}>
                        <div className="text-[11px] font-mono tracking-wider text-white/55">{isArabic ? "النمط" : "MODE"}</div>
                        <div className="mt-2 text-white font-semibold">{isArabic ? "سينمائي" : "Cinematic"}</div>
                      </div>
                      <div className="rounded-xl border p-4" style={{ borderColor: "rgba(255,255,255,0.20)", background: "rgba(255,255,255,0.04)" }}>
                        <div className="text-[11px] font-mono tracking-wider text-white/70">{isArabic ? "الصوت" : "AUDIO"}</div>
                        <div className="mt-2 text-white font-semibold">{isArabic ? "موصى به" : "Recommended"}</div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border p-4 md:p-5" style={{ borderColor: withAlpha(accent, 0.22), background: withAlpha(accent, 0.06) }}>
                      <div className="text-[11px] font-mono tracking-[0.22em] text-white/80">
                        {isArabic ? "لوحة ما قبل التشغيل" : "PRE-FLIGHT"}
                      </div>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                        {tips.map((t) => (
                          <div key={t.k} className="rounded-xl border p-3" style={{ borderColor: "rgba(255,255,255,0.20)", background: "rgba(0,0,0,0.35)" }}>
                            <div className="text-white font-semibold text-sm">{t.title}</div>
                            <div className="mt-1 text-white/80 text-xs leading-relaxed">{t.text}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                      <div className="text-white/70 text-xs">
                        {isArabic ? "يمكنك الإيقاف/التشغيل من شريط التحكم الموحد في أي وقت." : "You can play/pause anytime from the unified transport bar."}
                      </div>
                      <div className="flex gap-3 sm:justify-end">
                        <Dialog.Close asChild>
                          <button
                            className="px-5 py-3 rounded-xl border text-sm text-white/90 hover:text-white"
                            style={{ borderColor: "rgba(255,255,255,0.28)", background: "rgba(0,0,0,0.35)" }}
                          >
                            {isArabic ? "رجوع" : "Back"}
                          </button>
                        </Dialog.Close>
                        <button
                          ref={startBtnRef}
                          onClick={() => chapter && onStart(chapter)}
                          className="px-6 py-3 rounded-xl text-sm font-semibold"
                          style={{
                            background: `linear-gradient(135deg, ${accent}, ${withAlpha(accent, 0.65)})`,
                            boxShadow: `0 12px 34px ${withAlpha(accent, 0.22)}`,
                            color: "#0b0b0f",
                          }}
                        >
                          {isArabic ? "ابدأ الآن" : "Start Now"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

