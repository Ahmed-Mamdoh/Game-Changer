import { Helmet } from "react-helmet-async";
import { AuthForm } from "./../features/Auth/AuthForm";
import FadingBackground from "./../features/games/ui/FadingBackground";
function Auth() {
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
      <div className="relative mx-auto h-[100dvh] px-5 pt-24">
        <FadingBackground first={true} />
        {/* Content section */}
        <div className="z-10 w-full">
          <AuthForm />
        </div>
      </div>
    </>
  );
}

export default Auth;
