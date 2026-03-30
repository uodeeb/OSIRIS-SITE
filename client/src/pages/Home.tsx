import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { ASSET_URLS } from '@/lib/assetUrls';
import { useBandwidthStrategy } from '@/lib/mediaStrategy';
import { OSIRIS_EFFECTS, getOsirisMediaUrl } from '@/lib/osirisEffects';
import osirisLogo from '@/LOGO/LOGO02_upscayl_2x_digital-art-4x.svg';

const PARTS = [
  { number: '0', en: 'The Cosmic Courtroom', ar: 'غرفة المحاكمة الكونية', description: 'The trial begins outside time and space', bg: ASSET_URLS.backgrounds.osiris_cosmic, color: '#c9a96e', sceneId: 'zero-1-1-summons' },
  { number: 'I', en: 'The First Crime (Source Code)', ar: 'الجريمة الأولى', description: 'The algorithm is written and the first patterns appear', bg: ASSET_URLS.backgrounds.corporate_lab, color: '#ef4444', sceneId: 'one-1-5-1-promise' },
  { number: 'II', en: 'The Golden Calf', ar: 'العجل الذهبي', description: 'Building icons to fill the spiritual void', bg: ASSET_URLS.backgrounds.qabil_habil_altar, color: '#d4af37', sceneId: 'four-4-1-desert' },
  { number: 'III', en: 'The Council of Nicaea', ar: 'مجمع نيقية', description: 'When institutions weaponize the sacred', bg: ASSET_URLS.backgrounds.nicaea_council, color: '#3b82f6', sceneId: 'five-6a-1-nicaea-debate' },
  { number: 'IV', en: 'Andalusia & 20th Century', ar: 'الأندلس والقرن العشرون', description: 'Arrogance becomes history and ideology', bg: ASSET_URLS.backgrounds.granada_fall, color: '#22c55e', sceneId: 'six-8-1-andalusia' },
  { number: 'V', en: 'Karbala', ar: 'كربلاء', description: 'The unarmed truth — the antivirus', bg: ASSET_URLS.backgrounds.qabil_habil_aftermath, color: '#f97316', sceneId: 'seven-10-1-karbala' },
  { number: 'VI', en: 'Witnesses for the Defense', ar: 'شهود الدفاع', description: 'The closing testimony', bg: ASSET_URLS.backgrounds.osiris_interface, color: '#8b5cf6', sceneId: 'seven-12-1-truth-leak' },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [hoveredPart, setHoveredPart] = useState<number | null>(null);
  const [introPhase, setIntroPhase] = useState(0);
  const [uiLang, setUiLang] = useState<'en' | 'ar'>('ar');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { allowVideo } = useBandwidthStrategy();
  const [showTrailer, setShowTrailer] = useState(true);
  const [trailerClip, setTrailerClip] = useState(0);
  const trailerAudioRef = useRef<HTMLAudioElement | null>(null);
  const [musicVol, setMusicVol] = useState(0.22);
  const [musicOn, setMusicOn] = useState(true);
  const [musicMuted, setMusicMuted] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase(1), 250);
    const t2 = setTimeout(() => setIntroPhase(2), 900);
    const t3 = setTimeout(() => setIntroPhase(3), 1700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const TRAILER_CLIPS = [
    {
      id: 'summons',
      src: getOsirisMediaUrl(OSIRIS_EFFECTS['FX-01-SUMMONS-EYE'].base),
      fallback: getOsirisMediaUrl(OSIRIS_EFFECTS['FX-01-SUMMONS-EYE'].fallback),
      ar: 'الشر ليس عشوائياً… إنه كود',
      en: 'Evil is not random. It is code.',
      color: '#00e5ff',
    },
    {
      id: 'analysis',
      src: getOsirisMediaUrl(OSIRIS_EFFECTS['FX-04-NEURAL-ANALYSIS'].base),
      fallback: getOsirisMediaUrl(OSIRIS_EFFECTS['FX-08-SOLEMN-DUST'].fallback),
      ar: 'أوزيريس يقرأ الموجات… ويكشف النمط',
      en: 'OSIRIS reads the waves, then reveals the pattern.',
      color: '#9b5cff',
    },
    {
      id: 'truth',
      src: getOsirisMediaUrl(OSIRIS_EFFECTS['FX-07-TRUTH-LEAK'].base),
      fallback: getOsirisMediaUrl(OSIRIS_EFFECTS['FX-03-HOLOGRAM-DATA'].fallback),
      ar: 'الحقيقة لا تُسكت… بل تُبَثّ',
      en: 'Truth does not whisper. It broadcasts.',
      color: '#ff2d2d',
    },
  ];

  useEffect(() => {
    if (!showTrailer) return;
    const t = setInterval(() => setTrailerClip((v) => (v + 1) % TRAILER_CLIPS.length), 5200);
    return () => clearInterval(t);
  }, [showTrailer]);

  useEffect(() => {
    if (!showTrailer) return;
    if (!trailerAudioRef.current) {
      trailerAudioRef.current = new Audio('/music/TRACK-01.mp3');
      trailerAudioRef.current.loop = true;
      trailerAudioRef.current.preload = 'metadata';
    }
    const a = trailerAudioRef.current;
    a.volume = musicMuted ? 0 : Math.max(0, Math.min(1, musicVol));
    if (musicOn && !musicMuted) {
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  }, [showTrailer, musicOn, musicMuted, musicVol]);

  useEffect(() => {
    if (showTrailer) return;
    if (trailerAudioRef.current) trailerAudioRef.current.pause();
  }, [showTrailer]);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreenChange);
    onFullscreenChange();
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const activePart = hoveredPart !== null ? PARTS[hoveredPart] : PARTS[0];
  const isArabic = uiLang === 'ar';
  const activeTrailer = TRAILER_CLIPS[trailerClip];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white font-novel" dir={isArabic ? 'rtl' : 'ltr'}>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={ASSET_URLS.projectMedia.video.generated_yehya_office}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        style={{ opacity: 0.26, filter: 'brightness(0.45) contrast(1.1) saturate(0.6)' }}
      />

      <AnimatePresence mode="wait">
        {activePart && (
          <motion.img
            key={activePart.sceneId}
            src={activePart.bg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.34, scale: 1.02 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.7 }}
            style={{ filter: 'brightness(0.35) saturate(0.8)' }}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 45%, rgba(201,169,110,0.2), rgba(0,0,0,0.86) 58%, rgba(0,0,0,0.96) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0) 2px, rgba(255,255,255,0) 5px)', mixBlendMode: 'screen', opacity: 0.12 }} />
      <div className="absolute top-0 left-0 right-0 h-14 bg-black/80" />
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-black/85" />

      <div className="relative z-20 h-full flex flex-col">
        <motion.div
          className={`h-14 px-3 sm:px-6 flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: introPhase >= 1 ? 1 : 0, y: introPhase >= 1 ? 0 : -10 }}
        >
          <div className="text-[10px] font-mono tracking-[0.26em] text-amber-200/70">OSIRIS ARCHIVE</div>
          <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={toggleFullscreen}
              className="px-2 py-1 text-[9px] rounded-md font-mono tracking-wider"
              style={{ border: '1px solid rgba(201,169,110,0.2)', color: 'rgba(201,169,110,0.9)', background: 'rgba(0,0,0,0.35)' }}
            >
              {isFullscreen ? (isArabic ? 'إغلاق' : 'EXIT FULL') : (isArabic ? 'ملء الشاشة' : 'FULL')}
            </button>
            <div className="flex items-center rounded-md overflow-hidden" style={{ border: '1px solid rgba(201,169,110,0.2)' }}>
              <button onClick={() => setUiLang('ar')} className="px-2 py-1 text-[9px] font-mono" style={{ background: isArabic ? 'rgba(201,169,110,0.25)' : 'rgba(0,0,0,0.3)', color: isArabic ? '#c9a96e' : 'rgba(255,255,255,0.45)' }}>عر</button>
              <button onClick={() => setUiLang('en')} className="px-2 py-1 text-[9px] font-mono" style={{ background: !isArabic ? 'rgba(201,169,110,0.25)' : 'rgba(0,0,0,0.3)', color: !isArabic ? '#c9a96e' : 'rgba(255,255,255,0.45)' }}>EN</button>
            </div>
          </div>
        </motion.div>

        <div className={`flex-1 px-3 sm:px-6 md:px-10 pb-8 sm:pb-10 flex flex-col gap-5 md:gap-6 items-stretch ${isArabic ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
          <motion.div
            className={`flex-1 rounded-2xl border border-amber-300/20 bg-black/40 backdrop-blur-xl p-5 sm:p-6 md:p-8 flex flex-col justify-between ${isArabic ? 'text-right' : 'text-left'}`}
            initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
            animate={{ opacity: introPhase >= 2 ? 1 : 0, x: introPhase >= 2 ? 0 : (isArabic ? 20 : -20) }}
          >
            <div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-200/25 text-[10px] tracking-[0.2em] text-amber-100/70 ${isArabic ? 'font-arabic-ui' : 'font-mono'}`}>
                {isArabic ? 'رواية تفاعلية متعددة الوسائط' : 'MULTIMEDIA INTERACTIVE NOVEL'}
              </div>
              <div className={`mt-5 flex items-center gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <img
                  src={osirisLogo}
                  alt="OSIRIS"
                  className="w-14 h-14 md:w-16 md:h-16 opacity-95"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-light tracking-[0.18em] sm:tracking-[0.28em] text-amber-300 leading-none">OSIRIS</h1>
                  <p className="mt-2 text-lg sm:text-xl md:text-2xl text-amber-100/75 font-arabic-title" dir="rtl">المفسدون في الأرض</p>
                </div>
              </div>
              {isArabic ? (
                <p className="mt-5 max-w-xl text-white/78 text-sm sm:text-base leading-relaxed font-arabic" dir="rtl">
                  تجربة محاكمة سينمائية تمتد عبر ستة آلاف سنة، تقودك فيها الأصوات والموسيقى والشهادات التاريخية ضمن سرد تفاعلي حي.
                </p>
              ) : (
                <p className="mt-5 max-w-xl text-white/72 text-sm sm:text-base leading-relaxed">
                  A cinematic courtroom across six thousand years. Voices, music layers, and historical witnesses unfold as one guided narrative.
                </p>
              )}
            </div>

            <div className={`mt-7 flex flex-wrap gap-3 ${isArabic ? 'justify-end' : ''}`}>
              <motion.button
                onClick={() => setLocation('/play')}
                className={`px-6 sm:px-8 py-3 rounded-xl text-black font-semibold tracking-[0.12em] text-xs sm:text-sm ${isArabic ? 'font-arabic-ui' : ''}`}
                style={{ background: 'linear-gradient(135deg, #c9a96e, #f0d080)' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {isArabic ? '▶ ابدأ المحاكمة' : '▶ BEGIN THE TRIAL'}
              </motion.button>
              <div className={`px-4 py-3 rounded-xl border border-white/15 bg-white/5 text-[10px] sm:text-[11px] tracking-wider text-white/70 ${isArabic ? 'font-arabic-ui' : 'font-mono'}`}>
                {isArabic ? 'نمط سينمائي متزامن مع الصوت' : 'Voice-Synced Cinematic Mode'}
              </div>
            </div>
          </motion.div>

          <motion.div
            className={`w-full md:w-[430px] rounded-2xl border border-white/15 bg-black/45 backdrop-blur-xl p-4 md:p-5 ${isArabic ? 'text-right' : 'text-left'}`}
            initial={{ opacity: 0, x: isArabic ? -20 : 20 }}
            animate={{ opacity: introPhase >= 3 ? 1 : 0, x: introPhase >= 3 ? 0 : (isArabic ? -20 : 20) }}
          >
            <div className={`text-[11px] tracking-[0.2em] text-white/55 mb-3 ${isArabic ? 'font-arabic-ui' : 'font-mono'}`}>{isArabic ? 'الوصول إلى الفصول' : 'CHAPTER ACCESS'}</div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {PARTS.map((part, idx) => (
                <motion.button
                  key={part.number}
                  onMouseEnter={() => setHoveredPart(idx)}
                  onMouseLeave={() => setHoveredPart(null)}
                  onClick={() => setLocation(`/play?scene=${part.sceneId}`)}
                  className="relative rounded-lg overflow-hidden"
                  style={{ aspectRatio: '1 / 1.28' }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img src={part.bg} alt={part.en} className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'brightness(0.45) saturate(0.75)' }} />
                  <div className="absolute inset-0 bg-black/55" />
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: part.color }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-1.5">
                    <div className="text-[11px] font-mono font-bold" style={{ color: part.color }}>{part.number}</div>
                    <div className="text-[9px] text-white/80 font-arabic text-center leading-tight" dir="rtl">{part.ar}</div>
                  </div>
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activePart.sceneId}
                className="mt-4 p-3 rounded-lg border border-white/10 bg-black/35"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                {isArabic ? (
                  <>
                    <div className="text-[13px] text-white/92 font-arabic-title" dir="rtl">{activePart.ar}</div>
                    <div className="text-[11px] text-white/55 mt-1 font-arabic-ui" dir="rtl">{`الجزء ${activePart.number}`}</div>
                  </>
                ) : (
                  <>
                    <div className="text-[12px] font-mono tracking-wider" style={{ color: activePart.color }}>{`Part ${activePart.number} — ${activePart.en}`}</div>
                    <div className="text-[11px] text-white/45 mt-1.5">{activePart.description}</div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

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
                />
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

            <div className={`relative h-full flex flex-col justify-between px-4 sm:px-8 py-6 ${isArabic ? 'text-right' : 'text-left'}`}>
              <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <img src={osirisLogo} alt="OSIRIS" className="w-9 h-9 opacity-90" />
                  <div className="text-[10px] font-mono tracking-[0.26em] text-white/65">CINEMATIC TRAILER</div>
                </div>
                <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => setMusicMuted((v) => !v)}
                    className="px-2.5 py-1 text-[9px] rounded-md font-mono tracking-wider"
                    style={{ border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.75)', background: 'rgba(0,0,0,0.35)' }}
                  >
                    {musicMuted ? (isArabic ? 'صامت' : 'MUTED') : (isArabic ? 'صوت' : 'AUDIO')}
                  </button>
                  <button
                    onClick={() => setMusicOn((v) => !v)}
                    className="px-2.5 py-1 text-[9px] rounded-md font-mono tracking-wider"
                    style={{ border: `1px solid ${activeTrailer.color}33`, color: activeTrailer.color, background: 'rgba(0,0,0,0.35)' }}
                  >
                    {musicOn ? (isArabic ? 'إيقاف' : 'PAUSE') : (isArabic ? 'تشغيل' : 'PLAY')}
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="px-2.5 py-1 text-[9px] rounded-md font-mono tracking-wider"
                    style={{ border: '1px solid rgba(201,169,110,0.2)', color: 'rgba(201,169,110,0.9)', background: 'rgba(0,0,0,0.35)' }}
                  >
                    {isFullscreen ? (isArabic ? 'إغلاق' : 'EXIT FULL') : (isArabic ? 'ملء الشاشة' : 'FULL')}
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
                  <div className={`text-[11px] tracking-[0.22em] ${isArabic ? 'font-arabic-ui' : 'font-mono'} text-white/55`}>
                    {isArabic ? 'مقتطفات من المحاكمة' : 'EXCERPTS FROM THE TRIAL'}
                  </div>
                  <div className={`mt-3 text-2xl sm:text-3xl md:text-4xl leading-snug ${isArabic ? 'font-arabic-title' : 'font-light'} `} style={{ color: 'rgba(255,255,255,0.92)' }} dir={isArabic ? 'rtl' : 'ltr'}>
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
                    onClick={() => setShowTrailer(false)}
                    className={`px-5 py-3 rounded-xl text-[10px] tracking-[0.22em] ${isArabic ? 'font-arabic-ui' : 'font-mono'}`}
                    style={{ border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(0,0,0,0.35)', color: 'rgba(255,255,255,0.7)' }}
                  >
                    {isArabic ? 'تخطي المقطع' : 'SKIP'}
                  </button>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={musicVol}
                      onChange={(e) => setMusicVol(Number(e.target.value))}
                      className="w-28"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-white/35 font-mono tracking-wider">
                <span>{allowVideo ? 'VIDEO' : 'LOW-BANDWIDTH'}</span>
                <span>{isArabic ? 'اضغط ابدأ لفتح المحاكمة' : 'Press start to enter the trial'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
