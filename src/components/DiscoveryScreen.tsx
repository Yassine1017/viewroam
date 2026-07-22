import { Bookmark, Info, Luggage } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ShotGuide } from "../types/shotGuide";
import { BottomNavigation, type NavigationItem } from "./BottomNavigation";
import { BrandHeader } from "./BrandHeader";
import { DiscoveryMap } from "./DiscoveryMap";
import { SpotPreviewCard } from "./SpotPreviewCard";
import { SpotSearch } from "./SpotSearch";

interface DiscoveryScreenProps {
  activeNavigation: NavigationItem;
  guides: ShotGuide[];
  savedSpotIds: string[];
  selectedGuideId: string;
  onNavigationChange: (item: NavigationItem) => void;
  onOpenGuide: (guideId: string) => void;
  onSelectGuide: (guideId: string) => void;
  onToggleSaved: (guideId: string) => void;
}

export function DiscoveryScreen({
  activeNavigation,
  guides,
  savedSpotIds,
  selectedGuideId,
  onNavigationChange,
  onOpenGuide,
  onSelectGuide,
  onToggleSaved,
}: DiscoveryScreenProps) {
  const [query, setQuery] = useState("");
  const carouselScrollTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (carouselScrollTimerRef.current !== null) {
        window.clearTimeout(carouselScrollTimerRef.current);
      }
    },
    [],
  );

  const scrollToGuideCard = useCallback((guideId: string) => {
    let remainingAttempts = 3;

    function scrollWhenReady() {
      const card = document.getElementById(`spot-card-${guideId}`);

      if (card) {
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const behavior = prefersReducedMotion ? "auto" : "smooth";
        const resultsList = card.closest<HTMLElement>(".spot-results__list");
        const listScrollsHorizontally =
          resultsList &&
          window.getComputedStyle(resultsList).overflowX !== "visible" &&
          resultsList.scrollWidth > resultsList.clientWidth;

        if (resultsList && listScrollsHorizontally) {
          const listBounds = resultsList.getBoundingClientRect();
          const cardBounds = card.getBoundingClientRect();
          const centeredLeft =
            resultsList.scrollLeft +
            cardBounds.left -
            listBounds.left -
            (resultsList.clientWidth - cardBounds.width) / 2;

          resultsList.scrollTo({
            behavior,
            left: Math.max(0, centeredLeft),
          });
          return;
        }

        const resultsPanel = card.closest<HTMLElement>(".spot-results");
        const panelScrollsIndependently =
          resultsPanel &&
          window.getComputedStyle(resultsPanel).overflowY !== "visible" &&
          resultsPanel.scrollHeight > resultsPanel.clientHeight;

        if (resultsPanel && panelScrollsIndependently) {
          const panelBounds = resultsPanel.getBoundingClientRect();
          const cardBounds = card.getBoundingClientRect();
          const centeredTop =
            resultsPanel.scrollTop +
            cardBounds.top -
            panelBounds.top -
            (resultsPanel.clientHeight - cardBounds.height) / 2;

          resultsPanel.scrollTo({
            behavior,
            top: Math.max(0, centeredTop),
          });
          return;
        }

        card.scrollIntoView({
          behavior,
          block: "center",
          inline: "nearest",
        });
        return;
      }

      remainingAttempts -= 1;
      if (remainingAttempts > 0) window.requestAnimationFrame(scrollWhenReady);
    }

    window.requestAnimationFrame(scrollWhenReady);
  }, []);

  useEffect(() => {
    scrollToGuideCard(selectedGuideId);
  }, [scrollToGuideCard, selectedGuideId]);

  function selectGuideFromMap(guideId: string) {
    if (activeNavigation !== "explore" && !savedSpotIds.includes(guideId)) {
      onNavigationChange("explore");
    }

    if (query) setQuery("");
    onSelectGuide(guideId);
    scrollToGuideCard(guideId);
  }

  function selectGuideFromCard(guideId: string) {
    if (guideId !== selectedGuideId) onSelectGuide(guideId);
  }

  function handleCardRailScroll(event: React.UIEvent<HTMLDivElement>) {
    if (!window.matchMedia("(max-width: 879px)").matches) return;

    const resultsList = event.currentTarget;
    if (carouselScrollTimerRef.current !== null) {
      window.clearTimeout(carouselScrollTimerRef.current);
    }

    carouselScrollTimerRef.current = window.setTimeout(() => {
      const listBounds = resultsList.getBoundingClientRect();
      const listCenter = listBounds.left + listBounds.width / 2;
      let nearestGuideId = "";
      let nearestDistance = Number.POSITIVE_INFINITY;

      resultsList
        .querySelectorAll<HTMLElement>("[data-guide-id]")
        .forEach((card) => {
          const cardBounds = card.getBoundingClientRect();
          const cardCenter = cardBounds.left + cardBounds.width / 2;
          const distance = Math.abs(cardCenter - listCenter);

          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestGuideId = card.dataset.guideId ?? "";
          }
        });

      if (nearestGuideId && nearestGuideId !== selectedGuideId) {
        onSelectGuide(nearestGuideId);
      }
    }, 120);
  }

  function changeNavigation(item: NavigationItem) {
    if (item === activeNavigation) return;

    setQuery("");
    onNavigationChange(item);
    if (item === "explore" || savedSpotIds.includes(selectedGuideId)) return;

    const firstSavedGuide = guides.find((guide) =>
      savedSpotIds.includes(guide.id),
    );
    if (firstSavedGuide) onSelectGuide(firstSavedGuide.id);
  }

  function toggleSavedGuide(guideId: string) {
    const isRemoving = savedSpotIds.includes(guideId);
    onToggleSaved(guideId);

    if (
      isRemoving &&
      activeNavigation !== "explore" &&
      guideId === selectedGuideId
    ) {
      const nextSavedGuide = guides.find(
        (guide) => guide.id !== guideId && savedSpotIds.includes(guide.id),
      );
      if (nextSavedGuide) onSelectGuide(nextSavedGuide.id);
    }
  }

  const visibleGuides = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let result = guides;
    if (activeNavigation === "saved" || activeNavigation === "trip") {
      result = result.filter((guide) => savedSpotIds.includes(guide.id));
    }
    if (normalizedQuery) {
      result = result.filter((guide) =>
        [guide.name, guide.destination.neighborhood, ...guide.scenery_types]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      );
    }
    return result;
  }, [activeNavigation, guides, query, savedSpotIds]);

  const heading =
    activeNavigation === "explore"
      ? "Find your Tokyo shot"
      : activeNavigation === "saved"
        ? "Your saved spots"
        : "Tokyo shot shortlist";

  return (
    <div className="screen screen--discovery">
      <BrandHeader />
      <main className="discovery-layout">
        <section className="discovery-intro">
          <span className="eyebrow">Tokyo pilot · remotely researched</span>
          <h1>{heading}</h1>
          <p>
            Choose a pin to see the approximate position, camera angle and what
            to know before you go.
          </p>
          <SpotSearch query={query} onQueryChange={setQuery} />
        </section>

        <DiscoveryMap
          guides={guides}
          selectedGuideId={selectedGuideId}
          onSelectGuide={selectGuideFromMap}
        />

        <section className="spot-results" aria-live="polite">
          <div className="spot-results__heading">
            <div>
              <span>
                {visibleGuides.length}{" "}
                {visibleGuides.length === 1 ? "spot" : "spots"}
              </span>
              <h2>
                {activeNavigation === "trip"
                  ? "Weekend in Tokyo"
                  : "Shot guides"}
              </h2>
            </div>
            <small>All positions approximate</small>
          </div>

          {visibleGuides.length ? (
            <div
              className="spot-results__list"
              aria-label="Tokyo shot guides"
              onScroll={handleCardRailScroll}
            >
              {visibleGuides.map((guide) => (
                <SpotPreviewCard
                  guide={guide}
                  isSaved={savedSpotIds.includes(guide.id)}
                  isSelected={guide.id === selectedGuideId}
                  key={guide.id}
                  onOpenGuide={() => onOpenGuide(guide.id)}
                  onSelect={() => selectGuideFromCard(guide.id)}
                  onToggleSaved={() => toggleSavedGuide(guide.id)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              {activeNavigation === "trip" ? (
                <Luggage aria-hidden="true" />
              ) : (
                <Bookmark aria-hidden="true" />
              )}
              <h3>{query ? "No matching spots" : "No saved spots yet"}</h3>
              <p>
                {query
                  ? "Try a landmark or neighborhood name."
                  : "Save a shot guide to build your Tokyo shortlist."}
              </p>
              {!query ? (
                <button
                  type="button"
                  onClick={() => changeNavigation("explore")}
                >
                  Explore all five spots
                </button>
              ) : null}
            </div>
          )}

          <p className="pilot-note">
            <Info aria-hidden="true" size={17} /> Remote research only. Routes,
            rules, sightlines and access must be confirmed on site.
          </p>
        </section>
      </main>
      <BottomNavigation
        activeItem={activeNavigation}
        onChange={changeNavigation}
      />
    </div>
  );
}
