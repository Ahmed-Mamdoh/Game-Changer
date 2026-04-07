import { AuthForm } from "./../features/Auth/AuthForm";
import FadingBackground from "./../features/games/ui/FadingBackground";
function Auth() {
  return (
    <div className="relative mx-auto">
      <FadingBackground first={true} />
      {/* Content section */}
      <div className="absolute top-[10vh] z-10 w-full">
        <AuthForm />
      </div>
    </div>
  );
}

export default Auth;
