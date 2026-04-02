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

const openLaunch = (c: ChapterMeta) => {
  setSelected(c);
  setLaunchOpen(true);
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
      imageSrc: ASSET_URLS.backgrounds.osiris_cosmic,
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
      imageSrc: ASSET_URLS.backgrounds.berlin_1933,
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
      imageSrc: ASSET_URLS.backgrounds.berlin_1933,
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
      imageSrc: ASSET_URLS.backgrounds.cambodia_1975,
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
      subtitle: 'Light in the darkness',
      description: 'Golden age of knowledge and culture',
      accentColor: '#e74c3c',
      imageSrc: ASSET_URLS.backgrounds.cambodia_1975,
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
      imageSrc: ASSET_URLS.backgrounds.berlin_1933,
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
      imageSrc: ASSET_URLS.backgrounds.yahya_apartment,
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
      imageSrc: ASSET_URLS.backgrounds.yahya_apartment,
      sceneId: 'seven-1-witnesses',
      estMinutes: 22
    }
  ], [uiLang]);

  const isArabic = uiLang === "ar";
  const allowVideo = useBandwidthStrategy();

  const activeTrailer = TRAILER_LINES[trailerIdx % TRAILER_LINES.length];

  const handleStart = (c: ChapterMeta) => {
    setDurationMs(Math.max(10_000, c.estMinutes * 60 * 1000));
    setLaunchOpen(false);
    setLocation(`/play?scene=${encodeURIComponent(c.sceneId)}`);
  };

  const handleAudioConsent = useCallback((allowed: boolean) => {
    if (allowed) {
      play();
    } else {
      pause();
    }
    setShowAudioPrompt(false);
  }, [play, pause, setShowAudioPrompt]);

  return (
    <div className="relative z-10 h-[100dvh] w-screen overflow-hidden text-white" dir={isArabic ? "rtl" : "ltr"}>
      <AnimatePresence>
        {showTrailer && (
          <motion.div
            key="timer-overlay"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 0.2, y: 0, scale: 1 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            role="status"
            aria-live="polite"
          >
            <div
              className="text-6xl sm:text-7xl md:text-8xl font-bold text-white text-shadow-lg"
              style={{ textShadow: `0 0 30px ${activeTrailer.color}66, 0 0 60px ${activeTrailer.color}33` }}
            >
              {formatTime(mediaState.currentTime || 0)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-full w-full px-4 sm:px-6 pt-5 pb-[calc(env(safe-area-inset-bottom)+76px)] flex flex-col min-h-0 relative">
          <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'url(/patterns/geometric-pattern.svg)', backgroundSize: '20px 20px' }} />
        
        {/* Logo and Title */}
        <motion.div
          key="logo"
          className="absolute -right-10 sm:right-4 bottom-10 sm:bottom-14 w-[320px] sm:w-[420px] md:w-[520px] opacity-20 pointer-events-none"
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 0.2, y: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        >
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
                style={{ border: `1px solid ${activeTrailer.color}`, color: activeTrailer.color, background: 'rgba(0,0,0,0.35)' }}
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
            <div className={`mt-6 flex flex-wrap items-center gap-3 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
              <motion.button
                onClick={() => setLocation('/play')}
                className={`px-6 sm:px-8 py-3 rounded-xl text-black font-semibold tracking-[0.12em] text-xs sm:text-sm ${isArabic ? 'font-arabic-ui' : ''}`}
                style={{ background: `linear-gradient(135deg, ${activeTrailer.color}, #f0d080)` }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {isArabic ? 'ابدأ' : 'START TRIAL'}
              </motion.button>
              <button
                onClick={() => setLocation('/script')}
                className={`px-5 py-3 rounded-xl text-[10px] tracking-[0.22em] ${isArabic ? 'font-arabic-ui' : 'font-mono'}`}
                style={{ border: `1px solid ${activeTrailer.color}44`, background: 'rgba(0,0,0,0.35)', color: 'rgba(255,255,255,0.7)' }}
              >
                {isArabic ? 'النص الكامل' : 'FULL SCRIPT'}
              </button>
              <button
                onClick={() => { /* No fullscreen toggle in EnhancedHome */ }}
                className={`px-5 py-3 rounded-xl text-[10px] tracking-[0.22em] ${isArabic ? 'font-arabic-ui' : 'font-mono'}`}
                style={{ border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(0,0,0,0.35)', color: 'rgba(255,255,255,0.7)' }}
              >
                {isArabic ? 'تخطي المقطع' : 'SKIP'}
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-white/70 font-mono tracking-wider">
              <span>{allowVideo ? 'VIDEO' : 'LOW-BANDWIDTH'}</span>
              <span>{isArabic ? 'اضغط ابدأ لفتح المحاكمة' : 'Press start to enter the trial'}</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="h-full w-full px-4 sm:px-6 pt-5 pb-[calc(env(safe-area-inset-bottom)+76px)] flex flex-col min-h-0 relative">

      {/* Chapter Grid - Desktop */}
      <div className="hidden md:block h-full">
        <div className="h-full overflow-y-auto snap-y snap-mandatory">
          {chapters.map((c) => (
            <motion.div
              key={c.id}
              className="snap-start shrink-0 w-[280px] h-[200px] rounded-2xl border overflow-hidden text-left"
              style={{ borderColor: OSIRIS_EFFECTS.border(activeTrailer.color, 0.22), background: "rgba(0,0,0,0.35)" }}
              whileHover={{ scale: 1.02 }}
              onClick={() => openLaunch(c)}
            >
              <div className="relative h-full">
                <img src={c.imageSrc} alt={isArabic ? c.arabicTitle : c.title} className="absolute inset-0 h-full w-full object-cover" style={{ filter: "brightness(0.72) contrast(1.15) saturate(1.05)" }} />
                <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${OSIRIS_EFFECTS.fade(activeTrailer.color, 0.10)} 0%, rgba(0,0,0,0.84) 70%, rgba(0,0,0,0.98) 100%)` }} />
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
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chapter Grid - Mobile */}
      <div className="md:hidden h-full">
        <div className="h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex gap-4 px-4">
          {chapters.map((c) => (
            <motion.button
              key={c.id}
              onClick={() => openLaunch(c)}
              onFocus={() => setSelected(c)}
              className="snap-start shrink-0 w-[78vw] h-full rounded-2xl border overflow-hidden text-left min-h-[280px]"
              style={{ borderColor: OSIRIS_EFFECTS.border(activeTrailer.color, 0.22), background: "rgba(0,0,0,0.35)" }}
            >
              <div className="relative h-full">
                <img src={c.imageSrc} alt={isArabic ? c.arabicTitle : c.title} className="absolute inset-0 h-full w-full object-cover" style={{ filter: "brightness(0.72) contrast(1.15) saturate(1.05)" }} />
                <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${OSIRIS_EFFECTS.fade(activeTrailer.color, 0.10)} 0%, rgba(0,0,0,0.84) 70%, rgba(0,0,0,0.98) 100%)` }} />
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
                      style={{ border: `1px solid ${activeTrailer.color}`, color: activeTrailer.color, background: 'rgba(0,0,0,0.35)' }}
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
              </div>
            </motion.button>
          ))}
        </div>
      </div>

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
