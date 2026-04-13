import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function FilterButtons({
  category,
  name,
  paramName,
  or = false,
  defaultValue = [],
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState();
  useEffect(() => {
    setSelected(searchParams.get(paramName)?.split("-") || defaultValue);
  }, [searchParams, paramName]);

  const [showAll, setShowAll] = useState(false);

  return (
    <div
      className={`flex ${or ? "flex-nowrap" : "flex-wrap"} items-center gap-2`}
    >
      <p>{name}: </p>
      {category
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((_, i) => showAll || i < 2)
        .map((item, i) => {
          return (
            <button
              className={`border-pulse-primary/40 hover:bg-pulse-primary/30
                    hover:shadow-pulse-primary/60  cursor-pointer rounded-full border px-3 py-1.5 text-sm
                    font-medium tracking-wide transition-all duration-200 hover:scale-105 hover:shadow-[0_0_8px_2px]
                    ${!showAll && i === 1 && !or ? "hidden sm:block" : ""}
                    ${selected?.includes(item.id.toString()) ? "bg-pulse-primary/50 shadow-pulse-primary/60 shadow-[0_0_8px_2px]" : ""}`}
              onClick={() => {
                setSelected((prev) =>
                  prev.includes(item.id.toString())
                    ? prev.filter((id) => id !== item.id.toString())
                    : [...prev, item.id.toString()],
                );
                const newParams = new URLSearchParams(searchParams);
                let paramsToSet = searchParams.get(paramName) || "";
                if (or) {
                  paramsToSet = paramsToSet.includes(item.id.toString())
                    ? (paramsToSet = null)
                    : (paramsToSet = item.id.toString());
                  if (paramsToSet) {
                    newParams.set(paramName, paramsToSet);
                  } else {
                    newParams.delete(paramName);
                  }
                  setSearchParams(newParams);
                } else {
                  paramsToSet = paramsToSet.includes(item.id.toString())
                    ? paramsToSet
                        .split("-")
                        .filter((id) => id !== item.id.toString())
                        .join("-")
                    : paramsToSet.length > 0
                      ? [...paramsToSet.split("-"), item.id.toString()].join(
                          "-",
                        )
                      : item.id.toString();
                  newParams.set(paramName, paramsToSet);
                  setSearchParams(newParams);
                }
              }}
              key={item.id.toString()}
            >
              {item.name.split("(")[0]}
            </button>
          );
        })}
      {category.length > 2 && (
        <button
          className="text-text-secondary cursor-pointer"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Hide All" : "Show All..."}
        </button>
      )}
    </div>
  );
}

export default FilterButtons;
