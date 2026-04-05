import { useEffect, useMemo, useState } from "react";

type NetworkInformation = {
  effectiveType?: string;
  saveData?: boolean;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
};

function getNetworkInfo(): NetworkInformation | undefined {
  const nav = navigator as any;
  return nav?.connection || nav?.mozConnection || nav?.webkitConnection;
}

function computeAllowVideo() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("video") === "1" || params.get("cinemaVideo") === "force") {
    return true;
  }

  const reducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return false;

  const conn = getNetworkInfo();
  if (conn?.saveData) return false;
  const et = (conn?.effectiveType || "").toLowerCase();
  if (et === "2g" || et === "slow-2g") return false;
  return true;
}

export function useBandwidthStrategy() {
  const [allowVideo, setAllowVideo] = useState(computeAllowVideo());

  useEffect(() => {
    const update = () => setAllowVideo(computeAllowVideo());
    const conn = getNetworkInfo();
    conn?.addEventListener?.("change", update);
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    mq?.addEventListener?.("change", update);
    return () => {
      conn?.removeEventListener?.("change", update);
      mq?.removeEventListener?.("change", update);
    };
  }, []);

  return useMemo(() => ({ allowVideo }), [allowVideo]);
}
