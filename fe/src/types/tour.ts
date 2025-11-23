export interface Agency {
  agency_id: string;
  agency_name: string;
  email_agency: string;
  hotline: string;
}

export interface PickupPoint {
  location: string;
  address: string;
  time: string;
}

export interface Accommodation {
  hotel_name: string;
  stars: number;
  nights: number;
  address: string;
}

export interface Itinerary {
  day: number;
  title: string;
  activities: string[];
  accommodation: Accommodation | null;
}

export interface Policy {
  deposit_percent: number;
  cancellation_fee: string;
  refund_policy: string;
}

export interface Guide {
  name_guide: string;
  phone_guide: string;
  experience_years: number;
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
  start_location: string;
  end_location: string;
  destination?: string | null;
  region: number;

  // Phân loại
  categories: string[];

  // Lịch trình & dịch vụ
  pickup_points: PickupPoint[];
  itinerary: Itinerary[];
  transportation: string[];
  services_included: string[];
  services_excluded: string[];

  policy: Policy;
  guide: Guide;

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
  agency_name: string | null;
  email_agency: string | null;
  hotline: string | null;

  name: string;
  description: string | null;

  adult_price: string | number;
  children_price: string | number;

  discount?: string | number | null;
  duration_days: number;

  start_location: string;
  end_location: string;
  destination: string | null;
  region: number;
  categories: string[];

  pickup_points: PickupPoint[];
  itinerary: Itinerary[];
  transportation: string[];
  services_included: string[];
  services_excluded: string[];

  policy: Policy;
  guide: Guide;

  rating: string | number;
  reviews_count: number;
  is_active: boolean;

  created_at: string;
  updated_at: string;

  image_urls: ImageURL[];
}

export interface TourListPageType {
  tour_id: string;
  name: string;
  categories: string[];
  description?: string;
  adult_price: string | number;
  children_price: string | number;
  discount: string | number;
  duration_days: number;
  destination: string;
  rating: number;
  reviews_count: number;
  image_url: string;
}

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
