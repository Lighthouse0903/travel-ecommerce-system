export interface Agency {
  agency_id: string;
  agency_name: string;
  email_agency: string;
  hotline: string;
}

export interface Accommodation {
  hotel_name: string;
  stars: number;
  nights: number;
  address: string;
}

export type ItineraryActivity = {
  time: string; // "07:00"
  text: string; // "Đón khách tại điểm hẹn"
};

export interface Itinerary {
  day: number;
  title: string;
  activities: ItineraryActivity[];
  accommodation: Accommodation | null;
}

export type BEItineraryDay = {
  day: number;
  title: string;
  activities: string[];
  accommodation?: Accommodation | null;
};

export interface Policy {
  deposit_percent: number;
  cancellation_fee: string;
  refund_policy: string;
}

export interface TourRequest {
  // Thông tin cơ bản
  name: string;
  description?: string;
  adult_price?: string | number;
  children_price?: string | number;
  discount?: string | number;
  duration_days: number;

  // Địa điểm
  departure_location: string;
  destination: string;
  region: number;

  // Phân loại
  categories: string[];

  // Lịch trình & dịch vụ
  itinerary: Itinerary[];
  transportation: string[];
  services_included: string[];
  services_excluded: string[];

  policy: Policy;
  thumbnail: File;
  images: File[];

  is_active?: boolean;
}

export interface ImageURL {
  img_id: number;
  image: string;
}

export interface TourResponse {
  tour_id: string;
  agency_id: string | null;
  agency_user_id?: string;
  agency_name: string | null;
  agency_avatar_url?: string | null;
  email_agency: string | null;
  hotline: string | null;

  name: string;
  description: string | null;

  adult_price: string | number;
  children_price: string | number;

  discount?: string | number | null;
  duration_days: number;

  departure_location: string;
  destination: string | null;
  region: number;
  categories: string[];

  itinerary: BEItineraryDay[];
  transportation: string[];
  services_included: string[];
  services_excluded: string[];

  policy: Policy;

  rating: string | number;
  reviews_count: number;
  is_active: boolean;

  created_at: string;
  updated_at: string;

  thumbnail_url: string | null;
  image_urls: ImageURL[];
}

export type TourListPageType = {
  tour_id: string;
  name: string;
  categories: string[];
  description: string | null;
  adult_price: string | number | null;
  children_price: string | number | null;
  discount: string | number | null;
  duration_days: number;
  departure_location: string;
  destination: string;
  rating: string | number | null;
  reviews_count: number;
  thumbnail_url: string | null;
  is_active: boolean;
};

export const CATEGORY_CHOICES = [
  { value: "sea", label: "Biển" },
  { value: "mountain", label: "Núi" },
  { value: "resort", label: "Nghỉ dưỡng" },
  { value: "adventure", label: "Khám phá" },
  { value: "cultural", label: "Văn hoá" },
  { value: "history", label: "Lịch sử" },
];

export interface FilterTour {
  categories: string[];
  region: string;
  price: number;
}

export const CATEGORY_MAP = CATEGORY_CHOICES.reduce((acc, cur) => {
  acc[cur.value] = cur.label;
  return acc;
}, {} as Record<string, string>);
