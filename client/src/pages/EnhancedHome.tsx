import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import { ASSET_URLS } from "@/lib/assetUrls";
import { AudioConsentModal } from "@/components/AudioConsentModal";
import { ChapterLaunchModal, type ChapterMeta } from "@/components/ChapterLaunchModal";
import ExpandableChapters from "@/components/ExpandableChapters";
import { useMediaState } from "@/contexts/MediaStateContext";
import { useMediaActions } from "@/contexts/MediaActionsContext";
import { OSIRIS_EFFECTS, getOsirisMediaUrl } from "@/lib/osirisEffects";
import { useBandwidthStrategy } from "@/lib/mediaStrategy";
import osirisFavicon from "@/LOGO/new-logo/favicon-black-0.25.png";
import osirisFalcon from "@/LOGO/new-logo/logo-falcon.png";
import { BookOpen, Clock, Music, Volume2, Sparkles, Scroll, ChevronRight } from "lucide-react";

import styles from "./EnhancedHome.module.css";

type ChapterDef = ChapterMeta & {
  number: string;
  icon: string;
  title: string;
  arabicTitle: string;
  subtitle: string;
  arabicSubtitle: string;
  estMinutes: number;
  imageSrc: string;
  accentColor: string;
  sceneId: string;
};

const formatTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
};

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

// Novel features data
const NOVEL_FEATURES = [
  { icon: Volume2, en: "Voice-Synced Narration", ar: "سرد متزامن مع الصوت" },
  { icon: Music, en: "Cinematic Soundtrack", ar: "موسيقى تصويرية سينمائية" },
  { icon: Scroll, en: "7 Historical Chapters", ar: "7 فصول تاريخية" },
  { icon: Clock, en: "108 Minutes Experience", ar: "تجربة 108 دقيقة" },
  { icon: Sparkles, en: "AI-Powered Visuals", ar: "صور مدعومة بالذكاء الاصطناعي" },
];

