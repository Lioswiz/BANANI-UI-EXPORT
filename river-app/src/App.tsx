import { useState, type ReactNode } from "react";

import { RightRail } from "./components/RightRail";
import { Sidebar } from "./components/Sidebar";
import { StoryViewer } from "./components/StoryViewer";
import { TabBar, type TabKey } from "./components/TabBar";
import { Toast } from "./components/Toast";
import { WaveFilter } from "./components/WaveFilter";
import { activity, type Story } from "./lib/data";
import { actions } from "./lib/store";
import { Activity } from "./screens/Activity";
import { Chats } from "./screens/Chats";
import { Conversation } from "./screens/Conversation";
import { Explore } from "./screens/Explore";
import { HomeFeed } from "./screens/HomeFeed";
import { Profile } from "./screens/Profile";

/** Screens that stack on top of the tab they were opened from. */
type Overlay = null | "activity" | "conversation";

/**
 * One responsive shell for every width. The export is a 375pt phone screen, so
 * below `lg` this is that screen edge to edge — no frame, no letterboxing.
 * Above `lg` the tab bar's four tabs and the header's Activity move out to a
 * left sidebar and the feed becomes a centred column; on `xl` and up a right
 * rail of trends, channels and follow suggestions fills the leftover gutter.
 * The column itself never stretches past `max-w-[600px]`, so a 4K display
 * reads the same as a laptop.
 */
export default function App() {
  const [tab, setTab] = useState<TabKey>("home");
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [story, setStory] = useState<Story | null>(null);

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
    screen = <Activity onActivity={openActivity} onMessages={openMessages} onNavigate={go} />;
    screenKey = "activity";
  } else if (overlay === "conversation") {
    screen = <Conversation onBack={() => setOverlay(null)} />;
    screenKey = "conversation";
  } else if (tab === "home") {
    screen = (
      <HomeFeed
        onActivity={openActivity}
        onMessages={openMessages}
        onOpenStory={setStory}
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
    screen = <Profile onBack={() => go("home")} onOpenChats={openMessages} />;
    screenKey = "profile";
  }

  return (
    <div className="relative flex h-dvh w-full overflow-hidden bg-cream">
      <WaveFilter />
      <Sidebar
        active={overlay ? "home" : tab}
        onNavigate={go}
        onActivity={openActivity}
        unread={activity.length}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* key resets scroll position whenever the screen changes */}
        <main key={screenKey} className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[600px] pb-2">{screen}</div>
        </main>

        <TabBar
          active={tab}
          onChange={go}
          onCompose={() => {
            go("home");
            actions.requestCompose();
          }}
        />
      </div>

      <RightRail onOpenChannel={openMessages} />

      <Toast />

      {story && <StoryViewer story={story} onClose={() => setStory(null)} />}
    </div>
  );
}
