import { Link } from "react-router-dom";
import { IoGameController } from "react-icons/io5";

function Logo() {
  return (
    <div className="flex items-center gap-x-2">
      <Link to="/">
        <IoGameController className="h-8 w-8" />
      </Link>
      <h1 className="font-heading hidden text-center text-base font-bold sm:block md:text-2xl">
        <Link to="/">Game Changer</Link>
      </h1>
    </div>
  );
}

export default Logo;
