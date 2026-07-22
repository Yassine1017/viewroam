import { ExternalLink, Info } from "lucide-react";
import { useState } from "react";
import type { ShotGuide } from "../types/shotGuide";
import type { ComparisonMode, PhotoSelection } from "../types/photoMatch";
import { ComparisonControls } from "./ComparisonControls";
import { ComparisonViewer } from "./ComparisonViewer";
import { MatchActions } from "./MatchActions";
import { PhotoMatchHeader } from "./PhotoMatchHeader";
import { PhotoPrivacyNotice } from "./PhotoPrivacyNotice";

interface PhotoMatchScreenProps {
  error: string | null;
  guide: ShotGuide;
  isMatchSaved: boolean;
  onBack: () => void;
  onImageError: () => void;
  onReturn: () => void;
  onSave: () => void;
  onTryAnother: () => void;
  photo: PhotoSelection;
}

export function PhotoMatchScreen({
  error,
  guide,
  isMatchSaved,
  onBack,
  onImageError,
  onReturn,
  onSave,
  onTryAnother,
  photo,
}: PhotoMatchScreenProps) {
  const [mode, setMode] = useState<ComparisonMode>("overlay");
  const [opacity, setOpacity] = useState(55);
  const [showGrid, setShowGrid] = useState(true);
  return (
    <div className="screen screen--photo-match">
      <PhotoMatchHeader spotName={guide.name} onBack={onBack} />
      <main className="photo-match-layout">
        <div className="photo-match-stage">
          <ComparisonViewer
            mode={mode}
            opacity={opacity}
            overlay={guide.shot_guide.composition_overlay}
            showGrid={showGrid}
            targetPhoto={guide.reference_photo.local_path}
            userPhoto={photo}
            onUserImageError={onImageError}
          />
          <a
            className="photo-match-attribution"
            href={guide.reference_photo.source_page}
            target="_blank"
            rel="noreferrer"
          >
            Target photo: {guide.reference_photo.creator} ·{" "}
            {guide.reference_photo.license}
            <ExternalLink aria-hidden="true" size={13} strokeWidth={1.7} />
          </a>
        </div>
        <section className="photo-match-panel" aria-label="Photo Match tools">
          <div className="photo-match-intro">
            <h2>Compare your framing</h2>
            <p>Manual comparison — automatic analysis is not enabled.</p>
          </div>
          <ComparisonControls
            mode={mode}
            opacity={opacity}
            showGrid={showGrid}
            onModeChange={setMode}
            onOpacityChange={setOpacity}
            onToggleGrid={() => setShowGrid((isVisible) => !isVisible)}
          />
          {error ? (
            <p className="photo-match-error" role="alert">
              {error}
            </p>
          ) : null}
          {isMatchSaved ? (
            <div className="match-saved-status" role="status">
              <span>Match saved.</span>
              <small>The photo itself was not stored.</small>
            </div>
          ) : null}
          <PhotoPrivacyNotice />
          <div className="accuracy-note photo-match-accuracy">
            <Info aria-hidden="true" size={18} strokeWidth={1.7} />
            <span>Position approximate · Field check required</span>
          </div>
          <MatchActions
            hasError={Boolean(error)}
            isSaved={isMatchSaved}
            onReturn={onReturn}
            onSave={onSave}
            onTryAnother={onTryAnother}
          />
        </section>
      </main>
    </div>
  );
}
