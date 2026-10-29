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
// The families a game is on, from its IGDB platform ids
export const familiesOf = (platformIds = []) =>
  PLATFORM_FAMILIES.filter((family) =>
    family.ids.some((id) => platformIds.includes(id)),
  );
const KNOWN = new Set(PLATFORM_FAMILIES.map((family) => family.key));
const STORAGE_PREFIX = "myPlatforms:";

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

  // Another device may have changed them since this session started
  useEffect(() => {
    if (!user_id) return;
    let active = true;
    getMyPlatforms().then(({ data }) => {
      const remote = clean(data);
      if (!active || !remote) return;
      writeLocal(user_id, remote);
      setSelected(remote);
    });
    return () => {
      active = false;
    };
  }, [user_id]);

  // Takes the whole set at once, so a menu applies its checks in one go
  function setPlatforms(keys) {
    const next = PLATFORM_FAMILIES.map((f) => f.key).filter((k) =>
      keys.includes(k),
    );
    setSelected(next);
    writeLocal(user_id, next);
    saveMyPlatforms(next);
  }

  const platformIds = useMemo(
    () =>
      PLATFORM_FAMILIES.filter((family) => selected.includes(family.key))
        .flatMap((family) => family.ids)
        .sort((a, b) => a - b),
    [selected],
  );

  return { selected, setPlatforms, platformIds };
}
