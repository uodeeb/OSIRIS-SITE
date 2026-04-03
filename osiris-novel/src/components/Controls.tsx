import { usePlayerStore } from '@/store/playerStore'
import { SCENES, SCENE_ORDER } from '@/data/scenes'
import { Volume2, VolumeX, Play, Pause, Square, Zap, Lock, ChevronLeft, ChevronRight } from 'lucide-react'

const SPEED_LABELS: Record<string, string> = {
  veryslow: 'بطيء جداً',
  slow: 'بطيء',
  standard: 'عادي',
  fast: 'سريع',
}

const SPEED_VALUES = ['veryslow', 'slow', 'standard', 'fast'] as const

export function Controls() {
  const {
    isPlaying,
    isFrozen,
    isMuted,
    autoMode,
    autoSpeed,
    bgVolume,
    sceneVolume,
    voiceVolume,
    voiceSyncLock,
    activeVoiceNumber,
    currentSceneId,
    dialogueIndex,
    showControls,
    togglePlay,
    globalPause,
    globalStop,
    toggleMute,
    setBgVolume,
    setSceneVolume,
    setVoiceVolume,
    toggleAutoMode,
    setAutoSpeed,
    unfreeze,
  } = usePlayerStore()

  const scene = SCENES[currentSceneId]
  const totalScenes = SCENE_ORDER.length
  const currentSceneIdx = SCENE_ORDER.indexOf(currentSceneId) + 1
  const totalDialogues = scene?.dialogues.length || 0
  const currentDialogueIdx = dialogueIndex + 1

  if (!showControls && !isFrozen) return null

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 z-30 transition-all duration-300 ${
        isFrozen ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="bg-osiris-darker/90 backdrop-blur-md border-t border-osiris-border/50 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isFrozen) {
                  unfreeze()
                } else {
                  togglePlay()
                }
              }}
              className="p-2 rounded-full hover:bg-osiris-surface transition-colors text-osiris-gold"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button
              onClick={globalStop}
              disabled={voiceSyncLock}
              className="p-2 rounded-full hover:bg-osiris-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Stop"
            >
              <Square className="w-4 h-4" />
            </button>

            <button
              onClick={toggleMute}
              className="p-2 rounded-full hover:bg-osiris-surface transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-osiris-red" />
              ) : (
                <Volume2 className="w-4 h-4 text-osiris-gold" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-osiris-text-dim">
            <span>
              مشهد {currentSceneIdx}/{totalScenes}
            </span>
            <span className="text-osiris-border">|</span>
            <span>
              سطر {currentDialogueIdx}/{totalDialogues}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {voiceSyncLock ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-osiris-surface border border-osiris-gold/30">
                <Lock className="w-3.5 h-3.5 text-osiris-gold voice-lock-pulse" />
                <span className="text-xs text-osiris-gold">جاري التشغيل...</span>
                {activeVoiceNumber && (
                  <span className="text-xs text-osiris-text-dim">#{activeVoiceNumber}</span>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={toggleAutoMode}
                  disabled={voiceSyncLock}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                    autoMode
                      ? 'bg-osiris-gold/20 text-osiris-gold border border-osiris-gold/40'
                      : 'bg-osiris-surface text-osiris-text-dim border border-osiris-border'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  تلقائي
                </button>

                {autoMode && (
                  <select
                    value={autoSpeed}
                    onChange={(e) => setAutoSpeed(e.target.value as typeof autoSpeed)}
                    disabled={voiceSyncLock}
                    className="bg-osiris-surface border border-osiris-border rounded px-2 py-1 text-xs text-osiris-text disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {SPEED_VALUES.map((speed) => (
                      <option key={speed} value={speed}>
                        {SPEED_LABELS[speed]}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}
          </div>
        </div>

        {!isMuted && !voiceSyncLock && (
          <div className="flex items-center gap-6 mt-2 pt-2 border-t border-osiris-border/30">
            <div className="flex items-center gap-2">
              <span className="text-xs text-osiris-text-dim w-8">خلفية</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={bgVolume}
                onChange={(e) => setBgVolume(parseFloat(e.target.value))}
                className="w-20 accent-osiris-gold"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-osiris-text-dim w-8">مشهد</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={sceneVolume}
                onChange={(e) => setSceneVolume(parseFloat(e.target.value))}
                className="w-20 accent-osiris-gold"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-osiris-text-dim w-8">صوت</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={voiceVolume}
                onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                className="w-20 accent-osiris-gold"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
