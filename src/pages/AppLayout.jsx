import { Outlet, useLocation } from "react-router-dom";
import Header from "../ui/Header";
import ScrollToTop from "@/ui/ScrollToTop";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import Spinner from "../ui/Spinner";
import ChatBot from "@/features/ChatBot/ChatBot";

function AppLayout() {
  const location = useLocation();

  return (
    <div>
      <Toaster />
      <ScrollToTop />
      <Header />
      <ChatBot />
      <Suspense fallback={<Spinner />} key={location.pathname}>
        <Outlet />
      </Suspense>
    </div>
  );
}

export default AppLayout;
