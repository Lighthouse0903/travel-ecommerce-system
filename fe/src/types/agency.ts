export interface AgencyResponse {
  agency_id: string;
  company_name: string;
  license_number: string;
  hotline: string;
  email_agency: string;
  address_agency: string;
  verified: boolean;
  status: "pending" | "approved" | "rejected";
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

export type UpdateAgency = Partial<CreateAgency>;
