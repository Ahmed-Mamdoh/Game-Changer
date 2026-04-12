import { useState } from "react";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";

import Tabs from "./Tabs";
import Drawer from "./Drawer";
import { Menu } from "lucide-react";

function Header() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const supabaseToken = localStorage.getItem(
    "sb-kapovyqqncfsoangqppi-auth-token",
  );

  function handleSearch() {
    if (!search) return;
    navigate(`/allGames?search=${search}`);
  }

  return (
    <nav className="absolute top-0 z-50 flex w-full items-center justify-center bg-transparent shadow-md backdrop-blur-xs">
      <div className="flex w-full items-center gap-x-3 px-5 py-3 sm:grid md:px-5 lg:grid-cols-3 lg:px-20 xl:px-40">
        <Logo />
        <Tabs />
        <div className="flex w-full items-center gap-x-2 md:gap-x-3">
          <div
            className="text-text-primary border-obsidian-border focus-within:border-pulse-primary/80 
            z-10 flex w-full  items-center gap-2 rounded-full border-1 
          bg-[#2f2f3280] px-2 py-1.5 text-sm transition-colors"
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
              className="placeholder:text-text-secondary/60 w-full border-0 focus:outline-none"
            />
          </div>

          {!supabaseToken && (
            <button
              className="text-text-primary bg-pulse-secondary hover:bg-pulse-primary/80
              md:text-md cursor-pointer rounded-full border-none px-3
              py-2 text-sm text-nowrap shadow-xl
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
            className=" bg-pulse-secondary text-md flex items-center justify-center rounded-full  border-none p-2 shadow-xl transition-all duration-300 lg:hidden"
          >
            <Menu className="h-5 w-5 md:h-8 md:w-8" />
          </label>
        </div>
      </div>
    </nav>
  );
}

export default Header;
