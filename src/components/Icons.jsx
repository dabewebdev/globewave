/* eslint-disable react-refresh/only-export-components */
// Single-source icons. 1.5px stroke, 24x24, currentColor. No emoji anywhere.

const Icon = ({ children, size = 16, stroke = 1.5, fill = "none", label, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label={label}
    role={label ? "img" : "presentation"}
    aria-hidden={!label}
    {...rest}
  >
    {children}
  </svg>
);

export const I = {
  Play: (p) => (
    <Icon {...p} label="Play">
      <polygon points="7,5 19,12 7,19" fill="currentColor" stroke="none" />
    </Icon>
  ),
  Pause: (p) => (
    <Icon {...p} label="Pause">
      <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
      <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
    </Icon>
  ),
  Stop: (p) => (
    <Icon {...p} label="Stop">
      <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" stroke="none" />
    </Icon>
  ),
  Prev: (p) => (
    <Icon {...p} label="Previous">
      <polygon points="18,5 8,12 18,19" fill="currentColor" stroke="none" />
      <line x1="6" y1="5" x2="6" y2="19" />
    </Icon>
  ),
  Next: (p) => (
    <Icon {...p} label="Next">
      <polygon points="6,5 16,12 6,19" fill="currentColor" stroke="none" />
      <line x1="18" y1="5" x2="18" y2="19" />
    </Icon>
  ),
  Heart: (p) => (
    <Icon {...p} label="Favorite">
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
    </Icon>
  ),
  HeartFill: (p) => (
    <Icon {...p} fill="currentColor" stroke="currentColor" label="Favorited">
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
    </Icon>
  ),
  Search: (p) => (
    <Icon {...p} label="Search">
      <circle cx="11" cy="11" r="6" />
      <line x1="20" y1="20" x2="15.5" y2="15.5" />
    </Icon>
  ),
  Globe: (p) => (
    <Icon {...p} label="Globe">
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="3.5" ry="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </Icon>
  ),
  Volume: (p) => (
    <Icon {...p} label="Volume">
      <polygon points="4,9 9,9 14,5 14,19 9,15 4,15" fill="currentColor" stroke="currentColor" />
      <path d="M17 8.5a5 5 0 0 1 0 7" />
    </Icon>
  ),
  VolumeMute: (p) => (
    <Icon {...p} label="Mute">
      <polygon points="4,9 9,9 14,5 14,19 9,15 4,15" fill="currentColor" stroke="currentColor" />
      <line x1="17" y1="9" x2="22" y2="14" />
      <line x1="22" y1="9" x2="17" y2="14" />
    </Icon>
  ),
  Settings: (p) => (
    <Icon {...p} label="Settings">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 14.3a7.7 7.7 0 0 0 0-4.6l1.8-1.4-2-3.4-2.1.8a7.6 7.6 0 0 0-4-2.3L12.6 1h-3.2l-.5 2.4a7.6 7.6 0 0 0-4 2.3l-2.1-.8-2 3.4 1.8 1.4a7.7 7.7 0 0 0 0 4.6L.8 15.7l2 3.4 2.1-.8a7.6 7.6 0 0 0 4 2.3l.5 2.4h3.2l.5-2.4a7.6 7.6 0 0 0 4-2.3l2.1.8 2-3.4z" />
    </Icon>
  ),
  Close: (p) => (
    <Icon {...p} label="Close">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="6" y1="18" x2="18" y2="6" />
    </Icon>
  ),
  ChevronDown: (p) => (
    <Icon {...p} label="Open">
      <path d="M6 9l6 6 6-6" />
    </Icon>
  ),
  ChevronUp: (p) => (
    <Icon {...p} label="Collapse">
      <path d="M18 15l-6-6-6 6" />
    </Icon>
  ),
  Pin: (p) => (
    <Icon {...p} label="Location">
      <circle cx="12" cy="10" r="3" />
      <path d="M12 21c-4-5-7-8-7-11a7 7 0 0 1 14 0c0 3-3 6-7 11z" />
    </Icon>
  ),
  Headphones: (p) => (
    <Icon {...p} label="Headphones">
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="14" width="5" height="6" rx="1.5" />
      <rect x="16" y="14" width="5" height="6" rx="1.5" />
    </Icon>
  ),
  Refresh: (p) => (
    <Icon {...p} label="Retry">
      <polyline points="3,7 3,3 7,3" />
      <path d="M3 12a9 9 0 0 1 16-5l2 2" />
      <polyline points="21,17 21,21 17,21" />
      <path d="M21 12a9 9 0 0 1-16 5l-2-2" />
    </Icon>
  ),
};
