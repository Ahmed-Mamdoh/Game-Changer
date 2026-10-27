import { UserToken } from "@/hooks/useUserToken";
import Tab from "./Tab";

function Tabs() {
  const supabaseToken = UserToken();

  return (
    <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
      <Tab to="/games/allGames" sectionName="Browse" />
      {supabaseToken && <Tab to="/games/forYou" sectionName="For you" />}
      <Tab to="/games/freeGames" sectionName="Free" />
      <Tab to="/games/upcomingGames" sectionName="Upcoming" />
      {supabaseToken && <Tab to="/account" sectionName="Library" />}
    </nav>
  );
}

export default Tabs;
