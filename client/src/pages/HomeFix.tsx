import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import { background, character, videoBg, audio } from '@/lib/assets';
import { AudioConsentModal } from "@/components/AudioConsentModal";
import { ChapterLaunchModal, type ChapterMeta } from "@/components/ChapterLaunchModal";
import { useMediaState } from "@/contexts/MediaStateContext";
import { useMediaActions } from "@/contexts/MediaActionsContext";
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

type TrailerLine = {
  id: string;
  src: string;
  fallback: string;
  ar: string;
  en: string;
  color: string;
};

const trailerLines: TrailerLine[] = [
  {
    id: 'osiris-opens',
    src: '/assets/video-bg/cosmic-opening.mp4',
    fallback: '/assets/images/yehia-room.jpg',
    ar: 'الفتح العظيم',
    en: 'The Great Opening',
    color: '#c9a96e',
  },
  {
    id: 'cosmic-courtroom',
    src: '/assets/video-bg/nicaea.mp4',
    fallback: '/assets/images/02.jpg',
    ar: 'غرفة المحاكمة الكونية',
    en: 'The Cosmic Courtroom',
    color: '#dc2626',
  },
  {
    id: 'pharaoh-enters',
    src: '/assets/video-bg/egypt-nile-temple.mp4',
    fallback: '/assets/images/03.jpg',
    ar: 'دخول الفرعون',
    en: 'Pharaoh Enters',
    color: '#9333ea',
  },
  {
    id: 'nicaea-council',
    src: '/assets/video-bg/nicaea.mp4',
    fallback: '/assets/images/04.jpg',
    ar: 'مجمع نيقية',
    en: 'Council of Nicaea',
    color: '#22c55e',
  },
  {
    id: 'andalus-falls',
    src: '/assets/video-bg/granada-fall.mp4',
    fallback: '/assets/images/05.jpg',
    ar: 'سقوط الأندلس',
    en: 'Fall of Andalus',
    color: '#e74c3c',
  },
  {
    id: 'digital-age',
    src: '/assets/video-bg/digital-space.mp4',
    fallback: '/assets/images/06.jpg',
    ar: 'العصر الرقمي',
    en: 'The Digital Age',
    color: '#3b82f6',
  },
];

const formatTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
};

const openLaunch = (c: ChapterMeta, setSelected: React.Dispatch<React.SetStateAction<ChapterMeta | null>>, setLaunchOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
  setSelected(c);
  setLaunchOpen(true);
};

