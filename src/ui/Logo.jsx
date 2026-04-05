import { Link } from "react-router-dom";
import { IoGameController } from "react-icons/io5";

function Logo() {
  return (
    <div className="flex items-center gap-x-2">
      <IoGameController className="h-8 w-8" />
      <Link
        to="/"
        className="font-heading text-center text-base font-bold md:text-2xl"
      >
        Game Changer
      </Link>
    </div>
  );
}

export default Logo;
