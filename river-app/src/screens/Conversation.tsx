import { Avatar, SearchField } from "../components/primitives";
import {
  BackIcon,
  ImageIcon,
  MicIcon,
  PhoneIcon,
  SendIcon,
  VideoIcon,
} from "../lib/icons";
import { conversation, type Message } from "../lib/data";

/**
 * Geometry from the export: the shared-Loop card is full-bleed at 343x192.7pt
 * (the crop carries its own badge and caption, so nothing is overlaid), the
 * date divider sits *below* it, and photo messages are right-aligned on a
 * white polaroid rather than a dark bubble.
 */
export function Conversation({ onBack }: { onBack: () => void }) {
  const { with: person, shared } = conversation;

  return (
    <>
      <header className="flex items-center gap-3 border-b border-hairline px-4 pt-[18px] pb-3">
        <button
          type="button"
          aria-label="Back"
          onClick={onBack}
          className="shrink-0 transition active:scale-95"
        >
          <BackIcon size={22} />
        </button>

        <Avatar src={person.avatar} alt={person.name} size={40} online />

        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] leading-tight font-extrabold tracking-[-0.01em]">
            {person.name}
          </p>
          <p className="truncate text-[13px] font-semibold text-online">
            {conversation.status}
          </p>
        </div>

        <button
          type="button"
          aria-label="Voice call"
          className="grid size-[34px] shrink-0 place-items-center rounded-full border border-hairline bg-surface transition active:scale-95"
        >
          <PhoneIcon size={17} />
        </button>
        <button
          type="button"
          aria-label="Video call"
          className="grid size-[34px] shrink-0 place-items-center rounded-full border border-hairline bg-surface transition active:scale-95"
        >
          <VideoIcon size={17} />
        </button>
      </header>

      <div className="flex flex-col gap-3 px-4 pt-4 pb-2">
        <img
          src={shared.image}
          alt={shared.title}
          className="w-full rounded-[20px] object-cover"
        />

        <p className="pb-1 text-center text-[12px] font-semibold text-muted">
          {conversation.dateDivider}
        </p>

        {conversation.messages.map((m) => (
          <Bubble key={m.id} message={m} avatar={person.avatar} name={person.name} />
        ))}
      </div>

      <div className="sticky bottom-0 flex items-center gap-[10px] border-t border-hairline bg-cream px-4 py-3">
        <SearchField
          placeholder="Message Juno..."
          className="flex-1"
          trailing={
            <div className="flex shrink-0 items-center gap-[10px] text-ink">
              <ImageIcon size={21} />
              <MicIcon size={21} />
            </div>
          }
        />
        <button
          type="button"
          aria-label="Send"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-white transition active:scale-95"
        >
          <SendIcon size={19} />
        </button>
      </div>
    </>
  );
}

function Bubble({
  message,
  avatar,
  name,
}: {
  message: Message;
  avatar: string;
  name: string;
}) {
  const mine = message.from === "me";

  // a photo arrives as a white polaroid, not a bubble tinted by sender
  if (message.image) {
    return (
      <div className="flex justify-end">
        <img
          src={message.image}
          alt=""
          className="w-[212px] rounded-[16px] bg-surface p-[14px] shadow-[0_2px_8px_rgba(20,18,25,0.10)]"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-2 ${mine ? "flex-row-reverse" : ""}`}>
      {!mine && (
        <img
          src={avatar}
          alt={name}
          className="size-[27px] shrink-0 rounded-full object-cover"
        />
      )}

      <div className={`flex max-w-[76%] flex-col ${mine ? "items-end" : "items-start"}`}>
        <div className="relative">
          <div
            className={`rounded-[20px] px-[14px] py-[10px] text-[14px] leading-[1.35] font-medium ${
              mine
                ? "rounded-br-[7px] bg-ink text-white"
                : "rounded-bl-[7px] bg-surface text-ink shadow-[0_1px_2px_rgba(20,18,25,0.05)]"
            }`}
          >
            {message.body}
          </div>
          {!mine && (
            /* the export tails received bubbles with a detached nub */
            <span className="absolute -right-[9px] bottom-[3px] size-[13px] rounded-full border border-hairline bg-surface" />
          )}
        </div>
        {message.time && (
          <span className="mt-[5px] px-1 text-[11px] font-semibold text-muted">
            {message.time}
          </span>
        )}
      </div>
    </div>
  );
}
