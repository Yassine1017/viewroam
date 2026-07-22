import {
  AlertTriangle,
  Bookmark,
  Camera,
  Check,
  ChevronDown,
  Footprints,
  LocateFixed,
  Navigation,
  Sunrise,
} from "lucide-react";
import { useState } from "react";
import type { ShotGuide } from "../types/shotGuide";
import { Button } from "./Button";

interface NavigationInstructionsProps {
  guide: ShotGuide;
  isSaved: boolean;
  onStartGuide: () => void;
  onToggleSaved: () => void;
}

export function NavigationInstructions({
  guide,
  isSaved,
  onStartGuide,
  onToggleSaved,
}: NavigationInstructionsProps) {
  const [showConditionDetails, setShowConditionDetails] = useState(false);
  const liveCondition = guide.live_conditions[0];

  return (
    <section className="navigation-panel" aria-label="Route instructions">
      <div className="instruction-list">
        <article className="instruction-row">
          <span className="instruction-row__icon">
            <Footprints aria-hidden="true" size={22} strokeWidth={1.8} />
          </span>
          <div>
            <h2>Walk about {guide.navigation.walking_distance_meters} m</h2>
            <p>
              Estimated {guide.navigation.walking_time_minutes} min · confirm
              the route on site.
            </p>
          </div>
        </article>
        <article className="instruction-row">
          <span className="instruction-row__icon">
            <LocateFixed aria-hidden="true" size={22} strokeWidth={1.8} />
          </span>
          <div>
            <h2>Stand in the marked area</h2>
            <p>{guide.shooting_area.standing_instruction}</p>
          </div>
        </article>
        <article className="instruction-row">
          <span className="instruction-row__icon">
            <Navigation aria-hidden="true" size={22} strokeWidth={1.8} />
          </span>
          <div>
            <h2>
              Face {guide.shot_guide.camera_bearing_degrees}°{" "}
              {guide.shot_guide.camera_bearing_short_label}
            </h2>
            <p>{guide.shot_guide.composition_short_instruction}</p>
          </div>
        </article>
      </div>

      <div className="timing-row">
        <Sunrise aria-hidden="true" size={20} strokeWidth={1.7} />
        <span>Best {guide.timing_and_light.short_label}</span>
      </div>

      <button
        className={`condition-alert condition-alert--${liveCondition.severity}`}
        type="button"
        aria-expanded={showConditionDetails}
        onClick={() => setShowConditionDetails((isOpen) => !isOpen)}
      >
        <AlertTriangle aria-hidden="true" size={22} strokeWidth={1.8} />
        <span>
          <strong>{liveCondition.title}</strong>
          <small>Reviewed {guide.quality.last_researched_at}</small>
        </span>
        <ChevronDown
          className={showConditionDetails ? "is-rotated" : ""}
          aria-hidden="true"
          size={18}
          strokeWidth={1.8}
        />
      </button>
      {showConditionDetails ? (
        <p className="condition-details">{liveCondition.message}</p>
      ) : null}

      <div className="navigation-panel__actions">
        <Button
          fullWidth
          icon={<Camera aria-hidden="true" size={21} strokeWidth={1.8} />}
          onClick={onStartGuide}
        >
          Start Shot Guide
        </Button>
        <Button
          fullWidth
          icon={
            isSaved ? (
              <Check aria-hidden="true" size={21} strokeWidth={1.8} />
            ) : (
              <Bookmark aria-hidden="true" size={21} strokeWidth={1.8} />
            )
          }
          variant="secondary"
          aria-pressed={isSaved}
          onClick={onToggleSaved}
        >
          {isSaved ? "Saved" : "Save spot"}
        </Button>
      </div>
    </section>
  );
}
