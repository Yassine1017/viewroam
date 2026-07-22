import { Camera, ExternalLink, ShieldCheck, X } from "lucide-react";
import { useEffect } from "react";
import type { ShotGuide } from "../types/shotGuide";

interface TipsSheetProps {
  guide: ShotGuide;
  isOpen: boolean;
  onClose: () => void;
}

export function TipsSheet({ guide, isOpen, onClose }: TipsSheetProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="sheet-layer">
      <button
        className="sheet-backdrop"
        type="button"
        aria-label="Close photography tips"
        onClick={onClose}
      />
      <section
        className="tips-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tips-title"
      >
        <div className="tips-sheet__handle" aria-hidden="true" />
        <header className="tips-sheet__header">
          <div>
            <span>{guide.name}</span>
            <h2 id="tips-title">Before you capture</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label="Close tips"
            onClick={onClose}
          >
            <X aria-hidden="true" size={22} strokeWidth={1.8} />
          </button>
        </header>

        <div className="tips-sheet__content">
          <article>
            <Camera aria-hidden="true" size={22} strokeWidth={1.7} />
            <div>
              <h3>Composition</h3>
              <p>{guide.shot_guide.composition_instruction}</p>
              <p>{guide.shot_guide.phone_camera_suggestion}</p>
            </div>
          </article>

          <article>
            <ShieldCheck aria-hidden="true" size={22} strokeWidth={1.7} />
            <div>
              <h3>Visit respectfully</h3>
              <p>{guide.rules_and_respect.guidance[1]}</p>
              <p>{guide.rules_and_respect.guidance[3]}</p>
              <p>
                Tripod permission is unverified. Follow current signs and staff
                instructions.
              </p>
            </div>
          </article>
        </div>

        <footer className="tips-sheet__footer">
          <span>Reference photo: {guide.reference_photo.creator}</span>
          <a
            href={guide.reference_photo.source_page}
            target="_blank"
            rel="noreferrer"
          >
            {guide.reference_photo.license}
            <ExternalLink aria-hidden="true" size={14} strokeWidth={1.7} />
          </a>
        </footer>
      </section>
    </div>
  );
}
