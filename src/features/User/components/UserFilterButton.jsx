import { useSearchParams } from "react-router-dom";

function UserFilterButton({ paramsValue, buttonText }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get("status") || "";

  return (
    <button
      onClick={() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("status", paramsValue);
        setSearchParams(newParams);
      }}
      className={`bg-bg-card border-stroke-subtle hover:bg-pulse-primary w-full cursor-pointer rounded-full  
      border px-4 py-2 text-sm font-semibold transition-all sm:max-w-full sm:text-base
      ${statusParam === paramsValue ? "bg-pulse-primary" : ""}`}
    >
      {buttonText}
    </button>
  );
}

export default UserFilterButton;
