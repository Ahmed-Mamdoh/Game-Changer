import { FaArrowAltCircleDown, FaGamepad } from "react-icons/fa";
import Background from "./Background";
import background from "../assets/image.png";
import { useNavigate } from "react-router-dom";
import { LogIn, LogInIcon } from "lucide-react";

function HeroSection({ sectionId }) {
  const navigate = useNavigate();

  const supabaseToken =
    localStorage.getItem("sb-kapovyqqncfsoangqppi-auth-token") || {};

  const userName = JSON.parse(supabaseToken)?.user?.user_metadata?.username;

  function handleScroll(id) {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <>
      <div className="relative">
        <img
          src={background}
          alt="background"
          className="h-[91vh] w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center gap-y-8">
        {userName ? (
          <div className="font-heading flex flex-col gap-2 text-center font-semibold text-gray-200">
            <span className="text-3xl">Welcome Back</span>
            <span className="text-6xl">{userName}</span>
          </div>
        ) : (
          <>
            <h1 className="font-heading text-center text-5xl font-bold text-white md:text-nowrap">
              Game Changer
            </h1>
            <div className="flex w-full items-center justify-between gap-3">
              <button
                className="bg-accent-primary flex w-full cursor-pointer items-center justify-center gap-2 rounded-md px-2 py-2 text-xl font-black text-gray-950 transition-all hover:rounded-xl"
                onClick={() => navigate("/auth")}
              >
                <FaGamepad className="h-7 w-7" />
                <span>Sign Up</span>
              </button>
              <button
                className="bg-bg-secondary w-full cursor-pointer rounded-md px-2 py-2 text-lg text-nowrap text-gray-100 transition-all hover:rounded-xl"
                onClick={() => handleScroll(sectionId)}
              >
                Continue as Guest
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default HeroSection;
