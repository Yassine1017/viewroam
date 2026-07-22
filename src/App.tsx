import { useEffect, useMemo, useState } from "react";
import type { NavigationItem } from "./components/BottomNavigation";
import { CaptureSourceSheet } from "./components/CaptureSourceSheet";
import { DiscoveryScreen } from "./components/DiscoveryScreen";
import { NavigateScreen } from "./components/NavigateScreen";
import { PhotoMatchScreen } from "./components/PhotoMatchScreen";
import { ShotGuideScreen } from "./components/ShotGuideScreen";
import { defaultShotGuide, shotGuides } from "./data/shotGuides";
import { usePhotoMatch } from "./hooks/usePhotoMatch";
import { useSavedSpots } from "./hooks/useSavedSpots";

type AppScreen = "explore" | "navigate" | "guide" | "match";

export function App() {
  const [screen, setScreen] = useState<AppScreen>("explore");
  const [activeNavigation, setActiveNavigation] =
    useState<NavigationItem>("explore");
  const [selectedGuideId, setSelectedGuideId] = useState(defaultShotGuide.id);
  const selectedGuide = useMemo(
    () =>
      shotGuides.find((guide) => guide.id === selectedGuideId) ??
      defaultShotGuide,
    [selectedGuideId],
  );
  const { isSpotSaved, savedSpotIds, toggleSpot } = useSavedSpots();
  const photoMatch = usePhotoMatch(
    selectedGuide.id,
    selectedGuide.reference_photo.local_path,
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [screen]);

  function selectGuide(guideId: string) {
    if (guideId !== selectedGuideId) photoMatch.resetPhoto();
    setSelectedGuideId(guideId);
  }

  function openGuide(guideId: string) {
    selectGuide(guideId);
    setScreen("navigate");
  }

  function returnToGuide() {
    photoMatch.resetPhoto();
    setScreen("guide");
  }

  function tryAnotherPhoto() {
    photoMatch.resetPhoto();
    setScreen("guide");
    photoMatch.openCapture();
  }

  function chooseDevicePhoto(file: File) {
    if (photoMatch.chooseDevicePhoto(file)) setScreen("match");
  }

  function useDemoPhoto() {
    photoMatch.useDemoPhoto();
    setScreen("match");
  }

  let currentScreen;
  if (screen === "explore") {
    currentScreen = (
      <DiscoveryScreen
        activeNavigation={activeNavigation}
        guides={shotGuides}
        savedSpotIds={savedSpotIds}
        selectedGuideId={selectedGuide.id}
        onNavigationChange={setActiveNavigation}
        onOpenGuide={openGuide}
        onSelectGuide={selectGuide}
        onToggleSaved={toggleSpot}
      />
    );
  } else if (screen === "navigate") {
    currentScreen = (
      <NavigateScreen
        guide={selectedGuide}
        isSaved={isSpotSaved(selectedGuide.id)}
        onBack={() => setScreen("explore")}
        onStartGuide={() => setScreen("guide")}
        onToggleSaved={() => toggleSpot(selectedGuide.id)}
      />
    );
  } else if (screen === "match" && photoMatch.photo) {
    currentScreen = (
      <PhotoMatchScreen
        error={photoMatch.error}
        guide={selectedGuide}
        isMatchSaved={photoMatch.isMatchSaved}
        photo={photoMatch.photo}
        onBack={returnToGuide}
        onImageError={photoMatch.reportDisplayError}
        onReturn={returnToGuide}
        onSave={photoMatch.saveMatch}
        onTryAnother={tryAnotherPhoto}
      />
    );
  } else {
    currentScreen = (
      <ShotGuideScreen
        guide={selectedGuide}
        isSaved={isSpotSaved(selectedGuide.id)}
        onBack={() => setScreen("navigate")}
        onCapture={photoMatch.openCapture}
        onToggleSaved={() => toggleSpot(selectedGuide.id)}
      />
    );
  }

  return (
    <div className="app-shell">
      {currentScreen}
      <CaptureSourceSheet
        error={photoMatch.error}
        isOpen={photoMatch.isCaptureOpen}
        onChooseFile={chooseDevicePhoto}
        onClose={photoMatch.closeCapture}
        onUseDemo={useDemoPhoto}
      />
    </div>
  );
}
