export type PhotoSourceKind = "demo" | "device";

export type ComparisonMode = "overlay" | "target" | "user";

export interface PhotoSelection {
  kind: PhotoSourceKind;
  label: string;
  url: string;
}

export interface StoredPhotoMatch {
  spotId: string;
  completedAt: string;
  source: PhotoSourceKind;
}
