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
      className={`bg-myGray/80 hover:bg-pulse-primary/60 w-full cursor-pointer rounded-2xl
      px-4 py-2 font-semibold transition-all
      ${statusParam === paramsValue ? "bg-pulse-secondary" : ""}`}
    >
      {buttonText}
    </button>
  );
}

export default UserFilterButton;
