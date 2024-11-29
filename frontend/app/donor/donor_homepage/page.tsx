"use client";

import { HomeSection } from "./components/home";
import { RequestsSection } from "./components/requests"; // Renamed from InboxSection
import { MyPostsSection } from "./components/my-posts"; // New component
import { CalendarSection } from "./components/calendar";
import { SettingsSection } from "./components/settings";
import { useSection } from "../../../context/SectionContext";
import { useUser } from "../../../context/UserContext"; // Import the useUser hook

export default function DonorHomepage() {
  const { activeSection } = useSection();
  const { email } = useUser();

  const renderSection = () => {
    switch (activeSection) {
      case "Home":
        return <HomeSection />;
      case "Calendar":
        return <CalendarSection />;
      case "Requests":
        return email ? (
          <RequestsSection donorEmail={email} />
        ) : (
          <div>Please log in to view requests.</div>
        );
      case "My Posts":
        return <MyPostsSection />; // New component
      case "Settings":
        return <SettingsSection />;
      default:
        return <HomeSection />;
    }
  };

  return <div className="w-full h-full">{renderSection()}</div>;
}
