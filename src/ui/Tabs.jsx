import Tab from "./Tab";

function Tabs() {
  const supabaseToken = localStorage.getItem(
    "sb-kapovyqqncfsoangqppi-auth-token",
  );

  return (
    <nav
      role="tablist"
      className="hidden items-center justify-center gap-x-3 lg:flex"
    >
      <Tab to="/allGames" sectionName="All" lineStartAnimation="left" />
      <Tab to="/freeGames" sectionName="Free" lineStartAnimation="center" />
      <Tab
        to="/upcomingGames"
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
