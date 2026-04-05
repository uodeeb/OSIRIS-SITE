const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'MainPlayer.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Find the start of the return statement
const returnIndex = content.indexOf('return (');
if (returnIndex === -1) {
    console.error("Could not find 'return ('");
    process.exit(1);
}

const head = content.substring(0, returnIndex);

const cleanTail = `return (
  <motion.div
    className="relative w-screen h-screen overflow-hidden bg-black select-none font-novel"
    onClick={handleAdvance}
    animate={fxShake ? { x: [0, -4, 3, -2, 2, 0], y: [0, 2, -2, 3, -1, 0] } : { x: 0, y: 0 }}
    transition={{ duration: 0.45, ease: "easeInOut" }}>
    
    <CinematicStage
      scene={currentScene}
      sceneId={currentSceneId}
      bgImageSrc={bgImageSrc}
      bgVideoSrc={bgVideoSrc}
      audioDescSrcEn={currentScene.backgroundVideoAudioDescEn}
      audioDescSrcAr={currentScene.backgroundVideoAudioDescAr}
      allowVideo={allowVideo}
      bgLoaded={bgLoaded}
      setBgLoaded={setBgLoaded}
      videoReady={videoReady}
      setVideoReady={setVideoReady}
      overlay={overlay}
      mediaFilter={mediaFilter}
      videoRef={bgVideoRef}
      fx={{ flash: fxFlash, shake: fxShake, uiPulse }}
    />

    <OsirisEffectLayer effectId={osirisEffectId} allowVideo={allowVideo} />
    <GlobalMediaLayer primaryAudioSources={normalizedBaseCandidates} />

    {/* Voice Cue Indicator */}
    {activeVoiceNumber && (
      <motion.div
        className="absolute top-6 right-6 z-30 px-3 py-2 rounded-lg border border-cyan-500/30 bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: [0.6, 1, 0.7], y: 0 }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="text-[10px] font-mono tracking-widest text-cyan-200/90 p-2"> VOICE CUE {String(activeVoiceNumber).padStart(2, '0')}</div>
      </motion.div>
    )}

    {/* Image Cues */}
    <AnimatePresence mode="wait">
      {activeImageCue && (
        <motion.img
          key={activeImageCue.token}
          src={activeImageCue.src}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: activeImageCue.opacity }} exit={{ opacity: 0 }}
          style={{ mixBlendMode: activeImageCue.blend, zIndex: 7 }}
        />
      )}
    </AnimatePresence>

    {/* Tech Filters */}
    <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent mix-blend-screen opacity-20" />

    <Particles tone={tone} />

    {/* Transition Overlays */}
    <AnimatePresence>
      {sceneTransitioning && (
        <motion.div className="absolute inset-0 bg-black z-[100]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.8 }} />
      )}
    </AnimatePresence>

    {/* Audio Prompt */}
    <AnimatePresence>
      {showAudioPrompt && (
        <motion.div className="absolute inset-0 z-[110] bg-black/95 flex items-center justify-center p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="max-w-md text-center">
            <img src={osirisLogo} className="w-24 h-24 mx-auto mb-8 opacity-90" />
            <h2 className="text-4xl font-light text-amber-500 mb-2 tracking-[0.3em]">OSIRIS</h2>
            <p className="text-white/40 text-[10px] mb-12 tracking-[0.5em]">MULTIMEDIA EXPERIENCE</p>
            <button onClick={enableAudio} className="w-full py-5 bg-amber-600 text-black font-bold rounded-2xl hover:bg-amber-400 transition-all">START CINEMA</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Nav Bar */}
    {!isVoiceModeActive && (
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-8 pointer-events-none">
        <button onClick={(e) => { e.stopPropagation(); setLocation('/'); }} className="pointer-events-auto px-4 py-2 border border-white/10 rounded-xl bg-black/40 text-white/50 text-[10px] font-mono tracking-widest hover:text-white transition-all">← HOME</button>
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="flex bg-black/40 border border-white/10 rounded-xl overflow-hidden divide-x divide-white/10">
            <button onClick={() => setUiLang('ar')} className={ \`px-4 py-1.5 text-[9px] \${lang === 'ar' ? 'text-amber-400 bg-amber-400/10' : 'text-white/30'} \` }>AR</button>
            <button onClick={() => setUiLang('en')} className={ \`px-4 py-1.5 text-[9px] \${lang === 'en' ? 'text-amber-400 bg-amber-400/10' : 'text-white/30'} \` }>EN</button>
          </div>
        </div>
      </div>
    )}

    {/* Gameplay Root */}
    <div className="absolute inset-0 z-40 pointer-events-none flex flex-col justify-end p-8 sm:p-20">
      
      {/* Dialogue Box Area */}
      <div className="w-full max-w-5xl mx-auto relative pointer-events-none">
        
        {/* Portrait Positioning */}
        <AnimatePresence mode="wait">
          {showCharacter && currentCharConfig.imageUrl && preferredCharacterKey !== 'Narrator' && (
            <motion.div
              key={dialogueCharacterKey + '-portrait'}
              className={ \`absolute bottom-48 \${currentCharConfig.position === 'left' ? 'left-0' : 'right-0'} \` }
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}>
              <img src={currentCharConfig.imageUrl} className="w-24 sm:w-48 rounded-3xl border border-white/10 shadow-2xl" style={{ filter: 'brightness(0.9) contrast(1.1)' }} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!showChoices && currentDialogue && (
            <motion.div key={currentSceneId + dialogueIndex} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="pointer-events-auto">
              <div className={ \`mb-4 opacity-70 text-[9px] font-mono tracking-[0.4em] uppercase \${lang === 'ar' ? 'text-right' : ''} \` } style={{ color: currentCharConfig.color }}>
                {lang === 'ar' ? currentCharConfig.arabicName : currentCharConfig.name}
              </div>
              
              <LuxuryBorder active={!showChoices} progress={(dialogueIndex + 1) / (dialogueLines.length || 1)} accentColor={currentCharConfig.color} className="rounded-3xl">
                <div className={ \`bg-black/80 backdrop-blur-3xl rounded-3xl p-8 sm:p-12 \${lang === 'ar' ? 'text-right' : ''} \` }>
                  <p className={ \`text-white/95 leading-relaxed \${lang === 'ar' ? 'text-3xl font-arabic' : 'text-2xl font-light'} \` }>
                    {lang === 'ar' ? displayedArabic : displayedText}
                  </p>
                  
                  {/* Controls Row */}
                  {!isVoiceModeActive && (
                    <div className={ \`mt-12 flex items-center justify-between gap-8 \${lang === 'ar' ? 'flex-row-reverse' : ''} \` }>
                      <div className="flex items-center gap-6">
                        <button onClick={(e) => { e.stopPropagation(); handleBackScene(); }} disabled={dialogueIndex === 0} className="text-white/40 hover:text-white transition-all disabled:opacity-0"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button>
                        <button onClick={(e) => { e.stopPropagation(); handleAdvance(); }} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-amber-500/20 hover:text-amber-400 transition-all"><svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></button>
                      </div>
                      <VolumeControl musicVol={musicVol} sfxVol={sfxVol} onMusicChange={handleMusicVol} onSfxChange={handleSfxVol} isMuted={isMuted} onToggleMute={handleToggleMute} />
                    </div>
                  )}
                </div>
              </LuxuryBorder>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Choices Tree */}
        <AnimatePresence>
          {showChoices && currentScene.choices && currentScene.choices.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 pointer-events-auto">
              {currentScene.choices.map((choice, idx) => (
                <button key={choice.id} onClick={() => handleChoice(choice)} className={ \`group p-6 bg-black/60 border border-white/10 rounded-2xl backdrop-blur-xl hover:border-amber-500/40 hover:bg-amber-500/5 transition-all \${lang === 'ar' ? 'text-right' : ''} \` }>
                  <div className={ \`flex items-center gap-6 \${lang === 'ar' ? 'flex-row-reverse' : ''} \` }>
                    <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-mono text-white/50 group-hover:text-amber-400 group-hover:border-amber-400">{idx + 1}</span>
                    <span className="text-xl font-light text-white/80 group-hover:text-white transition-colors">{lang === 'ar' ? (choice.arabicText || choice.text) : choice.text}</span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* End of Scene */}
        <AnimatePresence>
          {isEndOfScene && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-12 bg-black/80 rounded-3xl border border-white/10 pointer-events-auto">
              <h3 className="text-amber-500 text-[10px] tracking-[0.6em] uppercase mb-12">Chapter Completed</h3>
              <div className="flex justify-center gap-6">
                <button onClick={handleNoChoiceAdvance} className="px-10 py-4 bg-amber-600 text-black font-bold rounded-2xl hover:bg-amber-400 shadow-xl transition-all">CONTINUE JOURNEY</button>
                <button onClick={() => setLocation('/')} className="px-10 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">EXIT TO MENU</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </motion.div>
);
}

export default MainPlayer;
`;

const finalFileContent = head + cleanTail;
fs.writeFileSync(filePath, finalFileContent);
console.log("MainPlayer.tsx successfully repaired.");
