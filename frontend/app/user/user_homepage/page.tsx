"use client";

import { HomeSection } from "./components/home";
import { InboxSection } from "./components/inbox";
import { SearchSection } from "./components/search";
import { CalendarSection } from "./components/calendar";
import { ManageSection } from "./components/manage";
import { AddDeliveryBoySection } from "./components/add-deliveryboy";
import { SettingsSection } from "./components/settings";
import { useSection } from "../../../context/SectionContext";

export default function UserHomepage() {
  const { activeSection } = useSection();

  const renderSection = () => {
    switch (activeSection) {
      case "Home":
        return <HomeSection />;
      case "Inbox":
        return <InboxSection />;
      case "Search":
        return <SearchSection />;
      case "Manage":
        return <ManageSection />;
      case "Recruit":
        return <AddDeliveryBoySection />;
      case "Calendar":
        return <CalendarSection />;
      case "Settings":
        return <SettingsSection />;
      default:
        return <HomeSection />;
    }
  };

  return (
    <div className="w-full h-full overflow-hidden">
      {renderSection()}
    </div>
  );
}
