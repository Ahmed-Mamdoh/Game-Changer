import { useState } from "react";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import Tabs from "./Tabs";
import Drawer from "./Drawer";
import { Menu } from "lucide-react";

function Header() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function handleSearch() {
    if (!search) return;
    navigate(`/allGames?search=${search}`);
  }

  return (
    <div className="from-accent-secondary/20 to-accent-secondary/40 z-50 flex w-full items-center justify-center border-b border-white/20 bg-linear-to-b shadow-md backdrop-blur-md">
      <div className="md-px-0 container flex items-center justify-between px-5 py-3 lg:px-20 xl:px-40">
        <Logo />
        <Tabs />
        <div className="flex items-center gap-x-3">
          <input
            type="text"
            autoComplete="search"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-bg-secondary rounded-lg px-4 py-2 text-sm text-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-violet-400 focus:outline-none active:ring-2 active:ring-violet-500 md:text-base"
          />
          <button
            className="btn text-bg-primary bg-accent-primary text-md hidden border-none shadow-xl transition-all duration-300 hover:rounded-3xl md:block"
            onClick={handleSearch}
          >
            <FaSearch />
          </button>
          <Drawer />
          <label
            htmlFor="my-drawer-4"
            className="text-bg-primary bg-accent-primary text-md flex items-center justify-center rounded-xs border-none px-1 py-1 shadow-xl transition-all duration-300 md:hidden"
          >
            <Menu className="h-8 w-8" />
          </label>
        </div>
      </div>
    </div>
  );
}

export default Header;
