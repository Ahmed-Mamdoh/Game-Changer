import Swal from "sweetalert2";

export const MySwal = Swal.mixin({
  confirmButtonColor: "var(--color-pulse-primary)",
  background: "var(--color-bg-card)",
  color: "var(--color-text-dim)",
  buttonsStyling: false,
  customClass: {
    popup: "backdrop-blur-xl! rounded-xl! border! border-stroke-medium!",
    confirmButton:
      "rounded-full bg-pulse-error text-white font-semibold  py-2 px-4 mr-4 border border-stroke-subtle cursor-pointer",
    cancelButton:
      "rounded-full bg-bg-surface text-white font-semibold  border border-stroke-subtle py-2 px-4 cursor-pointer",
  },
});
