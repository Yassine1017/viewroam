export interface Coordinates {
  latitude: number;
  longitude: number;
  precision: string;
  radius_meters?: number;
}

export interface RoutePoint {
  latitude: number;
  longitude: number;
}

export interface ShotGuideSource {
  id: string;
  title: string;
  url: string;
  supports: string[];
}

export type CompositionShape = "tower" | "gate" | "crossing" | "bridge";

export interface ShotGuide {
  id: string;
  slug: string;
  status: "remote_research";
  field_verification_required: true;
  destination: {
    country: string;
    city: string;
    district: string;
    neighborhood: string;
  };
  name: string;
  short_description: string;
  scenery_types: string[];
  subject: {
    name: string;
    coordinates: Coordinates;
  };
  shooting_area: {
    name: string;
    coordinates: Coordinates;
    exact_pin_policy: string;
    standing_instruction: string;
    verification_note: string;
  };
  navigation: {
    simulated_start: Coordinates;
    route: RoutePoint[];
    walking_distance_meters: number;
    walking_time_minutes: number;
    walking_time_status: string;
  };
  shot_guide: {
    camera_bearing_degrees: number;
    camera_bearing_label: string;
    camera_bearing_short_label: string;
    bearing_tolerance_degrees: number;
    bearing_method: string;
    orientation: Array<"portrait" | "landscape">;
    recommended_focal_length_full_frame_mm: {
      minimum: number;
      maximum: number;
      starting_point: number;
    };
    phone_camera_suggestion: string;
    composition_instruction: string;
    composition_short_instruction: string;
    expected_view: string;
    composition_overlay: {
      shape: CompositionShape;
      top_percent: number;
      left_percent: number;
      width_percent: number;
      height_percent: number;
    };
    accuracy: string;
    field_checks_needed: string[];
  };
  timing_and_light: {
    primary_recommendation: string;
    short_label: string;
    dynamic_time_rule: {
      event: string;
      start_offset_minutes: number;
      end_offset_minutes: number;
    };
    alternate_recommendation: string;
    lighting_direction_note: string;
    subject_lighting_note: string;
    accuracy: string;
  };
  access: {
    address: string;
    nearest_station: string;
    line: string;
    walking_time_minutes: number;
    walking_time_destination: string;
    walking_time_status: string;
    cost_note: string;
    published_hours: string;
    accessibility: {
      summary: string;
      route_verified: boolean;
      note: string;
    };
  };
  conditions: {
    crowd_level: "low" | "moderate" | "high" | "very_high";
    crowd_note: string;
    safety_level: "not_assessed";
    safety_note: string;
  };
  rules_and_respect: {
    site_type: string;
    personal_photography_status: string;
    tripod_status: string;
    commercial_photography_status: string;
    guidance: string[];
    editorial_rule: string;
  };
  live_conditions: Array<{
    severity: "info" | "medium" | "high";
    title: string;
    message: string;
    valid_until: string | null;
    source_id: string;
  }>;
  seasonal_notes: Array<{
    season: string;
    note: string;
  }>;
  reference_photo: {
    title: string;
    creator: string;
    source_page: string;
    image_url: string;
    local_path: string;
    alt_text: string;
    license: string;
    license_url: string;
    required_attribution: string;
    captured_at: string;
    metadata_focal_length_mm: number | null;
    usage_note: string;
  };
  quality: {
    editorial_confidence: string;
    coordinate_confidence: string;
    bearing_confidence: string;
    access_confidence: string;
    rules_confidence: string;
    current_view_confidence: string;
    last_researched_at: string;
    field_verified_at: null;
    reviewer: null;
  };
  sources: ShotGuideSource[];
}
