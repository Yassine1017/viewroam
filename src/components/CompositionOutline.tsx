import type { CSSProperties } from "react";
import type { ShotGuide } from "../types/shotGuide";

interface CompositionOutlineProps {
  overlay: ShotGuide["shot_guide"]["composition_overlay"];
}

export function CompositionOutline({ overlay }: CompositionOutlineProps) {
  const style = {
    "--outline-top": `${overlay.top_percent}%`,
    "--outline-left": `${overlay.left_percent}%`,
    "--outline-width": `${overlay.width_percent}%`,
    "--outline-height": `${overlay.height_percent}%`,
  } as CSSProperties;

  return (
    <div
      className={`composition-outline composition-outline--${overlay.shape}`}
      style={style}
      aria-hidden="true"
    />
  );
}
