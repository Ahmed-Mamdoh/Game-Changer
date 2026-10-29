import { logoutUser } from "@/api/supabase";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { UserToken } from "@/hooks/useUserToken";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Who this library belongs to, with the counts that sum it up in one line
function UserHeader({ userGames = [] }) {
  const navigate = useNavigate();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const { username } = UserToken()?.user?.user_metadata || {};

  const hours = userGames
    .filter((g) => g.status !== "to play")
    .reduce((acc, g) => acc + (g.hours_played || 0), 0);
  const countOf = (status) =>
    userGames.filter((g) => g.status === status).length;
  const facts = [
    { label: "hours", value: hours.toLocaleString() },
    { label: "played", value: countOf("finished") },
    { label: "playing", value: countOf("playing") },
    { label: "wishlist", value: countOf("to play") },
  ];

  async function handleLogout() {
    await logoutUser();
    navigate("/");
  }

  return (
    <div className="flex items-start justify-between gap-4 sm:items-center">
      <div className="flex min-w-0 items-center gap-4">
        <span
          aria-hidden="true"
          className="bg-bg-chip text-text-main flex size-14 shrink-0 items-center justify-center rounded-full text-2xl font-semibold uppercase"
        >
          {username?.[0] || "G"}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="truncate text-[length:var(--font-size-title)] leading-tight font-semibold tracking-tight">
            {username || "Your library"}
          </h1>
          <dl className="text-text-dim flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="flex flex-row-reverse items-baseline gap-1"
              >
                <dt>{fact.label}</dt>
                <dd className="text-text-main tabular font-semibold">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <button
        className="btn-quiet h-9 shrink-0"
        onClick={() => setIsLogoutOpen(true)}
      >
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
