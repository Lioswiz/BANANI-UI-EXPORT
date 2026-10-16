import { useApp } from "../lib/store";

/**
 * Transient feedback for actions the export gives no visible result to
 * (joining a channel, sharing, posting). Sits above the tab bar on narrow
 * screens and at the bottom of the column on wide ones.
 */
export function Toast() {
  const { toast } = useApp();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none absolute inset-x-0 bottom-[86px] z-40 flex justify-center px-4 lg:bottom-8"
    >
      {toast && (
        <p
          key={toast.id}
          className="animate-toast rounded-full bg-ink/95 px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(20,18,25,0.28)] backdrop-blur-sm"
        >
          {toast.text}
        </p>
      )}
    </div>
  );
}
