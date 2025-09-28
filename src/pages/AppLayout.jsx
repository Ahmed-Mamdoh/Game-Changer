import { Outlet } from "react-router-dom";
import Header from "../ui/Header";
import ScrollToTop from "@/ui/ScrollToTop";

function AppLayout() {
  return (
    <div>
      <ScrollToTop />
      <Header />
      <Outlet />
    </div>
  );
}

export default AppLayout;
