import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import { ASSET_URLS } from "@/lib/assetUrls";
import { AudioConsentModal } from "@/components/AudioConsentModal";
import { ChapterLaunchModal, type ChapterMeta } from "@/components/ChapterLaunchModal";
import ExpandableChapters from "@/components/ExpandableChapters";
import { useMediaController } from "@/contexts/MediaControllerContext";
import { OSIRIS_EFFECTS, getOsirisMediaUrl } from "@/lib/osirisEffects";
import { useBandwidthStrategy } from "@/lib/mediaStrategy";
import osirisFavicon from "@/LOGO/new-logo/favicon-black-0.25.png";
import osirisFalcon from "@/LOGO/new-logo/logo-falcon.png";

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

const TRAILER_LINES = [
  { color: "#c9a96e", text: { en: "6000 years of injustice", ar: "6000 سنة من الظلم" } },
  { color: "#dc2626", text: { en: "One man's quest for truth", ar: "بحث رجل واحد عن الحقيقة" } },
  { color: "#9333ea", text: { en: "From cosmic courtrooms to digital battlegrounds", ar: "من غرف المحاكمة الكونية إلى ساحات المعارك الرقمية" } },
  { color: "#22c55e", text: { en: "The weight of evidence", ar: "ثقل الأدلة" } },
  { color: "#e74c3c", text: { en: "When history becomes personal", ar: "عندما يصبح التاريخ شخصياً" } },
];

const formatTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
};

export default function EnhancedHome() {
  const [, setLocation] = useLocation();
  const { state: mediaState, play, pause, setAccentColor, setDurationMs, setUiLang } = useMediaController();
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

  const allowVideo = useBandwidthStrategy();

  const activeTrailer = TRAILER_LINES[trailerIdx % TRAILER_LINES.length];

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

  return (
    <div
      className="relative z-10 h-[100dvh] w-screen overflow-hidden text-white"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="h-full w-full px-4 sm:px-6 pt-5 pb-[calc(env(safe-area-inset-bottom)+76px)] flex flex-col min-h-0 relative">
        <div
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage: "url(/patterns/geometric-pattern.svg)",
            backgroundSize: "20px 20px",
          }}
        />
        <div
          className="relative z-10 flex items-center justify-between pb-3 border-b"
          style={{ borderColor: "rgba(255,255,255,0.10)" }}
        >
          <div
            className={`flex items-center gap-3 ${
              isArabic ? "flex-row-reverse" : ""
            }`}
          >
            <img
              src={osirisFavicon}
              alt="OSIRIS"
              className="h-8 w-8 opacity-95"
            />
            <div>
              <div className="text-[12px] font-mono tracking-[0.26em] text-white/70">
                OSIRIS ARCHIVE
              </div>
              <div className="text-sm text-white/90">
                {isArabic
                  ? "رواية تفاعلية متعددة الوسائط"
                  : "Multimedia Interactive Novel"}
              </div>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 ${
              isArabic ? "flex-row-reverse" : ""
            }`}
          >
            <button
              onClick={() => setUiLang(isArabic ? "en" : "ar")}
              className="px-3 py-1.5 rounded-lg text-xs border"
              style={{
                borderColor: "rgba(255,255,255,0.16)",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {isArabic ? "English" : "العربية"}
            </button>
            <button
              onClick={() => (mediaState.isPlaying ? pause() : play())}
              className="px-3 py-1.5 rounded-lg text-xs border"
              style={{
                borderColor: "rgba(201,169,110,0.4)",
                color: "rgba(201,169,110,0.95)",
              }}
            >
              {mediaState.isPlaying
                ? isArabic
                  ? "إيقاف"
                  : "Pause"
                : isArabic
                ? "تشغيل"
                : "Play"}
            </button>
          </div>
        </div>

        <div className="mt-5 grid flex-1 min-h-0 grid-cols-1 lg:grid-cols-12 gap-4">
          <div
            className="lg:col-span-4 flex flex-col justify-between rounded-2xl border p-4 sm:p-5"
            style={{
              borderColor: "rgba(201,169,110,0.22)",
              background: "rgba(0,0,0,0.38)",
            }}
          >
            <div>
              <div className="text-[11px] font-mono tracking-[0.22em] text-white/55">
                {isArabic ? "المفسدون في الأرض" : "THE CORRUPTORS ON EARTH"}
              </div>
              <div className="mt-3 text-3xl sm:text-4xl font-semibold leading-tight">
                {isArabic
                  ? "محاكمة تمتد عبر ستة آلاف سنة"
                  : "A trial across six thousand years"}
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
                  background:
                    "linear-gradient(135deg, rgba(201,169,110,0.9), rgba(201,169,110,0.62))",
                  boxShadow: "0 14px 40px rgba(201,169,110,0.20)",
                  color: "#0b0b0f",
                }}
              >
                {isArabic ? "ابدأ التجربة" : "Start Experience"}
              </button>
              <button
                onClick={() => setLocation("/model")}
                className="px-5 py-3 rounded-xl border text-sm text-white/90 hover:text-white"
                style={{
                  borderColor: "rgba(255,255,255,0.28)",
                  background: "rgba(0,0,0,0.30)",
                }}
              >
                {isArabic ? "عن نموذج OSIRIS" : "About OSIRIS Model"}
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 min-h-0 flex flex-col">
            <ExpandableChapters
              chapters={chapters}
              isArabic={isArabic}
              onSelect={openLaunch}
              autoPlay={true}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAudioPrompt && (
          <AudioConsentModal onConsent={handleAudioConsent} lang={uiLang} />
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
