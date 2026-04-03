export interface VoiceCue {
  voice: number
  at: number
  dialogueStartMs: number
}

export class SyncEngine {
  private voiceCues: Map<string, VoiceCue[]> = new Map()
  private activeVoice: number | null = null
  private isLocked = false
  private onVoiceStart?: () => void
  private onVoiceEnd?: () => void

  registerSceneCues(sceneId: string, cues: VoiceCue[]) {
    this.voiceCues.set(sceneId, cues)
  }

  getSceneCues(sceneId: string): VoiceCue[] {
    return this.voiceCues.get(sceneId) || []
  }

  checkVoiceTrigger(sceneId: string, dialogueIndex: number): VoiceCue | null {
    const cues = this.getSceneCues(sceneId)
    return cues.find(c => c.at === dialogueIndex) || null
  }

  lockVoice(voiceNumber: number) {
    this.activeVoice = voiceNumber
    this.isLocked = true
    this.onVoiceStart?.()
  }

  unlockVoice() {
    this.activeVoice = null
    this.isLocked = false
    this.onVoiceEnd?.()
  }

  isVoiceLocked(): boolean {
    return this.isLocked
  }

  getActiveVoice(): number | null {
    return this.activeVoice
  }

  setCallbacks(onStart: () => void, onEnd: () => void) {
    this.onVoiceStart = onStart
    this.onVoiceEnd = onEnd
  }

  clear() {
    this.voiceCues.clear()
    this.activeVoice = null
    this.isLocked = false
  }
}
