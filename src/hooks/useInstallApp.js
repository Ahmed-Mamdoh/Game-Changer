import { useSyncExternalStore } from "react";

// Chrome, Edge and Samsung Internet hand us an install prompt once the app
// qualifies. iPhone and iPad never do: there, people add it from the Share
// menu, so we show the steps instead. Imported from main.jsx so the listener is
// in place before the browser fires the event.

let deferredPrompt = null;
let installed = false;
const listeners = new Set();
let snapshot = getState();

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function isIos() {
  const { userAgent, platform, maxTouchPoints } = window.navigator;
  // iPadOS reports itself as a Mac with a touch screen
  return (
    /iPad|iPhone|iPod/.test(userAgent) ||
    (platform === "MacIntel" && maxTouchPoints > 1)
  );
}

function getState() {
  if (typeof window === "undefined") return { mode: "hidden" };
  if (installed || isStandalone()) return { mode: "hidden" };
  if (deferredPrompt) return { mode: "prompt" };
  if (isIos()) return { mode: "ios" };
  return { mode: "hidden" };
}

function emit() {
  const next = getState();
  if (next.mode === snapshot.mode) return;
  snapshot = next;
  listeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    // Keep Chrome's own mini-infobar away; our button asks when people want it
    event.preventDefault();
    deferredPrompt = event;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    installed = true;
    deferredPrompt = null;
    emit();
  });
  window
    .matchMedia("(display-mode: standalone)")
    .addEventListener("change", emit);
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Shows the browser's install dialog. The event works once, so it's dropped
// either way; Chrome fires a fresh one later if the person said no.
async function promptInstall() {
  if (!deferredPrompt) return "unavailable";
  const event = deferredPrompt;
  deferredPrompt = null;
  emit();
  await event.prompt();
  const { outcome } = await event.userChoice;
  return outcome;
}

// mode: "prompt" (one press installs), "ios" (show the Share steps) or "hidden"
function useInstallApp() {
  const state = useSyncExternalStore(subscribe, () => snapshot);
  return { ...state, promptInstall };
}

export default useInstallApp;
