import { Camera, Info, Lightbulb, LocateFixed, Users } from "lucide-react";
import { useState } from "react";
import type { ShotGuide } from "../types/shotGuide";
import { Button } from "./Button";
import { CameraSettings } from "./CameraSettings";
import { ShotGuideHeader } from "./ShotGuideHeader";
import { TipsSheet } from "./TipsSheet";
import { Viewfinder } from "./Viewfinder";

interface ShotGuideScreenProps {
  guide: ShotGuide;
  isSaved: boolean;
  onBack: () => void;
  onCapture: () => void;
  onToggleSaved: () => void;
}

export function ShotGuideScreen({
  guide,
  isSaved,
  onBack,
  onCapture,
  onToggleSaved,
}: ShotGuideScreenProps) {
  const [isTipsOpen, setIsTipsOpen] = useState(false);
  return (
    <div className="screen screen--guide">
      <ShotGuideHeader
        guide={guide}
        isSaved={isSaved}
        onBack={onBack}
        onToggleSaved={onToggleSaved}
      />
      <main className="guide-layout">
        <Viewfinder guide={guide} />
        <section className="guide-controls" aria-label="Shot instructions">
          <span className="eyebrow">Recommended framing</span>
          <h1>{guide.shot_guide.composition_short_instruction}</h1>
          <CameraSettings guide={guide} />
          <div className="area-status" role="status">
            <LocateFixed aria-hidden="true" size={20} strokeWidth={2} />
            <span>Approximate area — confirm on site</span>
          </div>
          <div className="guide-controls__actions">
            <Button
              fullWidth
              icon={<Camera aria-hidden="true" size={22} strokeWidth={1.8} />}
              onClick={onCapture}
            >
              Capture
            </Button>
            <Button
              fullWidth
              icon={
                <Lightbulb aria-hidden="true" size={21} strokeWidth={1.7} />
              }
              variant="secondary"
              onClick={() => setIsTipsOpen(true)}
            >
              View tips
            </Button>
          </div>
          <div className="respect-note">
            <Users aria-hidden="true" size={22} strokeWidth={1.6} />
            <p>
              {guide.rules_and_respect.guidance[0]}
              <br />
              {guide.rules_and_respect.guidance[1]}
            </p>
          </div>
          <div className="accuracy-note">
            <Info aria-hidden="true" size={18} strokeWidth={1.7} />
            <span>Position approximate · Field check required</span>
          </div>
        </section>
      </main>
      <TipsSheet
        guide={guide}
        isOpen={isTipsOpen}
        onClose={() => setIsTipsOpen(false)}
      />
    </div>
  );
}
