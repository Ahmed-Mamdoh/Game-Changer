import { Calendar, Gamepad2, Gift, User } from "lucide-react";
import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";

function Drawer() {
  const drawerCheckboxRef = useRef(null);
  const location = useLocation();
  const path = location.pathname;

  // Function to close the drawer
  const closeDrawer = () => {
    if (drawerCheckboxRef.current) {
      drawerCheckboxRef.current.checked = false;
    }
  };

  // Navigation items data for cleaner mapping
  const navItems = [
    {
      to: "/allGames",
      text: "All Games",
      icon: (
        <Gamepad2 className="text-pulse-accent group-hover:text-pulse-primary h-5 w-5" />
      ),
    },
    {
      to: "/freeGames",
      text: "Free Games",
      icon: (
        <Gift className="text-pulse-accent group-hover:text-pulse-primary h-5 w-5" />
      ),
    },
    {
      to: "/upcomingGames",
      text: "Upcoming",
      icon: (
        <Calendar className="text-pulse-accent group-hover:text-pulse-primary h-5 w-5" />
      ),
    },
    {
      to: "/account",
      text: "My Account",
      icon: (
        <User className="text-pulse-accent group-hover:text-pulse-primary h-5 w-5" />
      ),
    },
  ];

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
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <div className="bg-bg-base border-stroke-subtle h-full w-64 border-l px-4 py-6">
          <div className="flex h-full flex-col items-end">
            {/* Header */}
            <header className="mb-8">
              <Link
                to="/"
                onClick={closeDrawer}
                className="font-heading text-text-brand text-left text-2xl font-bold"
              >
                Game Changer
              </Link>
            </header>

            {/* Main Navigation */}
            <nav className="flex w-full flex-1 flex-col items-end gap-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.to}
                  onClick={closeDrawer}
                  className={`flex w-full items-center justify-end gap-3 rounded-full px-3 py-2 transition-all duration-200 ${path === item.to ? "bg-pulse-primary " : ""}`}
                >
                  <span className=" text-lg font-medium">{item.text}</span>
                  {item.icon}
                </Link>
              ))}
            </nav>

            {/* Footer */}
            <footer className="text-text-secondary mt-auto place-self-start pt-4 text-sm">
              <p>Tap outside to close</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Drawer;
