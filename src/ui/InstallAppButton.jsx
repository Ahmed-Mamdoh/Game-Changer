import { useState } from "react";
import { Download, Share, SquarePlus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import useInstallApp from "@/hooks/useInstallApp";

const IOS_STEPS = [
  { icon: Share, text: "Tap Share in your browser's toolbar." },
  { icon: SquarePlus, text: "Scroll down and tap Add to Home Screen." },
];

// "Install app" for wherever it fits. Renders nothing once installed or when
// the browser can't install. On iPhone and iPad it opens the Share steps.
function InstallAppButton({ className, onPress }) {
  const { mode, promptInstall } = useInstallApp();
  const [isIosOpen, setIsIosOpen] = useState(false);

  if (mode === "hidden") return null;

  function handleClick() {
    onPress?.();
    if (mode === "ios") setIsIosOpen(true);
    else promptInstall();
  }

  return (
    <>
      <button type="button" onClick={handleClick} className={className}>
        <Download className="h-4 w-4 shrink-0" />
        Install app
      </button>

      <Dialog open={isIosOpen} onOpenChange={setIsIosOpen}>
        <DialogContent
          showCloseButton={false}
          overlayClassName="confirm-overlay bg-black/60 backdrop-blur-sm"
          className="confirm-panel bg-bg-surface border-stroke-medium gap-0 overflow-hidden rounded-2xl border p-0 shadow-[var(--shadow-float)] sm:max-w-[24rem]"
        >
          <div className="flex flex-col items-center px-6 pt-7 pb-5 text-center">
            <img
              src="/apple-touch-icon.png"
              alt=""
              className="h-14 w-14 rounded-[0.9rem] outline-1 -outline-offset-1 outline-white/15"
            />
            <DialogTitle className="text-text-main mt-5 text-lg leading-snug font-semibold">
              Add Game Changer to your Home Screen
            </DialogTitle>
            <DialogDescription className="text-text-dim mt-2 text-sm leading-relaxed text-pretty">
              It opens full screen like an app. The only official one comes from
              game-changer-gg.vercel.app.
            </DialogDescription>
          </div>

          <ol className="border-stroke-subtle flex flex-col gap-3 border-t px-6 py-5">
            {IOS_STEPS.map(({ icon, text }, index) => {
              const StepIcon = icon;
              return (
                <li key={text} className="flex items-center gap-3 text-sm">
                  <span className="bg-bg-chip text-text-main tabular flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-text-main flex-1 leading-snug">
                    {text}
                  </span>
                  <StepIcon
                    aria-hidden="true"
                    className="text-pulse-primary h-5 w-5 shrink-0"
                  />
                </li>
              );
            })}
          </ol>

          <div className="border-stroke-subtle bg-bg-base/40 border-t px-6 py-4">
            <DialogClose asChild>
              <button type="button" className="btn-quiet w-full">
                Got it
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default InstallAppButton;
