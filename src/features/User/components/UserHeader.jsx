import { logoutUser, updateUser } from "@/api/supabase";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FaCheck, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function UserHeader() {
  const navigate = useNavigate();
  const supabaseToken = localStorage.getItem(
    "sb-kapovyqqncfsoangqppi-auth-token",
  );
  const userData = JSON.parse(supabaseToken || "{}");
  const { username } = userData?.user?.user_metadata || {};

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
    <div
      className="bg-bg-card border-stroke-medium hover:border-pulse-secondary
      flex flex-col items-start gap-4 rounded-xl border p-4 backdrop-blur-xl transition-all duration-300 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-6"
    >
      {/* <DataField label="Username" value={username} /> */}
      <div className="flex items-center gap-1">
        <h2>{username}</h2>
      </div>
      <button
        className="bg-pulse-primary hover:bg-pulse-primary focus:ring-pulse-glow w-full cursor-pointer rounded-full px-6 py-2 text-white transition-all duration-200 focus:ring-2 focus:outline-none sm:w-auto"
        aria-label="Log out"
        aria-labelledby="logout-btn"
        name="logout"
        onClick={() => {
          handleLogout();
        }}
      >
        Log Out
      </button>
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
        id={`${label.toLowerCase()}`}
        autoComplete={`${label.toLowerCase()}`}
        disabled={!isEditing}
        className="w-full max-w-3xs"
        onChange={(e) => setInputValue(e.target.value)}
        aria-label={`${label.toLowerCase()}-input`}
        aria-labelledby={`${label.toLowerCase()}-input`}
        name={`${label.toLowerCase()}`}
        aria-describedby={`${label.toLowerCase()}-input`}
      />
      <button
        className="btn bg-secondary text-secondary-content"
        onClick={handleUpdate}
        name="update"
        aria-label={isEditing ? "Save changes" : "Edit field"}
        aria-labelledby="update-btn"
      >
        {isEditing ? <FaCheck /> : <FaPen />}
      </button>
    </div>
  );
}

export default UserHeader;
