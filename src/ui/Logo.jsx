import { Link } from "react-router-dom";
import { IoGameController } from "react-icons/io5";

function Logo() {
  return (
    <div className="flex items-center gap-x-2">
      <Link to="/">
        <IoGameController className="h-8 w-8" />
      </Link>
      <Link
        to="/"
        className="font-heading hidden text-center text-base font-bold sm:block md:text-2xl"
      >
        Game Changer
      </Link>
    </div>
  );
}

export default Logo;
