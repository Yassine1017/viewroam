import type { ComparisonMode, PhotoSelection } from "../types/photoMatch";
import type { ShotGuide } from "../types/shotGuide";
import { CompositionOutline } from "./CompositionOutline";

interface ComparisonViewerProps {
  mode: ComparisonMode;
  onUserImageError: () => void;
  opacity: number;
  showGrid: boolean;
  targetPhoto: string;
  userPhoto: PhotoSelection;
  overlay: ShotGuide["shot_guide"]["composition_overlay"];
}

export function ComparisonViewer({
  mode,
  onUserImageError,
  opacity,
  showGrid,
  targetPhoto,
  userPhoto,
  overlay,
}: ComparisonViewerProps) {
  const showUserPhoto = mode !== "target";
  const showTargetPhoto = mode !== "user";
  const targetOpacity = mode === "overlay" ? opacity / 100 : 1;

  return (
    <section className="comparison-viewer" aria-label="Manual photo comparison">
      {showUserPhoto ? (
        <img
          className={`comparison-viewer__photo comparison-viewer__photo--user ${
            userPhoto.kind === "demo" ? "comparison-viewer__photo--demo" : ""
          }`}
          src={userPhoto.url}
          alt="Your selected photograph"
          onError={onUserImageError}
        />
      ) : null}

      {showTargetPhoto ? (
        <img
          className="comparison-viewer__photo comparison-viewer__photo--target"
          src={targetPhoto}
          alt="Target composition photograph"
          style={{ opacity: targetOpacity }}
        />
      ) : null}

      {showGrid ? (
        <div className="comparison-viewer__grid" aria-hidden="true">
          <span className="viewfinder__line viewfinder__line--v-one" />
          <span className="viewfinder__line viewfinder__line--v-two" />
          <span className="viewfinder__line viewfinder__line--h-one" />
          <span className="viewfinder__line viewfinder__line--h-two" />
        </div>
      ) : null}

      <CompositionOutline overlay={overlay} />

      <div className="comparison-viewer__label" aria-hidden="true">
        {mode === "overlay"
          ? "Overlay comparison"
          : mode === "target"
            ? "Target photo"
            : "Your photo"}
      </div>
    </section>
  );
}
