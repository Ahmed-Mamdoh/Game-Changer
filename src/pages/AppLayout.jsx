import { Outlet, useLocation } from "react-router-dom";
import Header from "../ui/Header";
import ScrollToTop from "@/ui/ScrollToTop";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import Spinner from "../ui/Spinner";
import ChatBot from "@/features/ChatBot/ChatBot";
import Footer from "@/ui/Footer";

function AppLayout() {
  const location = useLocation();

  return (
    <div className="relative min-h-[100dvh]">
      <Toaster />
      <ScrollToTop />
      <Header />
      <ChatBot />
      <Suspense fallback={<Spinner />} key={location.pathname}>
        <Outlet />
      </Suspense>
      <Footer />
    </div>
  );
}

export default AppLayout;
