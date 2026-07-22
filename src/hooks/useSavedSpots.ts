import { useState } from "react";

const STORAGE_KEY = "viewroam:saved-spots";

function readSavedSpots(): string[] {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    const parsedValue = storedValue ? (JSON.parse(storedValue) as unknown) : [];
    return Array.isArray(parsedValue)
      ? parsedValue.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
  } catch {
    return [];
  }
}

export function useSavedSpots() {
  const [savedSpotIds, setSavedSpotIds] = useState<string[]>(readSavedSpots);

  function isSpotSaved(spotId: string) {
    return savedSpotIds.includes(spotId);
  }

  function toggleSpot(spotId: string) {
    setSavedSpotIds((currentIds) => {
      const nextIds = currentIds.includes(spotId)
        ? currentIds.filter((id) => id !== spotId)
        : [...currentIds, spotId];

      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
      } catch {
        // The UI remains usable when browser storage is unavailable.
      }

      return nextIds;
    });
  }

  return { isSpotSaved, savedSpotIds, toggleSpot };
}
