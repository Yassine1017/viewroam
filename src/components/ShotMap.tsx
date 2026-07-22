import L from "leaflet";
import { LocateFixed } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ShotGuide } from "../types/shotGuide";

interface ShotMapProps {
  guide: ShotGuide;
}
type MapPoint = [number, number];

function pointAtBearing(
  origin: MapPoint,
  distanceMeters: number,
  bearingDegrees: number,
): MapPoint {
  const radius = 6_371_000;
  const angularDistance = distanceMeters / radius;
  const bearing = (bearingDegrees * Math.PI) / 180;
  const latitude = (origin[0] * Math.PI) / 180;
  const longitude = (origin[1] * Math.PI) / 180;
  const destinationLatitude = Math.asin(
    Math.sin(latitude) * Math.cos(angularDistance) +
      Math.cos(latitude) * Math.sin(angularDistance) * Math.cos(bearing),
  );
  const destinationLongitude =
    longitude +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(latitude),
      Math.cos(angularDistance) -
        Math.sin(latitude) * Math.sin(destinationLatitude),
    );
  return [
    (destinationLatitude * 180) / Math.PI,
    (destinationLongitude * 180) / Math.PI,
  ];
}

function cameraMarkerHtml() {
  return `<span class="map-camera-marker" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4 16 7h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l1.5-3z"/><circle cx="12" cy="13" r="3.25"/></svg></span>`;
}

function subjectMarkerHtml() {
  return `<span class="map-tower-marker" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg></span>`;
}

export function ShotMap({ guide }: ShotMapProps) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const boundsRef = useRef<L.LatLngBounds | null>(null);

  useEffect(() => {
    if (!mapElementRef.current) return;
    const shootingPoint: MapPoint = [
      guide.shooting_area.coordinates.latitude,
      guide.shooting_area.coordinates.longitude,
    ];
    const subjectPoint: MapPoint = [
      guide.subject.coordinates.latitude,
      guide.subject.coordinates.longitude,
    ];
    const userPoint: MapPoint = [
      guide.navigation.simulated_start.latitude,
      guide.navigation.simulated_start.longitude,
    ];
    const route = guide.navigation.route.map(
      ({ latitude, longitude }) => [latitude, longitude] as MapPoint,
    );
    const bearing = guide.shot_guide.camera_bearing_degrees;
    const coneDistance = Math.min(
      225,
      Math.max(90, guide.shooting_area.coordinates.radius_meters ?? 120),
    );
    const coneLeft = pointAtBearing(shootingPoint, coneDistance, bearing - 13);
    const coneRight = pointAtBearing(shootingPoint, coneDistance, bearing + 13);

    const map = L.map(mapElementRef.current, {
      zoomControl: false,
      attributionControl: true,
      minZoom: 14,
      maxZoom: 19,
    });
    mapInstanceRef.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.circle(shootingPoint, {
      radius: guide.shooting_area.coordinates.radius_meters ?? 35,
      color: "#ea5a32",
      fillColor: "#f8a286",
      fillOpacity: 0.22,
      weight: 2,
    })
      .addTo(map)
      .bindTooltip("Approximate shooting area", {
        direction: "top",
        className: "map-tooltip",
      });

    L.polygon([shootingPoint, coneLeft, coneRight], {
      color: "#e65a31",
      fillColor: "#f06a43",
      fillOpacity: 0.28,
      weight: 1.5,
      dashArray: "6 5",
    })
      .addTo(map)
      .bindTooltip(
        `${bearing}° ${guide.shot_guide.camera_bearing_short_label} view`,
        { direction: "center", className: "map-tooltip" },
      );

    L.polyline(route, {
      color: "#f05b32",
      weight: 5,
      dashArray: "2 10",
      lineCap: "round",
    }).addTo(map);

    L.marker(shootingPoint, {
      icon: L.divIcon({
        className: "map-marker-shell",
        html: cameraMarkerHtml(),
        iconSize: [44, 52],
        iconAnchor: [22, 46],
      }),
      keyboard: true,
      title: "Approximate camera position",
    })
      .addTo(map)
      .bindPopup(
        "<strong>Approximate camera position</strong><br>Field check required",
      );

    L.marker(subjectPoint, {
      icon: L.divIcon({
        className: "map-marker-shell",
        html: subjectMarkerHtml(),
        iconSize: [48, 58],
        iconAnchor: [24, 52],
      }),
      keyboard: true,
      title: guide.subject.name,
    })
      .addTo(map)
      .bindTooltip(guide.subject.name, {
        permanent: true,
        direction: "bottom",
        offset: [0, 4],
        className: "map-label",
      });

    L.circleMarker(userPoint, {
      radius: 9,
      color: "#ffffff",
      fillColor: "#2e8be8",
      fillOpacity: 1,
      weight: 4,
    })
      .addTo(map)
      .bindTooltip("Simulated starting position", {
        direction: "top",
        className: "map-tooltip",
      });

    const bounds = L.latLngBounds([...route, subjectPoint]).pad(0.25);
    boundsRef.current = bounds;
    map.fitBounds(bounds, { maxZoom: 17 });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [guide]);

  function recenterMap() {
    if (boundsRef.current)
      mapInstanceRef.current?.fitBounds(boundsRef.current, {
        animate: true,
        maxZoom: 17,
      });
  }

  return (
    <section
      className="map-frame"
      aria-label={`Approximate walking route to ${guide.name}`}
    >
      <div className="map-frame__canvas" ref={mapElementRef} />
      <div className="map-frame__legend" aria-hidden="true">
        <span /> Approximate area
      </div>
      <button
        className="map-frame__recenter"
        type="button"
        aria-label="Show route and subject"
        onClick={recenterMap}
      >
        <LocateFixed aria-hidden="true" size={21} strokeWidth={1.8} />
      </button>
    </section>
  );
}
