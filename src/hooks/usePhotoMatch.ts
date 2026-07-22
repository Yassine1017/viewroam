import { useEffect, useRef, useState } from "react";
import type { PhotoSelection, StoredPhotoMatch } from "../types/photoMatch";

const STORAGE_KEY = "viewroam:photo-matches";

function readStoredMatches(): StoredPhotoMatch[] {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    const parsedValue = storedValue ? (JSON.parse(storedValue) as unknown) : [];
    return Array.isArray(parsedValue)
      ? (parsedValue as StoredPhotoMatch[])
      : [];
  } catch {
    return [];
  }
}

export function usePhotoMatch(spotId: string, targetPhotoPath: string) {
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [photo, setPhoto] = useState<PhotoSelection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMatchSaved, setIsMatchSaved] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  function revokeCurrentObjectUrl() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }

  useEffect(() => {
    return () => revokeCurrentObjectUrl();
  }, []);

  function openCapture() {
    setError(null);
    setIsCaptureOpen(true);
  }

  function closeCapture() {
    setError(null);
    setIsCaptureOpen(false);
  }

  function useDemoPhoto() {
    revokeCurrentObjectUrl();
    setPhoto({
      kind: "demo",
      label: "Target-photo demonstration",
      url: targetPhotoPath,
    });
    setError(null);
    setIsMatchSaved(false);
    setIsCaptureOpen(false);
  }

  function chooseDevicePhoto(file: File) {
    if (!file.type.startsWith("image/") || file.size === 0) {
      setError("Choose a valid image file to continue.");
      return false;
    }

    try {
      const objectUrl = URL.createObjectURL(file);
      revokeCurrentObjectUrl();
      objectUrlRef.current = objectUrl;
      setPhoto({
        kind: "device",
        label: file.name || "Selected photograph",
        url: objectUrl,
      });
      setError(null);
      setIsMatchSaved(false);
      setIsCaptureOpen(false);
      return true;
    } catch {
      setError("We couldn’t prepare that image. Try a different file.");
      return false;
    }
  }

  function reportDisplayError() {
    setError("We couldn’t display that image. Try a different photo.");
    setIsMatchSaved(false);
  }

  function resetPhoto() {
    revokeCurrentObjectUrl();
    setPhoto(null);
    setError(null);
    setIsMatchSaved(false);
  }

  function saveMatch() {
    if (!photo || error) {
      return;
    }

    const matchRecord: StoredPhotoMatch = {
      spotId,
      completedAt: new Date().toISOString(),
      source: photo.kind,
    };

    try {
      const nextMatches = [
        ...readStoredMatches().filter((match) => match.spotId !== spotId),
        matchRecord,
      ];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMatches));
    } catch {
      // The current-session success state still works if storage is blocked.
    }

    setIsMatchSaved(true);
  }

  return {
    isCaptureOpen,
    photo,
    error,
    isMatchSaved,
    openCapture,
    closeCapture,
    useDemoPhoto,
    chooseDevicePhoto,
    reportDisplayError,
    resetPhoto,
    saveMatch,
  };
}
