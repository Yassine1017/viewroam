import {
  Aperture,
  CloudSun,
  RectangleHorizontal,
  RectangleVertical,
} from "lucide-react";
import type { ShotGuide } from "../types/shotGuide";

interface CameraSettingsProps {
  guide: ShotGuide;
}

export function CameraSettings({ guide }: CameraSettingsProps) {
  const orientation = guide.shot_guide.orientation[0];
  const OrientationIcon =
    orientation === "portrait" ? RectangleVertical : RectangleHorizontal;
  const settings = [
    {
      label: `${guide.shot_guide.recommended_focal_length_full_frame_mm.starting_point} mm`,
      Icon: Aperture,
    },
    {
      label: orientation === "portrait" ? "Portrait" : "Landscape",
      Icon: OrientationIcon,
    },
    { label: guide.timing_and_light.short_label, Icon: CloudSun },
  ];

  return (
    <div
      className="camera-settings"
      aria-label="Recommended starting settings"
      role="list"
    >
      {settings.map(({ label, Icon }) => (
        <div className="camera-setting" role="listitem" key={label}>
          <Icon aria-hidden="true" size={19} strokeWidth={1.7} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
