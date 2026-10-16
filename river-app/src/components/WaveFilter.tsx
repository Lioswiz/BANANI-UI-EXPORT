import { useEffect, useState } from "react";

/**
 * The wavy lens over a live status photo. A status is a moving surface, so the
 * picture inside the ring ripples like water instead of sitting flat the way a
 * normal avatar does.
 *
 * Two primitives, declared once for the whole document and referenced by id
 * from `@utility wave-3d`:
 *   feTurbulence      a slow, low-frequency noise field. At these frequencies
 *                     roughly one swell crosses a 54pt disc, so it bends the
 *                     picture like a lens rather than looking like static.
 *   feDisplacementMap pushes each pixel along that field — that displacement is
 *                     the wave. A blur would smooth the photo; this moves it.
 *
 * SMIL drives both numbers because CSS cannot animate a filter primitive. The
 * reader's motion preference is honoured by not emitting the <animate> children
 * at all, which leaves the swell baked in and perfectly still rather than
 * removing the effect.
 */
export function WaveFilter() {
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotion(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <svg aria-hidden="true" focusable="false" className="absolute size-0">
      <filter
        id="river-wave"
        x="-12%"
        y="-12%"
        width="124%"
        height="124%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.017 0.024"
          numOctaves="1"
          seed="7"
          result="swell"
        >
          {motion && (
            <animate
              attributeName="baseFrequency"
              dur="17s"
              values="0.017 0.024;0.024 0.017;0.017 0.024"
              repeatCount="indefinite"
            />
          )}
        </feTurbulence>
        <feDisplacementMap
          in="SourceGraphic"
          in2="swell"
          scale="5"
          xChannelSelector="R"
          yChannelSelector="G"
        >
          {motion && (
            <animate
              attributeName="scale"
              dur="9s"
              values="4;9;4"
              repeatCount="indefinite"
            />
          )}
        </feDisplacementMap>
      </filter>
    </svg>
  );
}
