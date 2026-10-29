import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search, state } = useLocation();

  useEffect(() => {
    // In-page filters (library tabs) pass keepScroll to stay where they are
    if (state?.keepScroll) return;
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "smooth",
    }); // scroll to the top
  }, [pathname, search, state]); // run every time the route changes

  return null;
}
