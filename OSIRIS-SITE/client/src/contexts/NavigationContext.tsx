import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PartId = 'zero' | 'one' | 'two' | 'three' | 'four' | 'five' | 'six' | 'seven';

export interface ChapterProgress {
  partId: PartId;
  chapterId: string;
  completed: boolean;
  choices: Record<string, string>;
}

interface NavigationContextType {
  currentPart: PartId;
  currentChapter: string;
  progress: ChapterProgress[];
  goToPart: (partId: PartId, chapterId?: string) => void;
  markChapterComplete: (partId: PartId, chapterId: string) => void;
  recordChoice: (partId: PartId, chapterId: string, choiceId: string, consequence: string) => void;
  getProgress: () => number;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPart, setCurrentPart] = useState<PartId>('zero');
  const [currentChapter, setCurrentChapter] = useState('intro');
  const [progress, setProgress] = useState<ChapterProgress[]>([]);

  const goToPart = (partId: PartId, chapterId: string = 'intro') => {
    setCurrentPart(partId);
    setCurrentChapter(chapterId);
  };

  const markChapterComplete = (partId: PartId, chapterId: string) => {
    setProgress(prev => {
      const existing = prev.find(p => p.partId === partId && p.chapterId === chapterId);
      if (existing) {
        return prev.map(p =>
          p.partId === partId && p.chapterId === chapterId
            ? { ...p, completed: true }
            : p
        );
      }
      return [...prev, { partId, chapterId, completed: true, choices: {} }];
    });
  };

  const recordChoice = (partId: PartId, chapterId: string, choiceId: string, consequence: string) => {
    setProgress(prev => {
      const existing = prev.find(p => p.partId === partId && p.chapterId === chapterId);
      if (existing) {
        return prev.map(p =>
          p.partId === partId && p.chapterId === chapterId
            ? { ...p, choices: { ...p.choices, [choiceId]: consequence } }
            : p
        );
      }
      return [...prev, { partId, chapterId, completed: false, choices: { [choiceId]: consequence } }];
    });
  };

  const getProgress = () => {
    const totalChapters = 35; // Approximate total
    const completedChapters = progress.filter(p => p.completed).length;
    return Math.round((completedChapters / totalChapters) * 100);
  };

  return (
    <NavigationContext.Provider
      value={{
        currentPart,
        currentChapter,
        progress,
        goToPart,
        markChapterComplete,
        recordChoice,
        getProgress,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};
