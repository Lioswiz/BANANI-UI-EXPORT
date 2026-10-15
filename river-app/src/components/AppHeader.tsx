import { HeartIcon, SendIcon } from "../lib/icons";
import { BetaChip, IconButton, LogoMark, Title } from "./primitives";

/**
 * The screen header shared by home / explore / chats / activity:
 * "rv" mark + screen title + beta chip on the left, heart and send on the
 * right. The heart opens Activity (which has no tab of its own in the export).
 */
export function AppHeader({
  title,
  onActivity,
  onMessages,
  trailing,
}: {
  title: string;
  onActivity?: () => void;
  onMessages?: () => void;
  trailing?: React.ReactNode;
}) {
  return (
    <header className="flex items-center gap-3 px-4 pt-[18px] pb-3">
      <LogoMark />
      <Title>{title}</Title>
      <BetaChip />
      <div className="ml-auto flex items-center gap-2">
        {trailing}
        <IconButton label="Activity" onClick={onActivity}>
          <HeartIcon size={19} />
        </IconButton>
        <IconButton label="Messages" onClick={onMessages}>
          <SendIcon size={19} />
        </IconButton>
      </div>
    </header>
  );
}
