import { useEffect, useRef } from "react";
import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";
import { UserToken } from "@/hooks/useUserToken";
import { useGetFreeGamesToShow } from "./useGetFreeGamesToShow";
import toast from "react-hot-toast";

function useWishlistAlerts() {
  const user_id = UserToken()?.user?.id;
  const { data: userGames } = useGetUserGames(user_id);
  const { dataToShow } = useGetFreeGamesToShow();
  const notifiedGames = useRef(new Set());

  const wishlistGames = userGames?.user_games?.filter(
    (game) => game.status === "to play",
  );

  const freeGames = dataToShow?.filter((game) =>
    wishlistGames?.some((wishlistGame) => wishlistGame.game_id === game.id),
  );

  useEffect(() => {
    if (freeGames?.length > 0) {
      freeGames.forEach((game, index) => {
        if (!notifiedGames.current.has(game.id)) {
          // Stagger notifications with a delay
          setTimeout(() => {
            // Play notification sound
            const audio = new Audio("/notification.mp3");
            audio.volume = 0.2; // Set volume to 20%
            audio.play().catch((err) => console.log("Audio play failed:", err));

            toast.success(
              (t) => (
                <div className="relative flex w-full max-w-sm items-center gap-4">
                  {/* Exit Button */}
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    aria-label="Dismiss"
                    className="text-text-muted hover:text-text-main absolute -top-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm hover:bg-white/10"
                  >
                    <span className="text-lg leading-none">×</span>
                  </button>

                  {/* Game Cover / Icon Placeholder */}
                  {game.cover?.url && (
                    <img
                      src={game.cover.url.replace("t_thumb", "t_cover_small")}
                      alt=""
                      className="h-16 w-12 shrink-0 rounded-sm object-cover"
                    />
                  )}

                  <div className="flex flex-col gap-0.5 px-2.5">
                    <h4 className="text-text-main text-sm font-semibold">
                      {game.name} is free on {game.freeOn}
                    </h4>
                    <p className="text-text-dim text-xs">
                      It's on your wishlist. Claim it to keep it.
                    </p>
                    <a
                      href={game.giveAwayLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-text-brand mt-1.5 text-sm font-semibold underline-offset-4 hover:underline"
                      onClick={() => toast.dismiss(t.id)}
                    >
                      Claim on {game.freeOn} →
                    </a>
                  </div>
                </div>
              ),
              {
                duration: 10000,
                position: "bottom-right",
                style: {
                  background: "var(--color-bg-raised)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  borderRadius: "0.75rem",
                  padding: "1rem",
                  color: "white",
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 0 20px rgba(124, 58, 237, 0.1)",
                  minWidth: "320px",
                },
                icon: null, // Hide default icon to use our custom layout
              },
            );
            notifiedGames.current.add(game.id);
          }, index * 2000); // 2 seconds delay between each
        }
      });
    }
  }, [freeGames]);
}

export default useWishlistAlerts;
