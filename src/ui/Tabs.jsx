import { NavLink } from "react-router-dom";
import Tab from "./Tab";

function Tabs() {
  return (
    <div className="hidden items-center justify-center gap-x-3 md:flex">
      <Tab to="/allGames" sectionName="All" lineStartAnimation="left" />
      <Tab to="/freeGames" sectionName="Free" lineStartAnimation="center" />
      <Tab
        to="/upcomingGames"
        sectionName="Upcoming"
        lineStartAnimation="right"
      />
    </div>
  );
}

export default Tabs;
