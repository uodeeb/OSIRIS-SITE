import { memo, type RefObject } from "react";
import { motion } from "framer-motion";
import type { Scene } from "@/lib/sceneSystem";
import osirisLogo from "@/LOGO/new-logo/favicon-black-0.25.png";

type Props = {
  scene: Scene;
  sceneId: string;
  bgImageSrc?: string;
  bgVideoSrc?: string;
  audioDescSrcEn?: string;
  audioDescSrcAr?: string;
  allowVideo: boolean;
  bgLoaded: boolean;
  setBgLoaded: (v: boolean) => void;
  videoReady: boolean;
  setVideoReady: (v: boolean) => void;
  overlay: string;
  mediaFilter: string;
  videoRef: RefObject<HTMLVideoElement | null>;
  fx: {
    flash: number;
    shake: number;
    uiPulse: number;
  };
};

export const CinematicStage = memo(function CinematicStage({
  scene,
  sceneId,
  bgImageSrc,
  bgVideoSrc,
  audioDescSrcEn,
  audioDescSrcAr,
  allowVideo,
  bgLoaded,
  setBgLoaded,
  videoReady,
  setVideoReady,
  overlay,
  mediaFilter,
  videoRef,
  fx,
}: Props) {
  const showVideo = allowVideo && !!bgVideoSrc;

  return (
    <>
      {bgImageSrc && (
        <motion.img
          key={sceneId + "-bg"}
          src={bgImageSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{
            opacity: bgLoaded ? (videoReady ? 0.12 : 1) : 0,
            scale: bgLoaded ? [1.035, 1.06, 1.035] : 1.06,
            x: bgLoaded ? ["0%", "0.8%", "0%"] : "0%",
            y: bgLoaded ? ["0%", "-0.6%", "0%"] : "0%",
          }}
          transition={{
            opacity: { duration: 1.4, ease: "easeOut" },
            scale: { duration: 26, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 18, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 21, repeat: Infinity, ease: "easeInOut" },
          }}
          onLoad={() => setBgLoaded(true)}
          onError={() => setBgLoaded(true)}
          style={{ filter: mediaFilter, zIndex: 0, willChange: 'transform, opacity' }}
          decoding="async"
          loading="eager"
        />
      )}

      {showVideo && (
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: [1.02, 1.04, 1.02],
            x: ["0%", "-0.5%", "0%"],
            y: ["0%", "0.35%", "0%"],
          }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          style={{ zIndex: 1, willChange: 'transform' }}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src={bgVideoSrc}
            poster={bgImageSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            onCanPlay={() => {
              if (videoRef.current) videoRef.current.playbackRate = 0.85;
              setVideoReady(true);
            }}
            onError={() => {
              setVideoReady(false);
            }}
            style={{
              opacity: videoReady ? 1 : 0,
              transition: "opacity 2.2s ease",
              filter: mediaFilter,
            }}
          />
          {audioDescSrcEn && (
            <track
              kind="descriptions"
              src={audioDescSrcEn}
              srcLang="en"
              label="English Audio Description"
              default={false}
            />
          )}
          {audioDescSrcAr && (
            <track
              kind="descriptions"
              src={audioDescSrcAr}
              srcLang="ar"
              label="وصف صوتي عربي"
              default={false}
            />
          )}
        </motion.div>
      )}

      {showVideo && (
        <div
          className="absolute bottom-0 right-0 z-10 pointer-events-none"
          style={{
            width: 240,
            height: 110,
            background: "linear-gradient(135deg, rgba(0,0,0,0.92), rgba(0,0,0,0.15))",
            backdropFilter: "blur(10px)",
            mixBlendMode: "normal",
            zIndex: 4,
          }}
        />
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(0,0,0,0.7) 0%,
            rgba(0,0,0,0.1) 25%,
            transparent 45%,
            transparent 52%,
            ${overlay} 100%
          )`,
          zIndex: 2,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "160px 160px",
          zIndex: 3,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 28%, rgba(0,0,0,0.65) 100%)",
          zIndex: 3,
        }}
      />

      {(scene.visualEffect === "scanlines" || scene.visualEffect === "cctv") && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.08, 0.12, 0.09] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.02) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)",
            mixBlendMode: "overlay",
            zIndex: 5,
          }}
        />
      )}

      <img
        src={osirisLogo}
        alt=""
        className="absolute top-5 right-6 pointer-events-none"
        style={{
          width: 170,
          opacity: 0.08,
          filter: "drop-shadow(0 0 22px rgba(201,169,110,0.18))",
          mixBlendMode: "screen",
          zIndex: 6,
        }}
      />

      {scene.visualEffect === "glitch" && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: [0, 0.18, 0.05, 0.22, 0],
            x: [0, 1, -1, 2, 0],
            y: [0, -1, 1, -2, 0],
          }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "linear-gradient(90deg, rgba(0,255,255,0.10), rgba(255,0,255,0.08), rgba(255,255,255,0.00))",
            mixBlendMode: "screen",
            zIndex: 6,
          }}
        />
      )}

      {scene.visualEffect === "alarm" && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.04, 0.18, 0.04] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0) 55%, rgba(255,60,60,0.35) 100%)",
            mixBlendMode: "screen",
            zIndex: 6,
          }}
        />
      )}

      {scene.visualEffect === "montage" && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0, 0.10, 0.02, 0.14, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(0,0,0,0.0) 45%, rgba(255,255,255,0.06))",
            mixBlendMode: "overlay",
            zIndex: 6,
          }}
        />
      )}

      {fx.flash > 0 && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, fx.flash, 0] }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{
            background: "rgba(255,255,255,0.9)",
            mixBlendMode: "overlay",
            zIndex: 9,
          }}
        />
      )}

      <div className="absolute top-0 left-0 right-0 h-12 bg-black pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-black pointer-events-none z-10" />
    </>
  );
});
