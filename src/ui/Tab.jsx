import { NavLink } from "react-router-dom";

function Tab({ to, sectionName }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors duration-100 ${
          isActive
            ? "text-text-main bg-white/[0.08] font-semibold"
            : "text-text-dim hover:text-text-main hover:bg-white/[0.05]"
        }`
      }
    >
      {sectionName}
    </NavLink>
  );
}

export default Tab;
