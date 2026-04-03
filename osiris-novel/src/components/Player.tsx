import { useEffect, useRef, useCallback, useState } from 'react'
import { usePlayerStore } from '@/store/playerStore'
import { AudioEngine } from '@/engine/AudioEngine'
import { ScriptEngine } from '@/engine/ScriptEngine'
import { SyncEngine } from '@/engine/SyncEngine'
import { SCENES, SCENE_ORDER, getNextSceneId } from '@/data/scenes'
import { VideoLayer } from './VideoLayer'
import { ScriptDisplay } from './ScriptDisplay'
import { EffectLayer } from './EffectLayer'
import { Controls } from './Controls'
import { CharacterPortrait } from './CharacterPortrait'

const audioEngine = new AudioEngine()
const scriptEngine = new ScriptEngine()
const syncEngine = new SyncEngine()

const AUTO_SPEED_DELAYS: Record<string, number> = {
  veryslow: 4000,
  slow: 2500,
  standard: 1500,
  fast: 800,
}

export function Player({ sceneId }: { sceneId: string }) {
  const {
    currentSceneId,
    dialogueIndex,
    displayedText,
    displayedArabic,
    isTyping,
    isDialogueComplete,
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
    osirisEffectId,
    sceneTransitioning,
    setScene,
    advanceDialogue,
    startTyping,
    completeTyping,
    setDisplayedText,
    togglePlay,
    globalPlay,
    globalStop,
    freeze,
    unfreeze,
    setVoiceLock,
    toggleMute,
    setBgVolume,
    setSceneVolume,
    setVoiceVolume,
    setAutoSpeed,
    setEffect,
    resetScene,
  } = usePlayerStore()

  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevDialogueIndexRef = useRef<number>(-1)
  const sceneInitializedRef = useRef<boolean>(false)

  const currentScene = SCENES[currentSceneId]
  const currentDialogue = currentScene?.dialogues[dialogueIndex]

  const handleDialogueClick = useCallback(() => {
    if (isFrozen) {
      unfreeze()
      return
    }

    if (voiceSyncLock) return

    if (isTyping) {
      scriptEngine.complete()
      completeTyping()
      return
    }

    if (isDialogueComplete) {
      advanceDialogue()
    }
  }, [isFrozen, voiceSyncLock, isTyping, isDialogueComplete, unfreeze, completeTyping, advanceDialogue])

  const handleVoiceTrigger = useCallback(
    (voiceNumber: number) => {
      const voiceAsset = `/assets/audio/voice/voice-${String(voiceNumber).padStart(2, '0')}.wav`

      setVoiceLock(true, voiceNumber)
      audioEngine.playVoice(voiceAsset)
    },
    [setVoiceLock]
  )

  const handleVoiceEnd = useCallback(() => {
    setVoiceLock(false)

    if (autoMode && isDialogueComplete) {
      const delay = AUTO_SPEED_DELAYS[autoSpeed] || 1500
      autoTimerRef.current = setTimeout(() => {
        advanceDialogue()
      }, delay)
    }
  }, [setVoiceLock, autoMode, isDialogueComplete, autoSpeed, advanceDialogue])

  const startTypewriter = useCallback(
    (text: string, arabic: string, index: number, cues?: { at: number; voice: number }[]) => {
      scriptEngine.stop()
      scriptEngine.setSpeed(autoSpeed)
      scriptEngine.setVoiceCues(cues || [])
      scriptEngine.setCallbacks({
        onChar: (charIdx) => {
          const displayed = text.slice(0, charIdx)
          const displayedAr = arabic.slice(0, charIdx)
          setDisplayedText(displayed, displayedAr)
        },
        onComplete: () => {
          completeTyping()
        },
        onVoiceTrigger: handleVoiceTrigger,
      })
      scriptEngine.start(text, arabic, index)
      startTyping()
    },
    [autoSpeed, setDisplayedText, completeTyping, handleVoiceTrigger, startTyping]
  )

  useEffect(() => {
    syncEngine.setCallbacks(
      () => {
        setVoiceLock(true)
      },
      () => {
        handleVoiceEnd()
      }
    )

    audioEngine.setVoiceCallbacks(
      () => {},
      () => {
        handleVoiceEnd()
      }
    )

    return () => {
      scriptEngine.stop()
      audioEngine.stopAll()
    }
  }, [handleVoiceEnd, setVoiceLock])

  useEffect(() => {
    if (currentSceneId !== sceneId) {
      setScene(sceneId)
    }
  }, [sceneId, currentSceneId, setScene])

  useEffect(() => {
    if (!currentScene || sceneTransitioning) return

    const scene = SCENES[currentSceneId]
    if (!scene) return

    audioEngine.playBg(scene.bgMusic)
    audioEngine.playSceneMusic(scene.sceneMusic)

    if (scene.effect) {
      setEffect(scene.effect)
    }

    sceneInitializedRef.current = true

    return () => {
      sceneInitializedRef.current = false
    }
  }, [currentSceneId, sceneTransitioning, currentScene, setEffect])

  useEffect(() => {
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current)
      autoTimerRef.current = null
    }
  }, [autoMode, autoSpeed])

  useEffect(() => {
    if (!currentDialogue || !currentScene || dialogueIndex === prevDialogueIndexRef.current) return

    prevDialogueIndexRef.current = dialogueIndex

    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current)
      autoTimerRef.current = null
    }

    const { text, arabicText, voiceCues, freeze: shouldFreeze } = currentDialogue

    if (shouldFreeze) {
      freeze()
    }

    if (voiceCues && voiceCues.length > 0) {
      startTypewriter(text, arabicText, dialogueIndex, voiceCues)
    } else {
      startTypewriter(text, arabicText, dialogueIndex)
    }
  }, [dialogueIndex, currentDialogue, currentScene, freeze, startTypewriter])

  useEffect(() => {
    if (isDialogueComplete && autoMode && !voiceSyncLock && !isFrozen) {
      const delay = AUTO_SPEED_DELAYS[autoSpeed] || 1500
      autoTimerRef.current = setTimeout(() => {
        const nextIdx = dialogueIndex + 1
        if (currentScene && nextIdx < currentScene.dialogues.length) {
          advanceDialogue()
        } else {
          const nextSceneId = getNextSceneId(currentSceneId)
          if (nextSceneId) {
            setScene(nextSceneId)
          }
        }
      }, delay)
    }

    return () => {
      if (autoTimerRef.current) {
        clearTimeout(autoTimerRef.current)
        autoTimerRef.current = null
      }
    }
  }, [
    isDialogueComplete,
    autoMode,
    autoSpeed,
    voiceSyncLock,
    isFrozen,
    dialogueIndex,
    currentScene,
    currentSceneId,
    advanceDialogue,
    setScene,
  ])

  useEffect(() => {
    if (isMuted) {
      audioEngine.setMuted(true)
    } else {
      audioEngine.setMuted(false)
      audioEngine.setVolumes(bgVolume, sceneVolume, voiceVolume, 0.5)
    }
  }, [isMuted, bgVolume, sceneVolume, voiceVolume])

  useEffect(() => {
    scriptEngine.setSpeed(autoSpeed)
  }, [autoSpeed])

  useEffect(() => {
    if (isPlaying && isFrozen) {
      unfreeze()
    }
  }, [isPlaying, isFrozen, unfreeze])

  const currentCharacter = currentDialogue?.character || 'narrator'
  const showPortrait = !!currentDialogue && !isTyping && !voiceSyncLock

  return (
    <div className="relative w-full h-full overflow-hidden bg-osiris-darker">
      <VideoLayer
        videoSrc={currentScene?.videoSrc || ''}
        imageSrc={currentScene?.imageSrc || ''}
        effect={osirisEffectId || currentScene?.effect || 'none'}
        isFrozen={isFrozen}
      />

      <EffectLayer
        effect={(osirisEffectId || currentScene?.effect || 'none') as
          | 'scanlines'
          | 'glitch'
          | 'cctv'
          | 'alarm'
          | 'montage'
          | 'none'}
        isFrozen={isFrozen}
      />

      <div className="absolute inset-0 flex items-end justify-center pb-32 z-20">
        {currentDialogue ? (
          <ScriptDisplay
            character={currentDialogue.character}
            text={currentDialogue.text}
            arabicText={currentDialogue.arabicText}
            displayedText={displayedText}
            displayedArabic={displayedArabic}
            isTyping={isTyping}
            isDialogueComplete={isDialogueComplete}
            isFrozen={isFrozen}
            voiceLocked={voiceSyncLock}
            onClick={handleDialogueClick}
          />
        ) : (
          <div className="text-osiris-text-dim text-center">
            <p className="text-lg">نهاية المشهد</p>
          </div>
        )}
      </div>

      <CharacterPortrait characterId={currentCharacter} isVisible={showPortrait} />

      <Controls />

      {isFrozen && (
        <div className="frozen-overlay" onClick={handleDialogueClick}>
          <div className="text-center">
            <p className="text-osiris-gold text-2xl font-semibold mb-2">متوقف</p>
            <p className="text-osiris-text-dim text-sm">انقر للمتابعة</p>
          </div>
        </div>
      )}
    </div>
  )
}
