import { Check, RefreshCw, Save } from "lucide-react";
import { Button } from "./Button";

interface MatchActionsProps {
  hasError: boolean;
  isSaved: boolean;
  onReturn: () => void;
  onSave: () => void;
  onTryAnother: () => void;
}

export function MatchActions({
  hasError,
  isSaved,
  onReturn,
  onSave,
  onTryAnother,
}: MatchActionsProps) {
  return (
    <div className="match-actions">
      <Button
        fullWidth
        disabled={hasError || isSaved}
        icon={
          isSaved ? (
            <Check aria-hidden="true" size={21} strokeWidth={1.9} />
          ) : (
            <Save aria-hidden="true" size={21} strokeWidth={1.8} />
          )
        }
        variant={isSaved ? "success" : "primary"}
        onClick={onSave}
      >
        {isSaved ? "Match saved" : "Save match"}
      </Button>

      <Button
        fullWidth
        icon={<RefreshCw aria-hidden="true" size={20} strokeWidth={1.8} />}
        variant="secondary"
        onClick={onTryAnother}
      >
        Try another photo
      </Button>

      <button className="text-action" type="button" onClick={onReturn}>
        Return to Shot Guide
      </button>
    </div>
  );
}
