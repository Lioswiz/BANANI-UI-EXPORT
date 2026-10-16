/**
 * Tiny app-wide store. Everything the mock screens can change lives here so it
 * survives navigating between tabs (local state would reset on unmount).
 *
 * Deliberately not a context: `useSyncExternalStore` over a module-level object
 * is a dozen lines, needs no provider in the tree, and can be read from any
 * component without prop drilling. Screen content is in memory only — a reload
 * resets the app to its exported appearance — with one exception: the signed-in
 * account, which has to outlive a reload or "log out" would mean nothing.
 */
import { useSyncExternalStore } from "react";

import {
  conversation,
  profile as profileSeed,
  type Message,
  type Post,
} from "./data";

export type Toast = { id: number; text: string };

/** A local account. There is no backend — see `signIn` / `signUp` below. */
export type Account = { name: string; handle: string; email: string };

export type AppState = {
  /** null while signed out, which is when the shell gives way to the gate */
  account: Account | null;
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

/* ------------------------------------------------------------------ auth */

const SESSION_KEY = "river.session";
const ACCOUNT_KEY = "river.account";

/** Storage can throw outright in a private window, hence the guards. */
function readStored(key: string): Account | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const a = JSON.parse(raw) as Partial<Account>;
    return a?.email && a.name && a.handle ? (a as Account) : null;
  } catch {
    return null;
  }
}

function writeStored(key: string, account: Account | null) {
  try {
    if (account) localStorage.setItem(key, JSON.stringify(account));
    else localStorage.removeItem(key);
  } catch {
    // no storage: nothing survives the tab
  }
}

/** The live session. Gone the moment you sign out. */
const readSession = () => readStored(SESSION_KEY);
const writeSession = (a: Account | null) => writeStored(SESSION_KEY, a);

/**
 * The account this device knows, kept separately from the session: signing out
 * drops the session but not the name and handle, so signing back in as the same
 * address returns you to the same profile rather than a stranger derived from
 * the email.
 */
const readAccount = () => readStored(ACCOUNT_KEY);
const writeAccount = (a: Account | null) => writeStored(ACCOUNT_KEY, a);

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * The export's profile copy is Sofia's, so a signed-in account takes over just
 * the parts of it that are identity — the name, and the handle at the front of
 * the meta line. The bio, stats and channel stay as the export drew them.
 */
function withHandle(meta: string, handle: string) {
  const rest = meta.indexOf(" · ");
  return `@${handle}${rest === -1 ? "" : meta.slice(rest)}`;
}

/** "sofia.reyes@mail.com" -> "Sofia Reyes", so a sign-in still has a name. */
function nameFromEmail(email: string) {
  const words = email
    .split("@")[0]
    .split(/[._\-+]+/)
    .filter(Boolean);
  const name = words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return name || "River user";
}

/** The whole store, seeded for whoever is signed in. */
function seedState(account: Account | null): AppState {
  return {
    account,
    liked: {},
    reposted: {},
    replies: {},
    joined: {},
    following: {},
    feed: [],
    name: account?.name ?? profileSeed.person.name,
    meta: account ? withHandle(profileSeed.meta, account.handle) : profileSeed.meta,
    bio: profileSeed.bio,
    messages: conversation.messages,
    composeToken: 0,
    toast: null,
  };
}

let state: AppState = seedState(readSession());

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
  /**
   * Sign in. Any well-formed credentials are accepted — there is nothing to
   * check them against — and the account is remembered on this device so the
   * same email keeps the same name next time. Returns an error to show, or null.
   */
  signIn(email: string, password: string): string | null {
    const mail = email.trim().toLowerCase();
    if (!isEmail(mail)) return "That doesn't look like an email address.";
    if (password.length < 6) return "Passwords are at least 6 characters.";

    const known = readAccount();
    const account: Account =
      known?.email.toLowerCase() === mail
        ? known
        : { name: nameFromEmail(mail), handle: mail.split("@")[0].slice(0, 20), email: mail };

    writeAccount(account);
    writeSession(account);
    set(seedState(account));
    return null;
  },

  /** Create an account, then sign straight into it. */
  signUp(fields: { name: string; handle: string; email: string; password: string }) {
    const name = fields.name.trim();
    const handle = fields.handle.trim().replace(/^@+/, "").toLowerCase();
    const mail = fields.email.trim().toLowerCase();

    if (name.length < 2) return "Add a name people will recognise.";
    if (!/^[a-z0-9._]{2,20}$/.test(handle))
      return "Handles are 2–20 letters, numbers, dots or underscores.";
    if (!isEmail(mail)) return "That doesn't look like an email address.";
    if (fields.password.length < 6) return "Passwords are at least 6 characters.";

    const account: Account = { name, handle, email: mail };
    writeAccount(account);
    writeSession(account);
    set(seedState(account));
    return null;
  },

  signOut() {
    writeSession(null);
    // signing out is a change of person: nothing the last one did carries over
    set(seedState(null));
  },

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
      author: { ...profileSeed.person, name: state.name },
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
