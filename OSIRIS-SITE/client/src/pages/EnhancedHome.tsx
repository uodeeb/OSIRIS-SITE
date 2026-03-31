import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import { ASSET_URLS } from "@/lib/assetUrls";
import { AudioConsentModal } from "@/components/AudioConsentModal";
import { ChapterLaunchModal, type ChapterMeta } from "@/components/ChapterLaunchModal";
import { useMediaController } from "@/contexts/MediaControllerContext";

import { OSIRIS_EFFECTS, getOsirisMediaUrl } from "@/lib/osirisEffects";
import { useBandwidthStrategy } from "@/lib/mediaStrategy";
import osirisFavicon from "@/LOGO/new-logo/favicon-black-0.25.png";
import osirisFalcon from "@/LOGO/new-logo/logo-falcon.png";

type ChapterDef = ChapterMeta & {
  number: string;
  icon: string;
};

function withAlpha(hex: string, alpha: number) {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? `${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}` : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function EnhancedHome() {
  const [, setLocation] = useLocation();
  const { state: mediaState, play, pause, setAccentColor, setDurationMs, setUiLang } = useMediaController();
  const { uiLang } = mediaState;
  const [launchOpen, setLaunchOpen] = useState(false);
  const [selected, setSelected] = useState<ChapterDef | null>(null);
  const [tilt, setTilt] = useState<Record<string, { rx: number; ry: number; tx: number; ty: number }>>({});
  const rafRef = useRef<number | null>(null);
  const [showTrailer, setShowTrailer] = useState(true);
  const [trailerIdx, setTrailerIdx] = useState(0);
  const { allowVideo } = useBandwidthStrategy();

type TrailerLine = {
  id: string;
  src: string;
  fallback: string;
  ar: string;
  en: string;
  color: string;
  captionSrcEn?: string;
  captionSrcAr?: string;
  audioDescSrcEn?: string;
  audioDescSrcAr?: string;
};

  const trailerLines = useMemo<TrailerLine[]>(
    () => [
      {
        id: 'summons',
        src: getOsirisMediaUrl(OSIRIS_EFFECTS['FX-01-SUMMONS-EYE'].base),
        fallback: getOsirisMediaUrl(OSIRIS_EFFECTS['FX-01-SUMMONS-EYE'].fallback),
        ar: 'الشر ليس عشوائياً… إنه كود',
        en: 'Evil is not random. It is code.',
        color: '#00e5ff',
        captionSrcEn: '/captions/summons-en.vtt',
        captionSrcAr: '/captions/summons-ar.vtt',
        audioDescSrcEn: '/audio-descriptions/summons-en.vtt',
        audioDescSrcAr: '/audio-descriptions/summons-ar.vtt',
      },
      {
        id: 'analysis',
        src: getOsirisMediaUrl(OSIRIS_EFFECTS['FX-04-NEURAL-ANALYSIS'].base),
        fallback: getOsirisMediaUrl(OSIRIS_EFFECTS['FX-08-SOLEMN-DUST'].fallback),
        ar: 'أوزيريس يقرأ الموجات… ويكشف النمط',
        en: 'OSIRIS reads the waves, then reveals the pattern.',
        color: '#9b5cff',
        captionSrcEn: '/captions/analysis-en.vtt',
        captionSrcAr: '/captions/analysis-ar.vtt',
        audioDescSrcEn: '/audio-descriptions/analysis-en.vtt',
        audioDescSrcAr: '/audio-descriptions/analysis-ar.vtt',
      },
      {
        id: 'truth',
        src: getOsirisMediaUrl(OSIRIS_EFFECTS['FX-07-TRUTH-LEAK'].base),
        fallback: getOsirisMediaUrl(OSIRIS_EFFECTS['FX-03-HOLOGRAM-DATA'].fallback),
        ar: 'الحقيقة لا تُسكت… بل تُبَثّ',
        en: 'Truth does not whisper. It broadcasts.',
        color: '#ff2d2d',
        captionSrcEn: '/captions/truth-en.vtt',
        captionSrcAr: '/captions/truth-ar.vtt',
        audioDescSrcEn: '/audio-descriptions/truth-en.vtt',
        audioDescSrcAr: '/audio-descriptions/truth-ar.vtt',
      },
    ],
    [],
  );

  const chapters = useMemo<ChapterDef[]>(
    () => [
      {
        id: "part-0",
        number: "0",
        icon: "⚖️",
        title: "The Cosmic Courtroom",
        arabicTitle: "غرفة المحاكمة الكونية",
        subtitle: "The trial begins outside time and space",
        arabicSubtitle: "تبدأ المحاكمة خارج الزمان والمكان",
        estMinutes: 14,
        imageSrc: ASSET_URLS.backgrounds.osiris_cosmic,
        accentColor: "#c9a96e",
        sceneId: "zero-1-1-summons",
      },
      {
        id: "part-1",
        number: "I",
        icon: "💻",
        title: "The First Crime (Source Code)",
        arabicTitle: "الجريمة الأولى",
        subtitle: "The algorithm is written and the first patterns appear",
        arabicSubtitle: "يُكتب الخوارزم وتظهر الأنماط الأولى",
        estMinutes: 16,
        imageSrc: ASSET_URLS.backgrounds.corporate_lab,
        accentColor: "#ef4444",
        sceneId: "one-1-5-1-promise",
      },
      {
        id: "part-2",
        number: "II",
        icon: "🐄",
        title: "The Golden Calf",
        arabicTitle: "العجل الذهبي",
        subtitle: "Building icons to fill the spiritual void",
        arabicSubtitle: "بناء الأيقونات لملء الفراغ الروحي",
        estMinutes: 18,
        imageSrc: ASSET_URLS.backgrounds.qabil_habil_altar,
        accentColor: "#d4af37",
        sceneId: "four-4-1-desert",
      },
      {
        id: "part-3",
        number: "III",
        icon: "🏛️",
        title: "The Council of Nicaea",
        arabicTitle: "مجمع نيقية",
        subtitle: "When institutions weaponize the sacred",
        arabicSubtitle: "عندما تُسلّح المؤسسات المقدس",
        estMinutes: 16,
        imageSrc: ASSET_URLS.backgrounds.nicaea_council,
        accentColor: "#3b82f6",
        sceneId: "five-6a-1-nicaea-debate",
      },
      {
        id: "part-4",
        number: "IV",
        icon: "🕌",
        title: "Andalusia & 20th Century",
        arabicTitle: "الأندلس والقرن العشرون",
        subtitle: "Arrogance becomes history and ideology",
        arabicSubtitle: "الكبرياء يصبح تاريخاً وأيديولوجيا",
        estMinutes: 18,
        imageSrc: ASSET_URLS.backgrounds.granada_fall,
        accentColor: "#22c55e",
        sceneId: "six-8-1-andalusia",
      },
      {
        id: "part-5",
        number: "V",
        icon: "⚔️",
        title: "Karbala",
        arabicTitle: "كربلاء",
        subtitle: "The unarmed truth — the antivirus",
        arabicSubtitle: "الحقيقة العزلاء — مضاد الفيروس",
        estMinutes: 14,
        imageSrc: ASSET_URLS.backgrounds.qabil_habil_aftermath,
        accentColor: "#f97316",
        sceneId: "seven-10-1-karbala",
      },
      {
        id: "part-6",
        number: "VI",
        icon: "👁️",
        title: "Witnesses for the Defense",
        arabicTitle: "شهود الدفاع",
        subtitle: "The closing testimony",
        arabicSubtitle: "الشهادة الختامية",
        estMinutes: 12,
        imageSrc: ASSET_URLS.backgrounds.osiris_interface,
        accentColor: "#8b5cf6",
        sceneId: "seven-12-1-truth-leak",
      },
    ],
    [],
  );

  const isArabic = uiLang === "ar";

  const currentAccentColor = useMemo(() => selected?.accentColor || "#c9a96e", [selected?.accentColor]);

  useEffect(() => {
    setAccentColor(currentAccentColor);
  }, [currentAccentColor, setAccentColor]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const force = params.get("trailer") === "1";
    if (force) {
      try {
        window.localStorage.removeItem("osiris-trailer-hidden");
      } catch {
        // ignore
      }
      setShowTrailer(true);
      return;
    }
    try {
      const hidden = window.localStorage.getItem("osiris-trailer-hidden") === "1";
      if (hidden) setShowTrailer(false);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!showTrailer) return;
    const id = window.setInterval(() => setTrailerIdx((v) => (v + 1) % trailerLines.length), 5200);
    return () => window.clearInterval(id);
  }, [showTrailer, trailerLines.length]);

  const openLaunch = (c: ChapterDef) => {
    setSelected(c);
    setLaunchOpen(true);
  };

  const handleStart = (c: ChapterMeta) => {
    setDurationMs(Math.max(10_000, c.estMinutes * 60 * 1000));
    setLaunchOpen(false);
    setLocation(`/play?scene=${encodeURIComponent(c.sceneId)}`);
  };

  const handleCardMove = (id: string, e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const ry = (px - 0.5) * 10;
    const rx = (0.5 - py) * 10;
    const tx = (px - 0.5) * 10;
    const ty = (py - 0.5) * 10;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setTilt((prev) => ({ ...prev, [id]: { rx, ry, tx, ty } }));
    });
  };

  const handleCardLeave = (id: string) => setTilt((prev) => ({ ...prev, [id]: { rx: 0, ry: 0, tx: 0, ty: 0 } }));

  const accent = selected?.accentColor || mediaState.accentColor || "#c9a96e";
  const progress = mediaState.durationMs > 0 ? Math.max(0, Math.min(1, mediaState.elapsedMs / mediaState.durationMs)) : 0;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const activeTrailer = trailerLines[trailerIdx % trailerLines.length];

  return (
    <div className="relative z-10 h-[100dvh] w-screen overflow-hidden text-white" dir={isArabic ? "rtl" : "ltr"}>
      <AnimatePresence>
        {showTrailer && (
          <motion.div
            key="trailer"
            className="absolute inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black" />
            <AnimatePresence mode="wait">
              {allowVideo ? (
                <motion.video
                  key={activeTrailer.id + '-v'}
                  className="absolute inset-0 w-full h-full object-cover"
                  src={activeTrailer.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 0.78, scale: 1.01 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ filter: 'brightness(0.45) contrast(1.12) saturate(0.9)' }}
                >
                  {activeTrailer.captionSrcEn && (
                    <track
                      kind="subtitles"
                      src={activeTrailer.captionSrcEn}
                      srcLang="en"
                      label="English"
                      default={uiLang === "en"}
                    />
                  )}
                  {activeTrailer.captionSrcAr && (
                    <track
                      kind="subtitles"
                      src={activeTrailer.captionSrcAr}
                      srcLang="ar"
                      label="العربية"
                      default={uiLang === "ar"}
                    />
                  )}
                  {activeTrailer.audioDescSrcEn && (
                    <track
                      kind="descriptions"
                      src={activeTrailer.audioDescSrcEn}
                      srcLang="en"
                      label="English Audio Description"
                      default={uiLang === "en"}
                    />
                  )}
                  {activeTrailer.audioDescSrcAr && (
                    <track
                      kind="descriptions"
                      src={activeTrailer.audioDescSrcAr}
                      srcLang="ar"
                      label="وصف صوتي عربي"
                      default={uiLang === "ar"}
                    />
                  )}
                </motion.video>
              ) : (
                <motion.img
                  key={activeTrailer.id + '-g'}
                  className="absolute inset-0 w-full h-full object-cover"
                  src={activeTrailer.fallback}
                  alt=""
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 0.72, scale: 1.01 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ filter: 'brightness(0.45) contrast(1.12) saturate(0.9)' }}
                />
              )}
            </AnimatePresence>

            <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 40% 35%, ${activeTrailer.color}22, rgba(0,0,0,0.86) 58%, rgba(0,0,0,0.98) 100%)` }} />
            <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0) 2px, rgba(0,0,0,0) 6px)', mixBlendMode: 'screen', opacity: 0.16 }} />
            <motion.img
              src={osirisFalcon}
              alt="OSIRIS falcon emblem"
              className="absolute -right-10 sm:right-4 bottom-10 sm:bottom-14 w-[320px] sm:w-[420px] md:w-[520px] opacity-20 pointer-events-none"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 0.2, y: 0, scale: 1 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              style={{ filter: 'drop-shadow(0 0 24px rgba(0,229,255,0.18))' }}
            />

            <div className={`relative h-full flex flex-col justify-between px-4 sm:px-8 py-6 ${isArabic ? 'text-right' : 'text-left'}`}>
              <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <img src={osirisFavicon} alt="OSIRIS logo" className="w-9 h-9 opacity-90" />
                  <div className="text-[10px] font-mono tracking-[0.26em] text-white/65">CINEMATIC TRAILER</div>
                </div>
                <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => {
                      // No audio control in EnhancedHome, as MediaControllerContext handles it globally
                    }}
                    className="px-2.5 py-1 text-[9px] rounded-md font-mono tracking-wider"
                    style={{ border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.75)', background: 'rgba(0,0,0,0.35)' }}
                  >
                    {mediaState.isMuted ? (isArabic ? 'صامت' : 'MUTED') : (isArabic ? 'صوت' : 'AUDIO')}
                  </button>
                  <button
                    onClick={() => (mediaState.isPlaying ? pause() : play())}
                    className="px-2.5 py-1 text-[9px] rounded-md font-mono tracking-wider"
                    style={{ border: `1px solid ${activeTrailer.color}33`, color: activeTrailer.color, background: 'rgba(0,0,0,0.35)' }}
                  >
                    {mediaState.isPlaying ? (isArabic ? 'إيقاف' : 'PAUSE') : (isArabic ? 'تشغيل الصوت' : 'PLAY AUDIO')}
                  </button>
                  <button
                    onClick={() => { /* No fullscreen toggle in EnhancedHome */ }}
                    className="px-2.5 py-1 text-[9px] rounded-md font-mono tracking-wider"
                    style={{ border: '1px solid rgba(201,169,110,0.2)', color: 'rgba(201,169,110,0.9)', background: 'rgba(0,0,0,0.35)' }}
                  >
                    {isArabic ? 'ملء الشاشة' : 'FULL'}
                  </button>
                </div>
              </div>

              <div className="max-w-3xl">
                <motion.div
                  key={activeTrailer.id + '-line'}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className={`text-[11px] tracking-[0.22em] ${isArabic ? 'font-arabic-ui' : 'font-mono'} text-white/70`}>
                    {isArabic ? 'مقتطفات من المحاكمة' : 'EXCERPTS FROM THE TRIAL'}
                  </div>
                  <div className={`mt-3 text-2xl sm:text-3xl md:text-4xl leading-normal ${isArabic ? 'font-arabic-title' : 'font-light'} `} style={{ color: 'rgba(255,255,255,0.92)' }} dir={isArabic ? 'rtl' : 'ltr'}>
                    {isArabic ? activeTrailer.ar : activeTrailer.en}
                  </div>
                </motion.div>

                <div className={`mt-6 flex flex-wrap items-center gap-3 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
                  <motion.button
                    onClick={() => setLocation('/play')}
                    className={`px-6 sm:px-8 py-3 rounded-xl text-black font-semibold tracking-[0.12em] text-xs sm:text-sm ${isArabic ? 'font-arabic-ui' : ''}`}
                    style={{ background: `linear-gradient(135deg, ${activeTrailer.color}, #f0d080)` }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isArabic ? '▶ ابدأ التجربة' : '▶ START EXPERIENCE'}
                  </motion.button>
                  <button
                    onClick={() => setLocation('/script')}
                    className={`px-5 py-3 rounded-xl text-[10px] tracking-[0.22em] ${isArabic ? 'font-arabic-ui' : 'font-mono'}`}
                    style={{ border: `1px solid ${activeTrailer.color}44`, background: 'rgba(0,0,0,0.25)', color: 'rgba(255,255,255,0.9)' }}
                  >
                    {isArabic ? 'النص الكامل' : 'FULL SCRIPT'}
                  </button>
                  <button
                    onClick={() => {
                      setShowTrailer(false);
                      try {
                        window.localStorage.setItem("osiris-trailer-hidden", "1");
                      } catch {
                        // ignore
                      }
                    }}
                    className={`px-5 py-3 rounded-xl text-[10px] tracking-[0.22em] ${isArabic ? 'font-arabic-ui' : 'font-mono'}`}
                    style={{ border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(0,0,0,0.35)', color: 'rgba(255,255,255,0.7)' }}
                  >
                    {isArabic ? 'تخطي المقطع' : 'SKIP'}
                  </button>
                  <div className="flex items-center gap-2">
                    {/* Volume control is handled by MediaControllerContext globally */}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-white/70 font-mono tracking-wider">
                <span>{allowVideo ? 'VIDEO' : 'LOW-BANDWIDTH'}</span>
                <span>{isArabic ? 'اضغط ابدأ لفتح المحاكمة' : 'Press start to enter the trial'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-full w-full px-4 sm:px-6 pt-5 pb-[calc(env(safe-area-inset-bottom)+76px)] flex flex-col min-h-0 relative">
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'url(/patterns/geometric-pattern.svg)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10 flex items-center justify-between pb-3 border-b" style={{ borderColor: "rgba(255,255,255,0.10)" }}>
          <div className={`flex items-center gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
            <img src={osirisFavicon} alt="OSIRIS" className="h-8 w-8 opacity-95" />
            <div>
              <div className="text-[12px] font-mono tracking-[0.26em] text-white/70">OSIRIS ARCHIVE</div>
              <div className="text-sm text-white/90">{isArabic ? "رواية تفاعلية متعددة الوسائط" : "Multimedia Interactive Novel"}</div>
            </div>
          </div>

          <div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
            <button
              onClick={() => setUiLang(isArabic ? "en" : "ar")}
              className="px-3 py-2 text-[11px] rounded-xl border"
              style={{ borderColor: "rgba(255,255,255,0.16)", background: "rgba(0,0,0,0.30)", color: "rgba(255,255,255,0.85)" }}
            >
              {isArabic ? "English" : "العربية"}
            </button>
            <button
              onClick={() => (mediaState.isPlaying ? pause() : play())}
              className="px-3 py-2 text-[11px] rounded-xl border"
              style={{ borderColor: withAlpha(accent, 0.4), background: "rgba(0,0,0,0.30)", color: withAlpha(accent, 0.95) }}
            >
              {mediaState.isPlaying ? (isArabic ? "إيقاف" : "Pause") : (isArabic ? "تشغيل" : "Play")}
            </button>
          </div>
          <div className="absolute bottom-0 left-0 h-[2px] w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.10)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.round(progress * 100)}%`,
                background: `linear-gradient(90deg, ${withAlpha(accent, 0.35)} 0%, ${accent} 55%, rgba(255,255,255,0.92) 100%)`,
                boxShadow: `0 0 22px ${withAlpha(accent, 0.22)}`,
              }}
            />
          </div>
        </div>

        <div className="mt-5 grid flex-1 min-h-0 grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl border p-4 sm:p-5"
            style={{ borderColor: withAlpha(accent, 0.22), background: "rgba(0,0,0,0.38)" }}
          >
            <div>
              <div className="text-[11px] font-mono tracking-[0.22em] text-white/55">{isArabic ? "المفسدون في الأرض" : "THE CORRUPTORS ON EARTH"}</div>
              <div className="mt-3 text-3xl sm:text-4xl font-semibold leading-tight">
                {isArabic ? "محاكمة تمتد عبر ستة آلاف سنة" : "A trial across six thousand years"}
              </div>
              <div className="mt-3 text-sm sm:text-base text-white/85 leading-relaxed">
                {isArabic
                  ? "نمط سينمائي متزامن مع الصوت. تحكم موحد يوقف/يشغل كل الوسائط ويحسب زمن القراءة الحقيقي."
                  : "A cinematic mode synced with audio. One unified controller to play/pause all media and track real reading time."}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                onClick={() => openLaunch(chapters[0])}
                className="px-5 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: `linear-gradient(135deg, ${accent}, ${withAlpha(accent, 0.62)})`,
                  boxShadow: `0 14px 40px ${withAlpha(accent, 0.20)}`,
                  color: "#0b0b0f",
                }}
              >
                {isArabic ? "ابدأ التجربة" : "Start Experience"}
              </button>
              <button
                onClick={() => setLocation("/model")}
                className="px-5 py-3 rounded-xl border text-sm text-white/90 hover:text-white"
                style={{ borderColor: "rgba(255,255,255,0.28)", background: "rgba(0,0,0,0.30)" }}
              >
                {isArabic ? "عن نموذج OSIRIS" : "About OSIRIS Model"}
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 min-h-0">
            <div className="hidden md:grid min-h-0 grid-cols-2 xl:grid-cols-3 gap-4 h-full">
              {chapters.map((c) => {
                const t = tilt[c.id] || { rx: 0, ry: 0, tx: 0, ty: 0 };
                return (
                  <motion.div
                    key={c.id}
                    onPointerMove={(e) => handleCardMove(c.id, e)}
                    onPointerLeave={() => handleCardLeave(c.id)}
                    onFocus={() => setSelected(c)}
                    onMouseEnter={() => setSelected(c)}
                    onClick={() => openLaunch(c)}
                    className="relative rounded-2xl border overflow-hidden cursor-pointer select-none min-h-[280px]"
                    style={{
                      borderColor: withAlpha(c.accentColor, 0.22),
                      background: "rgba(0,0,0,0.35)",
                      transformStyle: "preserve-3d",
                      transform: `perspective(900px) rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
                      boxShadow: `0 18px 60px ${withAlpha(c.accentColor, 0.18)}`,
                    }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.18 }}
                    role="button"
                    tabIndex={0}
                    aria-label={isArabic ? `فتح ${c.arabicTitle}` : `Open ${c.title}`}
                  >
                    <div className="absolute inset-0">
                      <img
                        src={c.imageSrc}
                        alt={isArabic ? c.arabicTitle : c.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        style={{ transform: `translate3d(${t.tx * -1}px, ${t.ty * -1}px, 0) scale(1.08)`, filter: "brightness(0.75) contrast(1.15) saturate(1.05)" }}
                      />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${withAlpha(c.accentColor, 0.10)} 0%, rgba(0,0,0,0.82) 70%, rgba(0,0,0,0.96) 100%)` }} />
                    </div>

                    <div className="relative h-full p-4 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] font-mono tracking-[0.22em] text-white/85">{c.number}</div>
                        <div className="text-xl" style={{ filter: `drop-shadow(0 0 16px ${withAlpha(c.accentColor, 0.35)})` }}>{c.icon}</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-white">{isArabic ? c.arabicTitle : c.title}</div>
                        <div className="mt-1 text-[12px] text-white/70 leading-relaxed">{isArabic ? c.arabicSubtitle : c.subtitle}</div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-[11px] font-mono text-white/55">{isArabic ? `${c.estMinutes} دقيقة` : `${c.estMinutes} min`}</div>
                          <div className="h-9 w-9 rounded-xl border flex items-center justify-center" style={{ borderColor: withAlpha(c.accentColor, 0.24), background: withAlpha(c.accentColor, 0.10), color: c.accentColor }}>
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="md:hidden h-full">
              <div className="h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex gap-4 px-4">
                {chapters.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => openLaunch(c)}
                    onFocus={() => setSelected(c)}
                    className="snap-start shrink-0 w-[78vw] h-full rounded-2xl border overflow-hidden text-left min-h-[280px]"
                    style={{ borderColor: withAlpha(c.accentColor, 0.22), background: "rgba(0,0,0,0.35)" }}
                  >
                    <div className="relative h-full">
                      <img src={c.imageSrc} alt={isArabic ? c.arabicTitle : c.title} className="absolute inset-0 h-full w-full object-cover" style={{ filter: "brightness(0.72) contrast(1.15) saturate(1.05)" }} />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${withAlpha(c.accentColor, 0.10)} 0%, rgba(0,0,0,0.84) 70%, rgba(0,0,0,0.98) 100%)` }} />
                      <div className="relative h-full p-5 flex flex-col justify-end">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[12px] font-mono tracking-[0.22em] text-white/70">{c.number}</div>
                          <div className="text-2xl">{c.icon}</div>
                        </div>
                        <div className="text-xl font-semibold text-white">{isArabic ? c.arabicTitle : c.title}</div>
                        <div className="mt-2 text-sm text-white/85 leading-relaxed">{isArabic ? c.arabicSubtitle : c.subtitle}</div>
                        <div className="mt-3 text-[12px] font-mono text-white/75">{isArabic ? `${c.estMinutes} دقيقة` : `${c.estMinutes} min`}</div>
                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: c.accentColor }}>
                          <span>{isArabic ? "فتح" : "Open"}</span>
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timer Overlay */}
      <AnimatePresence>
        {mediaState.isPlaying && (
          <motion.div
            key="timer-overlay"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            role="status"
            aria-live="polite"
          >
            <div
              className="text-6xl sm:text-7xl md:text-8xl font-bold text-white text-shadow-lg"
              style={{ textShadow: `0 0 30px ${withAlpha(accent, 0.6)}, 0 0 60px ${withAlpha(accent, 0.3)}` }}
            >
              {formatTime(mediaState.elapsedMs)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

  const { play, pause } = useMediaController();

  const [showAudioPrompt, setShowAudioPrompt] = useState(true);

  const handleAudioConsent = useCallback((allowed: boolean) => {
    if (allowed) {
      play();
    } else {
      pause();
    }
    setShowAudioPrompt(false);
  }, [play, pause]);

  // ... other code ...

      <AnimatePresence>
        {showAudioPrompt && (
          <AudioConsentModal
            onConsent={handleAudioConsent}
            lang={isArabic ? "ar" : "en"}
          />
        )}
      </AnimatePresence>

      <ChapterLaunchModal
        open={launchOpen}
        onOpenChange={setLaunchOpen}
        chapter={selected}
        uiLang={uiLang}
        onStart={handleStart}
      />
    </div>
  );
}
