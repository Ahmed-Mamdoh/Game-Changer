import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link
      to="/"
      className="font-heading text-center text-base font-bold md:text-2xl"
    >
      Game Changer
    </Link>
  );
}

export default Logo;
