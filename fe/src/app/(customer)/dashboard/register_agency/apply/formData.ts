import { RegisterAgencyFormValues } from "@/types/agency";

export const buildRegisterAgencyFormData = (
  values: RegisterAgencyFormValues
) => {
  const fd = new FormData();

  // Step 1
  fd.append("agency_name", values.agency_name ?? "");
  fd.append("agency_type", values.agency_type ?? "business");
  fd.append("email_agency", values.email_agency ?? "");
  fd.append("hotline", values.hotline ?? "");
  fd.append("address_agency", values.address_agency ?? "");
  fd.append("description", values.description ?? "");

  // Step 2
  fd.append("license_number", values.license_number ?? "");
  fd.append(
    "legal_representative_name",
    values.legal_representative_name ?? ""
  );
  fd.append("legal_id_number", values.legal_id_number ?? "");

  // business mới gửi tax_code
  if (values.agency_type === "business") {
    fd.append("tax_code", values.tax_code ?? "");
  }

  // Step 3
  fd.append("bank_name", values.bank_name ?? "");
  fd.append("bank_account_number", values.bank_account_number ?? "");
  fd.append("bank_account_holder", values.bank_account_holder ?? "");

  // Step 4 (files)
  if (values.license_file) fd.append("license_file", values.license_file);
  if (values.legal_id_front) fd.append("legal_id_front", values.legal_id_front);
  if (values.legal_id_back) fd.append("legal_id_back", values.legal_id_back);
  if (values.avatar) fd.append("avatar", values.avatar);

  return fd;
};
export const logFormData = (fd: FormData) => {
  console.group(" REGISTER AGENCY FORM DATA");
  for (const [key, value] of fd.entries()) {
    if (value instanceof File) {
      console.log(key, {
        name: value.name,
        size: value.size,
        type: value.type,
      });
    } else {
      console.log(key, value);
    }
  }
  console.groupEnd();
};
