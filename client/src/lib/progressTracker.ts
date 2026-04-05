export interface ReadingProgress {
  currentSceneId: string;
  currentDialogueIndex: number;
  completedScenes: string[];
  bookmarks: string[];
  lastReadTime: number;
  totalReadingTime: number;
}

const STORAGE_KEY = 'osiris_reading_progress';

export const progressTracker = {
  // Initialize progress
  initProgress: (): ReadingProgress => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      currentSceneId: 'zero-1-1-summons',
      currentDialogueIndex: 0,
      completedScenes: [],
      bookmarks: [],
      lastReadTime: Date.now(),
      totalReadingTime: 0,
    };
  },

  // Save progress
  saveProgress: (progress: ReadingProgress) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  },

  // Update current scene
  updateCurrentScene: (sceneId: string, dialogueIndex: number = 0) => {
    const progress = progressTracker.initProgress();
    progress.currentSceneId = sceneId;
    progress.currentDialogueIndex = dialogueIndex;
    progress.lastReadTime = Date.now();
    progressTracker.saveProgress(progress);
  },

  // Mark scene as completed
  markSceneCompleted: (sceneId: string) => {
    const progress = progressTracker.initProgress();
    if (!progress.completedScenes.includes(sceneId)) {
      progress.completedScenes.push(sceneId);
    }
    progressTracker.saveProgress(progress);
  },

  // Add bookmark
  addBookmark: (sceneId: string) => {
    const progress = progressTracker.initProgress();
    if (!progress.bookmarks.includes(sceneId)) {
      progress.bookmarks.push(sceneId);
    }
    progressTracker.saveProgress(progress);
  },

  // Remove bookmark
  removeBookmark: (sceneId: string) => {
    const progress = progressTracker.initProgress();
    progress.bookmarks = progress.bookmarks.filter((id) => id !== sceneId);
    progressTracker.saveProgress(progress);
  },

  // Get progress percentage
  getProgressPercentage: (totalScenes: number): number => {
    const progress = progressTracker.initProgress();
    return Math.round((progress.completedScenes.length / totalScenes) * 100);
  },

  // Clear all progress
  clearProgress: () => {
    localStorage.removeItem(STORAGE_KEY);
  },
};
