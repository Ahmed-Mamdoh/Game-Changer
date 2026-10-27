import { useSearchParams } from "react-router-dom";

// One tab in the library's status row. Status color lives on the icon only.
function UserFilterButton({
  paramsValue,
  buttonText,
  icon: Icon,
  iconClassName = "",
  count,
  paramKey = "status",
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentParamValue = searchParams.get(paramKey) || "";
  const otherKey = paramKey === "status" ? "isFavorite" : "status";
  const isActive =
    currentParamValue === String(paramsValue) &&
    (paramsValue !== "" || !searchParams.get(otherKey));

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("status");
        newParams.delete("isFavorite");
        if (paramsValue !== "") newParams.set(paramKey, paramsValue);
        setSearchParams(newParams);
      }}
      className={`flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-md px-3 text-sm whitespace-nowrap transition-colors duration-100 ${
        isActive
          ? "bg-action text-on-action font-semibold"
          : "text-text-dim hover:text-text-main hover:bg-white/[0.06]"
      }`}
    >
      {Icon && (
        <Icon
          className={`h-4 w-4 ${isActive ? "text-on-action" : iconClassName}`}
        />
      )}
      {buttonText}
      {count !== undefined && (
        <span
          className={`tabular text-xs ${isActive ? "text-on-action/70" : "text-text-muted"}`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export default UserFilterButton;
