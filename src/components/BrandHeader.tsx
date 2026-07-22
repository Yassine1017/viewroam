import { ChevronDown, MapPin } from "lucide-react";

export function BrandHeader() {
  return (
    <header className="brand-header">
      <div className="brand-lockup" aria-label="ViewRoam — Chase the view.">
        <span className="brand-lockup__name">ViewRoam</span>
        <span className="brand-lockup__tagline">Chase the view.</span>
      </div>

      <div className="brand-header__actions">
        <button className="location-control" type="button" aria-label="Tokyo">
          <MapPin aria-hidden="true" size={19} strokeWidth={1.8} />
          <span>Tokyo</span>
          <ChevronDown aria-hidden="true" size={14} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}
