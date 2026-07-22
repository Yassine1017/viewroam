import { Compass, ExternalLink } from "lucide-react";
import type { ShotGuide } from "../types/shotGuide";
import { CompositionOutline } from "./CompositionOutline";

interface ViewfinderProps {
  guide: ShotGuide;
}

export function Viewfinder({ guide }: ViewfinderProps) {
  const imagePath = guide.reference_photo.local_path;

  return (
    <section className="viewfinder" aria-label="Shot composition preview">
      <img
        className="viewfinder__image"
        src={imagePath}
        alt={guide.reference_photo.alt_text}
      />
      <div className="viewfinder__grid" aria-hidden="true">
        <span className="viewfinder__line viewfinder__line--v-one" />
        <span className="viewfinder__line viewfinder__line--v-two" />
        <span className="viewfinder__line viewfinder__line--h-one" />
        <span className="viewfinder__line viewfinder__line--h-two" />
      </div>
      <div className="viewfinder__bearing">
        <Compass aria-hidden="true" size={22} strokeWidth={1.7} />
        <strong>{guide.shot_guide.camera_bearing_degrees}°</strong>
      </div>
      <CompositionOutline overlay={guide.shot_guide.composition_overlay} />
      <div className="viewfinder__level" aria-label="Camera level">
        <span />
        <small>level</small>
      </div>
      <figure className="target-view">
        <img src={imagePath} alt="Target composition preview" />
        <figcaption>Target view</figcaption>
      </figure>
      <a
        className="viewfinder__attribution"
        href={guide.reference_photo.source_page}
        target="_blank"
        rel="noreferrer"
      >
        Photo: {guide.reference_photo.creator} · {guide.reference_photo.license}
        <ExternalLink aria-hidden="true" size={11} />
      </a>
    </section>
  );
}
