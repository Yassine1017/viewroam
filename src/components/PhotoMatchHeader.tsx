import { ArrowLeft } from "lucide-react";

interface PhotoMatchHeaderProps {
  spotName: string;
  onBack: () => void;
}

export function PhotoMatchHeader({ spotName, onBack }: PhotoMatchHeaderProps) {
  return (
    <header className="shot-header photo-match-header">
      <button
        className="icon-button"
        type="button"
        aria-label="Back to Shot Guide"
        onClick={onBack}
      >
        <ArrowLeft aria-hidden="true" size={23} strokeWidth={1.8} />
      </button>
      <div className="shot-header__title">
        <h1>Photo Match</h1>
        <span>{spotName}</span>
      </div>
      <span className="photo-match-header__spacer" aria-hidden="true" />
    </header>
  );
}
