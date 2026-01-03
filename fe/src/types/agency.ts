export type AgencyStatus = "pending" | "approved" | "rejected";
export type AgencyType = "business" | "individual";

// thông tin response khi đănng kí và getProfileAgency trả về
export interface AgencyProfile {
  agency_id: string;

  agency_name: string;
  agency_type: AgencyType;
  license_number: string;
  hotline: string;
  email_agency: string;
  address_agency: string;
  description: string | null;

  legal_representative_name: string;
  legal_id_number: string;
  tax_code: string | null;

  bank_name: string;
  bank_account_number: string;
  bank_account_holder: string;

  avatar_url: string | null;
  license_url: string | null;
  legal_id_front_url: string | null;
  legal_id_back_url: string | null;

  verified: boolean;
  status: AgencyStatus;
  reason_rejected: string | null;

  created_at: string;
  updated_at: string;
}

// type của Form khi đăng kí đại lý
export type RegisterAgencyFormValues = {
  agency_name?: string;
  agency_type?: AgencyType;
  email_agency?: string;
  hotline?: string;
  address_agency?: string;
  description?: string;

  license_number?: string;
  legal_representative_name?: string;
  legal_id_number?: string;
  tax_code?: string;

  bank_name?: string;
  bank_account_number?: string;
  bank_account_holder?: string;

  license_file?: File | null;
  legal_id_front?: File | null;
  legal_id_back?: File | null;
  avatar?: File | null;
};

// type của form cập nhật
export type EditAgencyProfileValues = {
  avatar: File | null;

  email_agency: string;
  hotline: string;
  address_agency: string;

  bank_name: string;
  bank_account_number: string;
  bank_account_holder: string;

  description: string;
};
