import { useState } from "react";
import { backdropSrcSet, pickBackdrop } from "@/utils/igdbImage";

// Full-bleed game art that blurs up: a ~1 KB version of the same image shows
// at once, and the sharp file fades in over it when it finishes loading.
// className positions the wrapper; imgClassName styles both images.
function BackdropImage({
  game,
  className = "",
  imgClassName = "",
  ...imgProps
}) {
  const [loadedSrc, setLoadedSrc] = useState(null);
  const src = pickBackdrop(game);
  if (!src) return null;
  const isLoaded = loadedSrc === src;

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <img
        src={pickBackdrop(game, "t_cover_small")}
        alt=""
        fetchPriority="high"
        className={`absolute inset-0 h-full w-full scale-110 object-cover blur-2xl ${imgClassName}`}
      />
      <img
        src={src}
        srcSet={backdropSrcSet(game)}
        sizes="max(100vw, 178vh)"
        alt=""
        // A cached image can finish before React attaches onLoad
        ref={(img) => img?.complete && img.naturalWidth && setLoadedSrc(src)}
        onLoad={() => setLoadedSrc(src)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${imgClassName}`}
        {...imgProps}
      />
    </div>
  );
}

export default BackdropImage;
