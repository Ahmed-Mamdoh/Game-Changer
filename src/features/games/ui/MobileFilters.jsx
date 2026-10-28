import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useGetNumberOfResults } from "../hooks/useGetNumberOfResults";
import { useActiveCount, useActiveItems } from "../hooks/useFilterParams";
import { FilterOptions } from "./FilterButtons";

function ResultsButton() {
  const location = useLocation();
  const { data, isLoading } = useGetNumberOfResults(location.pathname);
  const count = data?.count;
  return (
    <Dialog.Close className="bg-action text-on-action hover:bg-action-hover h-12 w-full cursor-pointer rounded-lg text-base font-semibold">
      {isLoading || count == null
        ? "Show games"
        : `Show ${count.toLocaleString()} ${count === 1 ? "game" : "games"}`}
    </Dialog.Close>
  );
}

// One collapsible group in the sheet. Its list mounts fresh on every expand,
// so checked options are pinned on top, and stays mounted until the collapse
// has played out.
function Section({ filter, open, onToggle }) {
  const active = useActiveItems(filter);
  const Icon = filter.icon;
  const summary = active.map((item) => item.name.split("(")[0].trim());
  const [prevOpen, setPrevOpen] = useState(open);
  const [shown, setShown] = useState(open);
  const [mountKey, setMountKey] = useState(0);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setShown(true);
      setMountKey((k) => k + 1);
    }
  }

  return (
    <section className="border-stroke-subtle border-b last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex min-h-14 w-full cursor-pointer items-center gap-3 px-4 text-left"
      >
        {Icon && <Icon className="text-text-dim h-5 w-5 shrink-0" />}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="font-semibold">{filter.name}</span>
          {summary.length > 0 && (
            <span className="text-text-brand truncate text-sm">
              {summary.join(", ")}
            </span>
          )}
        </span>
        <ChevronDown
          className={`text-text-dim h-5 w-5 shrink-0 transition-transform duration-[220ms] ease-(--ease-out-expo) ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-[220ms] ease-(--ease-out-expo) ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        onTransitionEnd={(e) => {
          if (e.target === e.currentTarget && !open) setShown(false);
        }}
      >
        <div className="overflow-hidden">
          {shown && (
            <div key={mountKey} className="px-2 pb-3">
              <FilterOptions {...filter} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Phones: one Filters button opening a bottom sheet with every filter group
function MobileFilters({ filters, onClearAll }) {
  const [openName, setOpenName] = useState(null);
  const activeCount = useActiveCount(filters);

  return (
    <Dialog.Root onOpenChange={(open) => open && setOpenName(null)}>
      <Dialog.Trigger
        className={`flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border px-3 text-sm whitespace-nowrap ${
          activeCount
            ? "border-stroke-brand bg-pulse-primary/15 font-semibold"
            : "border-stroke-medium bg-white/[0.06]"
        }`}
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        Filters
        {activeCount > 0 && (
          <span className="bg-action text-on-action tabular flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold">
            {activeCount}
          </span>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content
          aria-describedby={undefined}
          className="sheet-panel bg-bg-raised border-stroke-medium text-text-main fixed inset-x-0 bottom-0 z-50 flex max-h-[88dvh] flex-col rounded-t-2xl border-t shadow-[var(--shadow-float)]"
        >
          <div className="flex items-center gap-3 px-4 pt-3 pb-2">
            <Dialog.Title className="flex-1 text-lg font-semibold">
              Filters
            </Dialog.Title>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-text-brand h-10 cursor-pointer px-2 text-sm font-semibold"
              >
                Clear all
              </button>
            )}
            <Dialog.Close
              aria-label="Close filters"
              className="text-text-dim hover:text-text-main -mr-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          <div className="border-stroke-subtle flex-1 overflow-y-auto overscroll-contain border-t">
            {filters.map((filter) => (
              <Section
                key={filter.name}
                filter={filter}
                open={openName === filter.name}
                onToggle={() =>
                  setOpenName((name) =>
                    name === filter.name ? null : filter.name,
                  )
                }
              />
            ))}
          </div>

          <div className="border-stroke-subtle border-t p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <ResultsButton />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default MobileFilters;
