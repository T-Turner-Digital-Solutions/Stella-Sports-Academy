/** Thin decorative wave, anchored to the bottom of every board portal page — matches the reference design. */
export function PortalWaveFooter() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className="mt-10 h-10 w-full flex-shrink-0 text-blue-700"
    >
      <path
        d="M0,30 C240,60 480,0 720,20 C960,40 1200,10 1440,30 L1440,60 L0,60 Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M0,38 C240,65 480,12 720,30 C960,48 1200,18 1440,38 L1440,60 L0,60 Z"
        fill="currentColor"
      />
    </svg>
  );
}
