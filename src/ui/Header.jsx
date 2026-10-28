import { useEffect, useState } from "react";
import Logo from "./Logo";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

import Tabs from "./Tabs";
import Drawer from "./Drawer";
import SearchBox from "./SearchBox";
import { UserToken } from "@/hooks/useUserToken";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const supabaseToken = UserToken();
  const username = supabaseToken?.user?.user_metadata?.username;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-200 ${
        scrolled
          ? "bg-bg-surface/90 border-stroke-medium border-b shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md"
          : "border-b border-transparent bg-gradient-to-b from-black/60 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 md:gap-6 md:px-8">
        <Logo />
        <Tabs />

        <SearchBox />

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
