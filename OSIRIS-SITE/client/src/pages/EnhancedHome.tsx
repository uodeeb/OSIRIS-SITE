import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useLocation } from "wouter";
import { ASSET_URLS } from "@/lib/assetUrls";
import { AudioConsentModal } from "@/components/AudioConsentModal";
import { ChapterLaunchModal, type ChapterMeta } from "@/components/ChapterLaunchModal";
import { useMediaController } from "@/contexts/MediaControllerContext";
import { LuxuryBorder } from "@/components/LuxuryBorder";
import osirisFavicon from "@/LOGO/new-logo/favicon-black-0.25.png";

type ChapterDef = ChapterMeta & {
  number: string;
  icon: string;
};

export default function EnhancedHome() {
  const [, setLocation] = useLocation();
  const { state: mediaState, play, pause, setAccentColor, setDurationMs, setUiLang, setPrimaryAudioMuted } = useMediaController();
  const { uiLang } = mediaState;
  
  const [launchOpen, setLaunchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);

  const chapters = useMemo<ChapterDef[]>(
    () => [
      { id: "part-0", number: "0", icon: "⚖️", title: "The Cosmic Courtroom", arabicTitle: "غرفة المحاكمة الكونية", subtitle: "The trial begins outside time and space", arabicSubtitle: "تبدأ المحاكمة خارج الزمان والمكان", estMinutes: 14, imageSrc: ASSET_URLS.backgrounds.osiris_cosmic, accentColor: "#c9a96e", sceneId: "zero-1-1-summons" },
      { id: "part-1", number: "I", icon: "💻", title: "The First Crime", arabicTitle: "الجريمة الأولى", subtitle: "The algorithm is written", arabicSubtitle: "يُكتب الخوارزم", estMinutes: 16, imageSrc: ASSET_URLS.backgrounds.corporate_lab, accentColor: "#ef4444", sceneId: "one-1-5-1-promise" },
      { id: "part-2", number: "II", icon: "🐄", title: "The Golden Calf", arabicTitle: "العجل الذهبي", subtitle: "Building icons for the void", arabicSubtitle: "بناء الأيقونات للفراغ", estMinutes: 18, imageSrc: ASSET_URLS.backgrounds.qabil_habil_altar, accentColor: "#d4af37", sceneId: "four-4-1-desert" },
      { id: "part-3", number: "III", icon: "🏛️", title: "Council of Nicaea", arabicTitle: "مجمع نيقية", subtitle: "Weaponizing the sacred", arabicSubtitle: "تسليح المقدس", estMinutes: 16, imageSrc: ASSET_URLS.backgrounds.nicaea_council, accentColor: "#3b82f6", sceneId: "five-6a-1-nicaea-debate" },
      { id: "part-4", number: "IV", icon: "🕌", title: "Andalusia", arabicTitle: "الأندلس", subtitle: "History and ideology", arabicSubtitle: "التاريخ والأيديولوجيا", estMinutes: 18, imageSrc: ASSET_URLS.backgrounds.granada_fall, accentColor: "#22c55e", sceneId: "six-8-1-andalusia" },
      { id: "part-5", number: "V", icon: "⚔️", title: "Karbala", arabicTitle: "كربلاء", subtitle: "The unarmed truth", arabicSubtitle: "الحقيقة العزلاء", estMinutes: 14, imageSrc: ASSET_URLS.backgrounds.qabil_habil_aftermath, accentColor: "#f97316", sceneId: "seven-10-1-karbala" },
      { id: "part-6", number: "VI", icon: "👁️", title: "Witnesses", arabicTitle: "شهود الدفاع", subtitle: "The closing testimony", arabicSubtitle: "الشهادة الختامية", estMinutes: 12, imageSrc: ASSET_URLS.backgrounds.osiris_interface, accentColor: "#8b5cf6", sceneId: "seven-12-1-truth-leak" },
    ],
    []
  );

  const selected = chapters[activeIndex];
  const isArabic = uiLang === "ar";
  const accent = selected?.accentColor || "#c9a96e";

  useEffect(() => { setAccentColor(accent); }, [accent, setAccentColor]);

  const handleAudioConsent = useCallback((allowed: boolean) => {
    if (allowed) play();
    else pause();
    setShowAudioPrompt(false);
  }, [play, pause]);

  const handleStart = (c: ChapterMeta) => {
    setDurationMs(Math.max(10_000, c.estMinutes * 60 * 1000));
    setLaunchOpen(false);
    setLocation(`/play?scene=${encodeURIComponent(c.sceneId)}`);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#020202] text-white select-none font-novel" dir={isArabic ? "rtl" : "ltr"}>
      
      {/* Immersive Static Backdrop */}
      <div className="absolute inset-0 z-0 bg-black">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover grayscale opacity-20 blur-[2px]">
          <source src={ASSET_URLS.backgrounds.osiris_cosmic.replace('.jpg', '.mp4')} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#020202]/90 via-transparent to-[#020202]/95" />
      </div>

      <div className="relative z-20 h-full flex flex-col p-8 sm:p-12">
        
        {/* Cinematic Header */}
        <header className="flex items-center justify-between border-b border-white/5 pb-8 mb-8 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-6">
            <img src={osirisFavicon} className="w-12 h-12" />
            <div>
              <h1 className="text-xl font-bold tracking-[0.3em] uppercase opacity-90">Osiris Project</h1>
              <p className="text-[10px] font-mono text-amber-500/60 tracking-[0.4em] uppercase">Archive Portal Alpha</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-8">
            <button 
              onClick={() => setUiLang(isArabic ? "en" : "ar")} 
              className="px-6 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono tracking-widest hover:border-amber-500/40 transition-all uppercase"
            >
              {isArabic ? "Switch to English" : "اللغة العربية"}
            </button>
            <button onClick={() => setPrimaryAudioMuted(!mediaState.isMuted)} className="text-[10px] font-mono tracking-widest text-white/40 hover:text-white transition-colors">
              {mediaState.isMuted ? "MUTED" : "MASTER AUDIO"}
            </button>
          </div>
        </header>

        {/* 🏺 THE MASTER SCENE EXPANDABLE INTERFACE 🏺 */}
        <div className="flex-1 flex gap-2 sm:gap-4 justify-center items-stretch min-h-0 relative">
           {chapters.map((chapter, idx) => (
             <ChapterStrip 
               key={chapter.id}
               chapter={chapter}
               isActive={idx === activeIndex}
               isArabic={isArabic}
               onSelect={() => setActiveIndex(idx)}
               onLaunch={() => setLaunchOpen(true)}
               onTrailer={() => setLocation('/intro')}
             />
           ))}
        </div>

        {/* Navigation Indicator */}
        <div className="mt-8 flex justify-center items-center gap-10 font-mono text-[9px] tracking-[0.8em] text-white/10">
          <span>SELECT CHAPTER ARCHIVE</span>
          <div className="h-px w-24 bg-white/5" />
          <span>CINEMATIC TRIAL SELECTION</span>
        </div>
      </div>

      <AnimatePresence>
        {showAudioPrompt && <AudioConsentModal onConsent={handleAudioConsent} lang={isArabic ? "ar" : "en"} />}
      </AnimatePresence>

      {launchOpen && (
        <ChapterLaunchModal open={launchOpen} onOpenChange={setLaunchOpen} chapter={selected} uiLang={uiLang} onStart={handleStart} />
      )}
    </div>
  );
}

