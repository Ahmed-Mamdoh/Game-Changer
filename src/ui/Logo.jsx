import { Link } from "react-router-dom";
import { IoGameController } from "react-icons/io5";

function Logo() {
  return (
    <Link
      to="/"
      className="flex shrink-0 items-center gap-2"
      aria-label="Game Changer home"
    >
      <IoGameController className="text-pulse-primary h-6 w-6" />
      <span className="font-heading hidden text-base font-semibold tracking-tight sm:block">
        Game Changer
      </span>
    </Link>
  );
}

export default Logo;
