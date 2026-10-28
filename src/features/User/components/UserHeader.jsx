import { logoutUser } from "@/api/supabase";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { UserToken } from "@/hooks/useUserToken";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserHeader() {
  const navigate = useNavigate();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const { username } = UserToken()?.user?.user_metadata || {};

  async function handleLogout() {
    await logoutUser();
    navigate("/");
  }

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[length:var(--font-size-title)] font-semibold tracking-tight">
          {username ? `${username}'s library` : "Your library"}
        </h1>
      </div>
      <button className="btn-quiet h-9" onClick={() => setIsLogoutOpen(true)}>
        Log out
      </button>

      <ConfirmDialog
        open={isLogoutOpen}
        onOpenChange={setIsLogoutOpen}
        title="Log out of Game Changer?"
        description="Your library is saved. Sign in again any time to pick up where you left off."
        confirmLabel="Log out"
        pendingLabel="Logging out…"
        onConfirm={handleLogout}
        icon={LogOut}
        destructive={false}
      />
    </div>
  );
}

export default UserHeader;
