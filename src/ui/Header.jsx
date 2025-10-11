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
  const supabaseToken = localStorage.getItem(
    "sb-kapovyqqncfsoangqppi-auth-token",
  );

  function handleSearch() {
    if (!search) return;
    navigate(`/allGames?search=${search}`);
  }

  return (
    <div className="from-secondary/20 to-secondary/40 border-base-100/20 z-50 flex w-full items-center justify-center border-b bg-linear-to-b shadow-md backdrop-blur-md">
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
            id="search"
            onChange={(e) => setSearch(e.target.value)}
            className="bg-base-200 text-base-content placeholder:text-base-content/60 focus:ring-primary/50 active:ring-primary/70 w-full rounded-lg px-4 py-2 text-sm focus:ring-2 focus:outline-none active:ring-2 md:text-base"
          />
          <button
            className="btn text-primary-content bg-primary text-md hidden border-none shadow-xl transition-all duration-300 md:block"
            onClick={handleSearch}
            name="search-button"
            role="button"
            aria-label="Search"
            id="search-button"
            aria-labelledby="search-button"
          >
            <FaSearch />
          </button>

          {!supabaseToken && (
            <button
              className="btn text-primary-content bg-primary text-md hidden border-none shadow-xl transition-all duration-300 md:block"
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
              Login
            </button>
          )}

          <Drawer />
          <label
            htmlFor="my-drawer-4"
            className="text-primary-content bg-primary text-md flex items-center justify-center rounded-md border-none px-1 py-1 shadow-xl transition-all duration-300 lg:hidden"
          >
            <Menu className="h-8 w-8" />
          </label>
        </div>
      </div>
    </div>
  );
}

export default Header;
