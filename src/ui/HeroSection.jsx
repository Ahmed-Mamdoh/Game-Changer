import {
  ArrowDown,
  Bot,
  Gift,
  Library,
  LogIn,
  Gamepad2,
  Trophy,
  Clock,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import background from "../assets/space.png";
import { UserToken } from "@/hooks/useUserToken";
import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";

function HeroSection() {
  const navigate = useNavigate();
  const userToken = UserToken();
  const userId = userToken?.user?.id;
  const username = userToken?.user?.user_metadata?.username || "Gamer";

  const { data: userGamesData } = useGetUserGames(userId);
  const userGames = userGamesData?.user_games || [];
  // Guest Hero Section
  if (!userToken) {
    return (
      <section className="bg-bg-base relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden">
        {/* Immersive Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={background}
            alt="Space Background"
            className="h-full w-full object-cover opacity-40 mix-blend-screen"
          />
          <div className="bg-radial-at-c from-pulse-primary/20 absolute inset-0 via-transparent to-transparent opacity-60" />
          <div className="from-bg-base to-bg-base/80 absolute inset-0 bg-linear-to-t via-transparent" />
        </div>

        {/* Floating Elements (Decorative) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="bg-pulse-primary/10 absolute top-[20%] left-[10%] h-64 w-64 animate-pulse rounded-full blur-3xl" />
          <div className="bg-pulse-accent/10 absolute right-[10%] bottom-[20%] h-96 w-96 animate-pulse rounded-full blur-3xl delay-1000" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center sm:px-12 sm:pt-28 lg:px-24">
          {/* Massive Headline */}
          <h1 className="mx-auto mb-4 tracking-tighter text-balance">
            Level Up Your <br />
            <span className="from-pulse-primary via-pulse-accent to-pulse-secondary bg-linear-to-r bg-clip-text text-transparent">
              Gaming Journey
            </span>
          </h1>

          {/* Subtext */}
          <h4 className="text-text-dim mx-auto mb-8 max-w-2xl text-balance">
            Discover your next obsession. Browse thousands of games, track your
            progress, and stay ahead of every release on the planet.
          </h4>

          {/* Auth / Guest CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <button
              onClick={() => navigate("/auth")}
              className="bg-pulse-primary flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-full px-10 text-lg sm:w-auto"
            >
              <LogIn className="h-5 w-5" />
              Join the Club
            </button>
            <button
              onClick={() => {
                const popularSection = document.getElementById("popular");
                popularSection?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group text-text-main flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 px-10 text-lg font-semibold backdrop-blur-md transition-all hover:bg-white/10 sm:w-auto"
            >
              Continue as Guest
              <ArrowDown className="h-5 w-5 transition-transform group-hover:translate-y-1" />
            </button>
          </div>

          {/* Platform Features Highlight */}
          <div className="text-text-muted mt-20 hidden  justify-between  gap-8 border-t border-white/5 pt-8 sm:flex md:justify-center md:gap-16">
            <div className="group hover:text-text-main flex flex-col items-center gap-2 transition-colors">
              <div className="bg-pulse-primary/10 text-pulse-primary flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110">
                <Bot className="h-6 w-6" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-text-main text-xl font-bold">
                  AI Assistant
                </span>
                <span className="text-[10px] font-medium tracking-widest uppercase opacity-70">
                  Personalized Recommendations
                </span>
              </div>
            </div>

            <div className="group hover:text-text-main flex flex-col items-center gap-2 transition-colors">
              <div className="bg-pulse-accent/10 text-pulse-accent flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110">
                <Library className="h-6 w-6" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-text-main text-xl font-bold">
                  Game Vault
                </span>
                <span className="text-[10px] font-medium tracking-widest uppercase opacity-70">
                  Track Your Collection
                </span>
              </div>
            </div>

            <div className="group hover:text-text-main flex flex-col items-center gap-2 transition-colors">
              <div className="bg-pulse-secondary/10 text-pulse-secondary flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110">
                <Gift className="h-6 w-6" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-text-main text-xl font-bold">
                  Free Tracker
                </span>
                <span className="text-[10px] font-medium tracking-widest uppercase opacity-70">
                  Daily Loot & Giveaways
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Logged In Hero Section
  const totalGames = userGames?.length || 0;
  const reviewsWritten =
    userGames?.filter((g) => g.game?.reviews?.[0]?.review)?.length || 0;
  const totalHours =
    userGames?.reduce((acc, curr) => acc + (curr.hours_played || 0), 0) || 0;

  return (
    <section className="bg-bg-base relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={background}
          alt="Space Background"
          className="h-full w-full object-cover opacity-30 mix-blend-screen grayscale"
        />
        <div className="bg-radial-at-c from-pulse-primary/10 absolute inset-0 via-transparent to-transparent opacity-40" />
        <div className="from-bg-base to-bg-base/90 absolute inset-0 bg-linear-to-t via-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center sm:px-12 lg:px-24">
        {/* Personalized Welcome */}
        <div className="mb-2 flex justify-center sm:mb-6">
          <div className="glass-badge border-pulse-primary/30 bg-pulse-primary/10 text-pulse-accent flex items-center gap-2 px-6 py-2 text-sm font-bold tracking-widest uppercase">
            Welcome Back, {username}
          </div>
        </div>

        <h1 className="mx-auto mb-4 max-w-4xl tracking-tighter text-balance sm:mb-10">
          Your{" "}
          <span className="from-pulse-primary via-pulse-accent to-pulse-secondary bg-linear-to-r bg-clip-text text-transparent">
            Gaming Empire
          </span>{" "}
          is Growing
        </h1>

        {/* User Stats Dashboard */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
          <div className="group border-stroke-subtle bg-bg-card hover:border-pulse-primary/50 flex flex-row items-center gap-3 rounded-2xl border p-4 backdrop-blur-md transition-all sm:flex-col sm:p-8">
            <div className="bg-pulse-primary/20 text-pulse-primary flex h-14 w-14 items-center justify-center rounded-full transition-transform group-hover:scale-110">
              <Gamepad2 className="h-8 w-8" />
            </div>
            <div className="flex items-center gap-2 sm:flex-col sm:gap-0">
              <span className="text-text-main text-3xl font-black">
                {totalGames}
              </span>
              <span className="text-text-dim text-sm font-semibold tracking-wider uppercase">
                Games in Vault
              </span>
            </div>
          </div>

          <div className="group border-stroke-subtle bg-bg-card hover:border-pulse-accent/50 flex flex-row items-center gap-3 rounded-2xl border p-4 backdrop-blur-md transition-all sm:flex-col sm:p-8">
            <div className="bg-pulse-accent/20 text-pulse-accent flex h-14 w-14 items-center justify-center rounded-full transition-transform group-hover:scale-110">
              <MessageSquare className="h-8 w-8" />
            </div>
            <div className="flex items-center gap-2 sm:flex-col sm:gap-0">
              <span className="text-text-main text-3xl font-black">
                {reviewsWritten}
              </span>
              <span className="text-text-dim text-sm font-semibold tracking-wider uppercase">
                Reviews Written
              </span>
            </div>
          </div>

          <div className="group border-stroke-subtle bg-bg-card hover:border-pulse-secondary/50 flex flex-row  items-center gap-3 rounded-2xl border p-4 backdrop-blur-md transition-all sm:flex-col sm:p-8">
            <div className="bg-pulse-secondary/20 text-pulse-secondary flex h-14 w-14 items-center justify-center rounded-full transition-transform group-hover:scale-110">
              <Clock className="h-8 w-8" />
            </div>
            <div className="flex items-center gap-2 sm:flex-col sm:gap-0">
              <span className="text-text-main text-3xl font-black">
                {totalHours}
              </span>
              <span className="text-text-dim text-sm font-semibold tracking-wider uppercase">
                Hours Invested
              </span>
            </div>
          </div>
        </div>

        {/* Quick Dashboard Action */}
        <div className="mt-12">
          <button
            onClick={() => navigate("/account")}
            className="bg-pulse-primary mx-auto flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-full px-12 text-lg sm:w-auto"
          >
            <Library className="h-6 w-6" />
            Go to My Library
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
