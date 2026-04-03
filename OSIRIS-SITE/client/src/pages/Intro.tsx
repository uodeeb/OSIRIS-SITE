import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import { OSIRIS_EFFECTS, getOsirisMediaUrl } from "@/lib/osirisEffects";
import { useBandwidthStrategy } from "@/lib/mediaStrategy";
import { useMediaController } from "@/contexts/MediaControllerContext";

export default function Intro() {
  const [, setLocation] = useLocation();
  const { state: mediaState, play, pause } = useMediaController();
  const { uiLang } = mediaState;
  const { allowVideo } = useBandwidthStrategy();
  const [trailerIdx, setTrailerIdx] = useState(0);

  const isArabic = uiLang === "ar";

  type TrailerLine = {
    id: string;
    src: string;
    fallback: string;
    ar: string;
    en: string;
    color: string;
    captionSrcEn?: string;
    captionSrcAr?: string;
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
      },
    ],
    [],
  );

  useEffect(() => {
    const id = window.setInterval(() => setTrailerIdx((v) => (v + 1) % trailerLines.length), 5200);
    return () => window.clearInterval(id);
  }, [trailerLines.length]);

  const activeTrailer = trailerLines[trailerIdx % trailerLines.length];

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-black text-white" dir={isArabic ? "rtl" : "ltr"}>
      <motion.div
        key="trailer-container"
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AnimatePresence mode="wait">
          {allowVideo ? (
            <motion.video
              key={`${activeTrailer.id}-v`}
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
                <track kind="subtitles" src={activeTrailer.captionSrcEn} srcLang="en" label="English" default={uiLang === "en"} />
              )}
              {activeTrailer.captionSrcAr && (
                <track kind="subtitles" src={activeTrailer.captionSrcAr} srcLang="ar" label="العربية" default={uiLang === "ar"} />
              )}
            </motion.video>
          ) : (
            <motion.img
              key={`${activeTrailer.id}-i`}
              src={activeTrailer.fallback}
              alt={isArabic ? activeTrailer.ar : activeTrailer.en}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 0.72, scale: 1.01 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ filter: 'brightness(0.45) contrast(1.12) saturate(0.9)' }}
            />
          )}
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />

        <div className="absolute inset-x-0 bottom-[15%] flex flex-col items-center text-center px-6 pointer-events-none">
          <motion.div
            key={activeTrailer.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="text-[12px] font-mono tracking-[0.4em] text-white/50 mb-4 uppercase">OSIRIS PERSPECTIVE</div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-2 leading-tight" style={{ color: activeTrailer.color }}>
              {isArabic ? activeTrailer.ar : activeTrailer.en}
            </h1>
          </motion.div>
        </div>

        <div className="absolute bottom-10 inset-x-0 flex flex-col items-center gap-4 z-50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation('/')}
              className={`px-5 py-3 rounded-xl text-[10px] tracking-[0.22em] ${isArabic ? 'font-arabic-ui' : 'font-mono'}`}
              style={{ border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(0,0,0,0.35)', color: 'rgba(255,255,255,0.7)' }}
            >
              {isArabic ? 'العودة للرئيسية' : 'BACK TO HOME'}
            </button>
            <button
              onClick={() => {
                try {
                  window.localStorage.setItem("osiris-trailer-hidden", "1");
                } catch { /* ignore */ }
                setLocation('/');
              }}
              className={`px-5 py-3 rounded-xl text-[10px] tracking-[0.22em] ${isArabic ? 'font-arabic-ui' : 'font-mono'}`}
              style={{ border: `1px solid ${activeTrailer.color}44`, background: 'rgba(0,0,0,0.25)', color: 'rgba(255,255,255,0.9)' }}
            >
              {isArabic ? 'استكشاف الفصول' : 'EXPLORE CHAPTERS'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
