import { FaArrowAltCircleDown } from "react-icons/fa";
import Background from "./Background";
import background from "../assets/image.png";

function HeroSection({ sectionId }) {
  function handleScroll(id) {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }
  return (
    <>
      {/* <Background className="hidden md:block" /> */}
      <div className="relative">
        <img
          src={background}
          alt="background"
          className="h-[91vh] w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center gap-y-8">
        <h1 className="font-heading text-center text-5xl font-bold text-white md:text-nowrap">
          Game Changer
        </h1>
        <button>
          <FaArrowAltCircleDown
            className="text-accent-primary cursor-pointer text-5xl"
            onClick={() => handleScroll(sectionId)}
          />
        </button>
      </div>
    </>
  );
}

export default HeroSection;
