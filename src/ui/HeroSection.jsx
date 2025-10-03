import { FaArrowAltCircleDown, FaGamepad } from "react-icons/fa";
import background from "../assets/image.png";
import { useNavigate } from "react-router-dom";

function HeroSection({ sectionId }) {
  const navigate = useNavigate();

  const supabaseToken =
    localStorage.getItem("sb-kapovyqqncfsoangqppi-auth-token") || "{}";

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
          <div className="font-heading text-base-content flex flex-col gap-2 text-center font-semibold">
            <span className="text-3xl">Welcome Back</span>
            <span className="text-6xl">{userName}</span>
          </div>
        ) : (
          <>
            <h1 className="font-heading text-base-content text-center text-5xl font-bold md:text-nowrap">
              Game Changer
            </h1>
            <div className="flex w-full items-center justify-between gap-3">
              <button
                className="bg-primary text-primary-content flex w-full cursor-pointer items-center justify-center gap-2 rounded-md px-2 py-2 text-xl font-black transition-all hover:rounded-xl"
                onClick={() => navigate("/auth")}
              >
                <FaGamepad className="h-7 w-7" />
                <span>Login</span>
              </button>
              <button
                className="bg-base-100 text-base-content w-full cursor-pointer rounded-md px-2 py-2 text-lg text-nowrap transition-all hover:rounded-xl"
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
