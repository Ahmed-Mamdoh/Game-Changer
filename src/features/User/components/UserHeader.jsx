import { logoutUser, updateUser } from "@/api/supabase";
import { Input } from "@/components/ui/input";
import { UserToken } from "@/hooks/useUserToken";
import { MySwal } from "@/lib/swal";
import { useState } from "react";
import { FaCheck, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function UserHeader() {
  const navigate = useNavigate();

  const { username } = UserToken()?.user?.user_metadata || {};

  function handleLogout() {
    MySwal.fire({
      title: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Log out",
    }).then((result) => {
      if (result.isConfirmed) {
        logoutUser().then(() => navigate("/"));
      }
    });
  }

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[length:var(--font-size-title)] font-semibold tracking-tight">
          {username ? `${username}'s library` : "Your library"}
        </h1>
      </div>
      <button className="btn-quiet h-9" onClick={handleLogout}>
        Log out
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
      MySwal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`,
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
                MySwal.fire({
                  title: "Error",
                  icon: "error",
                  html: error.message,
                });
                return;
              }
              MySwal.fire({
                title: "Saved!",
                icon: "success",
              });
            })
            .finally(setIsEditing(false));
        } else if (result.isDenied) {
          MySwal.fire({
            title: "Changes are not saved",
            icon: "info",
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
