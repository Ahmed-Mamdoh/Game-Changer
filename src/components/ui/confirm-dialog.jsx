import { useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

// Asks before a destructive action. Cancel is focused first so Enter is safe.
function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  pendingLabel,
  onConfirm,
}) {
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
        className="bg-bg-surface border-stroke-medium gap-0 rounded-xl border p-6 shadow-[var(--shadow-float)] sm:max-w-[28rem]"
      >
        <DialogTitle className="text-text-main text-lg leading-snug font-semibold text-balance">
          {title}
        </DialogTitle>
        <DialogDescription className="text-text-dim mt-2 text-sm leading-relaxed text-pretty">
          {description}
        </DialogDescription>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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
            {isPending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { ConfirmDialog };
