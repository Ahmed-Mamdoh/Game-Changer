import { Outlet } from "react-router-dom";
import Header from "../ui/Header";
import ScrollToTop from "@/ui/ScrollToTop";
import { Toaster } from "react-hot-toast";

function AppLayout() {
  return (
    <div>
      <Toaster />
      <ScrollToTop />
      <Header />
      <Outlet />
    </div>
  );
}

export default AppLayout;
