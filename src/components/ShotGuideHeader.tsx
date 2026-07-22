import { ArrowLeft, Bookmark, MoreHorizontal } from "lucide-react";
import type { ShotGuide } from "../types/shotGuide";

interface ShotGuideHeaderProps {
  guide: ShotGuide;
  isSaved: boolean;
  onBack: () => void;
  onToggleSaved: () => void;
}

export function ShotGuideHeader({
  guide,
  isSaved,
  onBack,
  onToggleSaved,
}: ShotGuideHeaderProps) {
  return (
    <header className="shot-header">
      <button
        className="icon-button"
        type="button"
        aria-label="Back to map"
        onClick={onBack}
      >
        <ArrowLeft aria-hidden="true" size={23} strokeWidth={1.8} />
      </button>
      <div className="shot-header__title">
        <strong>Shot Guide</strong>
        <span>{guide.name}</span>
      </div>
      <div className="shot-header__actions">
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
            size={20}
            strokeWidth={1.8}
          />
        </button>
        <button className="icon-button" type="button" aria-label="More options">
          <MoreHorizontal aria-hidden="true" size={22} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}
