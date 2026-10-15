/**
 * Content transcribed from the UI export. Kept as plain data so the screens
 * stay presentational and the copy lives in one place.
 */

export type Person = {
  name: string;
  handle: string;
  avatar: string;
  verified?: boolean;
};

export type Story = {
  id: string;
  label: string;
  avatar: string;
  /** "you" renders the dashed ring + add button, "live" the pink badge */
  variant?: "you" | "live";
};

export type Post = {
  id: string;
  author: Person;
  time: string;
  body: string;
  image?: string;
  stats: { comments: string; reposts: string; likes: string };
};

export type Channel = {
  id: string;
  name: string;
  preview: string;
  members: string;
};

export type ChatRow = {
  id: string;
  person: Person;
  tag?: string;
  preview: string;
  time: string;
  unread?: number;
  /** new-Loop indicator instead of an unread count */
  camera?: boolean;
  online?: boolean;
};

export type ActivityItem = {
  id: string;
  tone: "brand" | "zest" | "info" | "ink";
  icon: "heart" | "repost" | "userplus" | "megaphone";
  title: string;
  meta: string;
};

export type Message = {
  id: string;
  from: "me" | "them";
  body?: string;
  image?: string;
  time?: string;
};

export type Tile = {
  id: string;
  tag: string;
  image: string;
  /** which of the export's two fixed masonry columns this tile lives in */
  col: 0 | 1;
  /** the export bakes the tag and comment glyph into the image itself */
  tagged?: boolean;
  /** spans two grid rows — the export's tall half of the masonry pair */
  tall?: boolean;
};

/* ------------------------------------------------------------- people */

export const sofia: Person = {
  name: "Sofia Reyes",
  handle: "@sof",
  avatar: "/img/avatar-sofia.jpg",
  verified: true,
};

export const maya: Person = {
  name: "Maya Chen",
  handle: "@maya.wav",
  avatar: "/img/avatar-maya.jpg",
  verified: true,
};

export const dario: Person = {
  name: "Dario Fontaine",
  handle: "@dario",
  avatar: "/img/avatar-dario-sm.jpg",
};

export const kai: Person = {
  name: "Kai Kapoor",
  handle: "@kai.jpg",
  avatar: "/img/avatar-kai-sm.jpg",
  verified: true,
};

export const juno: Person = {
  name: "Juno Park",
  handle: "@juno",
  avatar: "/img/avatar-juno-head.jpg",
  verified: true,
};

/* ------------------------------------------------------------ home feed */

export const stories: Story[] = [
  { id: "you", label: "You", avatar: "/img/avatar-sofia.jpg", variant: "you" },
  { id: "mia", label: "mia.wav", avatar: "/img/avatar-mia-big.jpg", variant: "live" },
  { id: "dario", label: "dario", avatar: "/img/avatar-rats.jpg" },
  { id: "juno", label: "juno", avatar: "/img/avatar-juno-big.jpg" },
  { id: "kai", label: "kai.jpg", avatar: "/img/avatar-kai-big.jpg", variant: "live" },
];

export const posts: Post[] = [
  {
    id: "p1",
    author: maya,
    time: "2m",
    body: "dropped the backstage dump from last night — which edit should make the cover? reply with 1, 2 or 3",
    image: "/img/post-photobooth.jpg",
    stats: { comments: "184", reposts: "312", likes: "2.4k" },
  },
  {
    id: "p2",
    author: dario,
    time: "18m",
    body: "Hot take: group chats are the new comment sections. Moving all my drops to broadcast channels this week.",
    stats: { comments: "96", reposts: "45", likes: "891" },
  },
  {
    id: "p3",
    author: kai,
    time: "1h",
    body: "Golden hour rooftop set is LIVE — join the Loop room, bringing 3 friends on stage",
    image: "/img/post-rooftop.jpg",
    stats: { comments: "402", reposts: "1.1k", likes: "5.1k" },
  },
];

/* -------------------------------------------------------------- explore */

export const exploreFilters = ["Trending", "Music", "Fashion", "Food", "Nightlife"];

/**
 * Two fixed columns, each one tall tile (503x923) and two short ones
 * (501x449): the tall tile is exactly two short rows plus the 8.3pt gap.
 *   left  — fitcheck / live / food
 *   right — morning / loop / portrait
 */
export const tiles: Tile[] = [
  { id: "t1", tag: "#fitcheck", image: "/img/tile-fitcheck.jpg", col: 0, tagged: true, tall: true },
  { id: "t2", tag: "#morning", image: "/img/tile-morning.jpg", col: 1, tagged: true },
  { id: "t3", tag: "#loop", image: "/img/tile-loop.jpg", col: 1, tagged: true },
  { id: "t4", tag: "#live", image: "/img/tile-live.jpg", col: 0, tagged: true },
  { id: "t5", tag: "#food", image: "/img/tile-food.jpg", col: 0, tagged: true },
  { id: "t6", tag: "#portrait", image: "/img/tile-portrait.jpg", col: 1, tagged: true, tall: true },
];

