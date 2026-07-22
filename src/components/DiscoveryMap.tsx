import L from "leaflet";
import { LocateFixed } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ShotGuide } from "../types/shotGuide";

interface DiscoveryMapProps {
  guides: ShotGuide[];
  selectedGuideId: string;
  onSelectGuide: (guideId: string) => void;
}

const TOKYO_CENTER: L.LatLngExpression = [35.6828, 139.7588];

function pinHtml(index: number, isSelected: boolean) {
  return `<span class="discovery-pin${isSelected ? " is-selected" : ""}"><strong>${index + 1}</strong></span>`;
}

function makePinIcon(index: number, isSelected: boolean) {
  return L.divIcon({
    className: "discovery-pin-shell",
    html: pinHtml(index, isSelected),
    iconSize: [44, 52],
    iconAnchor: [22, 46],
  });
}

function setMarkerAccessibility(
  marker: L.Marker,
  guide: ShotGuide,
  index: number,
  isSelected: boolean,
) {
  const markerElement = marker.getElement();
  markerElement?.setAttribute(
    "aria-label",
    `${index + 1}. ${guide.name}, approximate shooting area${isSelected ? ", selected" : ""}`,
  );
  markerElement?.setAttribute("aria-pressed", String(isSelected));
}

export function DiscoveryMap({
  guides,
  selectedGuideId,
  onSelectGuide,
}: DiscoveryMapProps) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const boundsRef = useRef<L.LatLngBounds | null>(null);
  const markerRefs = useRef(new Map<string, L.Marker>());
  const lastPannedGuideIdRef = useRef(selectedGuideId);
  const onSelectGuideRef = useRef(onSelectGuide);
  const selectedGuideIdRef = useRef(selectedGuideId);

  useEffect(() => {
    onSelectGuideRef.current = onSelectGuide;
  }, [onSelectGuide]);

  useEffect(() => {
    selectedGuideIdRef.current = selectedGuideId;
  }, [selectedGuideId]);

  useEffect(() => {
    if (!mapElementRef.current) return;

    const markers = markerRefs.current;
    const map = L.map(mapElementRef.current, {
      attributionControl: true,
      minZoom: 10,
      maxZoom: 19,
      zoomControl: false,
    });
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);

    const bounds = L.latLngBounds([]);
    guides.forEach((guide, index) => {
      const point: L.LatLngExpression = [
        guide.shooting_area.coordinates.latitude,
        guide.shooting_area.coordinates.longitude,
      ];
      bounds.extend(point);

      const isSelected = guide.id === selectedGuideIdRef.current;
      const marker = L.marker(point, {
        icon: makePinIcon(index, isSelected),
        keyboard: true,
        title: `${guide.name} — approximate area`,
      }).addTo(map);

      markers.set(guide.id, marker);
      marker.setZIndexOffset(isSelected ? 1000 : 0);
      setMarkerAccessibility(marker, guide, index, isSelected);
      marker.bindTooltip(guide.name, {
        direction: "top",
        offset: [0, -42],
        className: "map-tooltip",
      });
      marker.on("click", () => onSelectGuideRef.current(guide.id));
    });

    boundsRef.current = bounds;
    lastPannedGuideIdRef.current = selectedGuideIdRef.current;
    map.fitBounds(bounds.pad(0.22), { maxZoom: 12 });

    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(mapElementRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      boundsRef.current = null;
      markers.clear();
    };
  }, [guides]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    guides.forEach((guide, index) => {
      const marker = markerRefs.current.get(guide.id);
      if (!marker) return;

      const isSelected = guide.id === selectedGuideId;
      marker.setIcon(makePinIcon(index, isSelected));
      marker.setZIndexOffset(isSelected ? 1000 : 0);
      setMarkerAccessibility(marker, guide, index, isSelected);
    });

    if (lastPannedGuideIdRef.current === selectedGuideId) return;

    const selectedGuide = guides.find((guide) => guide.id === selectedGuideId);
    if (!selectedGuide) return;

    const target = L.latLng(
      selectedGuide.shooting_area.coordinates.latitude,
      selectedGuide.shooting_area.coordinates.longitude,
    );
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const targetZoom = map.getZoom() < 11.5 ? 12 : map.getZoom();

    map.flyTo(target, targetZoom, {
      animate: !prefersReducedMotion,
      duration: prefersReducedMotion ? 0 : 0.55,
    });
    lastPannedGuideIdRef.current = selectedGuideId;
  }, [guides, selectedGuideId]);

  function recenterMap() {
    const map = mapInstanceRef.current;
    if (!map) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const bounds = boundsRef.current;
    if (bounds) {
      map.fitBounds(bounds.pad(0.22), {
        animate: !prefersReducedMotion,
        duration: prefersReducedMotion ? 0 : 0.45,
        maxZoom: 12,
      });
      return;
    }

    map.setView(TOKYO_CENTER, 11, { animate: !prefersReducedMotion });
  }

  return (
    <section
      className="discovery-map"
      aria-label="Map of five Tokyo photo spots"
    >
      <div className="discovery-map__canvas" ref={mapElementRef} />
      <div className="discovery-map__badge">5 remote-researched spots</div>
      <button
        className="map-frame__recenter"
        type="button"
        aria-label="Show all Tokyo spots"
        onClick={recenterMap}
      >
        <LocateFixed aria-hidden="true" size={21} strokeWidth={1.8} />
      </button>
    </section>
  );
}
