export type TypewriterSpeed = 'veryslow' | 'slow' | 'standard' | 'fast'

const SPEED_MAP: Record<TypewriterSpeed, number> = {
  veryslow: 80,
  slow: 50,
  standard: 35,
  fast: 20,
}

export interface TypewriterCallbacks {
  onChar: (index: number) => void
  onComplete: () => void
  onVoiceTrigger: (voiceNumber: number) => void
}

export class ScriptEngine {
  private intervalId: ReturnType<typeof setInterval> | null = null
  private currentIndex = 0
  private fullText = ''
  private fullArabic = ''
  private speed: TypewriterSpeed = 'standard'
  private isRunning = false
  private isPaused = false
  private callbacks: TypewriterCallbacks | null = null
  private voiceCues: { at: number; voice: number }[] = []
  private currentDialogueIndex = 0
  private triggeredVoices = new Set<number>()

  setSpeed(speed: TypewriterSpeed): void {
    this.speed = speed
  }

  setCallbacks(callbacks: TypewriterCallbacks): void {
    this.callbacks = callbacks
  }

  setVoiceCues(cues: { at: number; voice: number }[]): void {
    this.voiceCues = cues
  }

  start(text: string, arabic: string, dialogueIndex: number): void {
    this.stop()
    this.fullText = text
    this.fullArabic = arabic
    this.currentDialogueIndex = dialogueIndex
    this.currentIndex = 0
    this.isRunning = true
    this.isPaused = false
    this.triggeredVoices = new Set()
    this.runInterval()
  }

  pause(): void {
    if (!this.isRunning || this.isPaused) return
    this.isPaused = true
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  resume(): void {
    if (!this.isRunning || !this.isPaused) return
    this.isPaused = false
    this.runInterval()
  }

  complete(): void {
    if (!this.isRunning) return
    this.currentIndex = this.fullText.length
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isRunning = false
    this.isPaused = false
    this.callbacks?.onComplete()
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isRunning = false
    this.isPaused = false
    this.currentIndex = 0
    this.fullText = ''
    this.fullArabic = ''
    this.triggeredVoices = new Set()
  }

  advance(): boolean {
    if (this.isRunning && !this.isPaused) {
      this.complete()
      return false
    }
    return true
  }

  isTyping(): boolean {
    return this.isRunning && !this.isPaused
  }

  getDisplayedText(): string {
    return this.fullText.slice(0, this.currentIndex)
  }

  getDisplayedArabic(): string {
    return this.fullArabic.slice(0, this.currentIndex)
  }

  getCurrentIndex(): number {
    return this.currentIndex
  }

  setPaused(paused: boolean): void {
    if (paused) {
      this.pause()
    } else {
      this.resume()
    }
  }

  private runInterval(): void {
    const interval = SPEED_MAP[this.speed]
    this.intervalId = setInterval(() => {
      if (this.currentIndex >= this.fullText.length) {
        if (this.intervalId !== null) {
          clearInterval(this.intervalId)
          this.intervalId = null
        }
        this.isRunning = false
        this.isPaused = false
        this.callbacks?.onComplete()
        return
      }

      this.currentIndex++
      this.callbacks?.onChar(this.currentIndex)

      for (const cue of this.voiceCues) {
        if (this.currentIndex === cue.at && !this.triggeredVoices.has(cue.voice)) {
          this.triggeredVoices.add(cue.voice)
          this.pause()
          this.callbacks?.onVoiceTrigger(cue.voice)
          return
        }
      }
    }, interval)
  }
}
