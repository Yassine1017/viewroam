import { ShieldCheck } from "lucide-react";

export function PhotoPrivacyNotice() {
  return (
    <aside className="photo-privacy-notice">
      <ShieldCheck aria-hidden="true" size={22} strokeWidth={1.7} />
      <div>
        <strong>Your photo stays on this device</strong>
        <p>It is used for this session and is not uploaded.</p>
      </div>
    </aside>
  );
}
