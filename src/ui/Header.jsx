import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search } from "lucide-react";

import Tabs from "./Tabs";
import Drawer from "./Drawer";
import { UserToken } from "@/hooks/useUserToken";

function Header() {
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const supabaseToken = UserToken();
  const username = supabaseToken?.user?.user_metadata?.username;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ctrl/Cmd + K or "/" focuses search
  useEffect(() => {
    function onKey(e) {
      const typing = ["INPUT", "TEXTAREA"].includes(e.target.tagName);
      if (
        (e.key === "k" && (e.ctrlKey || e.metaKey)) ||
        (e.key === "/" && !typing)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const query = search.trim();
    if (!query) return;
    navigate(`/games/allGames?search=${encodeURIComponent(query)}`);
    inputRef.current?.blur();
  }

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-200 ${
        scrolled
          ? "bg-bg-base/90 border-stroke-subtle border-b backdrop-blur-md"
          : "border-b border-transparent bg-gradient-to-b from-black/60 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 md:gap-6 md:px-8">
        <Logo />
        <Tabs />

        <form
          role="search"
          onSubmit={handleSearch}
          className="border-stroke-subtle focus-within:border-stroke-brand ml-auto flex h-9 w-full max-w-72 items-center gap-2 rounded-md border bg-black/40 px-2.5 backdrop-blur-md transition-colors"
        >
          <Search className="text-text-muted h-4 w-4 shrink-0" />
          <label htmlFor="search" className="sr-only">
            Search games
          </label>
          <input
            ref={inputRef}
            type="search"
            autoComplete="off"
            placeholder="Search games"
            value={search}
            id="search"
            onChange={(e) => setSearch(e.target.value)}
            className="placeholder:text-text-muted w-full min-w-0 border-0 bg-transparent text-sm focus:outline-none"
          />
          <kbd className="text-text-muted border-stroke-subtle hidden rounded-sm border px-1.5 text-xs whitespace-nowrap md:block">
            Ctrl K
          </kbd>
        </form>

        {supabaseToken ? (
          <Link
            to="/account"
            className="bg-bg-chip text-text-main hidden h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold uppercase sm:flex"
            aria-label="Your library"
            title="Your library"
          >
            {username?.[0] || "G"}
          </Link>
        ) : (
          <button
            className="btn-primary h-9 px-4"
            onClick={() => {
              localStorage.removeItem("sb-kapovyqqncfsoangqppi-auth-token");
              navigate("/auth");
            }}
          >
            Sign in
          </button>
        )}

        <Drawer />
        <label
          htmlFor="my-drawer-4"
          aria-label="Open menu"
          className="text-text-main flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md hover:bg-white/[0.08] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </label>
      </div>
    </header>
  );
}

export default Header;
