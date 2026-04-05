import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { getOsirisEffectOpacity, getOsirisMediaUrl, OSIRIS_EFFECTS, type OsirisEffectId } from "@/lib/osirisEffects";

type OsirisEffectLayerProps = {
  effectId: OsirisEffectId | null;
  allowVideo: boolean;
};

export function OsirisEffectLayer({ effectId, allowVideo }: OsirisEffectLayerProps) {
  const composition = effectId ? OSIRIS_EFFECTS[effectId] : null;
  const opacity = useMemo(() => (effectId ? getOsirisEffectOpacity(effectId) : 0), [effectId]);
  const [videoFailed, setVideoFailed] = useState(false);
  const [gifFailed, setGifFailed] = useState(false);

  useEffect(() => {
    setVideoFailed(false);
    setGifFailed(false);
  }, [effectId]);

  const useVideo = Boolean(allowVideo && composition?.base.relativePath && !videoFailed);
  const useGif = Boolean(composition?.fallback.relativePath && !gifFailed);

  const baseUrl = composition ? getOsirisMediaUrl(composition.base) : "";
  const fallbackUrl = composition ? getOsirisMediaUrl(composition.fallback) : "";

  return (
    <AnimatePresence mode="wait">
      {composition && (
        <motion.div
          key={composition.effectId + (useVideo ? "-v" : "-g")}
          initial={{ opacity: 0 }}
          animate={{ opacity }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 7, mixBlendMode: "screen" }}
          aria-hidden="true"
        >
          <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 30% 20%, ${composition.palette[1]}22, rgba(0,0,0,0) 55%)` }} />
          {useVideo ? (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src={baseUrl}
              muted
              playsInline
              loop
              autoPlay
              preload="auto"
              onError={() => setVideoFailed(true)}
            />
          ) : useGif ? (
            <img
              className="absolute inset-0 w-full h-full object-cover"
              src={fallbackUrl}
              alt=""
              decoding="async"
              onError={() => setGifFailed(true)}
            />
          ) : null}
          <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0) 2px, rgba(0,0,0,0) 6px)", opacity: composition.effectId === "FX-02-INTERFACE-SCANLINES" ? 0.55 : 0.18 }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

