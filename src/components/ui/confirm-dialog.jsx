import { useRef, useState } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

// Asks before a destructive action. Cancel is focused first so Enter is safe.
// Pass `art` (an image URL) to show what is being removed, with the icon on it.
function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  pendingLabel,
  onConfirm,
  art,
  icon = Trash2,
}) {
  const Icon = icon;
  const cancelRef = useRef(null);
  const [isPending, setIsPending] = useState(false);

  async function handleConfirm() {
    setIsPending(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && onOpenChange(next)}>
      <DialogContent
        role="alertdialog"
        showCloseButton={false}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          cancelRef.current?.focus();
        }}
        overlayClassName="confirm-overlay bg-black/60 backdrop-blur-sm"
        className="confirm-panel bg-bg-surface border-stroke-medium isolate gap-0 overflow-hidden rounded-2xl border p-0 shadow-[var(--shadow-float)] sm:max-w-[26rem]"
      >
        {/* The art bleeds in behind the header, washed with a hint of danger */}
        {art && (
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-44 overflow-hidden"
          >
            <img
              src={art}
              alt=""
              className="h-full w-full scale-125 object-cover opacity-35 blur-2xl"
            />
            <div className="from-pulse-error/10 via-bg-surface/70 to-bg-surface absolute inset-0 bg-gradient-to-b" />
          </div>
        )}

        <div className="flex flex-col items-center px-6 pt-7 pb-6 text-center">
          {art ? (
            <div className="relative">
              <img
                src={art}
                alt=""
                className="aspect-[3/4] w-20 rounded-lg object-cover shadow-[var(--shadow-float)] outline-1 -outline-offset-1 outline-white/15"
              />
              <span className="confirm-badge bg-pulse-error text-on-action ring-bg-surface absolute -right-3 -bottom-3 flex h-9 w-9 items-center justify-center rounded-full ring-4">
                <Icon className="h-4 w-4" strokeWidth={2.25} />
              </span>
            </div>
          ) : (
            <span className="confirm-badge bg-pulse-error/12 text-pulse-error flex h-12 w-12 items-center justify-center rounded-full">
              <Icon className="h-5 w-5" />
            </span>
          )}

          <DialogTitle className="text-text-main mt-6 text-lg leading-snug font-semibold text-balance">
            {title}
          </DialogTitle>
          <DialogDescription className="text-text-dim mt-2 text-sm leading-relaxed text-pretty">
            {description}
          </DialogDescription>
        </div>

        <div className="border-stroke-subtle bg-bg-base/40 grid grid-cols-2 gap-2 border-t px-6 py-4">
          <DialogClose asChild>
            <button
              ref={cancelRef}
              type="button"
              disabled={isPending}
              className="btn-quiet"
            >
              Cancel
            </button>
          </DialogClose>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="btn-danger"
          >
            {isPending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Icon className="h-4 w-4" />
            )}
            {isPending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { ConfirmDialog };
