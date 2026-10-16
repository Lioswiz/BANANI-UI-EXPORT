/**
 * Tiny app-wide store. Everything the mock screens can change lives here so it
 * survives navigating between tabs (local state would reset on unmount).
 *
 * Deliberately not a context: `useSyncExternalStore` over a module-level object
 * is a dozen lines, needs no provider in the tree, and can be read from any
 * component without prop drilling. State is in memory only — a reload resets
 * the app to its exported appearance.
 */
import { useSyncExternalStore } from "react";

import {
  conversation,
  profile as profileSeed,
  type Message,
  type Post,
} from "./data";

export type Toast = { id: number; text: string };

export type AppState = {
  /** post id -> liked */
  liked: Record<string, boolean>;
  reposted: Record<string, boolean>;
  /** post id -> reply bodies, oldest first */
  replies: Record<string, string[]>;
  /** channel id -> joined */
  joined: Record<string, boolean>;
  /** author handle -> following that person */
  following: Record<string, boolean>;
  /** Chirps the user posts, newest first, above the exported feed */
  feed: Post[];
  /** the profile's editable copy, seeded from the export */
  name: string;
  meta: string;
  bio: string;
  /** the open conversation's thread */
  messages: Message[];
  /** bumped by the tab bar's + button; HomeFeed focuses its composer on change */
  composeToken: number;
  toast: Toast | null;
};

let state: AppState = {
  liked: {},
  reposted: {},
  replies: {},
  joined: {},
  following: {},
  feed: [],
  name: profileSeed.person.name,
  meta: profileSeed.meta,
  bio: profileSeed.bio,
  messages: conversation.messages,
  composeToken: 0,
  toast: null,
};

const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function set(patch: Partial<AppState>) {
  state = { ...state, ...patch };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function snapshot() {
  return state;
}

export function useApp(): AppState {
  return useSyncExternalStore(subscribe, snapshot);
}

/* ------------------------------------------------------------- feedback */

let toastSeq = 0;
let toastTimer: ReturnType<typeof setTimeout> | undefined;

/** Show a transient line at the bottom of the frame. */
export function toast(text: string) {
  const id = ++toastSeq;
  set({ toast: { id, text } });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    if (state.toast?.id === id) set({ toast: null });
  }, 1900);
}

/** Copy to the clipboard without caring whether the browser allows it. */
export function copy(text: string, done: string) {
  navigator.clipboard?.writeText(text).catch(() => {});
  toast(done);
}

/* ---------------------------------------------------------------- stats */

/**
 * Counts arrive from the export already abbreviated ("2.4k", "891"), so a
 * toggle has to round-trip through a number to move the digit.
 */
export function bumpStat(value: string, delta: number): string {
  const parsed = /^([\d.]+)k$/i.exec(value.trim());
  const n = parsed ? parseFloat(parsed[1]) * 1000 : parseFloat(value);
  if (!Number.isFinite(n)) return value;
  const next = Math.max(0, n + delta * (parsed ? 1000 : 1));
  if (next >= 1000) {
    const k = (next / 1000).toFixed(1);
    return `${k.endsWith(".0") ? k.slice(0, -2) : k}k`;
  }
  return String(next);
}

/* -------------------------------------------------------------- actions */

export const actions = {
  toggleLike(id: string) {
    set({ liked: { ...state.liked, [id]: !state.liked[id] } });
  },

  toggleRepost(id: string) {
    set({ reposted: { ...state.reposted, [id]: !state.reposted[id] } });
  },

  addReply(id: string, body: string) {
    const text = body.trim();
    if (!text) return;
    set({ replies: { ...state.replies, [id]: [...(state.replies[id] ?? []), text] } });
  },

  toggleJoin(id: string) {
    const joined = !state.joined[id];
    set({ joined: { ...state.joined, [id]: joined } });
    toast(joined ? "Joined the channel" : "Left the channel");
  },

  toggleFollow(handle: string, name: string) {
    const following = !state.following[handle];
    set({ following: { ...state.following, [handle]: following } });
    toast(following ? `Following ${name}` : `Unfollowed ${name}`);
  },

  /** Publish a Chirp: it lands on top of the feed as the signed-in user. */
  publish(body: string) {
    const text = body.trim();
    if (!text) return;
    const post: Post = {
      id: `own-${Date.now()}`,
      author: profileSeed.person,
      time: "now",
      body: text,
      stats: { comments: "0", reposts: "0", likes: "0" },
    };
    set({ feed: [post, ...state.feed] });
    toast("Chirp posted");
  },

  /** Edit the profile's name / meta line / bio. */
  setProfile(patch: Partial<Pick<AppState, "name" | "meta" | "bio">>) {
    set(patch);
    toast("Profile updated");
  },

  sendMessage(body: string) {
    const text = body.trim();
    if (!text) return;
    const at = new Date();
    const time = `${at.getHours()}:${String(at.getMinutes()).padStart(2, "0")}`;
    set({
      messages: [
        ...state.messages,
        { id: `own-${Date.now()}`, from: "me", body: text, time },
      ],
    });
  },

  requestCompose() {
    set({ composeToken: state.composeToken + 1 });
  },
};
