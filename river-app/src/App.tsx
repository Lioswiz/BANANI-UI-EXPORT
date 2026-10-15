import { useState, type ReactNode } from "react";

import { TabBar, type TabKey } from "./components/TabBar";
import { Activity } from "./screens/Activity";
import { Chats } from "./screens/Chats";
import { Conversation } from "./screens/Conversation";
import { Explore } from "./screens/Explore";
import { HomeFeed } from "./screens/HomeFeed";
import { Profile } from "./screens/Profile";

/** Screens that stack on top of the tab they were opened from. */
type Overlay = null | "activity" | "conversation";

/**
 * Phone-frame shell. The export is a 375pt screen at 3x, so the frame is a
 * fixed 375px column that scrolls internally while the tab bar stays put.
 */
export default function App() {
  const [tab, setTab] = useState<TabKey>("home");
  const [overlay, setOverlay] = useState<Overlay>(null);

  const go = (next: TabKey) => {
    setTab(next);
    setOverlay(null);
  };
  const openActivity = () => setOverlay("activity");
  const openMessages = () => go("chats");
  const openConversation = () => setOverlay("conversation");

  let screen: ReactNode;
  let screenKey: string;

  if (overlay === "activity") {
    screen = <Activity onActivity={openActivity} onMessages={openMessages} />;
    screenKey = "activity";
  } else if (overlay === "conversation") {
    screen = <Conversation onBack={() => setOverlay(null)} />;
    screenKey = "conversation";
  } else if (tab === "home") {
    screen = (
      <HomeFeed
        onActivity={openActivity}
        onMessages={openMessages}
        onOpenStory={() => go("profile")}
      />
    );
    screenKey = "home";
  } else if (tab === "explore") {
    screen = <Explore onActivity={openActivity} onMessages={openMessages} />;
    screenKey = "explore";
  } else if (tab === "chats") {
    screen = (
      <Chats
        onActivity={openActivity}
        onMessages={openMessages}
        onOpenConversation={openConversation}
      />
    );
    screenKey = "chats";
  } else {
    screen = <Profile onBack={() => go("home")} />;
    screenKey = "profile";
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-[#e6e1d8] p-4">
      <div className="flex h-[812px] max-h-[calc(100dvh-2rem)] w-[375px] flex-col overflow-hidden rounded-[44px] border-[9px] border-ink bg-cream shadow-[0_24px_60px_rgba(20,18,25,0.28)]">
        {/* key resets scroll position whenever the screen changes */}
        <main key={screenKey} className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
          {screen}
        </main>

        <TabBar active={tab} onChange={go} onCompose={() => go("home")} />
      </div>
    </div>
  );
}
