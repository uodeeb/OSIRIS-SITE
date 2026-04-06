import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, Sparkles } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
  // Disable autoPlay for users with motion sensitivity
  const effectiveAutoPlay = autoPlay && !shouldReduceMotion;

  useEffect(() => {
    if (!effectiveAutoPlay || isHovering) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % chapters.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [effectiveAutoPlay, chapters.length, isHovering]);

  const handleHover = (index: number) => {
    setActiveIndex(index);
    setIsHovering(true);
  };

  const handleLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className={`flex h-full w-full gap-2 ${className}`} dir={isArabic ? "rtl" : "ltr"}>
      {chapters.map((chapter, index) => {
        const isActive = index === activeIndex;

        return (
          <motion.div
            key={chapter.id}
            className="relative h-full cursor-pointer overflow-hidden rounded-2xl group"
            onMouseEnter={() => handleHover(index)}
            onMouseLeave={handleLeave}
            onClick={() => onSelect(chapter)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(chapter);
              }
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                setActiveIndex((prev) => Math.min(prev + 1, chapters.length - 1));
              }
              if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setActiveIndex((prev) => Math.max(prev - 1, 0));
              }
            }}
            aria-expanded={isActive}
            aria-label={`Chapter ${chapter.number}: ${isArabic ? chapter.arabicTitle : chapter.title}`}
            animate={{ 
              flex: isActive ? 4 : 1,
            }}
            transition={shouldReduceMotion ? { duration: 0 } : { 
              duration: 0.6, 
              ease: [0.25, 0.46, 0.45, 0.94] 
            }}
            style={{ 
              minWidth: isActive ? "320px" : "72px",
            }}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={chapter.imageSrc}
                alt={isArabic ? chapter.arabicTitle : chapter.title}
                className="h-full w-full object-cover transition-all duration-700"
                style={{
                  filter: isActive
                    ? "brightness(0.6) contrast(1.1) saturate(1.1)"
                    : "brightness(0.35) contrast(1.2) saturate(0.9)",
                  transform: isActive ? "scale(1.05)" : "scale(1.1)",
                }}
              />
              {/* Gradient Overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: isActive
                    ? `linear-gradient(180deg, ${chapter.accentColor}20 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.95) 100%)`
                    : `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)`,
                }}
              />
              {/* Border glow when active */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={{ 
                  boxShadow: isActive 
                    ? `inset 0 0 0 1px ${chapter.accentColor}50, 0 0 40px ${chapter.accentColor}15`
                    : "inset 0 0 0 1px rgba(255,255,255,0.05)"
                }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4 }}
              />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-4">
              {/* Top - Chapter Number & Icon (Always Visible) */}
              <div className={`flex items-start justify-between ${isArabic ? "flex-row-reverse" : ""}`}>
                {/* Number Badge */}
                <motion.div
                  className="flex flex-col items-center gap-1"
                  animate={{ 
                    scale: isActive ? 1 : 0.9,
                    opacity: 1 
                  }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{ 
                      background: isActive 
                        ? `linear-gradient(135deg, ${chapter.accentColor}40, ${chapter.accentColor}20)`
                        : "rgba(255,255,255,0.08)",
                      border: `1px solid ${isActive ? chapter.accentColor : "rgba(255,255,255,0.1)"}`,
                      color: isActive ? chapter.accentColor : "rgba(255,255,255,0.6)",
                      boxShadow: isActive ? `0 4px 20px ${chapter.accentColor}30` : "none",
                    }}
                  >
                    {chapter.number}
                  </div>
                </motion.div>

                {/* Icon (visible when active) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, delay: 0.1 }}
                      className="text-2xl"
                    >
                      {chapter.icon}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Middle - Title (Only when active) */}
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="space-y-3"
                  >
                    {/* Title */}
                    <div>
                      <h3 
                        className={`text-xl font-semibold leading-tight ${isArabic ? "font-arabic-title" : ""}`}
                        style={{ color: chapter.accentColor }}
                      >
                        {isArabic ? chapter.arabicTitle : chapter.title}
                      </h3>
                      <p className="mt-1 text-xs text-white/50">
                        {isArabic ? chapter.title : chapter.arabicTitle}
                      </p>
                    </div>

                    {/* Subtitle */}
                    <p 
                      className={`text-sm text-white/80 leading-relaxed ${isArabic ? "font-arabic" : ""}`}
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4, delay: 0.25 }}
                    className={`flex items-center justify-between pt-4 border-t ${isArabic ? "flex-row-reverse" : ""}`}
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}
                  >
                    {/* Duration */}
                    <div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
                      <Clock className="w-3.5 h-3.5 text-white/40" />
                      <span className="text-[11px] font-mono text-white/60">
                        {isArabic ? `${chapter.estMinutes} دقيقة` : `${chapter.estMinutes} min`}
                      </span>
                    </div>

                    {/* Play Button */}
                    <motion.button
                      className="h-10 px-4 rounded-xl flex items-center gap-2 text-xs font-medium"
                      style={{
                        background: `linear-gradient(135deg, ${chapter.accentColor}90, ${chapter.accentColor}60)`,
                        color: "#0a0a0f",
                        boxShadow: `0 4px 20px ${chapter.accentColor}40`,
                      }}
                      whileHover={shouldReduceMotion ? {} : { 
                        scale: 1.05,
                        boxShadow: `0 6px 30px ${chapter.accentColor}60`,
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      {isArabic ? "ابدأ" : "Start"}
                    </motion.button>
                  </motion.div>
                ) : (
                  /* Collapsed state - Vertical text */
                  <motion.div 
                    className="flex flex-col items-center gap-3 pb-2"
                    initial={false}
                    animate={{ opacity: 1 }}
                  >
                    {/* Vertical chapter number for collapsed state */}
                    <span 
                      className="text-[10px] font-mono text-white/40 tracking-widest"
                      style={{ 
                        writingMode: "vertical-rl",
                        textOrientation: "mixed",
                      }}
                    >
                      {isArabic ? `الفصل ${chapter.number}` : `CHAPTER ${chapter.number}`}
                    </span>
                    
                    {/* Glow indicator - hidden for reduced motion */}
                    {!shouldReduceMotion && (
                      <motion.div
                        className="w-1 h-8 rounded-full"
                        style={{ background: chapter.accentColor }}
                        animate={{ 
                          opacity: [0.3, 0.6, 0.3],
                          scaleY: [0.8, 1, 0.8],
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hover indicator line at bottom */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5"
              style={{ background: chapter.accentColor }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isActive ? 1 : 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4, delay: isActive ? 0.2 : 0 }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
