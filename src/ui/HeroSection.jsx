import { Link } from "react-router-dom";
import background from "../assets/space.png";
import theWitcher from "../assets/the-witcher.png";

function HeroSection() {
  const supabaseToken =
    localStorage.getItem("sb-kapovyqqncfsoangqppi-auth-token") || "{}";

  const userName = JSON.parse(supabaseToken)?.user?.user_metadata?.username;

  return (
    <>
      <div className="relative">
        <img
          src={background}
          alt="background"
          className="h-screen w-full object-cover object-top"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div
        className="absolute top-1/2 left-1/2 flex h-full w-full
      -translate-x-1/2 -translate-y-1/2 transform flex-col items-center gap-y-8"
      >
        {userName ? (
          <div className="font-heading text-base-content flex flex-col gap-2 text-center font-semibold">
            <span className="text-2xl sm:text-3xl">Welcome Back</span>
            <span className="text-5xl sm:text-7xl">{userName}</span>
          </div>
        ) : (
          <>
            <div className="flex h-full w-full items-center justify-center px-4">
              <div
                className="relative mt-10 h-[82%] w-full max-w-[67rem]
                transition-all duration-500 hover:scale-102"
              >
                <img
                  src={theWitcher}
                  alt="the-witcher"
                  className=" h-full w-full rounded-2xl object-cover"
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

                <div className="absolute top-[22%] right-10 flex w-[22rem] flex-col gap-5">
                  <h2 className="text-text-dark text-5xl font-bold">
                    The Witcher 3: Wild Hunt
                  </h2>
                  <p className="text-text-dark/80 text-2xl font-bold">
                    Experience the award-winning RPG masterpieces
                  </p>
                  <Link
                    to="/game/1942"
                    className="text-text-primary bg-pulse-secondary
                    hover:bg-pulse-primary flex w-full cursor-pointer items-center
                    justify-center gap-2 rounded-full px-2 py-2 text-xl font-bold
                    transition-all"
                  >
                    Get It Now
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default HeroSection;
