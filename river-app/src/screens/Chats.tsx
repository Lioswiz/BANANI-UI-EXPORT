import { useState } from "react";

import { AppHeader } from "../components/AppHeader";
import {
  Avatar,
  Chip,
  PillButton,
  Rail,
  SearchField,
  SectionHeading,
  Tag,
} from "../components/primitives";
import { CameraIcon, MegaphoneIcon } from "../lib/icons";
import { channels, chatFilters, chatRows } from "../lib/data";

export function Chats({
  onActivity,
  onMessages,
  onOpenConversation,
}: {
  onActivity: () => void;
  onMessages: () => void;
  onOpenConversation: () => void;
}) {
  const [filter, setFilter] = useState(chatFilters[0]);

  return (
    <>
      <AppHeader title="chats" onActivity={onActivity} onMessages={onMessages} />

      <div className="px-4">
        <SearchField placeholder="Search chats, channels, people" />
      </div>

      <Rail className="px-4 pt-[17px] pb-1">
        {chatFilters.map((f) => (
          <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f}
          </Chip>
        ))}
      </Rail>

      <div className="px-4 pt-[14px]">
        <SectionHeading>Channels you follow</SectionHeading>
      </div>

      <div className="flex flex-col gap-2 px-4 pt-[7px]">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="flex items-center gap-3 rounded-[20px] border border-hairline bg-surface p-3"
          >
            <div className="grid size-12 shrink-0 place-items-center rounded-[16px] bg-ink text-white">
              <MegaphoneIcon size={21} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-[6px]">
                <span className="truncate text-[14px] leading-[19px] font-extrabold tracking-[-0.01em]">
                  {channel.name}
                </span>
                <MegaphoneIcon size={13} className="shrink-0 text-ink/45" />
              </div>
              <p className="truncate text-[13px] leading-[18px] font-medium text-muted">
                {channel.preview}
              </p>
              <p className="text-[12px] leading-[17px] font-semibold text-ink/70">
                {channel.members}
              </p>
            </div>
            <PillButton size="sm">Join</PillButton>
          </div>
        ))}
      </div>

      <div className="px-4 pt-5">
        <SectionHeading>Messages</SectionHeading>
      </div>

      <div className="flex flex-col px-4">
        {chatRows.map((row) => (
          <button
            key={row.id}
            type="button"
            onClick={onOpenConversation}
            className="flex items-center gap-3 py-[10px] text-left transition active:opacity-70"
          >
            <Avatar
              src={row.person.avatar}
              alt={row.person.name}
              size={48}
              online={row.online}
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-[14px] font-extrabold tracking-[-0.01em]">
                  {row.person.name}
                </span>
                {row.tag && <Tag>{row.tag}</Tag>}
              </div>
              <p className="truncate text-[15px] font-medium text-muted">
                {row.preview}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-[6px] self-start pt-1">
              <span className="text-[13px] font-semibold text-muted">{row.time}</span>
              {row.unread ? (
                <span className="grid size-[22px] place-items-center rounded-full bg-brand text-[12px] font-bold text-white">
                  {row.unread}
                </span>
              ) : row.camera ? (
                <CameraIcon size={21} className="text-ink" />
              ) : null}
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
