import { useSearchParams } from "react-router-dom";

function UserFilterButton({
  paramsValue,
  buttonText,
  icon: Icon,
  count,
  activeColor = "pulse-primary",
  paramKey = "status",
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentParamValue = searchParams.get(paramKey) || "";
  const isActive = currentParamValue === String(paramsValue);

  const colorMap = {
    "pulse-primary": {
      border: "border-pulse-primary",
      bg: "bg-pulse-primary",
      bgLight: "bg-pulse-primary/10",
      text: "text-pulse-primary",
      shadow: "shadow-pulse-primary/10",
    },
    "pulse-secondary": {
      border: "border-pulse-secondary",
      bg: "bg-pulse-secondary",
      bgLight: "bg-pulse-secondary/10",
      text: "text-pulse-secondary",
      shadow: "shadow-pulse-secondary/10",
    },
    "pulse-success": {
      border: "border-pulse-success",
      bg: "bg-pulse-success",
      bgLight: "bg-pulse-success/10",
      text: "text-pulse-success",
      shadow: "shadow-pulse-success/10",
    },
    "pulse-error": {
      border: "border-pulse-error",
      bg: "bg-pulse-error",
      bgLight: "bg-pulse-error/10",
      text: "text-pulse-error",
      shadow: "shadow-pulse-error/10",
    },
    "pulse-warning": {
      border: "border-pulse-warning",
      bg: "bg-pulse-warning",
      bgLight: "bg-pulse-warning/10",
      text: "text-pulse-warning",
      shadow: "shadow-pulse-warning/10",
    },
    "pulse-accent": {
      border: "border-pulse-accent",
      bg: "bg-pulse-accent",
      bgLight: "bg-pulse-accent/10",
      text: "text-pulse-accent",
      shadow: "shadow-pulse-accent/10",
    },
  };

  const colors = colorMap[activeColor] || colorMap["pulse-primary"];

  return (
    <button
      onClick={() => {
        const newParams = new URLSearchParams(searchParams);
        if (paramsValue === "") {
          newParams.delete(paramKey);
        } else {
          // When setting status, we might want to clear isFavorite and vice-versa
          // depending on how we want the filters to interact.
          // For now, let's just set the requested param.
          newParams.set(paramKey, paramsValue);

          // Special case: if we are setting a status, clear isFavorite
          if (paramKey === "status") {
            newParams.delete("isFavorite");
          }
          // Special case: if we are setting isFavorite, clear status
          if (paramKey === "isFavorite") {
            newParams.delete("status");
          }
        }
        setSearchParams(newParams);
      }}
      className={`group relative flex cursor-pointer items-center justify-between gap-3 overflow-hidden rounded-xl border px-4 py-3 transition-all duration-300
      ${
        isActive
          ? `${colors.border} ${colors.bgLight} shadow-[0_0_15px_rgba(0,0,0,0.1)] ${colors.shadow}`
          : "border-stroke-subtle hover:border-stroke-medium bg-white/[0.02] hover:bg-white/[0.05]"
      }`}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <Icon
            size={18}
            className={`transition-colors duration-300 ${
              isActive
                ? colors.text
                : "text-text-dim group-hover:text-text-main"
            }`}
          />
        )}
        <span
          className={`text-sm font-semibold transition-colors duration-300 sm:text-base ${
            isActive
              ? "text-text-main"
              : "text-text-dim group-hover:text-text-main"
          }`}
        >
          {buttonText}
        </span>
      </div>

      {count !== undefined && (
        <span
          className={`flex h-6 min-w-[24px] items-center justify-center rounded-full px-2 text-[10px] font-bold transition-all duration-300 sm:text-xs ${
            isActive
              ? `${colors.bg} text-white shadow-lg`
              : "text-text-dim group-hover:text-text-main bg-white/10 group-hover:bg-white/20"
          }`}
        >
          {count}
        </span>
      )}

      {/* Active Indicator Bar */}
      {isActive && (
        <div
          className={`absolute bottom-0 left-0 h-1 w-full ${colors.bg} animate-in fade-in slide-in-from-bottom-1`}
        />
      )}
    </button>
  );
}

export default UserFilterButton;
