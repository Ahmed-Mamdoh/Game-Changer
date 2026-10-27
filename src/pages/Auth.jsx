import { Helmet } from "react-helmet-async";
import { AuthForm } from "./../features/Auth/AuthForm";
import { useGetGameSection } from "@/features/games/hooks/useGetGameSection";
import { pickBackdrop } from "@/utils/igdbImage";
function Auth() {
  const { data: games } = useGetGameSection("total_rating_count", 16);
  const backdropGame = Array.isArray(games) ? games[1] || games[0] : null;

  return (
    <>
      <Helmet>
        {/* Basic SEO Meta Tags */}
        <title>Game-Changer | Login or Sign Up</title>
        <meta
          name="description"
          content="Join Game-Changer to discover popular, free, and upcoming games. Create your account or log in to start exploring the best gaming destination."
        />
        <meta
          property="og:description"
          content="Join Game-Changer to discover popular, free, and upcoming games. Create your account or log in to start exploring the best gaming destination."
        />
        <link rel="canonical" href="https://game-changer-gg.vercel.app/auth" />
      </Helmet>
      <div className="relative isolate flex min-h-[100dvh] items-center px-4 pt-24 pb-12 md:px-8">
        {backdropGame && (
          <img
            src={pickBackdrop(backdropGame)}
            alt=""
            className="art-fade absolute inset-0 -z-10 h-full w-full object-cover brightness-90"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
        <div className="mx-auto w-full max-w-[1440px]">
          <AuthForm />
        </div>
      </div>
    </>
  );
}

export default Auth;
