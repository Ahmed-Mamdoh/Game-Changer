import { Calendar, Gamepad2, Gift, Library, Sparkles } from "lucide-react";
import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserToken } from "@/hooks/useUserToken";

function Drawer() {
  const drawerCheckboxRef = useRef(null);
  const location = useLocation();
  const path = location.pathname;
  const userToken = UserToken();

  const closeDrawer = () => {
    if (drawerCheckboxRef.current) {
      drawerCheckboxRef.current.checked = false;
    }
  };

  const navItems = [
    { to: "/games/allGames", text: "Browse", icon: Gamepad2 },
    { to: "/games/forYou", text: "For you", icon: Sparkles, auth: true },
    { to: "/games/freeGames", text: "Free games", icon: Gift },
    { to: "/games/upcomingGames", text: "Upcoming", icon: Calendar },
    { to: "/account", text: "Your library", icon: Library, auth: true },
  ].filter((item) => !item.auth || userToken);

  return (
    <div className="drawer drawer-end z-50 w-0 lg:hidden">
      <input
        id="my-drawer-4"
        type="checkbox"
        className="drawer-toggle"
        ref={drawerCheckboxRef}
      />
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-4"
          aria-label="Close menu"
          className="drawer-overlay"
        ></label>

        <div className="bg-bg-surface border-stroke-subtle flex h-full w-72 flex-col border-l px-3 py-5">
          <Link
            to="/"
            onClick={closeDrawer}
            className="mb-6 px-3 text-base font-semibold"
          >
            Game Changer
          </Link>

          <nav aria-label="Main" className="flex flex-col gap-1">
            {navItems.map(({ to, text, icon }) => {
              const active = path === to;
              const NavIcon = icon;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={closeDrawer}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-11 items-center gap-3 rounded-md px-3 text-base transition-colors duration-100 ${
                    active
                      ? "text-text-main bg-white/[0.08] font-semibold"
                      : "text-text-dim hover:text-text-main hover:bg-white/[0.05]"
                  }`}
                >
                  <NavIcon
                    className={`h-5 w-5 ${active ? "text-pulse-primary" : "text-text-muted"}`}
                  />
                  {text}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Drawer;
