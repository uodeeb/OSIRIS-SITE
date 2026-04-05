import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioConsentModalProps {
  onConsent: (allowed: boolean) => void;
  lang: 'en' | 'ar';
}

export function AudioConsentModal({ onConsent, lang }: AudioConsentModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const audioConsent = localStorage.getItem('osiris-audio-consent');
    if (audioConsent === null) {
      setIsVisible(true);
    } else {
      onConsent(audioConsent === 'true');
    }
  }, [onConsent]);

  const handleConsent = (allowed: boolean) => {
    localStorage.setItem('osiris-audio-consent', allowed.toString());
    setIsVisible(false);
    onConsent(allowed);
  };

  const texts = {
    en: {
      title: 'Audio Experience',
      description: 'OSIRIS features a rich cinematic audio experience with music, sound effects, and narration. Would you like to enable audio?',
      enable: 'Enable Audio',
      skip: 'Continue Silently',
      note: 'You can change this later in settings'
    },
    ar: {
      title: 'تجربة الصوت',
      description: 'يتميز OSIRIS بتجربة صوتية سينمائية غنية مع الموسيقى، المؤثرات الصوتية، والسرد. هل ترغب في تمكين الصوت؟',
      enable: 'تمكين الصوت',
      skip: 'الاستمرار بصمت',
      note: 'يمكنك تغيير هذا لاحقاً في الإعدادات'
    }
  };

  const text = texts[lang];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="mx-4 max-w-md rounded-lg border border-white/10 bg-black/90 p-6 text-center shadow-2xl"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="mb-4">
              <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">{text.title}</h3>
              <p className="mb-4 text-sm text-white/70">{text.description}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleConsent(true)}
                className="w-full rounded-md bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-3 text-sm font-medium text-white transition-all hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-black"
              >
                {text.enable}
              </button>
              
              <button
                onClick={() => handleConsent(false)}
                className="w-full rounded-md border border-white/20 px-4 py-3 text-sm font-medium text-white/80 transition-all hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black"
              >
                {text.skip}
              </button>
            </div>

            <p className="mt-3 text-xs text-white/50">{text.note}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}