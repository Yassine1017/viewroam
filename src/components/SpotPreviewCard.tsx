import {
  Bookmark,
  Camera,
  Check,
  Clock3,
  ExternalLink,
  MapPin,
} from "lucide-react";
import type { ShotGuide } from "../types/shotGuide";
import { Button } from "./Button";

interface SpotPreviewCardProps {
  guide: ShotGuide;
  isSaved: boolean;
  isSelected: boolean;
  onOpenGuide: () => void;
  onSelect: () => void;
  onToggleSaved: () => void;
}

export function SpotPreviewCard({
  guide,
  isSaved,
  isSelected,
  onOpenGuide,
  onSelect,
  onToggleSaved,
}: SpotPreviewCardProps) {
  return (
    <article
      className={`spot-card ${isSelected ? "is-selected" : ""}`}
      data-guide-id={guide.id}
      id={`spot-card-${guide.id}`}
    >
      <button
        className="spot-card__preview"
        type="button"
        aria-label={`Select ${guide.name} on map`}
        aria-pressed={isSelected}
        onClick={onSelect}
      >
        <img
          src={guide.reference_photo.local_path}
          alt={guide.reference_photo.alt_text}
        />
        <span className="spot-card__number" aria-hidden="true">
          {guide.shot_guide.camera_bearing_short_label}
        </span>
        <span className="spot-card__status">Field check required</span>
      </button>

      <div className="spot-card__body">
        <div className="spot-card__heading">
          <button
            className="spot-card__select"
            type="button"
            aria-pressed={isSelected}
            onClick={onSelect}
          >
            <span>{guide.destination.neighborhood}</span>
            <h3>{guide.name}</h3>
            <small>{isSelected ? "Selected on map" : "Show on map"}</small>
          </button>
          <button
            className={`icon-button ${isSaved ? "icon-button--saved" : ""}`}
            type="button"
            aria-label={
              isSaved ? `Remove ${guide.name} from saved` : `Save ${guide.name}`
            }
            aria-pressed={isSaved}
            onClick={onToggleSaved}
          >
            {isSaved ? (
              <Check aria-hidden="true" size={20} />
            ) : (
              <Bookmark aria-hidden="true" size={20} />
            )}
          </button>
        </div>

        <div className="spot-card__facts">
          <span>
            <Clock3 aria-hidden="true" size={16} />
            {guide.timing_and_light.short_label}
          </span>
          <span>
            <MapPin aria-hidden="true" size={16} />
            Approximate shooting area
          </span>
        </div>

        <a
          className="spot-card__credit"
          href={guide.reference_photo.source_page}
          target="_blank"
          rel="noreferrer"
        >
          Photo: {guide.reference_photo.creator} ·{" "}
          {guide.reference_photo.license}
          <ExternalLink aria-hidden="true" size={11} />
        </a>

        <p>{guide.short_description}</p>

        <Button
          fullWidth
          icon={<Camera aria-hidden="true" size={19} />}
          onClick={onOpenGuide}
        >
          Open Shot Guide
        </Button>
      </div>
    </article>
  );
}