export default function EnhancedHome() {
  const [, setLocation] = useLocation();
  const mediaState = useMediaState();
  const { play, pause, setAccentColor, setDurationMs, setUiLang } = useMediaActions();
  const { uiLang } = mediaState;
  const [launchOpen, setLaunchOpen] = useState(false);
  const [selected, setSelected] = useState<ChapterMeta | null>(null);
  const [tilt, setTilt] = useState<Record<string, { rx: number; ry: number; tx: number; ty: number }>>({});
  const rafRef = useRef<number | null>(null);
  const [showTrailer, setShowTrailer] = useState(true);
  const [trailerIdx, setTrailerIdx] = useState(0);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);

  const chapters = useMemo(() => [
    {
      id: 'part-0',
      number: '0',
      title: 'The Cosmic Courtroom',
      icon: '⚖️',
      arabicTitle: 'غرفة المحاكمة الكونية',
      arabicSubtitle: 'المحاكمة خارج الزمن والمكان',
      subtitle: 'Trial outside time and space',
      description: 'The trial begins outside time and space',
      accentColor: '#c9a96e',
      imageSrc: background('osiris_cosmic'),
      sceneId: 'zero-1-1-summons',
      estMinutes: 12
    },
    {
      id: 'part-1',
      number: '1',
      title: 'The First Crime',
      icon: '🗡️',
      arabicTitle: 'الجريمة الأولى',
      arabicSubtitle: 'جريمة قابيل',
      subtitle: 'A crime that echoes through millennia',
      description: 'Qabil commits the first recorded murder',
      accentColor: '#dc2626',
      imageSrc: background('berlin_1933'),
      sceneId: 'one-1-qabil-intro',
      estMinutes: 15
    },
    {
      id: 'part-2',
      number: '2',
      title: 'Pharaoh',
      icon: '👑',
      arabicTitle: 'الفرعون',
      arabicSubtitle: 'مجمع الأحكام',
      subtitle: 'Divine authority challenged',
      description: 'Constantine confronts the power of empire',
      accentColor: '#9333ea',
      imageSrc: background('berlin_1933'),
      sceneId: 'two-1-council',
      estMinutes: 18
    },
    {
      id: 'part-3',
      number: '3',
      title: 'Nicaea',
      icon: '⛪',
      arabicTitle: 'نيقية',
      arabicSubtitle: 'ضوء العلم',
      subtitle: 'Where faith meets reason',
      description: 'The council that shaped Christian doctrine',
      accentColor: '#22c55e',
      imageSrc: background('cambodia_1975'),
      sceneId: 'three-1-decree',
      estMinutes: 14
    },
    {
      id: 'part-4',
      number: '4',
      title: 'Andalus',
      icon: '🏰',
      arabicTitle: 'الأندلس',
      arabicSubtitle: 'ضوء الأندلس',
      subtitle: 'Light in darkness',
      description: 'Golden age of knowledge and culture',
      accentColor: '#e74c3c',
      imageSrc: background('cambodia_1975'),
      sceneId: 'four-1-cordoba',
      estMinutes: 16
    },
    {
      id: 'part-5',
      number: '5',
      title: '20th Century',
      icon: '🌐',
      arabicTitle: 'القرن العشرين',
      arabicSubtitle: 'العصر الحديث',
      subtitle: 'When history accelerates',
      description: 'From Hitler to algorithms',
      accentColor: '#3b82f6',
      imageSrc: background('berlin_1933'),
      sceneId: 'five-1-hitler',
      estMinutes: 20
    },
    {
      id: 'part-6',
      number: '6',
      title: 'Digital Pride',
      icon: '💻',
      arabicTitle: 'الفخر الرقمي',
      arabicSubtitle: 'الكبرياء',
      subtitle: 'When code becomes conviction',
      description: 'From Facebook leaks to AI justice',
      accentColor: '#8b5cf6',
      imageSrc: background('yahya_apartment'),
      sceneId: 'six-1-facebook',
      estMinutes: 18
    },
    {
      id: 'part-7',
      number: '7',
      title: 'Witnesses for Defense',
      icon: '👥',
      arabicTitle: 'شهود الدفاع',
      arabicSubtitle: 'عن العدالة',
      subtitle: 'Voices from the past',
      description: 'When history speaks for itself',
      accentColor: '#f59e0b',
      imageSrc: background('yahya_apartment'),
      sceneId: 'seven-1-witnesses',
      estMinutes: 22
    }
  ], [uiLang]);

  const isArabic = uiLang === "ar";
  const { allowVideo } = useBandwidthStrategy();
  const accent = chapters[0]?.accentColor || '#c9a96e';
  const progress = 0; // Placeholder - would come from media state

  const activeTrailer = trailerLines[trailerIdx % trailerLines.length];

  const handleStart = (c: ChapterMeta) => {
    setDurationMs(Math.max(10_000, c.estMinutes * 60 * 1000));
    setLaunchOpen(false);
    setLocation(`/play?scene=${encodeURIComponent(c.sceneId)}`);
  };

  const handleCardMove = useCallback((id: string, e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateY = (x / rect.width) * 15;
    const rotateX = -(y / rect.height) * 15;
    setTilt(prev => ({ ...prev, [id]: { rx: rotateX, ry: rotateY, tx: x * 0.1, ty: y * 0.1 } }));
  }, []);

  const handleCardLeave = useCallback((id: string) => {
    setTilt(prev => ({ ...prev, [id]: { rx: 0, ry: 0, tx: 0, ty: 0 } }));
  }, []);

  const handleAudioConsent = useCallback((allowed: boolean) => {
    if (allowed) {
      play();
    } else {
      pause();
    }
    setShowAudioPrompt(false);
  }, [play, pause, setShowAudioPrompt]);

  useEffect(() => {
    setAccentColor(accent);
  }, [accent, setAccentColor]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrailerIdx(prev => (prev + 1) % trailerLines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleRAF = () => {
      Object.keys(tilt).forEach(id => {
        const t = tilt[id];
        if (Math.abs(t.rx) > 0.1 || Math.abs(t.ry) > 0.1) {
          setTilt(prev => ({ ...prev, [id]: { rx: t.rx * 0.95, ry: t.ry * 0.95, tx: t.tx * 0.95, ty: t.ty * 0.95 } }));
          rafRef.current = requestAnimationFrame(handleRAF);
        } else {
          rafRef.current = null;
        }
      });
    };

    Object.keys(tilt).forEach(id => {
      const t = tilt[id];
      if (Math.abs(t.rx) > 0.1 || Math.abs(t.ry) > 0.1) {
        rafRef.current = requestAnimationFrame(handleRAF);
      }
    });
  }, [tilt]);

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
                />
              ) : (
                <motion.img
                  key={activeTrailer.id + '-i'}
                  className="absolute inset-0 w-full h-full object-cover"
                  src={activeTrailer.fallback}
                  alt={isArabic ? activeTrailer.ar : activeTrailer.en}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 0.78, scale: 1.01 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              )}
            </AnimatePresence>
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
                onClick={() => openLaunch(chapters[0], setSelected, setLaunchOpen)}
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
                    onClick={() => openLaunch(c, setSelected, setLaunchOpen)}
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
                    onClick={() => openLaunch(c, setSelected, setLaunchOpen)}
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

      {/* Audio Consent Modal */}
      <AnimatePresence>
        {showAudioPrompt && (
          <AudioConsentModal
            onConsent={handleAudioConsent}
            lang={isArabic ? "ar" : "en"}
          />
        )}
      </AnimatePresence>

      {/* Chapter Launch Modal */}
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
