import { useEffect, useMemo, useState } from "react";
import { getMyPlatforms, saveMyPlatforms } from "@/api/supabase";
import { UserToken } from "@/hooks/useUserToken";

// Platforms by family: a newer console also plays the older one's games
export const PLATFORM_FAMILIES = [
  { key: "pc", name: "PC", ids: [6] },
  { key: "playstation", name: "PlayStation", ids: [167, 48] },
  { key: "xbox", name: "Xbox", ids: [169, 49] },
  { key: "switch", name: "Switch", ids: [130] },
];
const KNOWN = new Set(PLATFORM_FAMILIES.map((family) => family.key));
const STORAGE_PREFIX = "myPlatforms:";
// Toggling a few chips in a row builds the picks once
const APPLY_DELAY = 600;

const clean = (keys) =>
  Array.isArray(keys) ? keys.filter((key) => KNOWN.has(key)) : null;

function readLocal(user_id) {
  try {
    return clean(JSON.parse(localStorage.getItem(STORAGE_PREFIX + user_id)));
  } catch {
    return null;
  }
}

function writeLocal(user_id, keys) {
  try {
    localStorage.setItem(STORAGE_PREFIX + user_id, JSON.stringify(keys));
  } catch {
    // Storage blocked, the account copy still has them
  }
}

// The player's platforms. None picked means every platform.
export function useMyPlatforms() {
  const user = UserToken()?.user;
  const user_id = user?.id;
  const [selected, setSelected] = useState(
    () => readLocal(user_id) ?? clean(user?.user_metadata?.platforms) ?? [],
  );
  const [applied, setApplied] = useState(selected);

  // Another device may have changed them since this session started
  useEffect(() => {
    if (!user_id) return;
    let active = true;
    getMyPlatforms().then(({ data }) => {
      const remote = clean(data);
      if (!active || !remote) return;
      writeLocal(user_id, remote);
      setSelected(remote);
      setApplied(remote);
    });
    return () => {
      active = false;
    };
  }, [user_id]);

  useEffect(() => {
    if (selected === applied) return;
    const timer = setTimeout(() => setApplied(selected), APPLY_DELAY);
    return () => clearTimeout(timer);
  }, [selected, applied]);

  function toggle(key) {
    const next = selected.includes(key)
      ? selected.filter((k) => k !== key)
      : PLATFORM_FAMILIES.map((f) => f.key).filter(
          (k) => k === key || selected.includes(k),
        );
    setSelected(next);
    writeLocal(user_id, next);
    saveMyPlatforms(next);
  }

  const platformIds = useMemo(
    () =>
      PLATFORM_FAMILIES.filter((family) => applied.includes(family.key))
        .flatMap((family) => family.ids)
        .sort((a, b) => a - b),
    [applied],
  );

  return {
    selected,
    toggle,
    platformIds,
    // Waiting out the delay before the new choice applies
    isApplying: selected !== applied,
  };
}
