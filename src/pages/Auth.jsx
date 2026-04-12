import { AuthForm } from "./../features/Auth/AuthForm";
import FadingBackground from "./../features/games/ui/FadingBackground";
function Auth() {
  return (
    <div className="relative mx-auto min-h-screen py-20">
      <FadingBackground first={true} />
      {/* Content section */}
      <div className=" z-10 w-full">
        <AuthForm />
      </div>
    </div>
  );
}

export default Auth;
