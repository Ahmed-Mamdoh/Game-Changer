import { Link, useNavigate } from "react-router-dom";
import background from "../assets/space.png";
import sts2 from "../assets/STS2.png";
import sts2Poster from "../assets/STS2-Poster.webp";

function HeroSection() {
  const navigate = useNavigate();
  return (
    <>
      <div className="relative">
        <img
          src={background}
          alt="background"
          className="h-[100dvh] w-full mask-b-from-50% mask-b-to-transparent object-cover object-top"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div
          className="absolute top-1/2 left-1/2 flex h-full w-full
        -translate-x-1/2 -translate-y-1/2 transform flex-col items-center gap-y-8"
        >
          <div className="flex h-full w-full items-center justify-center px-4">
            <div
              className="relative h-[70%] w-[95%] cursor-pointer transition-all duration-500
            hover:scale-102 sm:mt-10 sm:h-[80%] sm:w-[80%]"
              onClick={() => navigate("/game/296831")}
            >
              <img
                src={sts2}
                alt="the-witcher"
                className=" hidden h-full w-full rounded-2xl object-cover sm:block"
                fetchPriority="high"
              />
              <img
                src={sts2Poster}
                alt="the-witcher"
                className=" block h-full w-full rounded-2xl object-cover sm:hidden"
                fetchPriority="high"
              />

              <div
                className="from-pulse-primary/50 pointer-events-none absolute
                  inset-0 rounded-2xl bg-gradient-to-t via-transparent to-transparent
                  mix-blend-multiply"
              />
              <span
                className="bg-pulse-primary/90 absolute -top-4 left-6
                  rounded-full px-4 py-1.5 text-sm font-medium text-white shadow-lg
                  backdrop-blur-sm"
              >
                Editor's Pick
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeroSection;