export default function EnhancedHome() {
  const [, setLocation] = useLocation();
  const mediaState = useMediaState();
  const { play, pause, setAccentColor, setDurationMs, setUiLang } = useMediaActions();
  const { uiLang } = mediaState;
  const [launchOpen, setLaunchOpen] = useState(false);
  const [selected, setSelected] = useState<ChapterMeta | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerIdx, setTrailerIdx] = useState(0);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);
  const rafRef = useRef<number | null>(null);

  const openLaunch = (c: ChapterMeta) => {
    setSelected(c);
    setLaunchOpen(true);
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

  const allowVideo = useBandwidthStrategy();

  const handleStart = (c: ChapterMeta) => {
    setDurationMs(Math.max(10_000, c.estMinutes * 60 * 1000));
    setLaunchOpen(false);
    setLocation(`/play?scene=${encodeURIComponent(c.sceneId)}`);
  };

  const handleAudioConsent = useCallback(
    (allowed: boolean) => {
      if (allowed) {
        play();
      } else {
        pause();
      }
      setShowAudioPrompt(false);
    },
    [play, pause]
  );

  // Start from first chapter
  const handleStartExperience = () => {
    const firstChapter = chapters[0];
    if (firstChapter) {
      handleStart(firstChapter);
    }
  };

  return (
    <div
      className="relative z-10 h-[100dvh] w-screen overflow-hidden text-white"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${currentAccentColor}15 0%, transparent 50%),
                        radial-gradient(ellipse at 70% 80%, #1a1a2e 0%, #0a0a0f 100%)`,
          }}
        />
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="h-full w-full px-4 sm:px-6 pt-4 pb-[calc(env(safe-area-inset-bottom)+76px)] flex flex-col min-h-0 relative">
        {/* Header - Minimal & Elegant */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex items-center justify-between pb-3 border-b"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className={`flex items-center gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
              <img
                src={osirisFavicon}
                alt="OSIRIS"
                className="relative h-9 w-9 opacity-95"
              />
            </motion.div>
            <div>
              <div className="text-[11px] font-mono tracking-[0.3em] text-amber-200/70 uppercase">
                OSIRIS
              </div>
              <div className="text-[10px] text-white/50 tracking-wider">
                {isArabic ? "المفسدون في الأرض" : "The Corruptors on Earth"}
              </div>
            </div>
          </div>

          {/* Language Toggle Only - No Play Button */}
          <motion.button
            onClick={() => setUiLang(isArabic ? "en" : "ar")}
            className="px-4 py-2 rounded-lg text-xs border backdrop-blur-sm transition-all duration-300 hover:bg-white/5"
            style={{
              borderColor: "rgba(201,169,110,0.3)",
              color: "rgba(201,169,110,0.9)",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isArabic ? "English" : "العربية"}
          </motion.button>
        </motion.div>

        {/* Main Content Grid */}
        <div className="mt-4 grid flex-1 min-h-0 grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Panel - Novel Info Card */}
          <motion.div
            initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3 flex flex-col gap-4"
          >
            {/* Main Info Card */}
            <div
              className="flex-1 flex flex-col rounded-2xl border p-5 overflow-hidden relative"
              style={{
                borderColor: "rgba(201,169,110,0.15)",
                background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(10,10,15,0.8) 100%)",
                boxShadow: "0 0 60px rgba(201,169,110,0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              {/* Decorative top line */}
              <div 
                className="absolute top-0 left-0 right-0 h-px"
                style={{ 
                  background: "linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.5) 50%, transparent 100%)" 
                }}
              />

              {/* Novel Title */}
              <div className="relative z-10">
                <motion.div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono tracking-[0.2em] text-amber-200/60 border"
                  style={{ borderColor: "rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.05)" }}
                >
                  <BookOpen className="w-3 h-3" />
                  {isArabic ? "رواية تفاعلية" : "INTERACTIVE NOVEL"}
                </motion.div>

                <h1 className="mt-4 text-2xl font-light tracking-[0.15em] text-white">
                  OSIRIS
                </h1>
                <p className="mt-1 text-lg text-amber-200/70 font-arabic-title" dir="rtl">
                  المفسدون في الأرض
                </p>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-white/70 leading-relaxed flex-1">
                {isArabic 
                  ? "محاكمة سينمائية تمتد عبر ستة آلاف سنة، تقودك فيها الأصوات والموسيقى والشهادات التاريخية ضمن سرد تفاعلي حي يتحدث عن الشرِّ ككودٍ برمجيٍّ يتكرر عبر التاريخ."
                  : "A cinematic courtroom spanning six thousand years. Voices, music, and historical witnesses guide you through an interactive narrative exploring evil as a recurring code throughout history."
                }
              </p>

              {/* Features Grid */}
              <div className="mt-4 grid grid-cols-1 gap-2">
                {NOVEL_FEATURES.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <feature.icon className="w-4 h-4 text-amber-400/60" />
                    <span className="text-[11px] text-white/60">
                      {isArabic ? feature.ar : feature.en}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="mt-4 flex flex-col gap-2">
                <motion.button
                  onClick={handleStartExperience}
                  className="w-full py-3 rounded-xl text-sm font-semibold tracking-wider flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, rgba(201,169,110,0.95), rgba(201,169,110,0.7))",
                    boxShadow: "0 8px 32px rgba(201,169,110,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
                    color: "#0b0b0f",
                  }}
                  whileHover={{ scale: 1.02, boxShadow: "0 12px 40px rgba(201,169,110,0.35)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isArabic ? "▶ ابدأ التجربة" : "▶ BEGIN THE TRIAL"}
                  <ChevronRight className="w-4 h-4" />
                </motion.button>

                <motion.button
                  onClick={() => setLocation("/model")}
                  className="w-full py-3 rounded-xl border text-sm text-white/80 hover:text-white transition-colors flex items-center justify-center gap-2"
                  style={{
                    borderColor: "rgba(255,255,255,0.12)",
                    background: "rgba(0,0,0,0.3)",
                  }}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isArabic ? "عن نموذج OSIRIS" : "About OSIRIS Model"}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Expandable Chapters */}
          <motion.div 
            initial={{ opacity: 0, x: isArabic ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-9 min-h-0 flex flex-col"
          >
            {/* Section Header */}
            <div className={`flex items-center justify-between mb-3 ${isArabic ? "flex-row-reverse" : ""}`}>
              <div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
                <span className="text-[11px] font-mono tracking-[0.2em] text-white/50 uppercase">
                  {isArabic ? "الفصول السبعة" : "Seven Chapters"}
                </span>
                <div className="h-px w-8 bg-white/20" />
              </div>
              <span className="text-[10px] text-white/40">
                {isArabic ? "انقر لتوسيع الفصل" : "Click chapter to expand"}
              </span>
            </div>

            {/* Chapters Component */}
            <ExpandableChapters
              chapters={chapters}
              isArabic={isArabic}
              onSelect={openLaunch}
              autoPlay={true}
              className="flex-1"
            />

            {/* Bottom Hint */}
            <div 
              className={`mt-3 flex items-center gap-3 px-4 py-3 rounded-xl border ${isArabic ? "flex-row-reverse" : ""}`}
              style={{ 
                borderColor: "rgba(201,169,110,0.1)",
                background: "rgba(0,0,0,0.3)",
              }}
            >
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#c9a96e" }}
              />
              <span className="text-[11px] text-white/50">
                {isArabic 
                  ? "كل فصل يمثل حقبة تاريخية في قصة الإفساد في الأرض"
                  : "Each chapter represents a historical epoch in the story of corruption on Earth"
                }
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Audio Consent Modal */}
      <AnimatePresence>
        {showAudioPrompt && (
          <AudioConsentModal onConsent={handleAudioConsent} lang={uiLang} />
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

      {/* Ambient decoration */}
      <motion.div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] pointer-events-none opacity-10"
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          rotate: { duration: 60, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <img 
          src={osirisFalcon} 
          alt="" 
          className="w-full h-full object-contain"
          style={{ filter: 'drop-shadow(0 0 30px rgba(201,169,110,0.3))' }}
        />
      </motion.div>
    </div>
  );
}
