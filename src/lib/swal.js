import Swal from "sweetalert2";

export const MySwal = Swal.mixin({
  background: "var(--color-bg-surface)",
  color: "var(--color-text-dim)",
  buttonsStyling: false,
  reverseButtons: true,
  customClass: {
    popup: "rounded-xl! border! border-stroke-medium!",
    title: "text-text-main! text-xl! font-semibold!",
    confirmButton:
      "rounded-md bg-pulse-error text-on-action font-semibold h-10 px-5 ml-3 cursor-pointer",
    denyButton:
      "rounded-md border border-stroke-medium text-text-main font-semibold h-10 px-5 ml-3 cursor-pointer",
    cancelButton:
      "rounded-md border border-stroke-medium text-text-main font-semibold h-10 px-5 cursor-pointer",
  },
});
