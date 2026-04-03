import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    if (!autoPlay || isHovering) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % chapters.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [autoPlay, chapters.length, isHovering]);

  const handleHover = (index: number) => {
    setActiveIndex(index);
    setIsHovering(true);
  };

  const handleLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className={`flex h-[380px] w-full gap-2 ${className}`} dir={isArabic ? "rtl" : "ltr"}>
      {chapters.map((chapter, index) => {
        const isActive = index === activeIndex;

        return (
          <motion.div
            key={chapter.id}
            className="relative h-full cursor-pointer overflow-hidden rounded-xl"
            onMouseEnter={() => handleHover(index)}
            onMouseLeave={handleLeave}
            onClick={() => onSelect(chapter)}
            animate={{ flex: isActive ? 3 : 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ minWidth: isActive ? "280px" : "80px" }}
          >
            <div className="absolute inset-0">
              <img
                src={chapter.imageSrc}
                alt={isArabic ? chapter.arabicTitle : chapter.title}
                className="h-full w-full object-cover"
                style={{
                  filter: isActive
                    ? "brightness(0.7) contrast(1.1) saturate(1.05)"
                    : "brightness(0.5) contrast(1.15) saturate(1.05) blur(1px)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, ${chapter.accentColor}15 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.95) 100%)`,
                  opacity: isActive ? 1 : 0.7,
                }}
              />
            </div>

            <div className="relative h-full flex flex-col justify-between p-4">
              <div className="flex items-center justify-between">
                <motion.div
                  className="text-[11px] font-mono tracking-[0.22em] text-white/85"
                  animate={{ opacity: isActive ? 1 : 0.6 }}
                >
                  {chapter.number}
                </motion.div>
                <motion.div
                  className="text-xl"
                  animate={{ scale: isActive ? 1.2 : 1, opacity: isActive ? 1 : 0.7 }}
                  transition={{ duration: 0.3 }}
                  style={{ filter: `drop-shadow(0 0 16px ${chapter.accentColor}50)` }}
                >
                  {chapter.icon}
                </motion.div>
              </div>

              <div className="space-y-2">
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="space-y-2"
                    >
                      <div className="overflow-hidden">
                        <motion.h3
                          className="text-lg sm:text-xl font-semibold text-white leading-tight"
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                          {isArabic ? chapter.arabicTitle : chapter.title}
                        </motion.h3>
                      </div>

                      <motion.p
                        className="text-xs text-white/70 leading-relaxed"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        {isArabic ? chapter.arabicSubtitle : chapter.subtitle}
                      </motion.p>

                      <motion.div
                        className="flex items-center justify-between pt-2"
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        <span className="text-[11px] font-mono text-white/60">
                          {isArabic ? `${chapter.estMinutes} دقيقة` : `${chapter.estMinutes} min`}
                        </span>

                        <motion.div
                          className="h-8 w-8 rounded-lg border flex items-center justify-center"
                          style={{
                            borderColor: `${chapter.accentColor}40`,
                            background: `${chapter.accentColor}20`,
                            color: chapter.accentColor,
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isActive && (
                  <motion.div className="flex flex-col items-center gap-2" initial={false} animate={{ opacity: 1 }}>
                    <span
                      className="text-[10px] font-mono text-white/50"
                      style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                    >
                      {chapter.number}
                    </span>
                  </motion.div>
                )}
              </div>
            </div>

            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5"
              style={{ background: chapter.accentColor }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isActive ? 1 : 0 }}
              transition={{ duration: 0.4, delay: isActive ? 0.2 : 0 }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

