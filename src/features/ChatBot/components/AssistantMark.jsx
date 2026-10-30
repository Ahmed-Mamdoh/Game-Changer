import { Sparkles } from "lucide-react";
import { IoGameController } from "react-icons/io5";

// The assistant's face: the site's gamepad logo with a spark for "AI"
const SIZES = {
  sm: { pad: "h-3.5 w-3.5", spark: "h-2 w-2 -top-0.5 -right-1" },
  md: { pad: "h-6 w-6", spark: "h-3 w-3 -top-1 -right-1.5" },
  lg: { pad: "h-9 w-9", spark: "h-4 w-4 -top-1.5 -right-2" },
};

function AssistantMark({ size = "md" }) {
  const { pad, spark } = SIZES[size];
  return (
    <span className="relative inline-flex" aria-hidden>
      <IoGameController className={`text-pulse-primary ${pad}`} />
      <Sparkles
        className={`text-pulse-accent fill-pulse-accent absolute ${spark}`}
        strokeWidth={1.5}
      />
    </span>
  );
}

export default AssistantMark;
