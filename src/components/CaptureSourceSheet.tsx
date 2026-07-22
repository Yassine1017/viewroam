import { ImagePlus, Images, X } from "lucide-react";
import { useEffect, useRef, type ChangeEvent } from "react";
import { Button } from "./Button";

interface CaptureSourceSheetProps {
  error: string | null;
  isOpen: boolean;
  onChooseFile: (file: File) => void;
  onClose: () => void;
  onUseDemo: () => void;
}

export function CaptureSourceSheet({
  error,
  isOpen,
  onChooseFile,
  onClose,
  onUseDemo,
}: CaptureSourceSheetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      onChooseFile(selectedFile);
    }
    event.target.value = "";
  }

  return (
    <div className="sheet-layer">
      <button
        className="sheet-backdrop"
        type="button"
        aria-label="Close photo options"
        onClick={onClose}
      />

      <section
        className="capture-source-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="capture-source-title"
      >
        <div className="capture-source-sheet__handle" aria-hidden="true" />

        <header className="capture-source-sheet__header">
          <div>
            <span>Manual photo comparison</span>
            <h2 id="capture-source-title">Add a photo to compare</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label="Close photo options"
            onClick={onClose}
          >
            <X aria-hidden="true" size={22} strokeWidth={1.8} />
          </button>
        </header>

        <p className="capture-source-sheet__intro">
          Choose an existing image, or use the demo to explore the comparison
          controls without sharing a photo.
        </p>

        <input
          ref={fileInputRef}
          className="visually-hidden"
          type="file"
          accept="image/*"
          aria-label="Choose an image from your device"
          onChange={handleFileChange}
        />

        <div className="capture-source-sheet__options">
          <Button
            fullWidth
            icon={<ImagePlus aria-hidden="true" size={22} strokeWidth={1.7} />}
            onClick={() => fileInputRef.current?.click()}
          >
            Choose from device
          </Button>

          <Button
            fullWidth
            icon={<Images aria-hidden="true" size={22} strokeWidth={1.7} />}
            variant="secondary"
            onClick={onUseDemo}
          >
            Try with demo photo
          </Button>
        </div>

        {error ? (
          <p className="capture-source-sheet__error" role="alert">
            {error}
          </p>
        ) : null}

        <button
          className="text-action text-action--centered"
          type="button"
          onClick={onClose}
        >
          Cancel
        </button>
      </section>
    </div>
  );
}
