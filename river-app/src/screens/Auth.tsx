import { useId, useState, type FormEvent, type ReactNode } from "react";

import { BetaChip, LogoMark } from "../components/primitives";
import { actions } from "../lib/store";

type Mode = "signin" | "signup";

/**
 * The gate in front of the shell. It is written in the export's own language —
 * cream ground, ink pills, the "rv" mark and lime beta chip — so signing in
 * reads as part of the app rather than as a page bolted on front.
 *
 * One screen covers both jobs, since the two differ only by two fields and a
 * few words: someone without an account taps through to "Create account" and
 * the same form grows a name and a handle. That keeps the flow one tap deep
 * rather than sending anybody to a second route.
 */
export function Auth() {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = mode === "signup";

  function swap() {
    setMode(signup ? "signin" : "signup");
    setError(null);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const problem = signup
      ? actions.signUp({ name, handle, email, password })
      : actions.signIn(email, password);
    setError(problem);
  }

  return (
    <div className="min-h-dvh bg-cream px-6 py-12">
      <div className="mx-auto flex min-h-[calc(100dvh-6rem)] w-full max-w-[400px] flex-col justify-center">
        <div className="flex items-center gap-2">
          <LogoMark />
          <span className="text-[22px] leading-none font-extrabold tracking-[-0.03em]">
            river
          </span>
          <BetaChip />
        </div>

        <h1 className="mt-8 text-[28px] leading-[1.12] font-extrabold tracking-[-0.03em]">
          {signup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-[14px] leading-[20px] font-medium text-muted">
          {signup
            ? "Pick a name and a handle. You can change both later from your profile."
            : "Sign in to pick up your feed, your chats and your Loops."}
        </p>

        {/* noValidate: every rule lives in the store so the message is styled
            like the rest of the app. Left to the browser, an invalid address
            silently blocks the submit and raises its own unstyled bubble. */}
        <form noValidate onSubmit={submit} className="mt-7 flex flex-col gap-[14px]">
          {signup && (
            <Field
              label="Full name"
              value={name}
              onChange={setName}
              placeholder="Sofia Reyes"
              autoComplete="name"
              autoFocus
            />
          )}
          {signup && (
            <Field
              label="Handle"
              value={handle}
              onChange={setHandle}
              placeholder="sof"
              prefix="@"
              autoComplete="username"
            />
          )}
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@mail.com"
            autoComplete="email"
            autoFocus={!signup}
          />
          <Field
            label="Password"
            type={reveal ? "text" : "password"}
            value={password}
            onChange={setPassword}
            placeholder={signup ? "At least 6 characters" : "Your password"}
            autoComplete={signup ? "new-password" : "current-password"}
            trailing={
              <button
                type="button"
                onClick={() => setReveal((r) => !r)}
                aria-label={reveal ? "Hide password" : "Show password"}
                className="-mr-1 shrink-0 rounded-full px-2 py-1 text-[12px] font-bold text-muted transition hover:text-ink"
              >
                {reveal ? "Hide" : "Show"}
              </button>
            }
          />

          {error && (
            <p
              role="alert"
              className="rounded-[12px] bg-brand/8 px-3 py-[10px] text-[13px] leading-[18px] font-semibold text-brand"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-1 h-12 rounded-full bg-ink text-[15px] font-bold text-white transition hover:bg-ink/90 active:scale-[0.98]"
          >
            {signup ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-[14px] font-medium text-muted">
          {signup ? "Already have an account?" : "New to river?"}{" "}
          <button
            type="button"
            onClick={swap}
            className="rounded font-bold text-brand transition hover:underline"
          >
            {signup ? "Sign in" : "Create one"}
          </button>
        </p>

        <p className="mt-8 text-center text-[12px] leading-[17px] font-medium text-faint">
          Demo build — accounts stay in this browser and nothing is sent
          anywhere.
        </p>
      </div>
    </div>
  );
}

/** Labelled field: a white box on the cream ground, with room for a prefix
    (the handle's "@") and a trailing control (the password reveal).
    The label is tied to the input by id rather than by wrapping, so the reveal
    button doesn't end up inside the field's accessible name. */
function Field({
  label,
  value,
  onChange,
  prefix,
  trailing,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  trailing?: ReactNode;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "className" | "id"
>) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-[6px] block text-[12px] font-bold text-muted">
        {label}
      </label>
      <div className="flex h-12 items-center gap-[2px] rounded-[14px] border border-hairline bg-surface px-[15px] transition focus-within:border-brand/45 focus-within:ring-4 focus-within:ring-brand/10">
        {prefix && (
          <span className="text-[15px] font-medium text-muted">{prefix}</span>
        )}
        <input
          {...rest}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-ink outline-none placeholder:text-faint"
        />
        {trailing}
      </div>
    </div>
  );
}
