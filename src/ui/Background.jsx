import GradientBlinds from "@/components/GradientBlinds";
import LiquidEther from "@/components/LiquidEther";

function Background({ className }) {
  return (
    <div
      style={{ width: "100%", height: "91dvh", position: "relative" }}
      className={className}
    >
      <GradientBlinds
        gradientColors={["#5d0ec1"]}
        angle={-24}
        noise={0.3}
        blindCount={64}
        blindMinWidth={45}
        spotlightRadius={0.3}
        spotlightSoftness={1}
        spotlightOpacity={1}
        mouseDampening={0.15}
        distortAmount={1}
        shineDirection="left"
        mixBlendMode="lighten"
      />
    </div>
  );
}

export default Background;
