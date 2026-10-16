/**
 * Inline icon set. Everything is drawn on a 24x24 grid with a 1.8px stroke and
 * round caps/joins to match the export's line weight.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

/* ---------------------------------------------------------------- header */

export const HeartIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 20.2 4.6 12.9a4.7 4.7 0 0 1 0-6.7 4.7 4.7 0 0 1 6.7 0l.7.7.7-.7a4.7 4.7 0 0 1 6.7 0 4.7 4.7 0 0 1 0 6.7Z" />
  </Svg>
);

export const SendIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20.6 3.4 3.5 9.9c-.7.3-.7 1.2 0 1.4l6.4 2.3c.2.1.4.2.5.5l2.3 6.4c.2.7 1.1.7 1.4 0Z" />
  </Svg>
);

export const BackIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14.5 5.5 8 12l6.5 6.5" />
  </Svg>
);

export const SettingsIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="2.9" />
    <path d="M19.3 14.5a1.6 1.6 0 0 0 .3 1.8l.1.1a1.9 1.9 0 1 1-2.7 2.7l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5v.2a1.9 1.9 0 0 1-3.8 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a1.9 1.9 0 1 1-2.7-2.7l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1h-.2a1.9 1.9 0 0 1 0-3.8h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a1.9 1.9 0 1 1 2.7-2.7l.1.1a1.6 1.6 0 0 0 1.8.3 1.6 1.6 0 0 0 1-1.5v-.2a1.9 1.9 0 0 1 3.8 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a1.9 1.9 0 1 1 2.7 2.7l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1h.2a1.9 1.9 0 0 1 0 3.8h-.1a1.6 1.6 0 0 0-1.5 1Z" />
  </Svg>
);

/* ------------------------------------------------------------- tab bar */

export const HomeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 10.2 12 4l8 6.2V19a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 19Z" />
    <path d="M9.6 20.6v-6h4.8v6" />
  </Svg>
);

export const CompassIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M15.6 8.4 13.8 14l-5.4 1.6L10.2 10Z" />
  </Svg>
);

export const PlusIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={2.4}>
    <path d="M12 5.5v13M5.5 12h13" />
  </Svg>
);

export const ChatIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20.5 11.6c0 4.2-3.8 7.6-8.5 7.6a9.8 9.8 0 0 1-2.6-.35L4.6 20.4l1.2-3.6A7.2 7.2 0 0 1 3.5 11.6C3.5 7.4 7.3 4 12 4s8.5 3.4 8.5 7.6Z" />
  </Svg>
);

export const PersonIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8.4" r="3.7" />
    <path d="M4.9 20.3a7.4 7.4 0 0 1 14.2 0" />
  </Svg>
);

/* --------------------------------------------------------- post actions */

export const CommentIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20.4 11.5c0 4-3.8 7.2-8.4 7.2a10 10 0 0 1-2.7-.37L5 20.2l1.1-3.5a7 7 0 0 1-2.5-5.2C3.6 7.5 7.4 4.3 12 4.3s8.4 3.2 8.4 7.2Z" />
  </Svg>
);

export const RepostIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.6 9.2a6.4 6.4 0 0 1 6.4-5.4h6.2" />
    <path d="M14.6 1.6 17.4 3.8l-2.8 2.3" />
    <path d="M19.4 14.8a6.4 6.4 0 0 1-6.4 5.4H6.8" />
    <path d="M9.4 22.4 6.6 20.2l2.8-2.3" />
  </Svg>
);

export const AnalyticsIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 20v-6M12 20V6M18 20v-9" />
  </Svg>
);

/* ---------------------------------------------------------------- misc */

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="10.8" cy="10.8" r="6.4" />
    <path d="m15.6 15.6 4 4" />
  </Svg>
);

export const PhoneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20.4 16.9v2.4a1.6 1.6 0 0 1-1.8 1.6 16 16 0 0 1-7-2.5 15.7 15.7 0 0 1-4.8-4.8 16 16 0 0 1-2.5-7.1A1.6 1.6 0 0 1 5.9 4.7h2.4a1.6 1.6 0 0 1 1.6 1.4c.1.8.3 1.6.6 2.4a1.6 1.6 0 0 1-.4 1.7l-1 1a12.8 12.8 0 0 0 4.8 4.8l1-1a1.6 1.6 0 0 1 1.7-.4c.8.3 1.6.5 2.4.6a1.6 1.6 0 0 1 1.4 1.6Z" />
  </Svg>
);

export const VideoIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="6.4" width="12.6" height="11.2" rx="2.6" />
    <path d="m15.6 10.4 5.4-3v9.2l-5.4-3Z" />
  </Svg>
);

export const ImageIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.4" y="4.6" width="17.2" height="14.8" rx="2.6" />
    <circle cx="8.6" cy="9.6" r="1.6" />
    <path d="m4.2 17.2 4.5-4.3a2 2 0 0 1 2.7 0l5 4.8" />
    <path d="m14.4 14.4 1.5-1.4a2 2 0 0 1 2.7 0l1.9 1.8" />
  </Svg>
);

export const MicIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="9.2" y="3" width="5.6" height="10.4" rx="2.8" />
    <path d="M5.6 11.2a6.4 6.4 0 0 0 12.8 0" />
    <path d="M12 17.6V21" />
  </Svg>
);

export const CameraIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 8.6h2.6l1.5-2.2h7.8l1.5 2.2H20a1.6 1.6 0 0 1 1.6 1.6v7.4A1.6 1.6 0 0 1 20 19.2H4a1.6 1.6 0 0 1-1.6-1.6v-7.4A1.6 1.6 0 0 1 4 8.6Z" />
    <circle cx="12" cy="13.6" r="3.2" />
  </Svg>
);

export const MegaphoneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 10.2v3.6a1.4 1.4 0 0 0 1.4 1.4h1.4L14.6 19V5L6.8 8.8H5.4A1.4 1.4 0 0 0 4 10.2Z" />
    <path d="M17.6 8.8a4.6 4.6 0 0 1 0 6.4" />
    <path d="M8.2 15.4v3.2a1.4 1.4 0 0 0 2.8 0v-1.9" />
  </Svg>
);

export const MicBroadcastIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M11 4.4v5.2l5.6 3.2" />
    <path d="M17.7 6.6a7.6 7.6 0 0 1 0 10.8" />
    <path d="M20.4 3.9a11.4 11.4 0 0 1 0 16.2" />
  </Svg>
);

export const VerifiedIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.6}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="m8.6 12.2 2.3 2.3 4.5-4.9" />
  </Svg>
);

export const TrendUpIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 15.4 9.4 10l3.6 3.6L20 6.6" />
    <path d="M15.4 6.6H20v4.6" />
  </Svg>
);

export const UserPlusIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="10" cy="8.2" r="3.5" />
    <path d="M3.8 19.6a6.6 6.6 0 0 1 12.4-2.4" />
    <path d="M18 12.4v6M15 15.4h6" />
  </Svg>
);

export const BoltIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13.4 2.6 4.8 13.4h6L10 21.4l8.6-10.8h-6Z" />
  </Svg>
);

/* ----------------------------------------------------------- interaction */

/** Used to dismiss the story and tile overlays. */
export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.2 6.2 17.8 17.8M17.8 6.2 6.2 17.8" />
  </Svg>
);

/** Chevron for the wide-screen rails' "see all" links. */
export const ChevronRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
  </Svg>
);
