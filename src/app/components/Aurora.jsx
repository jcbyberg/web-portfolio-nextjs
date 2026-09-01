"use client";

import { useEffect, useRef } from "react";
import "./aurora.css";

const SETTLE_THRESHOLD = 0.0005;
const EASING = 0.055;

// Each name here needs a matching `.aurora[data-palette="…"]` block in
// aurora.css. An unknown name silently falls back to "aurora", whose blobs are
// tuned with `screen` for a dark ground and wash out to nothing on a light one
// — so a typo reads as "the effect stopped working" rather than as an error.
const PALETTES = new Set(["aurora", "ember", "rose"]);

export default function Aurora({ intensity = "full", palette = "aurora" }) {
  const containerRef = useRef(null);
  const preset = intensity === "subtle" ? "subtle" : "full";
  const paletteName = PALETTES.has(palette) ? palette : "aurora";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const noHover = window.matchMedia("(hover: none)");

    let targetX = 0;
    let targetY = 0;
    let easedX = 0;
    let easedY = 0;
    let frameId = null;
    let tracking = false;

    const writePosition = () => {
      container.style.setProperty("--aurora-x", String(easedX));
      container.style.setProperty("--aurora-y", String(easedY));
    };

    const cancelFrame = () => {
      if (frameId === null) return;
      window.cancelAnimationFrame(frameId);
      frameId = null;
    };

    const tick = () => {
      frameId = null;
      if (document.hidden || !tracking) return;

      const deltaX = targetX - easedX;
      const deltaY = targetY - easedY;

      easedX += deltaX * EASING;
      easedY += deltaY * EASING;

      const settled =
        Math.abs(targetX - easedX) < SETTLE_THRESHOLD &&
        Math.abs(targetY - easedY) < SETTLE_THRESHOLD;

      if (settled) {
        easedX = targetX;
        easedY = targetY;
      }

      writePosition();

      if (!settled) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    const startFrame = () => {
      if (frameId === null && !document.hidden && tracking) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    const handlePointerMove = (event) => {
      targetX = event.clientX / window.innerWidth - 0.5;
      targetY = event.clientY / window.innerHeight - 0.5;
      startFrame();
    };

    const updateTracking = () => {
      const shouldTrack =
        !reducedMotion.matches && !coarsePointer.matches && !noHover.matches;

      if (shouldTrack === tracking) return;
      tracking = shouldTrack;

      if (tracking) {
        window.addEventListener("pointermove", handlePointerMove, {
          passive: true,
        });
        return;
      }

      window.removeEventListener("pointermove", handlePointerMove);
      cancelFrame();
      targetX = 0;
      targetY = 0;
      easedX = 0;
      easedY = 0;
      writePosition();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelFrame();
        return;
      }

      if (
        Math.abs(targetX - easedX) >= SETTLE_THRESHOLD ||
        Math.abs(targetY - easedY) >= SETTLE_THRESHOLD
      ) {
        startFrame();
      }
    };

    // Safari <= 13 has no addEventListener on MediaQueryList, only the
    // deprecated addListener. Without this fallback the effect throws, and
    // because the app has no error boundary an uncaught effect error unmounts
    // the whole root — the failure mode is a blank page, not a dead background.
    const queries = [reducedMotion, coarsePointer, noHover];
    const subscribe = (mq) =>
      mq.addEventListener
        ? mq.addEventListener("change", updateTracking)
        : mq.addListener(updateTracking);
    const unsubscribe = (mq) =>
      mq.removeEventListener
        ? mq.removeEventListener("change", updateTracking)
        : mq.removeListener(updateTracking);

    queries.forEach(subscribe);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    updateTracking();

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      queries.forEach(unsubscribe);
      cancelFrame();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="aurora"
      data-intensity={preset}
      data-palette={paletteName}
      aria-hidden="true"
    >
      <div className="aurora__layer aurora__layer--a">
        <div className="aurora__blob aurora__blob--a" />
      </div>
      <div className="aurora__layer aurora__layer--b">
        <div className="aurora__blob aurora__blob--b" />
      </div>
      <div className="aurora__layer aurora__layer--c">
        <div className="aurora__blob aurora__blob--c" />
      </div>
    </div>
  );
}
