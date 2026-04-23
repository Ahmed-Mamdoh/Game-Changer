import { useState } from "react";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";

import Tabs from "./Tabs";
import Drawer from "./Drawer";
import { Menu } from "lucide-react";
import { UserToken } from "@/hooks/useUserToken";

function Header() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const supabaseToken = UserToken();

  function handleSearch() {
    if (!search) return;
    navigate(`/allGames?search=${search}`);
  }

  return (
    <nav className="absolute top-0 z-50 flex w-full items-center justify-center bg-transparent shadow-md backdrop-blur-xs">
      <div className="flex w-full items-center gap-x-3 px-5 py-3 sm:grid sm:grid-cols-2 md:px-5 lg:grid-cols-3 lg:px-20 xl:px-40">
        <Logo />
        <Tabs />
        <div className="flex w-full items-center gap-x-2 md:gap-x-3">
          <div
            className="border-stroke-subtle focus-within:border-stroke-brand 
            bg-bg-surface/25 z-10 flex  w-full items-center gap-2 rounded-full 
          border-1 px-2 py-1.5 text-sm transition-colors"
          >
            <IoIosSearch className="h-5 w-5 md:h-6 md:w-6" />
            <input
              type="text"
              autoComplete="search"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search..."
              value={search}
              id="search"
              onChange={(e) => setSearch(e.target.value)}
              className="placeholder:text-text-dim w-full border-0 focus:outline-none"
            />
          </div>

          {!supabaseToken && (
            <button
              className="bg-pulse-primary  hover:bg-pulse-primary/60
              md:text-md cursor-pointer rounded-full border-none px-3
              py-2 text-sm text-nowrap 
              transition-all duration-300 md:block md:px-4.5"
              onClick={() => {
                localStorage.removeItem("sb-kapovyqqncfsoangqppi-auth-token");
                navigate("/auth");
              }}
              aria-label="Login"
              aria-labelledby="login-button"
              id="login-button"
              name="login-button"
              role="button"
            >
              Join Now
            </button>
          )}

          <Drawer />
          <label
            htmlFor="my-drawer-4"
            className="bg-pulse-primary  text-md flex items-center justify-center rounded-full  border-none px-2 py-2 transition-all duration-300 lg:hidden"
          >
            <Menu className="h-5 w-5 md:h-5 md:w-5" />
          </label>
        </div>
      </div>
    </nav>
  );
}

export default Header;