function ChapterStrip({ chapter, isActive, isArabic, onSelect, onLaunch, onTrailer }) {
  return (
    <motion.div
      onClick={onSelect}
      className={`relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-700 ease-[0.22, 1, 0.36, 1] ${isActive ? 'flex-[10]' : 'flex-1 group'}`}
      initial={false}
      animate={{ flex: isActive ? 10 : 1 }}
    >
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={chapter.imageSrc} 
          alt={chapter.title} 
          className={`w-full h-full object-cover transition-all duration-1000 ${isActive ? 'scale-100 blur-0 opacity-100' : 'scale-125 blur-sm opacity-30 group-hover:opacity-50'}`} 
        />
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-700 ${isActive ? 'opacity-0' : 'opacity-100'}`} />
      </div>

      {/* Luxury Framing for Master Scene */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 z-10 pointer-events-none border border-white/5"
          />
        )}
      </AnimatePresence>

      {/* 🏷️ Closed Slab View */}
      <AnimatePresence mode="wait">
        {!isActive ? (
          <motion.div 
            key="collapsed"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-8"
          >
             <div className="w-10 h-10 rounded-full border border-amber-500/30 flex items-center justify-center bg-black/40 backdrop-blur-md group-hover:border-amber-500 group-hover:scale-110 transition-all shadow-lg shadow-amber-500/5">
                <span className="text-[10px] font-mono font-bold text-amber-500">{chapter.number}</span>
             </div>
          </motion.div>
        ) : (
          /* 🎬 Master Scene View */
          <motion.div 
            key="expanded"
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 z-20 flex flex-col justify-end p-12 sm:p-20 pointer-events-none"
          >
            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

            <div className="relative z-30 max-w-3xl pointer-events-auto">
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="px-3 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-[9px] font-mono tracking-widest text-amber-400">ARCHIVE {chapter.id.toUpperCase()}</div>
                </div>
                <h2 className="text-6xl sm:text-7xl font-bold mb-6 tracking-tight leading-none text-white drop-shadow-2xl">
                  {isArabic ? chapter.arabicTitle : chapter.title}
                </h2>
                <p className="text-white/60 text-lg sm:text-xl font-light italic mb-12 max-w-2xl leading-relaxed">
                  {isArabic ? chapter.arabicSubtitle : chapter.subtitle}
                </p>

                <div className="flex items-center gap-6">
                   <button 
                     onClick={(e) => { e.stopPropagation(); onLaunch(); }} 
                     className="px-12 py-5 bg-amber-600 text-black font-bold rounded-xl hover:bg-amber-400 hover:scale-105 active:scale-95 transition-all shadow-xl uppercase tracking-widest text-xs"
                   >
                     Launch Trial
                   </button>
                   <button 
                     onClick={(e) => { e.stopPropagation(); onTrailer(); }} 
                     className="px-12 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                   >
                     Review Trailer
                   </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
