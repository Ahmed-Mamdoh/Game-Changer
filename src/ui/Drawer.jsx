import { Menu } from "lucide-react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Drawer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted
    ? createPortal(
        <div className="drawer drawer-end z-50">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">{/* Page content here */}</div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-4"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu text-text-general min-h-full w-60 bg-gray-900 p-4">
              {/* Sidebar content here */}
              <li className="rounded-md text-xl hover:bg-gray-700">
                <Link to="/allGames">All</Link>
              </li>
              <li className="rounded-md text-xl hover:bg-gray-700">
                <Link to="/freeGames">Free</Link>
              </li>
              <li className="rounded-md text-xl hover:bg-gray-700">
                <Link to="/upcomingGames">Upcoming</Link>
              </li>
            </ul>
          </div>
        </div>,
        document.getElementById("drawer-root"),
      )
    : null;
}

export default Drawer;
