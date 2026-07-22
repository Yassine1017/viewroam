import { Grid3X3 } from "lucide-react";
import type { ComparisonMode } from "../types/photoMatch";

interface ComparisonControlsProps {
  mode: ComparisonMode;
  onModeChange: (mode: ComparisonMode) => void;
  onOpacityChange: (opacity: number) => void;
  onToggleGrid: () => void;
  opacity: number;
  showGrid: boolean;
}

const modes: Array<{ label: string; value: ComparisonMode }> = [
  { label: "Overlay", value: "overlay" },
  { label: "Target", value: "target" },
  { label: "Your photo", value: "user" },
];

export function ComparisonControls({
  mode,
  onModeChange,
  onOpacityChange,
  onToggleGrid,
  opacity,
  showGrid,
}: ComparisonControlsProps) {
  return (
    <section className="comparison-controls" aria-label="Comparison controls">
      <div className="comparison-controls__group">
        <span className="comparison-controls__label">View</span>
        <div className="comparison-modes" role="group" aria-label="Photo view">
          {modes.map((item) => (
            <button
              className={`comparison-modes__item ${
                mode === item.value ? "is-active" : ""
              }`}
              key={item.value}
              type="button"
              aria-pressed={mode === item.value}
              onClick={() => onModeChange(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="comparison-controls__group">
        <div className="comparison-controls__range-label">
          <label htmlFor="target-opacity">Target opacity</label>
          <output htmlFor="target-opacity">{opacity}%</output>
        </div>
        <input
          id="target-opacity"
          className="comparison-opacity"
          type="range"
          min="0"
          max="100"
          step="5"
          value={opacity}
          disabled={mode !== "overlay"}
          aria-label="Target photograph opacity"
          onChange={(event) => onOpacityChange(Number(event.target.value))}
        />
      </div>

      <button
        className="grid-toggle"
        type="button"
        aria-pressed={showGrid}
        onClick={onToggleGrid}
      >
        <Grid3X3 aria-hidden="true" size={19} strokeWidth={1.7} />
        <span>Composition grid</span>
        <strong>{showGrid ? "On" : "Off"}</strong>
      </button>
    </section>
  );
}
