import { NavLink } from "react-router-dom";

function Tab({ to, sectionName }) {
  return (
    <NavLink
      to={to}
      role="tab"
      className={({ isActive }) =>
        isActive
          ? "group text-xl font-bold transition-colors"
          : "text-neutral-content group text-xl font-medium transition-colors"
      }
    >
      {({ isActive }) => (
        <div className="text-nowrap">
          {sectionName}
          <hr
            className={`bg-pulse-primary h-[1px] scale-x-0 border-0 transition-transform duration-200 group-hover:scale-x-100 ${isActive ? "scale-x-100" : ""}`}
          />
        </div>
      )}
    </NavLink>
  );
}

export default Tab;
