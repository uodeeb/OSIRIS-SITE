export class AudioEngine {
  private bgAudio: HTMLAudioElement | null = null
  private sceneAudio: HTMLAudioElement | null = null
  private voiceAudio: HTMLAudioElement | null = null
  private sfxPool: HTMLAudioElement[] = []
  private maxSfxPool = 4

  private crossfadeDuration = 800 // ms
  private isCrossfading = false

  // Current state
  private currentBgSrc = ''
  private currentSceneSrc = ''
  private currentVoiceSrc = ''

  // Volume levels
  private bgVolume = 0.15
  private sceneVolume = 0.30
  private voiceVolume = 0.85
  private sfxVolume = 0.50
  private isMuted = false

  // Callbacks
  private onVoiceEnded?: () => void
  private onVoiceStarted?: () => void

  constructor() {
    this.bgAudio = new Audio()
    this.bgAudio.loop = true
    this.bgAudio.preload = 'auto'

    this.sceneAudio = new Audio()
    this.sceneAudio.loop = true
    this.sceneAudio.preload = 'auto'

    this.voiceAudio = new Audio()
    this.voiceAudio.preload = 'auto'

    for (let i = 0; i < this.maxSfxPool; i++) {
      const sfx = new Audio()
      sfx.preload = 'auto'
      this.sfxPool.push(sfx)
    }
  }

  init(): void {
    if (!this.bgAudio) return
    this.bgAudio.src = 'track-01'
    this.bgAudio.volume = this.isMuted ? 0 : this.bgVolume
    this.bgAudio.play().catch(() => {})
  }

  setVolumes(bg: number, scene: number, voice: number, sfx: number): void {
    this.bgVolume = Math.max(0, Math.min(1, bg))
    this.sceneVolume = Math.max(0, Math.min(1, scene))
    this.voiceVolume = Math.max(0, Math.min(1, voice))
    this.sfxVolume = Math.max(0, Math.min(1, sfx))

    if (this.bgAudio && !this.isMuted) {
      this.bgAudio.volume = this.bgVolume
    }
    if (this.sceneAudio && !this.isMuted) {
      this.sceneAudio.volume = this.sceneVolume
    }
    if (this.voiceAudio && !this.isMuted) {
      this.voiceAudio.volume = this.voiceVolume
    }
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted

    if (this.bgAudio) {
      this.bgAudio.volume = muted ? 0 : this.bgVolume
    }
    if (this.sceneAudio) {
      this.sceneAudio.volume = muted ? 0 : this.sceneVolume
    }
    if (this.voiceAudio) {
      this.voiceAudio.volume = muted ? 0 : this.voiceVolume
    }
    for (const sfx of this.sfxPool) {
      sfx.volume = muted ? 0 : this.sfxVolume
    }
  }

  playBg(src: string): void {
    if (!this.bgAudio || this.currentBgSrc === src) return

    this.currentBgSrc = src
    this.bgAudio.src = src
    this.bgAudio.volume = this.isMuted ? 0 : this.bgVolume
    this.bgAudio.play().catch(() => {})
  }

  playSceneMusic(src: string): void {
    if (!this.sceneAudio || this.currentSceneSrc === src) return

    if (this.isCrossfading || this.sceneAudio.src) {
      this.crossfadeTo(src)
    } else {
      this.currentSceneSrc = src
      this.sceneAudio.src = src
      this.sceneAudio.volume = this.isMuted ? 0 : this.sceneVolume
      this.sceneAudio.play().catch(() => {})
    }
  }

  private crossfadeTo(newSrc: string): void {
    if (!this.sceneAudio) return

    this.isCrossfading = true
    const startVolume = this.sceneAudio.volume
    const targetVolume = this.isMuted ? 0 : this.sceneVolume
    const steps = 20
    const stepDuration = this.crossfadeDuration / steps
    let step = 0

    const fadeOutInterval = setInterval(() => {
      step++
      const progress = step / steps

      if (this.sceneAudio) {
        this.sceneAudio.volume = startVolume * (1 - progress)
      }

      if (step >= steps) {
        clearInterval(fadeOutInterval)

        if (this.sceneAudio) {
          this.sceneAudio.pause()
          this.currentSceneSrc = newSrc
          this.sceneAudio.src = newSrc
          this.sceneAudio.volume = 0
          this.sceneAudio.play().catch(() => {})

          let fadeInStep = 0
          const fadeInInterval = setInterval(() => {
            fadeInStep++
            const fadeInProgress = fadeInStep / steps

            if (this.sceneAudio) {
              this.sceneAudio.volume = targetVolume * fadeInProgress
            }

            if (fadeInStep >= steps) {
              clearInterval(fadeInInterval)
              if (this.sceneAudio) {
                this.sceneAudio.volume = targetVolume
              }
              this.isCrossfading = false
            }
          }, stepDuration)
        } else {
          this.isCrossfading = false
        }
      }
    }, stepDuration)
  }

  playVoice(src: string): void {
    if (!this.voiceAudio) return

    this.currentVoiceSrc = src
    this.voiceAudio.src = src
    this.voiceAudio.volume = this.isMuted ? 0 : this.voiceVolume

    this.voiceAudio.onended = () => {
      this.currentVoiceSrc = ''
      this.onVoiceEnded?.()
    }

    this.voiceAudio.play().catch(() => {})
    this.onVoiceStarted?.()
  }

  stopVoice(): void {
    if (!this.voiceAudio) return

    this.voiceAudio.pause()
    this.voiceAudio.currentTime = 0
    this.voiceAudio.onended = null
    this.currentVoiceSrc = ''
    this.onVoiceEnded?.()
  }

  playSfx(src: string): void {
    const availableSfx = this.sfxPool.find(sfx => sfx.paused || sfx.ended)

    if (!availableSfx) return

    availableSfx.src = src
    availableSfx.volume = this.isMuted ? 0 : this.sfxVolume
    availableSfx.currentTime = 0
    availableSfx.play().catch(() => {})
  }

  pauseAll(): void {
    this.bgAudio?.pause()
    this.sceneAudio?.pause()
    this.voiceAudio?.pause()
    for (const sfx of this.sfxPool) {
      sfx.pause()
    }
  }

  resumeAll(): void {
    if (this.bgAudio && this.bgAudio.src) {
      this.bgAudio.play().catch(() => {})
    }
    if (this.sceneAudio && this.sceneAudio.src) {
      this.sceneAudio.play().catch(() => {})
    }
    if (this.voiceAudio && this.voiceAudio.src) {
      this.voiceAudio.play().catch(() => {})
    }
  }

  stopAll(): void {
    if (this.bgAudio) {
      this.bgAudio.pause()
      this.bgAudio.currentTime = 0
    }
    if (this.sceneAudio) {
      this.sceneAudio.pause()
      this.sceneAudio.currentTime = 0
    }
    if (this.voiceAudio) {
      this.voiceAudio.pause()
      this.voiceAudio.currentTime = 0
      this.voiceAudio.onended = null
    }
    for (const sfx of this.sfxPool) {
      sfx.pause()
      sfx.currentTime = 0
      sfx.src = ''
    }

    this.currentBgSrc = ''
    this.currentSceneSrc = ''
    this.currentVoiceSrc = ''
    this.isCrossfading = false
  }

  setVoiceCallbacks(onStarted: () => void, onEnded: () => void): void {
    this.onVoiceStarted = onStarted
    this.onVoiceEnded = onEnded
  }

  isVoicePlaying(): boolean {
    if (!this.voiceAudio) return false
    return !this.voiceAudio.paused && !this.voiceAudio.ended && this.voiceAudio.currentTime > 0
  }

  getVoiceDuration(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.voiceAudio) {
        reject(new Error('Voice audio not initialized'))
        return
      }

      if (this.voiceAudio.duration && !isNaN(this.voiceAudio.duration)) {
        resolve(this.voiceAudio.duration)
        return
      }

      const onLoadedMetadata = () => {
        if (this.voiceAudio) {
          this.voiceAudio.removeEventListener('loadedmetadata', onLoadedMetadata)
          resolve(this.voiceAudio.duration)
        }
      }

      const onError = () => {
        if (this.voiceAudio) {
          this.voiceAudio.removeEventListener('loadedmetadata', onLoadedMetadata)
          reject(new Error('Failed to load voice metadata'))
        }
      }

      this.voiceAudio.addEventListener('loadedmetadata', onLoadedMetadata)
      this.voiceAudio.addEventListener('error', onError)

      if (this.voiceAudio.src) {
        this.voiceAudio.load()
      }
    })
  }

  dispose(): void {
    this.stopAll()

    if (this.bgAudio) {
      this.bgAudio.src = ''
      this.bgAudio = null
    }
    if (this.sceneAudio) {
      this.sceneAudio.src = ''
      this.sceneAudio = null
    }
    if (this.voiceAudio) {
      this.voiceAudio.src = ''
      this.voiceAudio.onended = null
      this.voiceAudio = null
    }
    for (const sfx of this.sfxPool) {
      sfx.src = ''
    }
    this.sfxPool = []
  }
}
