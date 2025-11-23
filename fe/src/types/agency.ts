export interface AgencyResponse {
  agency_id: string;
  agency_name: string;
  license_number: string;
  hotline: string;
  email_agency: string;
  address_agency: string;
  verified: boolean;
  status: "pending" | "approved" | "rejected";
  reason_rejected?: string;
  user_id?: string;
  representative_name?: string;
  avatar_url?: string;
  license_url?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export type Agency = AgencyResponse;

export type CreateAgency = {
  company_name: string;
  license_number: string;
  hotline: string;
  email_agency: string;
  address_agency: string;
  logo?: File;
  business_license?: File;
};

export type UpdateAgency = {
  agency_name: string;
  license_number: string;
  hotline: string;
  email_agency: string;
  address_agency: string;
  description?: string;
};
