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
                    className="absolute -top-1 -right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/5 text-white/40 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <span className="text-lg leading-none">×</span>
                  </button>

                  {/* Game Cover / Icon Placeholder */}
                  <div className="bg-pulse-primary/20 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/10 text-2xl shadow-inner">
                    🎁
                  </div>

                  <div className="flex flex-col gap-0.5 px-2.5">
                    <h4 className="text-sm font-bold tracking-tight text-white">
                      {game.name} is FREE!
                    </h4>
                    <p className="text-xs font-medium text-white/60">
                      Found a gift from your wishlist on{" "}
                      <span className="text-pulse-accent font-bold">
                        {game.freeOn.toUpperCase()}
                      </span>
                    </p>
                    <a
                      href={game.giveAwayLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-pulse-accent  mt-1.5 flex items-center gap-1 text-[11px] font-black tracking-widest uppercase transition-all hover:brightness-125"
                      onClick={() => toast.dismiss(t.id)}
                    >
                      <span className="underline">Claim Now</span>
                      <span className="text-[14px]">🚀</span>
                    </a>
                  </div>
                </div>
              ),
              {
                duration: 10000,
                position: "bottom-right",
                style: {
                  background: "rgba(15, 23, 42, 0.8)",
                  backdropFilter: "blur(16px) saturate(180%)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "1.25rem",
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
