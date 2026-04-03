import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PlayerState {
  currentSceneId: string
  dialogueIndex: number
  sceneTransitioning: boolean

  displayedText: string
  displayedArabic: string
  isTyping: boolean
  isDialogueComplete: boolean

  isPlaying: boolean
  isFrozen: boolean
  novelPaused: boolean

  voiceSyncLock: boolean
  activeVoiceNumber: number | null

  isMuted: boolean
  bgVolume: number
  sceneVolume: number
  voiceVolume: number
  sfxVolume: number

  autoMode: boolean
  autoSpeed: 'veryslow' | 'slow' | 'standard' | 'fast'
  autoProgress: number

  showControls: boolean
  controlsLocked: boolean

  osirisEffectId: string | null
  characterEffectActive: boolean

  setScene: (sceneId: string) => void
  advanceDialogue: () => void
  goToScene: (sceneId: string) => void
  startTyping: () => void
  completeTyping: () => void
  setDisplayedText: (text: string, arabic: string) => void
  togglePlay: () => void
  globalPlay: () => void
  globalPause: () => void
  globalStop: () => void
  freeze: () => void
  unfreeze: () => void
  toggleMute: () => void
  setBgVolume: (v: number) => void
  setSceneVolume: (v: number) => void
  setVoiceVolume: (v: number) => void
  setSfxVolume: (v: number) => void
  setVoiceLock: (locked: boolean, voiceNum?: number) => void
  toggleAutoMode: () => void
  setAutoSpeed: (speed: 'veryslow' | 'slow' | 'standard' | 'fast') => void
  setAutoProgress: (p: number) => void
  toggleControls: () => void
  setEffect: (effectId: string | null) => void
  resetScene: () => void
}

const createPersistedSlice = (set: any, get: any) => ({
  isMuted: false,
  bgVolume: 0.15,
  sceneVolume: 0.3,
  voiceVolume: 0.85,
  sfxVolume: 0.5,
  autoSpeed: 'standard' as const,

  toggleMute: () => set((state: PlayerState) => ({ isMuted: !state.isMuted })),
  setBgVolume: (v: number) => set({ bgVolume: v }),
  setSceneVolume: (v: number) => set({ sceneVolume: v }),
  setVoiceVolume: (v: number) => set({ voiceVolume: v }),
  setSfxVolume: (v: number) => set({ sfxVolume: v }),
  setAutoSpeed: (speed: 'veryslow' | 'slow' | 'standard' | 'fast') => set({ autoSpeed: speed }),
})

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentSceneId: '',
      dialogueIndex: 0,
      sceneTransitioning: false,

      displayedText: '',
      displayedArabic: '',
      isTyping: false,
      isDialogueComplete: false,

      isPlaying: false,
      isFrozen: false,
      novelPaused: false,

      voiceSyncLock: false,
      activeVoiceNumber: null,

      autoMode: false,
      autoProgress: 0,

      showControls: true,
      controlsLocked: false,

      osirisEffectId: null,
      characterEffectActive: false,

      ...createPersistedSlice(set, get),

      setScene: (sceneId: string) =>
        set({
          currentSceneId: sceneId,
          dialogueIndex: 0,
          sceneTransitioning: true,
          displayedText: '',
          displayedArabic: '',
          isTyping: false,
          isDialogueComplete: false,
          autoProgress: 0,
        }),

      advanceDialogue: () =>
        set((state: PlayerState) => ({
          dialogueIndex: state.dialogueIndex + 1,
          displayedText: '',
          displayedArabic: '',
          isTyping: false,
          isDialogueComplete: false,
        })),

      goToScene: (sceneId: string) =>
        set({
          currentSceneId: sceneId,
          dialogueIndex: 0,
          sceneTransitioning: true,
          displayedText: '',
          displayedArabic: '',
          isTyping: false,
          isDialogueComplete: false,
          autoProgress: 0,
          osirisEffectId: null,
          characterEffectActive: false,
        }),

      startTyping: () => set({ isTyping: true, isDialogueComplete: false }),

      completeTyping: () => set({ isTyping: false, isDialogueComplete: true }),

      setDisplayedText: (text: string, arabic: string) =>
        set({ displayedText: text, displayedArabic: arabic }),

      togglePlay: () =>
        set((state: PlayerState) => {
          if (state.isFrozen) return state
          return { isPlaying: !state.isPlaying, novelPaused: state.isPlaying }
        }),

      globalPlay: () =>
        set({ isPlaying: true, novelPaused: false, isFrozen: false }),

      globalPause: () =>
        set({ isPlaying: false, novelPaused: true }),

      globalStop: () =>
        set({
          isPlaying: false,
          novelPaused: false,
          isFrozen: false,
          isTyping: false,
          isDialogueComplete: false,
          autoProgress: 0,
        }),

      freeze: () =>
        set({ isFrozen: true, isPlaying: false, novelPaused: true }),

      unfreeze: () =>
        set({ isFrozen: false, novelPaused: false }),

      setVoiceLock: (locked: boolean, voiceNum?: number) =>
        set({
          voiceSyncLock: locked,
          activeVoiceNumber: voiceNum ?? null,
          controlsLocked: locked,
        }),

      toggleAutoMode: () =>
        set((state: PlayerState) => ({
          autoMode: !state.autoMode,
          autoProgress: state.autoMode ? 0 : state.autoProgress,
        })),

      setAutoProgress: (p: number) => set({ autoProgress: p }),

      toggleControls: () =>
        set((state: PlayerState) => ({
          showControls: !state.showControls,
        })),

      setEffect: (effectId: string | null) =>
        set({
          osirisEffectId: effectId,
          characterEffectActive: effectId !== null,
        }),

      resetScene: () =>
        set({
          dialogueIndex: 0,
          displayedText: '',
          displayedArabic: '',
          isTyping: false,
          isDialogueComplete: false,
          sceneTransitioning: false,
          autoProgress: 0,
          osirisEffectId: null,
          characterEffectActive: false,
        }),
    }),
    {
      name: 'osiris-player-v2',
      partialize: (state: PlayerState) => ({
        isMuted: state.isMuted,
        bgVolume: state.bgVolume,
        sceneVolume: state.sceneVolume,
        voiceVolume: state.voiceVolume,
        autoSpeed: state.autoSpeed,
      }),
    }
  )
)