/* ---------------------------------------------------------------- chats */

export const channels: Channel[] = [
  {
    id: "c1",
    name: "Maya VIP Room",
    preview: "New drop Friday — presale link i...",
    members: "12.4k members",
  },
  {
    id: "c2",
    name: "Rooftop Radio",
    preview: "Kai is live: golden hour set",
    members: "8.1k members",
  },
];

export const chatRows: ChatRow[] = [
  {
    id: "m1",
    person: { name: "Juno Park", handle: "@juno", avatar: "/img/avatar-juno-big.jpg" },
    tag: "Close",
    preview: "sent you a Chirp: the rooftop set??",
    time: "2m",
    unread: 2,
    online: true,
  },
  {
    id: "m2",
    person: { name: "Studio Rats", handle: "@rats", avatar: "/img/avatar-rats.jpg" },
    tag: "Group",
    preview: "dario: stems are in the drive",
    time: "14m",
    unread: 5,
    online: true,
  },
  {
    id: "m3",
    person: { name: "Mia Lin", handle: "@mia.wav", avatar: "/img/avatar-mia-big.jpg" },
    preview: "You reacted to her Loop",
    time: "1h",
    camera: true,
    online: true,
  },
  {
    id: "m4",
    person: { name: "Sofia Reyes", handle: "@sof", avatar: "/img/avatar-sofia-big.jpg" },
    preview: "typing...",
    time: "2h",
    camera: true,
    online: true,
  },
  {
    id: "m5",
    person: { name: "Kai Kapoor", handle: "@kai.jpg", avatar: "/img/avatar-kai-big.jpg" },
    tag: "Channel",
    preview: "Invite: join my broadcast channel",
    time: "5h",
    unread: 1,
  },
];

export const chatFilters = ["All", "Unread", "Groups", "Channels"];

/* ------------------------------------------------------------- activity */

export const activityFilters = ["All", "Likes", "Replies", "Channels"];

export const activity: ActivityItem[] = [
  {
    id: "a1",
    tone: "brand",
    icon: "heart",
    title: "Maya and 2.1k others liked your Chirp",
    meta: "“rooftop fit check — yes or no?” · 2m",
  },
  {
    id: "a2",
    tone: "zest",
    icon: "repost",
    title: "Kai reposted your Loop",
    meta: "golden hour set teaser · 18m",
  },
  {
    id: "a3",
    tone: "info",
    icon: "userplus",
    title: "Dario started following you",
    meta: "12k followers · 1h",
  },
  {
    id: "a4",
    tone: "ink",
    icon: "megaphone",
    title: "Maya VIP Room: presale codes are live",
    meta: "channel · 2h",
  },
];

/* -------------------------------------------------------------- profile */

export const profile = {
  person: sofia,
  meta: "@sof · she/her · CDMX / LA",
  bio: "posting fits, film dumps & voice-note rants · broadcast channel below",
  stats: [
    { label: "Chirps", value: "1,284" },
    { label: "Followers", value: "89k" },
    { label: "Following", value: "412" },
  ],
  tabs: ["Chirps", "Media", "Loops"],
  channel: {
    title: "sof's channel · 22k members",
    subtitle: "daily voice notes + presale codes",
  },
};

export const profilePost: Post = {
  id: "pp1",
  author: sofia,
  time: "3h",
  body: "film dump: sunday market run. slide 3 is my whole personality now",
  image: "/img/post-market.jpg",
  stats: { comments: "88", reposts: "41", likes: "1.2k" },
};

/* --------------------------------------------------------- conversation */

export const conversation = {
  with: juno,
  status: "Active now · replies fast",
  dateDivider: "Today 9:32 AM",
  shared: {
    image: "/img/shared-loop.jpg",
    badge: "SHARED LOOP",
    title: "Rooftop set — Sat 8PM, you +2 on the list",
  },
  messages: [
    {
      id: "c1",
      from: "them",
      body: "ok this lineup is actually insane?? did you see kai added a second date",
      time: "9:32",
    },
    {
      id: "c2",
      from: "me",
      body: "YES — I grabbed us presale codes. Check the channel post I forwarded",
      time: "9:35",
    },
    {
      id: "c3",
      from: "them",
      body: "you're the best. also — vote on maya's cover? I said #2, the flash one",
      time: "9:36",
    },
    { id: "c4", from: "me", image: "/img/msg-band.jpg" },
    { id: "c5", from: "me", body: "Noooo #1 supremacy. Sending you my edit", time: "9:37" },
    {
      id: "c6",
      from: "them",
      body: "WAIT that's actually hard. switching my vote rn",
      time: "9:38",
    },
  ] satisfies Message[],
};
