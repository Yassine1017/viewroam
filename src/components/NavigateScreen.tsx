import { ArrowLeft, Bookmark } from "lucide-react";
import type { ShotGuide } from "../types/shotGuide";
import { NavigationInstructions } from "./NavigationInstructions";
import { ShotMap } from "./ShotMap";

interface NavigateScreenProps {
  guide: ShotGuide;
  isSaved: boolean;
  onBack: () => void;
  onStartGuide: () => void;
  onToggleSaved: () => void;
}

export function NavigateScreen({
  guide,
  isSaved,
  onBack,
  onStartGuide,
  onToggleSaved,
}: NavigateScreenProps) {
  return (
    <div className="screen screen--navigate">
      <header className="route-header">
        <button
          className="icon-button"
          type="button"
          aria-label="Back to Explore"
          onClick={onBack}
        >
          <ArrowLeft aria-hidden="true" size={23} strokeWidth={1.8} />
        </button>
        <div>
          <span>Navigate to the shot</span>
          <strong>{guide.destination.neighborhood}</strong>
        </div>
        <button
          className={`icon-button ${isSaved ? "icon-button--saved" : ""}`}
          type="button"
          aria-label={isSaved ? "Remove from saved spots" : "Save spot"}
          aria-pressed={isSaved}
          onClick={onToggleSaved}
        >
          <Bookmark
            aria-hidden="true"
            fill={isSaved ? "currentColor" : "none"}
            size={21}
            strokeWidth={1.8}
          />
        </button>
      </header>

      <div className="place-heading">
        <div>
          <span className="eyebrow">
            Approximate route · Field check required
          </span>
          <h1>{guide.name}</h1>
        </div>
      </div>

      <main className="navigate-layout">
        <ShotMap guide={guide} />
        <NavigationInstructions
          guide={guide}
          isSaved={isSaved}
          onStartGuide={onStartGuide}
          onToggleSaved={onToggleSaved}
        />
      </main>
    </div>
  );
}
