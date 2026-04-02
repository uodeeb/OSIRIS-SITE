import { useEffect, useRef, useState, useCallback } from 'react'

interface VideoLayerProps {
  videoSrc: string
  imageSrc: string
  effect: string
  isFrozen: boolean
}

export function VideoLayer({ videoSrc, imageSrc, effect, isFrozen }: VideoLayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleVideoLoaded = useCallback(() => {
    setVideoLoaded(true)
    setVideoError(false)
  }, [])

  const handleVideoError = useCallback(() => {
    setVideoError(true)
  }, [])

  useEffect(() => {
    setVideoLoaded(false)
    setVideoError(false)
    setImageLoaded(false)

    const video = videoRef.current
    if (!video) return

    video.src = videoSrc
    video.load()

    video.play().catch(() => {
      setVideoError(true)
    })
  }, [videoSrc])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isFrozen) {
      video.pause()
    } else if (videoLoaded && !videoError) {
      video.play().catch(() => {})
    }
  }, [isFrozen, videoLoaded, videoError])

  const kenBurnsClass = effect === 'none' ? 'ken-burns' : ''

  return (
    <div className="absolute inset-0 overflow-hidden">
      {!videoError ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          } ${kenBurnsClass}`}
          onLoadedData={handleVideoLoaded}
          onError={handleVideoError}
        />
      ) : null}

      <img
        src={imageSrc}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          videoError || !videoLoaded ? 'opacity-100' : 'opacity-0'
        } ${kenBurnsClass}`}
        onLoad={() => setImageLoaded(true)}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-osiris-darker/80 via-transparent to-osiris-darker/40 z-[3]" />
    </div>
  )
}
