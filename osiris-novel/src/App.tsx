import { useEffect, useState } from 'react'
import { Player } from './components/Player'
import { SCENES, SCENE_ORDER } from './data/scenes'
import { usePlayerStore } from './store/playerStore'

function HomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-osiris-darker overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-osiris-darker via-osiris-surface to-osiris-darker" />

      {/* Logo / Title */}
      <div className="relative z-10 text-center px-8 max-w-xl">
        <h1 className="text-5xl font-bold text-osiris-gold mb-4 tracking-wider">
          OSIRIS
        </h1>
        <p className="text-xl text-osiris-text mb-2 leading-relaxed">
          المفسدون في الأرض
        </p>
        <p className="text-osiris-text-dim text-sm mb-8">
          ستة آلاف سنة من القضية الواحدة
        </p>

        <button
          onClick={onStart}
          className="px-8 py-3 bg-osiris-gold/20 hover:bg-osiris-gold/30 text-osiris-gold rounded-full border border-osiris-gold/40 transition-all duration-300 text-lg font-medium"
        >
          ابدأ الاستماع
        </button>

        <p className="text-osiris-text-dim text-xs mt-6">
          انقر للمتابعة في كل سطر بعد اكتمال الكتابة
        </p>
      </div>
    </div>
  )
}

export default function App() {
  const [started, setStarted] = useState(false)
  const { currentSceneId, globalPlay } = usePlayerStore()

  useEffect(() => {
    if (started) {
      globalPlay()
    }
  }, [started, globalPlay])

  if (!started) {
    return <HomeScreen onStart={() => setStarted(true)} />
  }

  const sceneId = currentSceneId || SCENE_ORDER[0]
  const scene = SCENES[sceneId]

  if (!scene) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-osiris-darker">
        <p className="text-osiris-text-dim">المشهد غير موجود</p>
      </div>
    )
  }

  return <Player sceneId={sceneId} />
}
