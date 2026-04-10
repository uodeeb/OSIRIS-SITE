import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, BookOpen } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import falconLogo from "@/LOGO/new-logo/logo-falcon.png";

export interface ChapterItem {
  id: string;
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
}

interface ExpandableChaptersProps {
  chapters: ChapterItem[];
  isArabic: boolean;
  onSelect: (chapter: ChapterItem) => void;
  autoPlay?: boolean;
  className?: string;
}

export default function ExpandableChapters({
  chapters,
  isArabic,
  onSelect,
  autoPlay = true,
  className = "",
}: ExpandableChaptersProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0); // Default: first chapter expanded
  const [isHovering, setIsHovering] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
  // Disable autoPlay for users with motion sensitivity OR after user interaction
  const effectiveAutoPlay = autoPlay && !shouldReduceMotion && !hasInteracted;

  useEffect(() => {
    if (!effectiveAutoPlay || isHovering) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % chapters.length;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [effectiveAutoPlay, chapters.length, isHovering]);

  // Track any user interaction to stop auto-play
  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const handleHover = (index: number) => {
    setActiveIndex(index);
    setIsHovering(true);
    handleInteraction();
  };

  const handleLeave = () => {
    setIsHovering(false);
    // Keep the current active chapter expanded - never collapse all
  };
  
  // Calculate flex ratio - active chapter takes most space
  const getFlexValue = (index: number) => {
    if (activeIndex === null) return 1;
    if (index === activeIndex) return 8; // Active takes 8x more space
    return 0.6; // Others shrink
  };

  return (
    <div className={`relative h-full w-full ${className}`} dir={isArabic ? "rtl" : "ltr"}>
      {/* Bookshelf Container - Vertical on mobile, horizontal on sm+ */}
      <div className="relative flex flex-col sm:flex-row items-stretch sm:items-end justify-start sm:justify-center gap-2 sm:gap-1.5 md:gap-2 h-full overflow-y-auto sm:overflow-visible px-2 sm:px-4 pb-2 sm:pb-4 scrollbar-thin scrollbar-thumb-amber-500/30 scrollbar-track-transparent">
        {/* Shelf Background Shadow - only on larger screens */}
        <div className="hidden sm:block absolute bottom-0 left-0 right-0 h-4 sm:h-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
        
        {chapters.map((chapter, index) => {
          const isActive = index === activeIndex;
          const flexValue = getFlexValue(index);
          const chapterHeight = isActive ? "h-[140px]" : "h-[60px]";

          return (
            <motion.div
              key={chapter.id}
              className={"relative cursor-pointer group w-full sm:h-full " + chapterHeight}
              onMouseEnter={() => handleHover(index)}
              onMouseLeave={handleLeave}
              onClick={() => {
                handleInteraction();
                onSelect(chapter);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(chapter);
                }
                if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  setActiveIndex((prev) => Math.min((prev ?? 0) + 1, chapters.length - 1));
                }
                if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  setActiveIndex((prev) => Math.max((prev ?? 0) - 1, 0));
                }
              }}
              aria-expanded={isActive}
              aria-label={`Chapter ${chapter.number}: ${isArabic ? chapter.arabicTitle : chapter.title}`}
              animate={{
                flex: flexValue,
                y: isActive ? -8 : 0,
              }}
              transition={shouldReduceMotion ? { duration: 0 } : {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {/* Book Cover with conditional background */}
              <div 
                className="absolute inset-0 rounded-t-lg sm:rounded-t-xl overflow-hidden"
                style={{
                  boxShadow: isActive 
                    ? `0 20px 60px -10px ${chapter.accentColor}50, 0 0 0 1px ${chapter.accentColor}40, inset 0 1px 0 rgba(255,255,255,0.2)`
                    : '0 10px 30px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
                }}
              >
                {/* Background: Chapter Image when active, solid color when collapsed */}
                <AnimatePresence mode="wait">
                  {isActive ? (
                    <motion.div
                      key="image"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0"
                    >
                      <img
                        src={chapter.imageSrc}
                        alt=""
                        className="w-full h-full object-cover"
                        style={{
                          filter: 'brightness(0.5) contrast(1.1) saturate(0.9)',
                        }}
                      />
                      {/* Dark overlay for text readability */}
                      <div 
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(180deg, 
                            ${chapter.accentColor}20 0%, 
                            transparent 30%, 
                            rgba(0,0,0,0.7) 70%,
                            rgba(0,0,0,0.95) 100%)`,
                        }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="solid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(180deg, 
                          ${chapter.accentColor}25 0%, 
                          #1a1a2e 40%, 
                          #0f0f1a 100%)`,
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Book Spine - visible on all states */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-2 sm:w-3"
                  style={{
                    background: `linear-gradient(90deg, 
                      ${chapter.accentColor}80 0%, 
                      ${chapter.accentColor}50 40%, 
                      transparent 100%)`,
                  }}
                />
                
                {/* Right edge highlight */}
                <div 
                  className="absolute right-0 top-0 bottom-0 w-px"
                  style={{
                    background: `linear-gradient(180deg, 
                      ${chapter.accentColor}30 0%, 
                      transparent 50%, 
                      rgba(0,0,0,0.5) 100%)`,
                  }}
                />

                {/* Falcon Watermark - Only on active book */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <img
                        src={falconLogo}
                        alt=""
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain opacity-[0.15]"
                        style={{
                          filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.15))',
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Content Overlay */}
              <div className="relative h-full flex flex-col justify-between p-2 sm:p-3">
                {/* Top - Chapter Number Badge */}
                <div className={`flex items-start ${isArabic ? "flex-row-reverse" : ""}`}>
                  <motion.div
                    animate={{ 
                      scale: isActive ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md flex items-center justify-center text-[10px] sm:text-xs font-bold"
                      style={{ 
                        background: isActive 
                          ? `linear-gradient(135deg, ${chapter.accentColor}60, ${chapter.accentColor}30)`
                          : `linear-gradient(135deg, ${chapter.accentColor}40, transparent)`,
                        border: `1px solid ${isActive ? `${chapter.accentColor}80` : `${chapter.accentColor}40`}`,
                        color: isActive ? "#fff" : `${chapter.accentColor}cc`,
                        boxShadow: isActive ? `0 4px 15px ${chapter.accentColor}50` : 'none',
                      }}
                    >
                      {chapter.number}
                    </div>
                  </motion.div>
                </div>

                {/* Middle - Title & Info (Only when active) */}
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, delay: 0.1 }}
                      className="flex-1 flex flex-col justify-center space-y-2 sm:space-y-3 min-w-0"
                    >
                      {/* Title */}
                      <div>
                        <h3 
                          className={`text-base sm:text-lg md:text-xl font-semibold leading-tight ${isArabic ? "font-arabic-title" : ""} truncate`}
                          style={{ color: chapter.accentColor }}
                          title={isArabic ? chapter.arabicTitle : chapter.title}
                        >
                          {isArabic ? chapter.arabicTitle : chapter.title}
                        </h3>
                        <p className="mt-0.5 text-[10px] sm:text-xs text-white/50 truncate">
                          {isArabic ? chapter.title : chapter.arabicTitle}
                        </p>
                      </div>

                      {/* Subtitle - hidden on very small screens */}
                      <p 
                        className={`hidden sm:block text-xs md:text-sm text-white/70 leading-relaxed ${isArabic ? "font-arabic" : ""} line-clamp-2`}
                        dir={isArabic ? "rtl" : "ltr"}
                      >
                        {isArabic ? chapter.arabicSubtitle : chapter.subtitle}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom - Duration & Play Button (Only when active) */}
                <AnimatePresence>
                  {isActive ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.3, delay: 0.15 }}
                      className={`flex items-center justify-between pt-2 sm:pt-3 border-t ${isArabic ? "flex-row-reverse" : ""}`}
                      style={{ borderColor: "rgba(255,255,255,0.15)" }}
                    >
                      {/* Duration */}
                      <div className={`flex items-center gap-1 sm:gap-1.5 ${isArabic ? "flex-row-reverse" : ""}`}>
                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/50" />
                        <span className="text-[9px] sm:text-[10px] font-mono text-white/60">
                          {isArabic ? `${chapter.estMinutes}د` : `${chapter.estMinutes}m`}
                        </span>
                      </div>

                      {/* Play Button */}
                      <motion.button
                        className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-medium"
                        style={{
                          background: `linear-gradient(135deg, ${chapter.accentColor}95, ${chapter.accentColor}70)`,
                          color: "#0a0a0f",
                          boxShadow: `0 3px 15px ${chapter.accentColor}50`,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span className="text-[9px] sm:text-xs">{isArabic ? "ابدأ" : "Start"}</span>
                      </motion.button>
                    </motion.div>
                  ) : (
                    /* Collapsed state - Vertical chapter text */
                    <motion.div 
                      className="flex flex-col items-center gap-2 pb-1"
                      initial={false}
                    >
                      <span 
                        className="text-[8px] sm:text-[10px] font-mono text-white/30 tracking-widest"
                        style={{ 
                          writingMode: "vertical-rl",
                          textOrientation: "mixed",
                        }}
                      >
                        {chapter.number}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Active indicator glow at bottom */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 rounded-b-lg sm:rounded-b-xl"
                style={{ 
                  background: `linear-gradient(90deg, transparent 0%, ${chapter.accentColor} 20%, ${chapter.accentColor} 80%, transparent 100%)`,
                }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ 
                  opacity: isActive ? 1 : 0,
                  scaleX: isActive ? 1 : 0,
                }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
