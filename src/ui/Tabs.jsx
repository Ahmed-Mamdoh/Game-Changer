import { UserToken } from "@/hooks/useUserToken";
import Tab from "./Tab";

function Tabs() {
  const supabaseToken = UserToken();

  return (
    <nav
      role="tablist"
      className="hidden items-center justify-center gap-x-3 lg:flex"
    >
      <Tab to="/games/allGames" sectionName="All" lineStartAnimation="left" />
      <Tab
        to="/games/freeGames"
        sectionName="Free"
        lineStartAnimation="center"
      />
      <Tab
        to="/games/upcomingGames"
        sectionName="Upcoming"
        lineStartAnimation="right"
      />
      {supabaseToken && (
        <Tab to="/account" sectionName="Account" lineStartAnimation="right" />
      )}
    </nav>
  );
}

export default Tabs;
