import { logoutUser, updateUser } from "@/api/supabase";
import { Input } from "@/components/ui/input";
import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";
import { ChartPieDonutActive } from "@/ui/ChartPieDonutActive";
import Spinner from "@/ui/Spinner";
import { useState } from "react";
import { FaCheck, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
function Account() {
  const navigate = useNavigate();

  const supabaseToken = localStorage.getItem(
    "sb-kapovyqqncfsoangqppi-auth-token",
  );
  const userData = JSON.parse(supabaseToken || "{}");
  const { username } = userData?.user?.user_metadata || {};
  const user_id = userData?.user?.id;
  const { data, isLoading } = useGetUserGames(user_id);
  const user_games = data?.user_games || [];
  let genres = [];
  let genresCount = {};
  let chartData;
  if (!isLoading) {
    genres = user_games?.map((game) => game.genres).flat();
    genresCount = genres.reduce((acc, genre) => {
      return { ...acc, [genre]: (acc[genre] || 0) + 1 };
    }, {});
    chartData = Object.entries(genresCount).map(([genre, count]) => ({
      label: genre,
      number: count,
      fill: `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`,
    }));
    chartData.sort((a, b) => b.number - a.number);
  }

  function handleLogout() {
    Swal.fire({
      title: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Log Out",
      background: "oklch(22% 0.019 237.69)",
      color: "oklch(77.383% 0.043 245.096)",
    }).then((result) => {
      if (result.isConfirmed) {
        logoutUser().then(() => navigate("/"));
      }
    });
  }

  return (
    <div className="container mx-auto">
      <div className="bg-base-300 mx-auto mt-5 flex w-11/12 items-center justify-around rounded-md p-5">
        <DataField label="Username" value={username} />
        <button
          className="btn bg-secondary text-secondary-content"
          onClick={() => {
            handleLogout();
          }}
        >
          Log Out
        </button>
      </div>
      <div className="mx-auto my-6 flex w-11/12 items-center justify-between">
        <div></div>
        {!isLoading && <ChartPieDonutActive chartData={chartData} />}
      </div>
    </div>
  );
}

function DataField({ label, value }) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  async function handleUpdate() {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    if (isEditing) {
      Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`,
        background: "oklch(22% 0.019 237.69)",
        color: "oklch(77.383% 0.043 245.096)",
        text: `are you sure you want to update ${label} to ${inputValue}?`,
        icon: "warning",
      }).then((result) => {
        if (result.isConfirmed) {
          let dataToUpdate = {};
          if (label === "Username") dataToUpdate.username = inputValue;
          if (label === "Email") dataToUpdate.email = inputValue;
          if (label === "Password") dataToUpdate.password = inputValue;
          updateUser(dataToUpdate)
            .then(({ error }) => {
              if (error) {
                Swal.fire({
                  title: "Error",
                  icon: "error",
                  html: error.message,
                  background: "oklch(22% 0.019 237.69)",
                  color: "oklch(77.383% 0.043 245.096)",
                });
                return;
              }
              Swal.fire({
                title: "Saved!",
                icon: "success",
                background: "oklch(22% 0.019 237.69)",
                color: "oklch(77.383% 0.043 245.096)",
              });
            })
            .finally(setIsEditing(false));
        } else if (result.isDenied) {
          Swal.fire({
            title: "Changes are not saved",
            icon: "info",
            background: "oklch(22% 0.019 237.69)",
            color: "oklch(77.383% 0.043 245.096)",
          });
          setIsEditing(false);
        }
      });
    }
  }
  return (
    <div className="flex items-center gap-2">
      <p className="text-xl font-bold">{label}:</p>
      <Input
        value={inputValue}
        type="text"
        disabled={!isEditing}
        className="w-full max-w-3xs"
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        className="btn bg-secondary text-secondary-content"
        onClick={handleUpdate}
      >
        {isEditing ? <FaCheck /> : <FaPen />}
      </button>
    </div>
  );
}

export default Account;
